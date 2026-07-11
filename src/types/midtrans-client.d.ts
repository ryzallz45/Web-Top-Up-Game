declare module "midtrans-client" {
  interface SnapOptions {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionParameter {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    item_details?: Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
      brand?: string;
      category?: string;
    }>;
    customer_details?: {
      first_name?: string;
      last_name?: string;
      email?: string;
      phone?: string;
    };
    credit_card?: {
      secure?: boolean;
    };
    callbacks?: {
      finish?: string;
    };
  }

  interface SnapResponse {
    token: string;
    redirect_url: string;
  }

  interface NotificationResponse {
    order_id: string;
    transaction_status: string;
    fraud_status?: string;
    status_code: string;
    gross_amount: string;
    [key: string]: unknown;
  }

  class Snap {
    constructor(options: SnapOptions);
    createTransaction(parameter: TransactionParameter): Promise<SnapResponse>;
  }

  class CoreApi {
    constructor(options: SnapOptions);
    transaction: {
      notification(notification: Record<string, string>): Promise<NotificationResponse>;
    };
  }

  export { Snap, CoreApi };
  export default { Snap, CoreApi };
}
