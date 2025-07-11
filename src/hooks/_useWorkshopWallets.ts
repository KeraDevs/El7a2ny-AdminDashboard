import { useState, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Wallet,
  WalletTransaction,
  WalletTransferRequest,
  WalletStatusUpdateRequest,
  WalletStats,
  getNumericBalance,
} from "@/types/walletTypes";
import {
  getCurrentUserWallet,
  getWalletById,
  getWalletBalance,
  transferMoney,
  getTransactionHistory,
  updateWalletStatus,
} from "@/utils/walletsApi";
import { API_BASE_URL, API_KEY } from "@/utils/config";

// Workshop-specific API function for listing workshop admin wallets
const listWorkshopAdminWallets = async (
  token: string,
  limit = 10,
  offset = 0,
  status?: string,
  search?: string
) => {
  try {
    const params = new URLSearchParams({
      limit: limit.toString(),
      offset: offset.toString(),
      user_type: "workshopAdmin", // Key difference for workshop wallets
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
          "Content-Type": "application/json",
          "x-api-key": API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to list workshop wallets: ${response.statusText}`
      );
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
    console.error("Error listing workshop wallets:", error);
    throw error;
  }
};

export const useWorkshopWallets = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    hasMore: false,
  });
  const [stats, setStats] = useState<WalletStats>({
    totalBalance: 0,
    activeUsers: 0,
    averageBalance: 0,
    totalTransactions: 0,
  });

  // Get current user's wallet
  const fetchCurrentWallet = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();
      const wallet = await getCurrentUserWallet(token);
      setCurrentWallet(wallet);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch wallet");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Get wallet by ID
  const fetchWalletById = useCallback(
    async (walletId: string) => {
      if (!currentUser) return null;

      setLoading(true);
      setError(null);

      try {
        const token = await currentUser.getIdToken();
        const wallet = await getWalletById(walletId, token);
        return wallet;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch wallet");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Get wallet balance
  const fetchWalletBalance = useCallback(async () => {
    if (!currentUser) return null;

    setLoading(true);
    setError(null);

    try {
      const token = await currentUser.getIdToken();
      const balance = await getWalletBalance(token);
      return balance;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch balance");
      return null;
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // Transfer money
  const handleTransferMoney = useCallback(
    async (transferData: WalletTransferRequest) => {
      if (!currentUser) return null;

      setLoading(true);
      setError(null);

      try {
        const token = await currentUser.getIdToken();
        const transaction = await transferMoney(transferData, token);
        // Refresh current wallet after transfer
        await fetchCurrentWallet();
        return transaction;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to transfer money"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentUser, fetchCurrentWallet]
  );

  // Get transaction history
  const fetchTransactionHistory = useCallback(
    async (page = 1, limit = 10) => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const token = await currentUser.getIdToken();
        const offset = (page - 1) * limit;
        const response = await getTransactionHistory(token, limit, offset);

        if (page === 1) {
          setTransactions(response.transactions);
        } else {
          setTransactions((prev) => [...prev, ...response.transactions]);
        }

        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          hasMore: response.hasMore,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch transaction history"
        );
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Update wallet status (admin only)
  const handleUpdateWalletStatus = useCallback(
    async (walletId: string, statusData: WalletStatusUpdateRequest) => {
      if (!currentUser) return null;

      setLoading(true);
      setError(null);

      try {
        const token = await currentUser.getIdToken();
        const updatedWallet = await updateWalletStatus(
          walletId,
          statusData,
          token
        );

        // Update the wallet in the list if it exists
        setWallets((prev) =>
          prev.map((wallet) =>
            wallet.id === walletId ? updatedWallet : wallet
          )
        );

        return updatedWallet;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to update wallet status"
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // List all workshop admin wallets (admin only)
  const fetchAllWorkshopWallets = useCallback(
    async (
      page = 1,
      limit = 10,
      status?: string,
      search?: string,
      append = false
    ) => {
      if (!currentUser) return;

      setLoading(true);
      setError(null);

      try {
        const token = await currentUser.getIdToken();
        const offset = (page - 1) * limit;
        const response = await listWorkshopAdminWallets(
          token,
          limit,
          offset,
          status,
          search
        );

        if (append && page > 1) {
          setWallets((prev) => [...prev, ...response.wallets]);
        } else {
          setWallets(response.wallets);
        }

        setPagination({
          page: response.page,
          limit: response.limit,
          total: response.total,
          hasMore: response.hasMore,
        });

        // Calculate stats for workshop admin wallets
        const totalBalance = response.wallets.reduce(
          (sum: number, wallet: Wallet) =>
            sum + getNumericBalance(wallet.balance),
          0
        );
        const activeUsers = response.wallets.filter(
          (wallet: Wallet) => wallet.status === "active"
        ).length;
        const averageBalance =
          response.wallets.length > 0
            ? totalBalance / response.wallets.length
            : 0;

        setStats({
          totalBalance,
          activeUsers,
          averageBalance,
          totalTransactions: response.total,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch workshop wallets"
        );
      } finally {
        setLoading(false);
      }
    },
    [currentUser]
  );

  // Load more wallets for pagination
  const loadMoreWallets = useCallback(
    async (status?: string, search?: string) => {
      if (!pagination.hasMore || loading) return;

      await fetchAllWorkshopWallets(
        pagination.page + 1,
        pagination.limit,
        status,
        search,
        true
      );
    },
    [
      fetchAllWorkshopWallets,
      pagination.hasMore,
      pagination.page,
      pagination.limit,
      loading,
    ]
  );

  // Load more transactions for pagination
  const loadMoreTransactions = useCallback(async () => {
    if (!pagination.hasMore || loading) return;

    await fetchTransactionHistory(pagination.page + 1, pagination.limit);
  }, [
    fetchTransactionHistory,
    pagination.hasMore,
    pagination.page,
    pagination.limit,
    loading,
  ]);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Reset state
  const resetState = useCallback(() => {
    setWallets([]);
    setCurrentWallet(null);
    setTransactions([]);
    setPagination({
      page: 1,
      limit: 10,
      total: 0,
      hasMore: false,
    });
    setStats({
      totalBalance: 0,
      activeUsers: 0,
      averageBalance: 0,
      totalTransactions: 0,
    });
    setError(null);
  }, []);

  return {
    // State
    loading,
    error,
    wallets,
    currentWallet,
    transactions,
    pagination,
    stats,

    // Actions
    fetchCurrentWallet,
    fetchWalletById,
    fetchWalletBalance,
    handleTransferMoney,
    fetchTransactionHistory,
    handleUpdateWalletStatus,
    fetchAllWorkshopWallets,
    loadMoreWallets,
    loadMoreTransactions,
    clearError,
    resetState,
  };
};
