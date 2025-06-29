import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconPlus, IconWallet } from "@tabler/icons-react";
import { Wallet, formatBalance, getNumericBalance } from "@/types/walletTypes";
import { useWallets } from "@/hooks/_useWallets";
import toast from "react-hot-toast";

interface AddMoneyDialogProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddMoneyDialog({
  wallet,
  isOpen,
  onClose,
  onSuccess,
}: AddMoneyDialogProps) {
  const { handleTransferMoney, loading } = useWallets();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [reason, setReason] = useState("");

  const reasonOptions = [
    { value: "refund", label: "Refund" },
    { value: "bonus", label: "Bonus" },
    { value: "promotion", label: "Promotion" },
    { value: "compensation", label: "Compensation" },
    { value: "manual", label: "Manual Adjustment" },
    { value: "correction", label: "Correction" },
    { value: "other", label: "Other" },
  ];

  const handleSubmit = async () => {
    if (!wallet || !amount || !reason) {
      toast.error("Please fill in all required fields");
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const finalDescription =
      description.trim() || `${reason} - Admin added money`;

    try {
      const result = await handleTransferMoney({
        receiver_user_id: wallet.user_id,
        amount: numAmount,
        description: finalDescription,
      });

      if (result) {
        toast.success(
          `Successfully added EGP ${formatBalance(numAmount)} to wallet`
        );
        setAmount("");
        setDescription("");
        setReason("");
        onSuccess();
        onClose();
      }
    } catch (error) {
      toast.error("Failed to add money to wallet");
    }
  };

  const handleClose = () => {
    setAmount("");
    setDescription("");
    setReason("");
    onClose();
  };

  if (!wallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconPlus className="h-5 w-5 text-green-500" />
            Add Money to Wallet
          </DialogTitle>
          <DialogDescription>
            Add money to{" "}
            {wallet.user
              ? `${wallet.user.first_name} ${wallet.user.last_name}`
              : "user"}
            &apos;s wallet
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Current Balance Display */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <IconWallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Current Balance
              </span>
            </div>
            <div className="text-2xl font-bold">
              EGP {formatBalance(wallet.balance)}
            </div>
          </div>

          {/* Amount Input */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount *
            </Label>
            <Input
              id="amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="col-span-3"
              type="number"
              step="0.01"
              min="0.01"
            />
          </div>

          {/* Reason Selection */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="reason" className="text-right">
              Reason *
            </Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select reason" />
              </SelectTrigger>
              <SelectContent>
                {reasonOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description Input */}
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right mt-2">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Additional details (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="col-span-3"
              rows={3}
            />
          </div>

          {/* Preview */}
          {amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && (
            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-700 dark:text-green-300">
                  New Balance:
                </span>
                <span className="text-lg font-bold text-green-800 dark:text-green-200">
                  EGP{" "}
                  {formatBalance(
                    getNumericBalance(wallet.balance) + parseFloat(amount)
                  )}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!amount || !reason || loading}
            className="bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </div>
            ) : (
              <>
                <IconPlus className="h-4 w-4 mr-2" />
                Add Money
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
