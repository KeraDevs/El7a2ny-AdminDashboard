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
  IconWallet,
  IconSearch,
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
  IconSend,
  IconX,
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
import { ColumnVisibilityControl } from "@/components/ui/ColumnVisibilityControl";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

const PayoutsPage = () => {
  const {
    withdrawals,
    isLoading,
    error,
    currentPage,
    totalPages,
    total,
    setCurrentPage,
    processWithdrawal,
    refreshData,
  } = usePayouts();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] =
    useState<ManualWithdrawalRequest | null>(null);
  const [isProcessDialogOpen, setIsProcessDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [presetAction, setPresetAction] = useState<
    "approve" | "reject" | "initiate" | null
  >(null);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    workshop: true,
    admin: true,
    amount: true,
    payoutMethod: true,
    payoutDetails: true,
    requestDate: true,
    status: true,
    actions: true,
  });

  // Column definitions for visibility control
  const columns = [
    { key: "workshop", label: "Workshop", visible: columnVisibility.workshop },
    { key: "admin", label: "Admin", visible: columnVisibility.admin },
    { key: "amount", label: "Amount", visible: columnVisibility.amount },
    {
      key: "payoutMethod",
      label: "Payout Method",
      visible: columnVisibility.payoutMethod,
    },
    {
      key: "payoutDetails",
      label: "Payout Details",
      visible: columnVisibility.payoutDetails,
    },
    {
      key: "requestDate",
      label: "Request Date",
      visible: columnVisibility.requestDate,
    },
    { key: "status", label: "Status", visible: columnVisibility.status },
    { key: "actions", label: "Actions", visible: columnVisibility.actions },
  ];

  // Toggle column visibility
  const toggleColumn = (key: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

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

  // Prepare data for CSV export
  const csvData = filteredWithdrawals.map((withdrawal) => ({
    id: withdrawal.id,
    workshop_name: withdrawal.workshop?.name || "",
    admin_name: withdrawal.admin
      ? `${withdrawal.admin.first_name} ${withdrawal.admin.last_name}`
      : "",
    admin_email: withdrawal.admin?.email || "",
    admin_phone: withdrawal.admin?.phone || "",
    amount:
      typeof withdrawal.amount === "string"
        ? parseFloat(withdrawal.amount)
        : withdrawal.amount,
    payout_method: getPayoutMethodDisplay(withdrawal.payout_method),
    payout_details: formatPayoutDetails(
      withdrawal.payout_method,
      withdrawal.payout_details
    ),
    status: withdrawal.status,
    request_date: new Date(withdrawal.request_date).toLocaleDateString(),
    processed_date: withdrawal.processed_date
      ? new Date(withdrawal.processed_date).toLocaleDateString()
      : "",
    notes: withdrawal.notes || "",
  }));

  const csvHeaders = [
    { label: "Withdrawal ID", key: "id" },
    { label: "Workshop Name", key: "workshop_name" },
    { label: "Admin Name", key: "admin_name" },
    { label: "Admin Email", key: "admin_email" },
    { label: "Admin Phone", key: "admin_phone" },
    { label: "Amount (EGP)", key: "amount" },
    { label: "Payout Method", key: "payout_method" },
    { label: "Payout Details", key: "payout_details" },
    { label: "Status", key: "status" },
    { label: "Request Date", key: "request_date" },
    { label: "Processed Date", key: "processed_date" },
    { label: "Notes", key: "notes" },
  ];

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

  const handleApproveWithdrawal = (withdrawal: ManualWithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setPresetAction("approve");
    setIsProcessDialogOpen(true);
  };

  const handleRejectWithdrawal = (withdrawal: ManualWithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setPresetAction("reject");
    setIsProcessDialogOpen(true);
  };

  const handleInitiateWithdrawal = (withdrawal: ManualWithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setPresetAction("initiate");
    setIsProcessDialogOpen(true);
  };

  const handleViewWithdrawal = (withdrawal: ManualWithdrawalRequest) => {
    setSelectedWithdrawal(withdrawal);
    setIsViewDialogOpen(true);
  };

  const handleCloseProcessDialog = () => {
    setSelectedWithdrawal(null);
    setPresetAction(null);
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

  const getActionButtons = (withdrawal: ManualWithdrawalRequest) => {
    if (withdrawal.status === "pending") {
      return (
        <>
          <Button
            size="sm"
            onClick={() => handleApproveWithdrawal(withdrawal)}
            className="bg-green-600 hover:bg-green-700"
          >
            <IconCheck className="w-4 h-4 mr-2" />
            Approve
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => handleRejectWithdrawal(withdrawal)}
            className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          >
            <IconX className="w-4 h-4 mr-2" />
            Reject
          </Button>
        </>
      );
    }

    if (withdrawal.status === "approved") {
      return (
        <Button
          size="sm"
          onClick={() => handleInitiateWithdrawal(withdrawal)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <IconSend className="w-4 h-4 mr-2" />
          Initiate Payment
        </Button>
      );
    }

    return (
      <Button
        size="sm"
        variant="outline"
        onClick={() => handleViewWithdrawal(withdrawal)}
      >
        <IconEye className="w-4 h-4 mr-2" />
        View
      </Button>
    );
  };

  const stats = getPayoutStats();

  return (
    <div className="flex h-full w-full flex-col gap-5">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold tracking-tight">
          Payouts Management
        </h1>
        <p className="text-muted-foreground">
          Manage workshop withdrawal requests and payouts
        </p>
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
      <div className="flex flex-col md:flex-row items-center justify-between bg-muted dark:bg-background p-3 md:p-4 rounded-md gap-3">
        {/* Search bar */}
        <div className="relative w-full max-w-sm">
          <IconSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search admins, workshops, or payout details..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <ColumnVisibilityControl
            columns={columns}
            onToggleColumn={toggleColumn}
          />

          <Button onClick={refreshData} disabled={isLoading} variant="outline">
            <IconRefresh
              className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </div>

      {/* Withdrawals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal Requests</CardTitle>
          <CardDescription>
            View and process withdrawal requests from workshop admins
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <IconLoader className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          )}

          {!isLoading && error && (
            <div className="flex items-center justify-center h-64 text-destructive">
              Error loading withdrawals: {error}
            </div>
          )}

          {!isLoading && !error && filteredWithdrawals.length === 0 && (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              No withdrawal requests found
            </div>
          )}

          {!isLoading && !error && filteredWithdrawals.length > 0 && (
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
                      <div className="flex items-center gap-2">
                        {getActionButtons(withdrawal)}
                      </div>
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
          presetAction={presetAction}
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

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={csvData}
        filename="withdrawal-requests"
        headers={csvHeaders}
        columnVisibility={{
          workshop_name: columnVisibility.workshop,
          admin_name: columnVisibility.admin,
          admin_email: columnVisibility.admin,
          amount: columnVisibility.amount,
          payout_method: columnVisibility.payoutMethod,
          payout_details: columnVisibility.payoutDetails,
          request_date: columnVisibility.requestDate,
          status: columnVisibility.status,
        }}
      />
    </div>
  );
};

export default PayoutsPage;
