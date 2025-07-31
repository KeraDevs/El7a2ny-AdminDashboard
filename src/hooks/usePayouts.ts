"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  getPendingWithdrawals,
  processWithdrawalRequest,
} from "@/utils/walletsApi";
import {
  ManualWithdrawalRequest,
  ProcessWithdrawalRequest,
} from "@/types/walletTypes";
import toast from "react-hot-toast";

interface UsePayoutsReturn {
  withdrawals: ManualWithdrawalRequest[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  total: number;
  hasMore: boolean;
  statusFilter: string;
  workshopFilter: string;
  fetchWithdrawals: () => Promise<void>;
  processWithdrawal: (
    withdrawalId: string,
    processData: ProcessWithdrawalRequest
  ) => Promise<boolean>;
  setCurrentPage: (page: number) => void;
  setStatusFilter: (status: string) => void;
  setWorkshopFilter: (workshopId: string) => void;
  refreshData: () => Promise<void>;
}

export const usePayouts = (limit: number = 10): UsePayoutsReturn => {
  const { userData, currentUser } = useAuth();
  const [withdrawals, setWithdrawals] = useState<ManualWithdrawalRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [workshopFilter, setWorkshopFilter] = useState("");

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!currentUser) return null;
    try {
      return await currentUser.getIdToken();
    } catch (error) {
      console.error("Error getting token:", error);
      return null;
    }
  }, [currentUser]);

  const fetchWithdrawals = useCallback(async () => {
    if (!currentUser || !userData) {
      setError("Authentication required");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const token = await getToken();
      if (!token) {
        setError("Failed to get authentication token");
        return;
      }

      // Only fetch pending withdrawals, as /all endpoint does not exist
      let response = await getPendingWithdrawals(token, currentPage, limit);

      setWithdrawals(response.withdrawals);
      setTotal(response.total);
      setTotalPages(Math.ceil(response.total / limit));
      setHasMore(response.hasMore);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      setError(errorMessage);
      toast.error(`Failed to fetch withdrawals: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentUser,
    userData,
    currentPage,
    statusFilter,
    workshopFilter,
    limit,
    getToken,
  ]);

  const processWithdrawal = async (
    withdrawalId: string,
    processData: ProcessWithdrawalRequest
  ): Promise<boolean> => {
    if (!currentUser || !userData) {
      toast.error("Authentication required");
      return false;
    }

    try {
      const token = await getToken();
      if (!token) {
        toast.error("Failed to get authentication token");
        return false;
      }

      await processWithdrawalRequest(withdrawalId, processData, token);
      toast.success(
        `Withdrawal ${
          processData.action === "approve" ? "approved" : "rejected"
        } successfully`
      );
      await fetchWithdrawals(); // Refresh the list
      return true;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      toast.error(`Failed to process withdrawal: ${errorMessage}`);
      return false;
    }
  };

  const refreshData = async () => {
    await fetchWithdrawals();
  };

  // Fetch data when dependencies change
  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  return {
    withdrawals,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    hasMore,
    statusFilter,
    workshopFilter,
    fetchWithdrawals,
    processWithdrawal,
    setCurrentPage,
    setStatusFilter,
    setWorkshopFilter,
    refreshData,
  };
};
