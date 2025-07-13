"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  IconRefresh,
  IconSearch,
  IconChevronLeft,
  IconChevronRight,
  IconExternalLink,
  IconWallet,
  IconCalendar,
  IconFilter,
} from "@tabler/icons-react";
import { usePaymentTransactions } from "@/hooks/_usePaymentTransactions";
import {
  getPaymentTypeDisplay,
  getPaymentStatusDisplay,
} from "@/types/walletTypes";
import { format } from "date-fns";

export const TransactionsHistory: React.FC = () => {
  const {
    transactions,
    loading,
    error,
    pagination,
    fetchPaymentTransactions,
    refreshTransactions,
  } = usePaymentTransactions();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState({
    status: "",
    payment_type: "",
    search: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchPaymentTransactions(1, pageSize, {
      ...(filters.status && { status: filters.status }),
      ...(filters.payment_type && { payment_type: filters.payment_type }),
    });
    setCurrentPage(1);
  }, [
    fetchPaymentTransactions,
    pageSize,
    filters.status,
    filters.payment_type,
  ]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchPaymentTransactions(page, pageSize, {
      ...(filters.status && { status: filters.status }),
      ...(filters.payment_type && { payment_type: filters.payment_type }),
    });
  };

  const handleRefresh = () => {
    refreshTransactions();
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: "", payment_type: "", search: "" });
  };

  const filteredTransactions = transactions.filter((transaction) => {
    if (!filters.search) return true;

    const searchTerm = filters.search.toLowerCase();
    return (
      transaction.id.toLowerCase().includes(searchTerm) ||
      transaction.paymob_order_id.toLowerCase().includes(searchTerm) ||
      transaction.wallet?.user?.first_name
        ?.toLowerCase()
        .includes(searchTerm) ||
      transaction.wallet?.user?.last_name?.toLowerCase().includes(searchTerm) ||
      transaction.wallet?.user?.email?.toLowerCase().includes(searchTerm) ||
      transaction.description?.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(pagination.total / pageSize);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "pending":
        return "secondary";
      case "failed":
      case "cancelled":
      case "expired":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getPaymentTypeBadgeColor = (type: string) => {
    switch (type) {
      case "topup":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "payment":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "refund":
        return "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300";
      case "withdrawal":
        return "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Transactions History
            </h2>
            <p className="text-muted-foreground">
              View and manage all payment transactions with pagination
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <IconFilter className="mr-2 h-4 w-4" />
              Filters
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
            >
              <IconRefresh
                className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search</Label>
                  <div className="relative">
                    <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search"
                      placeholder="Search transactions..."
                      value={filters.search}
                      onChange={(e) =>
                        handleFilterChange("search", e.target.value)
                      }
                      className="pl-8"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={filters.status}
                    onValueChange={(value) =>
                      handleFilterChange("status", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                      <SelectItem value="expired">Expired</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <Select
                    value={filters.payment_type}
                    onValueChange={(value) =>
                      handleFilterChange("payment_type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All types</SelectItem>
                      <SelectItem value="topup">Top-up</SelectItem>
                      <SelectItem value="payment">Payment</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                      <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Page Size</Label>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => setPageSize(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 per page</SelectItem>
                      <SelectItem value="20">20 per page</SelectItem>
                      <SelectItem value="50">50 per page</SelectItem>
                      <SelectItem value="100">100 per page</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
                <div className="text-sm text-muted-foreground">
                  Showing {filteredTransactions.length} of {pagination.total}{" "}
                  transactions
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Transactions Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconWallet className="h-5 w-5" />
              Payment Transactions
            </CardTitle>
            <CardDescription>
              Complete history of all payment transactions in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading && transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">
                  Loading transactions...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-600">{error}</p>
                <Button
                  variant="outline"
                  onClick={handleRefresh}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Paymob Order</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((transaction) => {
                        const statusInfo = getPaymentStatusDisplay(
                          transaction.status
                        );
                        return (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              <div className="text-sm">
                                {transaction.id.slice(0, 8)}...
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                  <IconWallet className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm">
                                    {transaction.wallet?.user?.first_name}{" "}
                                    {transaction.wallet?.user?.last_name}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {transaction.wallet?.user?.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant="outline"
                                className={getPaymentTypeBadgeColor(
                                  transaction.payment_type
                                )}
                              >
                                {getPaymentTypeDisplay(
                                  transaction.payment_type
                                )}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div className="font-medium">
                                {transaction.amount.toLocaleString()}{" "}
                                {transaction.currency}
                              </div>
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant={getStatusBadgeVariant(
                                  transaction.status
                                )}
                              >
                                {statusInfo.label}
                              </Badge>
                            </TableCell>

                            <TableCell>
                              <div className="text-sm">
                                {transaction.paymob_order_id}
                              </div>
                              {transaction.paymob_transaction_id && (
                                <div className="text-xs text-muted-foreground">
                                  Txn:{" "}
                                  {transaction.paymob_transaction_id.slice(
                                    0,
                                    10
                                  )}
                                  ...
                                </div>
                              )}
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-1">
                                <IconCalendar className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm">
                                  {format(
                                    new Date(transaction.created_at),
                                    "MMM dd, yyyy"
                                  )}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {format(
                                  new Date(transaction.created_at),
                                  "HH:mm:ss"
                                )}
                              </div>
                            </TableCell>

                            <TableCell>
                              <div className="flex items-center gap-1">
                                {transaction.paymob_order_url && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      window.open(
                                        transaction.paymob_order_url,
                                        "_blank"
                                      )
                                    }
                                  >
                                    <IconExternalLink className="h-4 w-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between space-x-2 py-4">
                  <div className="text-sm text-muted-foreground">
                    Showing page {currentPage} of {totalPages} (
                    {pagination.total} total transactions)
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1 || loading}
                    >
                      <IconChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, totalPages) },
                        (_, i) => {
                          const pageNum =
                            Math.max(
                              1,
                              Math.min(totalPages - 4, currentPage - 2)
                            ) + i;
                          if (pageNum > totalPages) return null;

                          return (
                            <Button
                              key={pageNum}
                              variant={
                                currentPage === pageNum ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handlePageChange(pageNum)}
                              disabled={loading}
                            >
                              {pageNum}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages || loading}
                    >
                      Next
                      <IconChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};
