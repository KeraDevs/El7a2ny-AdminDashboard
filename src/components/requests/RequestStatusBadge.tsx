import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertCircle, WrenchIcon } from "lucide-react";

interface RequestStatusBadgeProps {
  status: "pending" | "in-progress" | "completed" | "cancelled";
}

const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  switch (status) {
    case "pending":
      return (
        <Badge
          variant="outline"
          className="bg-yellow-100 text-yellow-800 border-yellow-300"
        >
          <Clock className="mr-1 h-3 w-3" /> Pending
        </Badge>
      );
    case "in-progress":
      return (
        <Badge
          variant="outline"
          className="bg-blue-100 text-blue-800 border-blue-300"
        >
          <WrenchIcon className="mr-1 h-3 w-3" /> In Progress
        </Badge>
      );
    case "completed":
      return (
        <Badge
          variant="outline"
          className="bg-green-100 text-green-800 border-green-300"
        >
          <CheckCircle className="mr-1 h-3 w-3" /> Completed
        </Badge>
      );
    case "cancelled":
      return (
        <Badge
          variant="outline"
          className="bg-red-100 text-red-800 border-red-300"
        >
          <AlertCircle className="mr-1 h-3 w-3" /> Cancelled
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export default RequestStatusBadge;
