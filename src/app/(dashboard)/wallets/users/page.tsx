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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconWallet,
  IconPlus,
  IconMinus,
  IconSearch,
  IconFilter,
  IconCreditCard,
  IconUsers,
  IconTrendingUp,
} from "@tabler/icons-react";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

const mockUsers = [
  {
    id: 1,
    name: "Ahmed Mohamed",
    email: "ahmed.mohamed@example.com",
    phone: "+20 100 123 4567",
    walletBalance: 1250.0,
    status: "active",
    lastTransaction: "2024-01-15",
  },
  {
    id: 2,
    name: "Sara Hassan",
    email: "sara.hassan@example.com",
    phone: "+20 101 234 5678",
    walletBalance: 850.5,
    status: "active",
    lastTransaction: "2024-01-14",
  },
  {
    id: 3,
    name: "Mohamed Ali",
    email: "mohamed.ali@example.com",
    phone: "+20 102 345 6789",
    walletBalance: 0.0,
    status: "inactive",
    lastTransaction: "2024-01-10",
  },
  {
    id: 4,
    name: "Fatma Ibrahim",
    email: "fatma.ibrahim@example.com",
    phone: "+20 103 456 7890",
    walletBalance: 2100.75,
    status: "active",
    lastTransaction: "2024-01-15",
  },
  {
    id: 5,
    name: "Omar Khaled",
    email: "omar.khaled@example.com",
    phone: "+20 104 567 8901",
    walletBalance: 475.25,
    status: "active",
    lastTransaction: "2024-01-13",
  },
];

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  status: string;
  lastTransaction: string;
}

interface WalletDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
  type: "add" | "remove";
  onConfirm: (amount: number, reason: string) => void;
}

function WalletDialog({
  user,
  isOpen,
  onClose,
  type,
  onConfirm,
}: WalletDialogProps) {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onConfirm(numAmount, reason);
      setAmount("");
      setReason("");
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "add" ? (
              <IconPlus className="h-5 w-5 text-green-500" />
            ) : (
              <IconMinus className="h-5 w-5 text-red-500" />
            )}
            {type === "add" ? "Add Balance" : "Remove Balance"}
          </DialogTitle>
          <DialogDescription>
            {type === "add" ? "Add money to" : "Remove money from"} {user?.name}
            &apos;s wallet
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount
            </Label>
            <Input
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              type="number"
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {type === "add" ? (
                  <>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="bonus">Bonus</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="compensation">Compensation</SelectItem>
                    <SelectItem value="manual">Manual Adjustment</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="penalty">Penalty</SelectItem>
                    <SelectItem value="correction">Correction</SelectItem>
                    <SelectItem value="chargeback">Chargeback</SelectItem>
                    <SelectItem value="manual">Manual Adjustment</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
          {user && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <p className="text-sm text-muted-foreground">Current Balance</p>
              <p className="text-lg font-semibold">
                EGP {user.walletBalance.toFixed(2)}
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || !reason}
            className={
              type === "add"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
          >
            {type === "add" ? "Add Balance" : "Remove Balance"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function WalletStats({ users }: { users: User[] }) {
  const totalBalance = users.reduce((sum, user) => sum + user.walletBalance, 0);
  const activeUsers = users.filter((user) => user.status === "active").length;
  const avgBalance = totalBalance / users.length;

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
              EGP {totalBalance.toFixed(2)}
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
                Active Users
              </CardTitle>
              <IconUsers className="h-4 w-4 text-green-600" />
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
              EGP {avgBalance.toFixed(2)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function UsersWalletPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "remove">("add");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleWalletAction = (user: User, type: "add" | "remove") => {
    setSelectedUser(user);
    setDialogType(type);
    setDialogOpen(true);
  };

  const handleWalletUpdate = (amount: number) => {
    if (selectedUser) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === selectedUser.id
            ? {
                ...user,
                walletBalance:
                  dialogType === "add"
                    ? user.walletBalance + amount
                    : Math.max(0, user.walletBalance - amount),
                lastTransaction: new Date().toISOString().split("T")[0],
              }
            : user
        )
      );
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
            User Wallets
          </h1>
          <p className="text-muted-foreground">
            Manage user wallet balances and transactions
          </p>
        </div>
      </motion.div>

      {/* Stats */}
      <WalletStats users={users} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="flex-1 relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <IconFilter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IconCreditCard className="h-5 w-5" />
              Users & Wallet Balances
            </CardTitle>
            <CardDescription>
              View and manage user wallet balances
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Wallet Balance</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="hover:bg-muted/50">
                    <TableCell>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm">{user.phone}</p>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <IconWallet className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">
                          EGP {user.walletBalance.toFixed(2)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className={
                          user.status === "active"
                            ? "bg-green-100 text-green-800 hover:bg-green-200"
                            : ""
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <p className="text-sm text-muted-foreground">
                        {user.lastTransaction}
                      </p>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWalletAction(user, "add")}
                          className="hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                        >
                          <IconPlus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWalletAction(user, "remove")}
                          className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                          disabled={user.walletBalance === 0}
                        >
                          <IconMinus className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div>

      {/* Wallet Dialog */}
      <WalletDialog
        user={selectedUser}
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        type={dialogType}
        onConfirm={handleWalletUpdate}
      />

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={filteredUsers.map((user) => ({
          name: user.name || "",
          email: user.email || "",
          phone: `+${user.phone}` || "",
          wallet_balance: user.walletBalance?.toString() || "0",
          status: user.status || "",
          last_transaction: user.lastTransaction || "",
        }))}
        filename="user-wallets"
        pageName="User Wallets Management Report"
      />
    </div>
  );
}
