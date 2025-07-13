"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconWallet,
  IconSearch,
  IconFilter,
  IconRefresh,
  IconBuilding,
  IconUser,
  IconCalendar,
  IconCurrencyPound,
  IconLoader,
  IconEye,
  IconCheck,
  IconArrowLeft,
  IconArrowRight,
} from "@tabler/icons-react";
import { usePayouts } from "@/hooks/usePayouts";
import {
  ManualWithdrawalRequest,
  getPayoutMethodDisplay,
  formatPayoutDetails,
  formatBalance,
} from "@/types/walletTypes";
import ProcessWithdrawalDialog from "@/components/wallets/ProcessWithdrawalDialog";
import ViewWithdrawalDialog from "@/components/wallets/ViewWithdrawalDialog";

const PayoutsPage = () => {
  const {
    withdrawals,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    statusFilter,
    setCurrentPage,
    setStatusFilter,
    processWithdrawal,
    refreshData,
  } = usePayouts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<ManualWithdrawalRequest | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  // Filter withdrawals based on search query
  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      withdrawal.admin?.first_name?.toLowerCase().includes(searchLower) ||
      withdrawal.admin?.last_name?.toLowerCase().includes(searchLower) ||
      withdrawal.admin?.email?.toLowerCase().includes(searchLower) ||
      withdrawal.workshop?.name?.toLowerCase().includes(searchLower) ||
      withdrawal.payout_details.toLowerCase().includes(searchLower)
    );
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "processed":
        return "default";
      default:
        return "secondary";
    }
  };

  const handleProcessWithdrawal = (withdrawal: ManualWithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setIsProcessDialogOpen(true);
  };

  const handleViewWithdrawal = (withdrawal: ManualWithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setIsViewDialogOpen(true);
  };

  const handleCloseProcessDialog = () => {
    setSelectedWithdrawal(null);
    setIsProcessDialogOpen(false);
  };

  const handleCloseViewDialog = () => {
    setSelectedWithdrawal(null);
    setIsViewDialogOpen(false);
  };

  const getPayoutStats = () => {
    const pending = withdrawals.filter((w) => w.status === "pending").length;
    const totalAmount = withdrawals.reduce(
      (sum, w) =>
        sum + (typeof w.amount === "string" ? parseFloat(w.amount) : w.amount),
      0
    );
    const approved = withdrawals.filter((w) => w.status === "approved").length;

    return { pending, totalAmount, approved };
  };

  const stats = getPayoutStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payouts Management</h1>
          <p className="text-muted-foreground">
            Manage workshop withdrawal requests and payouts
          </p>
        </div>
        <Button onClick={refreshData} disabled={isLoading} variant="outline">
          {isLoading ? (
            <IconLoader className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <IconRefresh className="w-4 h-4 mr-2" />
          )}
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Requests
              </CardTitle>
              <IconWallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {stats.pending}
              </div>
              <p className="text-xs text-muted-foreground">Awaiting approval</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Amount
              </CardTitle>
              <IconCurrencyPound className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                EGP {formatBalance(stats.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all requests
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <IconCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {stats.approved}
              </div>
              <p className="text-xs text-muted-foreground">Ready for payout</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>
            View and process withdrawal requests from workshop admins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 gap-4">
              <div className="relative flex-1 max-w-sm">
                <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search admins, workshops, or payout details..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <IconFilter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="processed">Processed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Withdrawals Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <IconLoader className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64 text-destructive">
              Error loading withdrawals: {error}
            </div>
          ) : filteredWithdrawals.length === 0 ? (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No withdrawal requests found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Workshop</TableHead>
                  <TableHead>Admin</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Payout Method</TableHead>
                  <TableHead>Payout Details</TableHead>
                  <TableHead>Request Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWithdrawals.map((withdrawal) => (
                  <TableRow key={withdrawal.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconBuilding className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          {withdrawal.workshop?.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconUser className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {withdrawal.admin?.first_name}{" "}
                            {withdrawal.admin?.last_name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {withdrawal.admin?.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconCurrencyPound className="h-4 w-4 text-muted-foreground" />
                        <span className="font-bold text-green-600">
                          EGP {formatBalance(withdrawal.amount)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPayoutMethodDisplay(withdrawal.payout_method)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {formatPayoutDetails(
                          withdrawal.payout_method,
                          withdrawal.payout_details
                        )}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconCalendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(withdrawal.request_date).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                        {withdrawal.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {withdrawal.status === "pending" ? (
                        <Button
                          size="sm"
                          onClick={() => handleProcessWithdrawal(withdrawal)}
                        >
                          <IconEye className="w-4 h-4 mr-2" />
                          Process
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewWithdrawal(withdrawal)}
                        >
                          <IconEye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="flex items-center justify-between p-6">
            <div className="text-sm text-muted-foreground">
              Showing {filteredWithdrawals.length} of {total} withdrawal
              requests
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <IconArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>
              <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <IconArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Process Withdrawal Dialog */}
      {selectedWithdrawal && (
        <ProcessWithdrawalDialog
          withdrawal={selectedWithdrawal}
          isOpen={isProcessDialogOpen}
          onClose={handleCloseProcessDialog}
          onProcess={processWithdrawal}
        />
      )}

      {/* View Withdrawal Dialog */}
      {selectedWithdrawal && (
        <ViewWithdrawalDialog
          withdrawal={selectedWithdrawal}
          isOpen={isViewDialogOpen}
          onClose={handleCloseViewDialog}
        />
      )}
    </div>
  );
};

export default PayoutsPage;
