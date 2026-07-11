import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "GameTopup <noreply@gametopup.id>";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.log("[Email] RESEND_API_KEY not configured, skipping email send");
      return { success: true, skipped: true };
    }

    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });

    console.log(`[Email] Sent to ${to}: ${subject}`, result);
    return { success: true };
  } catch (error) {
    console.error(`[Email] Failed to send to ${to}:`, error);
    return { success: false, error };
  }
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function baseLayout(title: string, content: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin:0;padding:0;background-color:#f8fafc;font-family:system-ui,-apple-system,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;padding:40px 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
              <tr>
                <td style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:30px;border-radius:16px 16px 0 0;text-align:center;">
                  <h1 style="color:white;font-size:24px;margin:0;">🎮 GameTopup</h1>
                </td>
              </tr>
              <tr>
                <td style="background-color:white;padding:32px;border-radius:0 0 16px 16px;box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">
                  <h2 style="color:#0f172a;font-size:20px;margin:0 0 16px 0;">${title}</h2>
                  ${content}
                </td>
              </tr>
              <tr>
                <td style="text-align:center;padding:24px;color:#94a3b8;font-size:12px;">
                  <p style="margin:0;">&copy; ${new Date().getFullYear()} GameTopup. All rights reserved.</p>
                  <p style="margin:4px 0 0 0;">Email ini dikirim otomatis, mohon tidak membalas.</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
}

function detailRow(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:8px 0;color:#64748b;font-size:14px;">${label}</td>
      <td style="padding:8px 0;color:#0f172a;font-size:14px;font-weight:500;text-align:right;">${value}</td>
    </tr>
  `;
}

export interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  gameName: string;
  nominal: string;
  productName: string;
  price: number;
  gameAccountId: string;
  gameServerId?: string | null;
  playerName?: string | null;
}

export async function sendOrderConfirmation(data: OrderEmailData) {
  const content = `
    <p style="color:#64748b;font-size:14px;margin:0 0 20px 0;">
      Hi <strong>${data.customerName}</strong>, pesanan kamu sudah diterima!
    </p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px;">
      ${detailRow("No. Pesanan", `<span style="font-family:monospace;">${data.orderNumber}</span>`)}
      ${detailRow("Game", data.gameName)}
      ${detailRow("Produk", `${data.productName} (${data.nominal})`)}
      ${detailRow("ID Akun", data.gameAccountId)}
      ${data.gameServerId ? detailRow("Server", data.gameServerId) : ""}
      ${data.playerName ? detailRow("Nama Pemain", data.playerName) : ""}
      ${detailRow("Total", `<span style="color:#2563eb;font-weight:700;">${formatRupiah(data.price)}</span>`)}
    </table>
    <p style="color:#64748b;font-size:14px;margin:0 0 12px 0;">
      Silakan selesaikan pembayaran untuk memproses pesanan kamu.
    </p>
    <a href="${process.env.NEXTAUTH_URL}/checkout/${data.orderNumber}" 
       style="display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Lihat Pesanan
    </a>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `[GameTopup] Pesanan ${data.orderNumber} Diterima`,
    html: baseLayout("Pesanan Berhasil Dibuat!", content),
  });
}

export interface PaymentEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  gameName: string;
  nominal: string;
  productName: string;
  amount: number;
  status: "success" | "failed";
  paidAt?: string;
}

export async function sendPaymentResult(data: PaymentEmailData) {
  const isSuccess = data.status === "success";
  const title = isSuccess ? "Pembayaran Berhasil!" : "Pembayaran Gagal";
  const bgColor = isSuccess ? "#f0fdf4" : "#fef2f2";
  const borderColor = isSuccess ? "#22c55e" : "#ef4444";
  const textColor = isSuccess ? "#166534" : "#991b1b";
  const message = isSuccess
    ? `Pembayaran untuk pesanan kamu sudah berhasil diproses. Pesanan sedang diproses oleh tim kami.`
    : `Pembayaran untuk pesanan kamu gagal diproses. Silakan coba lagi.`;

  const content = `
    <div style="background-color:${bgColor};border:1px solid ${borderColor};border-radius:12px;padding:20px;margin-bottom:20px;">
      <p style="color:${textColor};font-size:14px;margin:0;font-weight:600;">${message}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px;">
      ${detailRow("No. Pesanan", `<span style="font-family:monospace;">${data.orderNumber}</span>`)}
      ${detailRow("Game", data.gameName)}
      ${detailRow("Produk", `${data.productName} (${data.nominal})`)}
      ${detailRow("Jumlah Bayar", `<span style="color:#2563eb;font-weight:700;">${formatRupiah(data.amount)}</span>`)}
      ${data.paidAt ? detailRow("Dibayar Pada", data.paidAt) : ""}
    </table>
    ${isSuccess ? `
    <a href="${process.env.NEXTAUTH_URL}/checkout/${data.orderNumber}" 
       style="display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Lihat Status Pesanan
    </a>
    ` : `
    <a href="${process.env.NEXTAUTH_URL}/checkout/${data.orderNumber}" 
       style="display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Coba Bayar Lagi
    </a>
    `}
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `[GameTopup] ${title} - ${data.orderNumber}`,
    html: baseLayout(title, content),
  });
}

export interface StatusUpdateEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  gameName: string;
  productName: string;
  nominal: string;
  status: string;
}

const STATUS_LABELS: Record<string, string> = {
  SUCCESS: "Pesanan Berhasil",
  PROCESSING: "Sedang Diproses",
  FAILED: "Pesanan Gagal",
  CANCELLED: "Pesanan Dibatalkan",
  EXPIRED: "Pesanan Kedaluwarsa",
};

const STATUS_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  SUCCESS: { bg: "#f0fdf4", border: "#22c55e", text: "#166534" },
  PROCESSING: { bg: "#fffbeb", border: "#f59e0b", text: "#92400e" },
  FAILED: { bg: "#fef2f2", border: "#ef4444", text: "#991b1b" },
  CANCELLED: { bg: "#f8fafc", border: "#94a3b8", text: "#475569" },
  EXPIRED: { bg: "#f8fafc", border: "#94a3b8", text: "#475569" },
};

export async function sendStatusUpdate(data: StatusUpdateEmailData) {
  const title = STATUS_LABELS[data.status] || "Status Diperbarui";
  const colors = STATUS_COLORS[data.status] || STATUS_COLORS.PROCESSING;

  const content = `
    <div style="background-color:${colors.bg};border:1px solid ${colors.border};border-radius:12px;padding:20px;margin-bottom:20px;text-align:center;">
      <p style="color:${colors.text};font-size:16px;margin:0;font-weight:700;">${title}</p>
    </div>
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc;border-radius:12px;padding:20px;margin-bottom:20px;">
      ${detailRow("No. Pesanan", `<span style="font-family:monospace;">${data.orderNumber}</span>`)}
      ${detailRow("Game", data.gameName)}
      ${detailRow("Produk", `${data.productName} (${data.nominal})`)}
      ${detailRow("Status", `<span style="color:${colors.text};font-weight:700;">${title}</span>`)}
    </table>
    <a href="${process.env.NEXTAUTH_URL}/dashboard/orders" 
       style="display:inline-block;background-color:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;">
      Lihat Riwayat Pesanan
    </a>
  `;

  return sendEmail({
    to: data.customerEmail,
    subject: `[GameTopup] ${title} - ${data.orderNumber}`,
    html: baseLayout(title, content),
  });
}
