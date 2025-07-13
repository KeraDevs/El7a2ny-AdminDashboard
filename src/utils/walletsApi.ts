import { API_BASE_URL, API_KEY } from "./config";
import {
  Wallet,
  WalletTransaction,
  WalletTransferRequest,
  WalletStatusUpdateRequest,
  WalletAddCreditRequest,
  WalletListResponse,
  TransactionHistoryResponse,
  ManualWithdrawalListResponse,
  ProcessWithdrawalRequest,
} from "@/types/walletTypes";

const defaultHeaders: Record<string, string> = {
  "Content-Type": "application/json",
  "x-api-key": API_KEY || "",
};

// Get current user's wallet details
export const getCurrentUserWallet = async (token: string): Promise<Wallet> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/wallets`, {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get user wallet: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting user wallet:", error);
    throw error;
  }
};

// Get wallet by ID (admin or owner only)
export const getWalletById = async (
  walletId: string,
  token: string
): Promise<Wallet> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payment/wallets/${walletId}`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get wallet: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting wallet by ID:", error);
    throw error;
  }
};

// Get wallet balance for authenticated user
export const getWalletBalance = async (
  token: string
): Promise<{ balance: number }> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/wallets/balance`, {
      method: "GET",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to get wallet balance: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting wallet balance:", error);
    throw error;
  }
};

// Transfer money to another user's wallet
export const transferMoney = async (
  transferData: WalletTransferRequest,
  token: string
): Promise<WalletTransaction> => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/wallets/transfer`, {
      method: "POST",
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transferData),
    });

    if (!response.ok) {
      throw new Error(`Failed to transfer money: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error transferring money:", error);
    throw error;
  }
};

// Get transaction history for authenticated user
export const getTransactionHistory = async (
  token: string,
  limit = 10,
  offset = 0
): Promise<TransactionHistoryResponse> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    const response = await fetch(
      `${API_BASE_URL}/payment/wallets/transactions/history?${params}`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get transaction history: ${response.statusText}`
      );
    }

    const data = await response.json();
    return {
      transactions: data.transactions || [],
      total: data.total || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: data.transactions?.length === limit,
    };
  } catch (error) {
    console.error("Error getting transaction history:", error);
    throw error;
  }
};

// Update wallet status (admin only)
export const updateWalletStatus = async (
  walletId: string,
  statusData: WalletStatusUpdateRequest,
  token: string
): Promise<Wallet> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payment/wallets/${walletId}/status`,
      {
        method: "PATCH",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(statusData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update wallet status: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating wallet status:", error);
    throw error;
  }
};

// Add credit to user wallet (superadmin only)
export const addCreditToWallet = async (
  creditData: WalletAddCreditRequest,
  token: string
): Promise<WalletTransaction> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payment/wallets/admin/add-credit`,
      {
        method: "POST",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(creditData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add credit to wallet: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error adding credit to wallet:", error);
    throw error;
  }
};

// List all wallets (admin only)
export const listAllWallets = async (
  token: string,
  limit = 10,
  offset = 0,
  status?: string,
  search?: string
): Promise<WalletListResponse> => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
    });

    if (status && status !== "") {
      params.append("status", status);
    }

    if (search && search.trim() !== "") {
      params.append("search", search.trim());
    }

    const response = await fetch(
      `${API_BASE_URL}/payment/wallets/admin/list?${params}`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to list wallets: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      wallets: data.wallets || [],
      total: data.total || 0,
      page: Math.floor(offset / limit) + 1,
      limit,
      hasMore: data.wallets?.length === limit,
    };
  } catch (error) {
    console.error("Error listing wallets:", error);
    throw error;
  }
};

// Manual Withdrawal APIs

// Get all pending manual withdrawal requests (Superadmin only)
export const getPendingWithdrawals = async (
  token: string,
  page: number = 1,
  limit: number = 10
): Promise<ManualWithdrawalListResponse> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payment/manual-withdrawal/pending?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to get pending withdrawals: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting pending withdrawals:", error);
    throw error;
  }
};

// Process manual withdrawal request (approve/reject)
export const processWithdrawalRequest = async (
  withdrawalId: string,
  processData: ProcessWithdrawalRequest,
  token: string
): Promise<{ message: string }> => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/payment/manual-withdrawal/process/${withdrawalId}`,
      {
        method: "POST",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(processData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to process withdrawal: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error processing withdrawal:", error);
    throw error;
  }
};

// Get all manual withdrawal requests with filtering
export const getAllWithdrawals = async (
  token: string,
  page: number = 1,
  limit: number = 10,
  status?: string,
  workshopId?: string
): Promise<ManualWithdrawalListResponse> => {
  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (status) params.append("status", status);
    if (workshopId) params.append("workshop_id", workshopId);

    const response = await fetch(
      `${API_BASE_URL}/payment/manual-withdrawal/all?${params.toString()}`,
      {
        method: "GET",
        headers: {
          ...defaultHeaders,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get withdrawals: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting withdrawals:", error);
    throw error;
  }
};
