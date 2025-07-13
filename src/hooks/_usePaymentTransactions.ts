import { useState, useCallback } from "react";
import {
  PaymentTransaction,
  PaymentTransactionListResponse,
} from "@/types/walletTypes";
import { API_BASE_URL } from "@/utils/config";

export const usePaymentTransactions = () => {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 20,
    offset: 0,
    has_more: false,
  });

  const fetchPaymentTransactions = useCallback(
    async (
      page: number = 1,
      limit: number = 20,
      filters?: {
        status?: string;
        payment_type?: string;
        start_date?: string;
        end_date?: string;
      }
    ) => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("admin_token");
        if (!token) {
          throw new Error("No authentication token found");
        }

        const offset = (page - 1) * limit;
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: offset.toString(),
        });

        // Add filters if provided
        if (filters) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value) {
              params.append(key, value);
            }
          });
        }

        const response = await fetch(
          `${API_BASE_URL}/payment/payments/transactions?${params}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch payment transactions"
          );
        }

        const data: PaymentTransactionListResponse = await response.json();

        if (page === 1) {
          setTransactions(data.payment_transactions);
        } else {
          setTransactions((prev) => [...prev, ...data.payment_transactions]);
        }

        setPagination(data.pagination);
      } catch (error) {
        console.error("Error fetching payment transactions:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        if (page === 1) {
          setTransactions([]);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const refreshTransactions = useCallback(() => {
    return fetchPaymentTransactions(1, pagination.limit);
  }, [fetchPaymentTransactions, pagination.limit]);

  const loadMoreTransactions = useCallback(() => {
    if (!loading && pagination.has_more) {
      const nextPage = Math.floor(pagination.offset / pagination.limit) + 2;
      return fetchPaymentTransactions(nextPage, pagination.limit);
    }
  }, [fetchPaymentTransactions, loading, pagination]);

  return {
    transactions,
    loading,
    error,
    pagination,
    fetchPaymentTransactions,
    refreshTransactions,
    loadMoreTransactions,
  };
};
