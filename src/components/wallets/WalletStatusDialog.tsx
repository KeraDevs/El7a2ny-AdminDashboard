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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { IconEdit, IconWallet, IconAlertTriangle } from "@tabler/icons-react";
import { Wallet, formatBalance } from "@/types/walletTypes";
import toast from "react-hot-toast";

interface WalletStatusDialogProps {
  wallet: Wallet | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (
    status: "active" | "inactive" | "suspended" | "frozen"
  ) => Promise<void>;
}

const statusOptions = [
  {
    value: "active",
    label: "Active",
    description: "Wallet is active and can be used for transactions",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  },
  {
    value: "inactive",
    label: "Inactive",
    description: "Wallet is inactive but not suspended",
    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
  },
  {
    value: "suspended",
    label: "Suspended",
    description: "Wallet is temporarily suspended from transactions",
    color:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  },
  {
    value: "frozen",
    label: "Frozen",
    description: "Wallet is frozen and cannot be used",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  },
];

export default function WalletStatusDialog({
  wallet,
  isOpen,
  onClose,
  onConfirm,
}: WalletStatusDialogProps) {
  const [selectedStatus, setSelectedStatus] = useState<
    "active" | "inactive" | "suspended" | "frozen" | ""
  >("");
  const [loading, setLoading] = useState(false);

  const handleStatusChange = (value: string) => {
    if (
      value === "active" ||
      value === "inactive" ||
      value === "suspended" ||
      value === "frozen"
    ) {
      setSelectedStatus(value);
    }
  };

  const handleSubmit = async () => {
    if (!selectedStatus || !wallet) return;

    setLoading(true);
    try {
      await onConfirm(selectedStatus);
      setSelectedStatus("");
      onClose();
    } catch {
      toast.error("Failed to update wallet status");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedStatus("");
    onClose();
  };

  const selectedStatusInfo = statusOptions.find(
    (option) => option.value === selectedStatus
  );

  const currentStatusInfo = statusOptions.find(
    (option) => option.value === wallet?.status
  );

  if (!wallet) return null;

  const isStatusChanged = selectedStatus && selectedStatus !== wallet.status;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconEdit className="h-5 w-5" />
            Update Wallet Status
          </DialogTitle>
          <DialogDescription>
            Change the status of{" "}
            {wallet.user
              ? `${wallet.user.first_name} ${wallet.user.last_name}`
              : "user"}
            &apos;s wallet
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Current Status */}
          <div className="space-y-2">
            <Label>Current Status</Label>
            <div className="flex items-center gap-2">
              <Badge className={currentStatusInfo?.color} variant="secondary">
                {currentStatusInfo?.label}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {currentStatusInfo?.description}
              </span>
            </div>
          </div>

          {/* New Status Selection */}
          <div className="space-y-2">
            <Label htmlFor="status">New Status *</Label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select new status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    disabled={option.value === wallet.status}
                  >
                    <div className="flex items-center gap-2">
                      <Badge className={option.color} variant="secondary">
                        {option.label}
                      </Badge>
                      {option.value === wallet.status && (
                        <span className="text-xs text-muted-foreground">
                          (Current)
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedStatusInfo && (
              <p className="text-sm text-muted-foreground">
                {selectedStatusInfo.description}
              </p>
            )}
          </div>

          {/* Warning for restrictive statuses */}
          {(selectedStatus === "suspended" || selectedStatus === "frozen") && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-start gap-2">
                <IconAlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    Warning
                  </h4>
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                    {selectedStatus === "suspended"
                      ? "Suspending this wallet will prevent the user from making transactions."
                      : "Freezing this wallet will completely block all wallet operations."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Wallet Info */}
          <div className="bg-muted/30 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <IconWallet className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                Wallet Balance
              </span>
            </div>
            <div className="text-lg font-bold">
              EGP {formatBalance(wallet.balance)}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isStatusChanged || loading}
            variant={
              selectedStatus === "suspended" || selectedStatus === "frozen"
                ? "destructive"
                : "default"
            }
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Updating...
              </div>
            ) : (
              <>
                <IconEdit className="h-4 w-4 mr-2" />
                Update Status
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
