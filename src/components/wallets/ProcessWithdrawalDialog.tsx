"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  IconCheck,
  IconX,
  IconLoader,
  IconWallet,
  IconBuilding,
  IconUser,
  IconCalendar,
  IconCurrencyPound,
  IconSend,
} from "@tabler/icons-react";
import {
  ManualWithdrawalRequest,
  getPayoutMethodDisplay,
  formatPayoutDetails,
  formatBalance,
  ProcessWithdrawalRequest,
} from "@/types/walletTypes";

interface ProcessWithdrawalDialogProps {
  readonly withdrawal: ManualWithdrawalRequest;
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly onProcess: (
    withdrawalId: string,
    processData: ProcessWithdrawalRequest
  ) => Promise<boolean>;
  readonly presetAction?: "approve" | "reject" | "initiate" | null;
}

export default function ProcessWithdrawalDialog({
  withdrawal,
  isOpen,
  onClose,
  onProcess,
  presetAction,
}: ProcessWithdrawalDialogProps) {
  const [action, setAction] = useState<"approve" | "reject" | "initiate" | "">(
    presetAction || ""
  );
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Update action when presetAction changes
  useEffect(() => {
    setAction(presetAction || "");
  }, [presetAction]);

  const handleProcess = async () => {
    if (!action) return;

    setIsProcessing(true);
    try {
      const success = await onProcess(withdrawal.id, {
        action,
        notes: notes.trim() || undefined,
      });

      if (success) {
        handleClose();
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setAction("");
    setNotes("");
    onClose();
  };

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

  const getButtonClassName = () => {
    if (action === "approve") {
      return "bg-green-600 hover:bg-green-700";
    }
    if (action === "initiate") {
      return "bg-blue-600 hover:bg-blue-700";
    }
    if (action === "reject") {
      return "bg-red-600 hover:bg-red-700";
    }
    return "";
  };

  const getButtonContent = () => {
    if (isProcessing) {
      return (
        <>
          <IconLoader className="w-4 h-4 mr-2 animate-spin" />
          Processing...
        </>
      );
    }

    if (action === "approve") {
      return (
        <>
          <IconCheck className="w-4 h-4 mr-2" />
          Approve
        </>
      );
    }

    if (action === "initiate") {
      return (
        <>
          <IconSend className="w-4 h-4 mr-2" />
          Initiate Payment
        </>
      );
    }

    if (action === "reject") {
      return (
        <>
          <IconX className="w-4 h-4 mr-2" />
          Reject
        </>
      );
    }

    return "Process";
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconWallet className="h-5 w-5" />
            Process Withdrawal Request
          </DialogTitle>
          <DialogDescription>
            Review and process the withdrawal request from{" "}
            {withdrawal.admin?.first_name} {withdrawal.admin?.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Withdrawal Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Workshop
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconBuilding className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">
                    {withdrawal.workshop?.name}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Admin
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconUser className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {withdrawal.admin?.first_name} {withdrawal.admin?.last_name}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground ml-6">
                  {withdrawal.admin?.email}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Request Date
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(withdrawal.request_date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Amount
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconCurrencyPound className="h-4 w-4 text-muted-foreground" />
                  <span className="text-2xl font-bold text-green-600">
                    EGP {formatBalance(withdrawal.amount)}
                  </span>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Payout Method
                </Label>
                <div className="mt-1">
                  <Badge variant="outline" className="font-medium">
                    {getPayoutMethodDisplay(withdrawal.payout_method)}
                  </Badge>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Payout Details
                </Label>
                <div className="mt-1 p-2 bg-muted rounded-md">
                  <code className="text-sm">
                    {formatPayoutDetails(
                      withdrawal.payout_method,
                      withdrawal.payout_details
                    )}
                  </code>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Status
                </Label>
                <div className="mt-1">
                  <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                    {withdrawal.status.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Selection */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="action" className="text-sm font-medium">
                Action *
              </Label>
              <Select
                value={action}
                onValueChange={(value: "approve" | "reject" | "initiate") =>
                  setAction(value)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approve">
                    <div className="flex items-center gap-2">
                      <IconCheck className="h-4 w-4 text-green-600" />
                      Approve
                    </div>
                  </SelectItem>
                  <SelectItem value="initiate">
                    <div className="flex items-center gap-2">
                      <IconSend className="h-4 w-4 text-blue-600" />
                      Initiate Payment
                    </div>
                  </SelectItem>
                  <SelectItem value="reject">
                    <div className="flex items-center gap-2">
                      <IconX className="h-4 w-4 text-red-600" />
                      Reject
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </Label>
              <Textarea
                id="notes"
                placeholder="Add any notes or comments about this decision..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            onClick={handleProcess}
            disabled={!action || isProcessing}
            className={getButtonClassName()}
          >
            {getButtonContent()}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
