import Midtrans from "midtrans-client";

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

export const snap = new Midtrans.Snap({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export const api = new Midtrans.CoreApi({
  isProduction,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

export interface MidtransItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  brand?: string;
  category?: string;
}

export interface MidtransCustomer {
  first_name?: string;
  email?: string;
  phone?: string;
}

export interface CreateSnapTransactionParams {
  orderId: string;
  amount: number;
  items: MidtransItem[];
  customer: MidtransCustomer;
  paymentMethods?: string[];
  callbacks?: {
    finish?: string;
  };
}

export async function createSnapTransaction(params: CreateSnapTransactionParams) {
  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    item_details: params.items,
    customer_details: params.customer,
    credit_card: {
      secure: true,
    },
    callbacks: params.callbacks || {
      finish: `${process.env.NEXTAUTH_URL}/checkout/${params.orderId}?status=success`,
    },
  };

  const transaction = await snap.createTransaction(parameter);
  return transaction;
}

export function verifyNotification(notification: Record<string, string>) {
  const statusResponse = api.transaction.notification(notification);
  return statusResponse;
}
