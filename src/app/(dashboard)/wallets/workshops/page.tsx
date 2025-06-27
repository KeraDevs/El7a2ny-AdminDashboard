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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconWallet,
  IconPlus,
  IconMinus,
  IconSearch,
  IconFilter,
  IconDots,
  IconBuildingStore,
  IconTrendingUp,
} from "@tabler/icons-react";
import { FloatingDownloadButton } from "@/components/ui/FloatingDownloadButton";

interface Workshop {
  id: number;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  status: "active" | "inactive";
  lastTransaction: string;
  location: string;
  owner: string;
}

interface WalletDialogProps {
  workshop: Workshop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "add" | "transfer";
  onSubmit: (amount: number, reason: string) => void;
}

// Mock data for workshops
const mockWorkshops: Workshop[] = [
  {
    id: 1,
    name: "Auto Tech Workshop",
    email: "info@autotech.com",
    phone: "+20 100 123 4567",
    walletBalance: 152500.0,
    status: "active" as const,
    lastTransaction: "2024-01-15",
    location: "New Cairo",
    owner: "Ahmed Hassan",
  },
  {
    id: 2,
    name: "Speed Garage",
    email: "contact@speedgarage.com",
    phone: "+20 101 234 5678",
    walletBalance: 88500.5,
    status: "active" as const,
    lastTransaction: "2024-01-14",
    location: "Nasr City",
    owner: "Mohamed Ali",
  },
  {
    id: 3,
    name: "Quick Fix",
    email: "admin@quickfix.com",
    phone: "+20 102 345 6789",
    walletBalance: 0.0,
    status: "inactive" as const,
    lastTransaction: "2024-01-10",
    location: "Heliopolis",
    owner: "Sara Ahmed",
  },
  {
    id: 4,
    name: "Elite Motors",
    email: "service@elitemotors.com",
    phone: "+20 103 456 7890",
    walletBalance: 221000.75,
    status: "active" as const,
    lastTransaction: "2024-01-15",
    location: "Maadi",
    owner: "Omar Khaled",
  },
  {
    id: 5,
    name: "City Auto Care",
    email: "info@cityautocare.com",
    phone: "+20 104 567 8901",
    walletBalance: 47500.25,
    status: "active" as const,
    lastTransaction: "2024-01-13",
    location: "Zamalek",
    owner: "Fatma Ibrahim",
  },
];

interface WalletDialogProps {
  workshop: Workshop | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: "add" | "transfer";
  onSubmit: (amount: number, reason: string) => void;
}

