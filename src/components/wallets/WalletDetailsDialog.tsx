import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import {
  IconWallet,
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconHistory,
  IconRefresh,
} from "@tabler/icons-react";
import { Wallet, formatBalance } from "@/types/walletTypes";
import { useWallets } from "@/hooks/_useWallets";

interface WalletDetailsDialogProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
}

function getTransactionTypeColor(type: string) {
  switch (type) {
    case "credit":
    case "transfer_in":
      return "text-green-600 bg-green-50 dark:bg-green-900/20";
    case "debit":
    case "transfer_out":
      return "text-red-600 bg-red-50 dark:bg-red-900/20";
    default:
      return "text-gray-600 bg-gray-50 dark:bg-gray-700";
  }
}

function getStatusColor(status: string) {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
    case "failed":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
    case "cancelled":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
}

export default function WalletDetailsDialog({
  wallet,
  isOpen,
  onClose,
}: WalletDetailsDialogProps) {
  const { fetchTransactionHistory, transactions, loading } = useWallets();
  const [showTransactions, setShowTransactions] = useState(false);

  useEffect(() => {
    if (wallet && isOpen && showTransactions) {
      fetchTransactionHistory(1, 10);
    }
  }, [wallet, isOpen, showTransactions, fetchTransactionHistory]);

  const handleShowTransactions = () => {
    setShowTransactions(true);
    if (wallet) {
      fetchTransactionHistory(1, 10);
    }
  };

  if (!wallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconWallet className="h-5 w-5" />
            Wallet Details
          </DialogTitle>
          <DialogDescription>
            View wallet information and transaction history
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* User Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconUser className="h-5 w-5" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Name:</span>
                  <span className="font-medium">
                    {wallet.user
                      ? `${wallet.user.first_name} ${wallet.user.last_name}`
                      : "Unknown User"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconMail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Email:</span>
                  <span className="font-medium">
                    {wallet.user?.email || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconPhone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Phone:</span>
                  <span className="font-medium">
                    {wallet.user?.phone || "N/A"}
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <IconWallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Wallet ID:
                  </span>
                  <span className="font-mono text-sm">{wallet.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Created:
                  </span>
                  <span className="font-medium">
                    {new Date(wallet.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Updated:
                  </span>
                  <span className="font-medium">
                    {new Date(wallet.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Wallet Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <IconWallet className="h-5 w-5" />
                Wallet Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">
                    Current Balance
                  </span>
                  <div className="text-3xl font-bold text-primary">
                    EGP {formatBalance(wallet.balance)}
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <div>
                    <Badge
                      className={
                        wallet.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : wallet.status === "inactive"
                          ? "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                          : wallet.status === "suspended"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                      }
                      variant="secondary"
                    >
                      {wallet.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <IconHistory className="h-5 w-5" />
                  Transaction History
                </CardTitle>
                <div className="flex gap-2">
                  {!showTransactions && (
                    <Button
                      onClick={handleShowTransactions}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      <IconHistory className="h-4 w-4" />
                      Load Transactions
                    </Button>
                  )}
                  {showTransactions && (
                    <Button
                      onClick={() => fetchTransactionHistory(1, 10)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      disabled={loading}
                    >
                      <IconRefresh className="h-4 w-4" />
                      Refresh
                    </Button>
                  )}
                </div>
              </div>
              {showTransactions && (
                <CardDescription>
                  Recent transactions for this wallet
                </CardDescription>
              )}
            </CardHeader>
            {showTransactions && (
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-muted-foreground">
                      Loading transactions...
                    </p>
                  </div>
                ) : transactions.length > 0 ? (
                  <div className="max-h-[300px] overflow-y-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>
                              <Badge
                                className={getTransactionTypeColor(
                                  transaction.type
                                )}
                                variant="secondary"
                              >
                                {transaction.type.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span
                                className={
                                  transaction.type === "credit" ||
                                  transaction.type === "transfer_in"
                                    ? "text-green-600 font-medium"
                                    : "text-red-600 font-medium"
                                }
                              >
                                {transaction.type === "credit" ||
                                transaction.type === "transfer_in"
                                  ? "+"
                                  : "-"}
                                EGP {formatBalance(transaction.amount)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {transaction.description}
                              </span>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={getStatusColor(transaction.status)}
                                variant="secondary"
                              >
                                {transaction.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {new Date(
                                  transaction.created_at
                                ).toLocaleDateString()}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <IconHistory className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      No transactions found
                    </p>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
