# GameTopup

Platform top-up game terpercaya dengan proses cepat, aman, dan harga terbaik. Dibangun dengan Next.js 14 (App Router), TypeScript, Tailwind CSS, Prisma ORM, dan integrasi payment Midtrans + email Resend.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** SQLite + Prisma ORM
- **Auth:** NextAuth.js v4 (Credentials + JWT)
- **Payment:** Midtrans Snap & CoreApi
- **Email:** Resend

## Fitur

### Public
- Homepage dengan hero section, fitur, dan game populer
- Katalog game dengan pencarian dan filter kategori
- Detail game + checkout 3 langkah
- Halaman pembayaran dengan integrasi Midtrans Snap

### User
- Dashboard dengan statistik pesanan
- Riwayat pesanan
- Manajemen profil
- Lupa password via email

### Admin
- Dashboard statistik (total pendapatan, pesanan, pengguna, game)
- CRUD Game
- CRUD Produk
- Kelola pesanan (acc, tolak, proses, selesai, gagal, reset)

### Autentikasi & Keamanan
- Login / Register dengan validasi Zod
- Proteksi route (`/dashboard`, `/admin`)
- Role-based access (USER / ADMIN)
- Password di-hash dengan bcrypt (12 rounds)
- Forgot password + reset via email token (expiry 1 jam)

### Integrasi
- **Midtrans:** Snap popup/redirect, webhook callback, sandbox & production mode
- **Resend:** Email notifikasi (konfirmasi pesanan, hasil pembayaran, update status, reset password)

## Screenshots

> Belum tersedia

## Getting Started

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm

### Instalasi

```bash
git clone https://github.com/ryzallz45/Web-Top-Up-Game.git
cd Web-Top-Up-Game
npm install
```

### Konfigurasi Environment

Copy `.env.example` ke `.env.local` dan isi nilainya:

```bash
cp .env.example .env.local
```

Variabel yang dibutuhkan:

| Variabel | Deskripsi | Contoh |
|---|---|---|
| `DATABASE_URL` | Path database SQLite | `file:./dev.db` |
| `NEXTAUTH_URL` | Base URL aplikasi | `http://localhost:3000` |
| `NEXTAUTH_SECRET` | Secret key untuk JWT | `your-secret-key` |
| `MIDTRANS_IS_PRODUCTION` | Mode Midtrans | `false` (sandbox) |
| `MIDTRANS_SERVER_KEY` | Server key Midtrans | `SB-Mid-server-xxx` |
| `MIDTRANS_CLIENT_KEY` | Client key Midtrans | `SB-Mid-client-xxx` |
| `RESEND_API_KEY` | API key Resend | `re_xxxxx` |
| `EMAIL_FROM` | Alamat pengirim email | `GameTopup <noreply@gametopup.id>` |

### Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema ke database
npx prisma db push

# Seed data (game, produk, user admin & user)
npx prisma db seed
```

### Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

### Build untuk Production

```bash
npm run build
npm start
```

## Akun Test

| Role | Email | Password |
|---|---|---|
| Admin | admin@gametopup.id | admin123 |
| User | user@gametopup.id | user123 |

## Struktur Project

```
src/
  app/
    (auth)/              # Halaman auth (login, register, forgot/reset password)
    admin/               # Panel admin (dashboard, games, products, orders)
    api/                 # API routes
    checkout/            # Checkout & pembayaran
    dashboard/           # Dashboard user
    games/               # Katalog & detail game
  components/
    checkout/            # Komponen checkout
    games/               # Komponen game & produk
    layout/              # Header, Footer, Sidebar
    providers/           # SessionProvider (NextAuth)
    ui/                  # Button, Input, Card, Badge, Modal
  lib/
    auth.ts              # NextAuth config
    email.ts             # Resend email helper & templates
    midtrans.ts          # Midtrans Snap & CoreApi helpers
    prisma.ts            # Prisma client singleton
    utils.ts             # Utility functions
  middleware.ts          # Route protection
  types/                 # TypeScript types
```

## API Routes

| Route | Method | Deskripsi |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth handler |
| `/api/auth/register` | POST | Registrasi user |
| `/api/auth/forgot-password` | POST | Request reset password |
| `/api/auth/reset-password` | POST | Reset password via token |
| `/api/auth/update-profile` | POST | Update profil user |
| `/api/games` | GET | Daftar game |
| `/api/products` | GET | Daftar produk |
| `/api/orders` | GET/POST | Daftar / buat pesanan |
| `/api/payments/create` | POST | Buat transaksi Midtrans Snap |
| `/api/payments/callback` | POST | Webhook callback Midtrans |
| `/api/payments/status` | GET | Cek status pembayaran |
| `/api/admin/games` | GET/POST | Kelola game (admin) |
| `/api/admin/games/[id]` | PUT/DELETE | Update/hapus game |
| `/api/admin/products` | GET/POST | Kelola produk (admin) |
| `/api/admin/products/[id]` | PUT/DELETE | Update/hapus produk |
| `/api/admin/orders/[id]` | PUT | Update status pesanan (admin) |
| `/api/admin/stats` | GET | Statistik dashboard admin |

## Database Schema

- **User** — id, name, email, password, phone, role (USER/ADMIN), avatar
- **Game** — id, name, slug, description, image, category, isActive, sortOrder
- **Product** — id, name, description, price, originalPrice, nominal, bonus, gameId
- **Order** — id, orderNumber, status, totalAmount, userId, gameAccountId, gameServerId, playerName
- **OrderItem** — id, quantity, price, orderId, productId
- **Payment** — id, orderId, method, status, amount, fee, total, paymentUrl, paidAt
- **Transaction** — id, type, amount, description, userId, orderId
- **PasswordResetToken** — id, token, userId, expiresAt, used

## Alur Pembayaran (Midtrans)

1. User pilih produk → masukkan ID akun → pilih metode pembayaran
2. Sistem buat pesanan (status `PENDING`) → generate Snap token
3. User bayar via Midtrans Snap popup/redirect
4. Midtrans kirim webhook ke `/api/payments/callback`
5. Status pesanan & pembayaran otomatis diperbarui
6. Email notifikasi terkirim ke user

## Alur Forgot Password

1. User klik "Lupa password?" di halaman login
2. Masukkan email → sistem generate token (expiry 1 jam)
3. Email berisi link reset password terkirim via Resend
4. User klik link → masukkan password baru
5. Password di-hash ulang → token ditandai sudah digunakan

## License

Private — For educational purposes only.