// Wallet Statistics Component
const WalletStats = ({ workshops }: { workshops: Workshop[] }) => {
  const totalBalance = workshops.reduce(
    (sum, workshop) => sum + workshop.walletBalance,
    0
  );
  const activeWorkshops = workshops.filter((w) => w.status === "active").length;
  const averageBalance =
    workshops.length > 0 ? totalBalance / workshops.length : 0;
  const stats = [
    {
      title: "Total Workshop Balance",
      value: `${totalBalance.toLocaleString()} EGP`,
      icon: IconWallet,
      description: "Combined wallet balance",
      trend: "+12.5%",
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
    },
    {
      title: "Active Workshops",
      value: activeWorkshops.toString(),
      icon: IconBuildingStore,
      description: "Workshops with transactions",
      trend: "+5.2%",
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
    },
    {
      title: "Average Balance",
      value: `${averageBalance.toLocaleString()} EGP`,
      icon: IconTrendingUp,
      description: "Per workshop average",
      trend: "+8.1%",
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-6">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card
            className={`border-0 shadow-md bg-gradient-to-br ${stat.bgColor} hover:shadow-lg transition-all duration-300`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div
                className={`text-2xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
              >
                {stat.value}
              </div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <span className="text-xs text-green-600 font-medium">
                  {stat.trend}
                </span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Wallet Dialog Component
const WalletDialog = ({
  workshop,
  open,
  onOpenChange,
  type,
  onSubmit,
}: WalletDialogProps) => {
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = () => {
    const numAmount = parseFloat(amount);
    if (numAmount > 0 && reason.trim()) {
      onSubmit(numAmount, reason.trim());
      setAmount("");
      setReason("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {type === "add" ? (
              <IconPlus className="h-5 w-5 text-green-600" />
            ) : (
              <IconMinus className="h-5 w-5 text-blue-600" />
            )}
            {type === "add" ? "Add" : "Transfer"} Funds - {workshop?.name}
          </DialogTitle>
          <DialogDescription>
            Current balance:
            <span className="font-semibold">
              {workshop?.walletBalance.toLocaleString()} EGP
            </span>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (EGP)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger>
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {type === "add" ? (
                  <>
                    <SelectItem value="service_payment">
                      Service Payment Received
                    </SelectItem>
                    <SelectItem value="bonus">Performance Bonus</SelectItem>
                    <SelectItem value="refund_correction">
                      Refund Correction
                    </SelectItem>
                    <SelectItem value="commission_credit">
                      Commission Credit
                    </SelectItem>
                    <SelectItem value="manual_adjustment">
                      Manual Adjustment
                    </SelectItem>
                    <SelectItem value="government_subsidy">
                      Government Subsidy
                    </SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="transfer_to_bank">
                      Transfer to Bank Account
                    </SelectItem>
                    <SelectItem value="transfer_to_owner">
                      Transfer to Owner Account
                    </SelectItem>
                    <SelectItem value="penalty_deduction">
                      Penalty Deduction
                    </SelectItem>
                    <SelectItem value="tax_payment">Tax Payment</SelectItem>
                    <SelectItem value="commission_deduction">
                      Commission Deduction
                    </SelectItem>
                    <SelectItem value="transfer_other">
                      Transfer to Other Workshop
                    </SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || !reason}
            className={
              type === "add"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }
          >
            {type === "add" ? "Add Funds" : "Transfer Funds"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default function WorkshopWalletsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>(mockWorkshops);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(
    null
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<"add" | "transfer">("add");

  // Filter workshops based on search and status
  const filteredWorkshops = workshops.filter((workshop) => {
    const matchesSearch =
      workshop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workshop.location.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || workshop.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  const handleWalletAction = (workshop: Workshop, type: "add" | "transfer") => {
    setSelectedWorkshop(workshop);
    setDialogType(type);
    setDialogOpen(true);
  };
  const handleWalletSubmit = (amount: number, reason: string) => {
    if (!selectedWorkshop) return;

    setWorkshops((prev) =>
      prev.map((workshop) => {
        if (workshop.id === selectedWorkshop.id) {
          const newBalance =
            dialogType === "add"
              ? workshop.walletBalance + amount
              : Math.max(0, workshop.walletBalance - amount);

          return {
            ...workshop,
            walletBalance: newBalance,
            lastTransaction: new Date().toISOString().split("T")[0],
          };
        }
        return workshop;
      })
    );

    // Here you would typically make an API call to update the workshop's wallet
    console.log(
      `${dialogType === "add" ? "Added" : "Transferred"} ${amount} EGP ${
        dialogType === "add" ? "to" : "from"
      } ${selectedWorkshop.name} wallet. Reason: ${reason}`
    );
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md";
      case "inactive":
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md";
      default:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white shadow-md";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            Workshop Wallets
          </h1>
          <p className="text-muted-foreground">
            Manage workshop wallet balances and transactions
          </p>
        </div>
      </motion.div>

      <WalletStats workshops={workshops} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <IconWallet className="h-5 w-5" />
                  Workshop Wallets
                </CardTitle>
                <CardDescription>
                  View and manage workshop wallet balances
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search workshops..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-32">
                    <IconFilter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workshop</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Wallet Balance</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Transaction</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredWorkshops.map((workshop, index) => (
                    <motion.tr
                      key={workshop.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 border-b border-gray-100"
                    >
                      <TableCell>
                        <div>
                          <div className="font-medium">{workshop.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {workshop.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{workshop.owner}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{workshop.location}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{workshop.phone}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          {workshop.walletBalance.toLocaleString()} EGP
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(workshop.status)}>
                          {workshop.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {workshop.lastTransaction}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <IconDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                handleWalletAction(workshop, "add")
                              }
                              className="text-green-600"
                            >
                              <IconPlus className="mr-2 h-4 w-4" />
                              Add Funds
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleWalletAction(workshop, "transfer")
                              }
                              className="text-blue-600"
                            >
                              <IconMinus className="mr-2 h-4 w-4" />
                              Transfer Funds
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
              {filteredWorkshops.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No workshops found matching your criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <WalletDialog
        workshop={selectedWorkshop}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={dialogType}
        onSubmit={handleWalletSubmit}
      />

      {/* Floating Download Button */}
      <FloatingDownloadButton
        data={filteredWorkshops.map(workshop => ({
          name: workshop.name || '',
          email: workshop.email || '',
          phone: `+${workshop.phone}` || '',
          wallet_balance: workshop.walletBalance?.toString() || '0',
          location: workshop.location || '',
          owner: workshop.owner || '',
          status: workshop.status || '',
          last_transaction: workshop.lastTransaction || ''
        }))}
        filename="workshop-wallets"
        pageName="Workshop Wallets Management Report"
      />
    </div>
  );
}
