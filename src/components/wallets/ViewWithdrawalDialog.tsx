"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  IconWallet,
  IconBuilding,
  IconUser,
  IconCalendar,
  IconCurrencyPound,
  IconFileText,
} from "@tabler/icons-react";
import {
  ManualWithdrawalRequest,
  getPayoutMethodDisplay,
  formatPayoutDetails,
  formatBalance,
} from "@/types/walletTypes";

interface ViewWithdrawalDialogProps {
  withdrawal: ManualWithdrawalRequest;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewWithdrawalDialog({
  withdrawal,
  isOpen,
  onClose,
}: ViewWithdrawalDialogProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <IconWallet className="h-5 w-5" />
            Withdrawal Request Details
          </DialogTitle>
          <DialogDescription>
            View details for withdrawal request from{" "}
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
                {withdrawal.admin?.phone && (
                  <div className="text-sm text-muted-foreground ml-6">
                    {withdrawal.admin.phone}
                  </div>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground">
                  Request Date
                </Label>
                <div className="flex items-center gap-2 mt-1">
                  <IconCalendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(withdrawal.request_date).toLocaleDateString()} at{" "}
                    {new Date(withdrawal.request_date).toLocaleTimeString()}
                  </span>
                </div>
              </div>

              {withdrawal.processed_date && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">
                    Processed Date
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <IconCalendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {new Date(withdrawal.processed_date).toLocaleDateString()}{" "}
                      at{" "}
                      {new Date(withdrawal.processed_date).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              )}
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

          {withdrawal.notes && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <IconFileText className="h-4 w-4" />
                  Processing Notes
                </Label>
                <div className="mt-2 p-3 bg-muted rounded-md">
                  <p className="text-sm">{withdrawal.notes}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
