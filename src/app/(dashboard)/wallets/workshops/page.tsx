"use client";

import { useState, useEffect } from "react";
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
  IconPlus,
  IconSearch,
  IconTrendingUp,
  IconEye,
  IconEdit,
  IconRefresh,
  IconBuilding,
} from "@tabler/icons-react";
import { useWorkshopWallets } from "@/hooks/_useWorkshopWallets";
import { Wallet, formatBalance } from "@/types/walletTypes";
import WalletDetailsDialog from "@/components/wallets/WalletDetailsDialog";
import AddMoneyDialog from "@/components/wallets/AddMoneyDialog";
import WalletStatusDialog from "@/components/wallets/WalletStatusDialog";
import { ColumnVisibilityControl } from "@/components/ui/ColumnVisibilityControl";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";
import toast from "react-hot-toast";

interface WalletStatsProps {
  readonly totalBalance: number;
  readonly activeUsers: number;
  readonly averageBalance: number;
}

function WalletStats({
  totalBalance,
  activeUsers,
  averageBalance,
}: WalletStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-800/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-400">
                Total Wallet Balance
              </CardTitle>
              <IconWallet className="h-4 w-4 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-800 dark:text-blue-300">
              EGP {formatBalance(totalBalance)}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100/50 dark:from-green-900/20 dark:to-green-800/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-green-700 dark:text-green-400">
                Active Workshop Admins
              </CardTitle>
              <IconBuilding className="h-4 w-4 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-800 dark:text-green-300">
              {activeUsers}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100/50 dark:from-purple-900/20 dark:to-purple-800/20">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-400">
                Average Balance
              </CardTitle>
              <IconTrendingUp className="h-4 w-4 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-800 dark:text-purple-300">
              EGP {formatBalance(averageBalance)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function getStatusBadgeColor(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "inactive":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    case "suspended":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "frozen":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export default function WorkshopWalletsPage() {
  const {
    loading,
    error,
    wallets,
    pagination,
    stats,
    fetchAllWorkshopWallets,
    loadMoreWallets,
    handleUpdateWalletStatus,
    clearError,
  } = useWorkshopWallets();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedWallet, setSelectedWallet] = useState<Wallet | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [showAddMoneyDialog, setShowAddMoneyDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState({
    admin: true,
    contact: true,
    balance: true,
    status: true,
    lastUpdated: true,
    actions: true,
  });

  // Column definitions for visibility control
  const columns = [
    { key: "admin", label: "Workshop Admin", visible: columnVisibility.admin },
    { key: "contact", label: "Contact", visible: columnVisibility.contact },
    {
      key: "balance",
      label: "Wallet Balance",
      visible: columnVisibility.balance,
    },
    { key: "status", label: "Status", visible: columnVisibility.status },
    {
      key: "lastUpdated",
      label: "Last Updated",
      visible: columnVisibility.lastUpdated,
    },
    { key: "actions", label: "Actions", visible: columnVisibility.actions },
  ];

  // Toggle column visibility
  const toggleColumn = (key: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev],
    }));
  };

  // Prepare data for CSV export
  const csvData = wallets.map((wallet) => ({
    id: wallet.id,
    admin_name: wallet.user
      ? `${wallet.user.first_name} ${wallet.user.last_name}`
      : "Unknown Admin",
    email: wallet.user?.email || "",
    phone: wallet.user?.phone || "",
    balance:
      typeof wallet.balance === "string"
        ? parseFloat(wallet.balance)
        : wallet.balance,
    status: wallet.status,
    created_at: new Date(wallet.created_at || "").toLocaleDateString(),
    updated_at: new Date(wallet.updated_at).toLocaleDateString(),
  }));

  const csvHeaders = [
    { label: "Wallet ID", key: "id" },
    { label: "Admin Name", key: "admin_name" },
    { label: "Email", key: "email" },
    { label: "Phone", key: "phone" },
    { label: "Balance (EGP)", key: "balance" },
    { label: "Status", key: "status" },
    { label: "Created Date", key: "created_at" },
    { label: "Last Updated", key: "updated_at" },
  ];

  // Load wallets on component mount
  useEffect(() => {
    fetchAllWorkshopWallets(1, 10);
  }, [fetchAllWorkshopWallets]);

  // Handle search and filter
  const handleSearch = () => {
    fetchAllWorkshopWallets(1, 10, "", searchTerm);
  };

  const handleReset = () => {
    setSearchTerm("");
    fetchAllWorkshopWallets(1, 10);
  };

  const handleViewDetails = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowDetailsDialog(true);
  };

  const handleAddMoney = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowAddMoneyDialog(true);
  };

  const handleUpdateStatus = (wallet: Wallet) => {
    setSelectedWallet(wallet);
    setShowStatusDialog(true);
  };

  const handleStatusUpdate = async (status: string) => {
    if (!selectedWallet) return;

    try {
      await handleUpdateWalletStatus(selectedWallet.id, {
        status: status as "active" | "inactive" | "suspended" | "frozen",
      });
      toast.success("Wallet status updated successfully");
      setShowStatusDialog(false);
      setSelectedWallet(null);
    } catch {
      toast.error("Failed to update wallet status");
    }
  };

  const handleLoadMore = () => {
    if (pagination.hasMore && !loading) {
      loadMoreWallets("", searchTerm);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={clearError} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Workshop Wallets
          </h1>
          <p className="text-muted-foreground">
            Manage workshop admin wallet balances and transactions
          </p>
        </div>
        <Button
          onClick={() => {
            fetchAllWorkshopWallets(1, 10, "", searchTerm);
          }}
          variant="outline"
          className="gap-2"
        >
          <IconRefresh className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      <WalletStats
        totalBalance={stats.totalBalance}
        activeUsers={stats.activeUsers}
        averageBalance={stats.averageBalance}
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2">
                <IconBuilding className="h-5 w-5" />
                Workshop Admins & Wallet Balances
              </CardTitle>
              <CardDescription>
                View and manage workshop admin wallet balances
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <IconSearch className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search workshops by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="pl-8 w-[300px]"
                />
              </div>
              <ColumnVisibilityControl
                columns={columns}
                onToggleColumn={toggleColumn}
              />
              <Button onClick={handleSearch} className="gap-2">
                <IconSearch className="h-4 w-4" />
                Search
              </Button>
              <Button onClick={handleReset} variant="outline">
                Reset
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && wallets.length === 0 ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">
                Loading workshop wallets...
              </p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    {columnVisibility.admin && (
                      <TableHead>Workshop Admin</TableHead>
                    )}
                    {columnVisibility.contact && <TableHead>Contact</TableHead>}
                    {columnVisibility.balance && (
                      <TableHead>Wallet Balance</TableHead>
                    )}
                    {columnVisibility.status && <TableHead>Status</TableHead>}
                    {columnVisibility.lastUpdated && (
                      <TableHead>Last Updated</TableHead>
                    )}
                    {columnVisibility.actions && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {wallets.map((wallet) => (
                    <TableRow key={wallet.id}>
                      {columnVisibility.admin && (
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {wallet.user
                                ? `${wallet.user.first_name} ${wallet.user.last_name}`
                                : "Unknown Workshop Admin"}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {wallet.user?.email}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.contact && (
                        <TableCell>
                          <div className="text-sm">{wallet.user?.phone}</div>
                        </TableCell>
                      )}
                      {columnVisibility.balance && (
                        <TableCell>
                          <div className="font-medium text-lg">
                            EGP {formatBalance(wallet.balance)}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.status && (
                        <TableCell>
                          <Badge
                            className={getStatusBadgeColor(wallet.status)}
                            variant="secondary"
                          >
                            {wallet.status}
                          </Badge>
                        </TableCell>
                      )}
                      {columnVisibility.lastUpdated && (
                        <TableCell>
                          <div className="text-sm">
                            {new Date(wallet.updated_at).toLocaleDateString()}
                          </div>
                        </TableCell>
                      )}
                      {columnVisibility.actions && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewDetails(wallet)}
                              className="h-8 w-8 p-0"
                            >
                              <IconEye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleAddMoney(wallet)}
                              className="h-8 w-8 p-0 text-green-600 hover:text-green-700"
                            >
                              <IconPlus className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleUpdateStatus(wallet)}
                              className="h-8 w-8 p-0"
                            >
                              <IconEdit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.hasMore && (
                <div className="flex justify-center mt-6">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                    className="gap-2"
                  >
                    {loading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                    ) : (
                      "Load More"
                    )}
                  </Button>
                </div>
              )}

              {wallets.length === 0 && !loading && (
                <div className="text-center py-12">
                  <IconBuilding className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    No workshop wallets found
                  </p>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <WalletDetailsDialog
        wallet={selectedWallet}
        isOpen={showDetailsDialog}
        onClose={() => {
          setShowDetailsDialog(false);
          setSelectedWallet(null);
        }}
      />

      <AddMoneyDialog
        wallet={selectedWallet}
        isOpen={showAddMoneyDialog}
        onClose={() => {
          setShowAddMoneyDialog(false);
          setSelectedWallet(null);
        }}
        onSuccess={() => {
          fetchAllWorkshopWallets(1, 10, "", searchTerm);
        }}
      />

      <WalletStatusDialog
        wallet={selectedWallet}
        isOpen={showStatusDialog}
        onClose={() => {
          setShowStatusDialog(false);
          setSelectedWallet(null);
        }}
        onConfirm={handleStatusUpdate}
      />

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={csvData}
        filename="workshop-wallets"
        headers={csvHeaders}
        columnVisibility={{
          admin_name: columnVisibility.admin,
          email: columnVisibility.admin,
          phone: columnVisibility.contact,
          balance: columnVisibility.balance,
          status: columnVisibility.status,
          updated_at: columnVisibility.lastUpdated,
        }}
      />
    </div>
  );
}
