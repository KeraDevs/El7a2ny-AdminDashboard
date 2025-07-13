export interface Wallet {
  id: string;
  user_id: string;
  balance: number | string;
  status: "active" | "inactive" | "suspended" | "frozen";
  created_at: string;
  updated_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    profile_pic?: string;
  };
}

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: "credit" | "debit" | "transfer_in" | "transfer_out";
  amount: number;
  description: string;
  reference_id?: string;
  status: "pending" | "completed" | "failed" | "cancelled";
  created_at: string;
  updated_at: string;
  sender_wallet_id?: string;
  receiver_wallet_id?: string;
}

export interface WalletTransferRequest {
  receiver_user_id: string;
  amount: number;
  description: string;
}

export interface WalletStatusUpdateRequest {
  status: "active" | "inactive" | "suspended" | "frozen";
}

export interface WalletListResponse {
  wallets: Wallet[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface TransactionHistoryResponse {
  transactions: WalletTransaction[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface WalletStats {
  totalBalance: number;
  activeUsers: number;
  averageBalance: number;
  totalTransactions: number;
}

// Utility function to safely convert balance to number and format it
export function formatBalance(balance: number | string): string {
  const numBalance =
    typeof balance === "string" ? parseFloat(balance) : balance;
  return isNaN(numBalance) ? "0.00" : numBalance.toFixed(2);
}

// Utility function to get numeric balance
export function getNumericBalance(balance: number | string): number {
  const numBalance =
    typeof balance === "string" ? parseFloat(balance) : balance;
  return isNaN(numBalance) ? 0 : numBalance;
}

export interface ManualWithdrawalRequest {
  id: string;
  workshop_id: string;
  admin_id: string;
  amount: number;
  payout_method: string; // e.g., "vodafone_cash", "instapay", "orange_cash", etc.
  payout_details: string; // phone number for wallets or username@instapay for instapay
  status: "pending" | "approved" | "rejected" | "processed";
  request_date: string;
  processed_date?: string;
  processed_by?: string;
  notes?: string;
  workshop?: {
    id: string;
    name: string;
    owner_id: string;
  };
  admin?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
  };
}

export interface ManualWithdrawalListResponse {
  withdrawals: ManualWithdrawalRequest[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface ProcessWithdrawalRequest {
  action: "approve" | "reject";
  notes?: string;
}

// Utility function to get payout method display name
export function getPayoutMethodDisplay(method: string): string {
  const methodMap: Record<string, string> = {
    vodafone_cash: "Vodafone Cash",
    orange_cash: "Orange Cash",
    etisalat_cash: "Etisalat Cash",
    instapay: "InstaPay",
    bank_transfer: "Bank Transfer",
    we_pay: "WE Pay",
  };
  return methodMap[method] || method;
}

// Utility function to format payout details based on method
export function formatPayoutDetails(method: string, details: string): string {
  if (method === "instapay") {
    return details.includes("@") ? details : `${details}@instapay`;
  }
  return details;
}

export interface PaymentTransaction {
  id: string;
  wallet_id: string;
  payment_type: "topup" | "payment" | "refund" | "withdrawal";
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed" | "cancelled" | "expired";
  paymob_order_id: string;
  paymob_transaction_id?: string;
  paymob_order_url?: string;
  description?: string;
  failure_reason?: string;
  expires_at?: string;
  created_at: string;
  updated_at: string;
  wallet?: {
    id: string;
    user_id: string;
    user?: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      phone: string;
      profile_pic?: string;
    };
  };
}

export interface PaymentTransactionListResponse {
  message: string;
  payment_transactions: PaymentTransaction[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    has_more: boolean;
  };
}

// Utility function to get payment type display name
export function getPaymentTypeDisplay(type: string): string {
  const typeMap: Record<string, string> = {
    topup: "Top-up",
    payment: "Payment",
    refund: "Refund",
    withdrawal: "Withdrawal",
  };
  return typeMap[type] || type;
}

// Utility function to get payment status display name and color
export function getPaymentStatusDisplay(status: string): {
  label: string;
  color: string;
} {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: "Pending", color: "text-yellow-600" },
    completed: { label: "Completed", color: "text-green-600" },
    failed: { label: "Failed", color: "text-red-600" },
    cancelled: { label: "Cancelled", color: "text-gray-600" },
    expired: { label: "Expired", color: "text-red-500" },
  };
  return statusMap[status] || { label: status, color: "text-gray-600" };
}
