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
