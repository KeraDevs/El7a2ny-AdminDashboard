import { Badge } from "@/components/ui/badge";

interface RequestUrgencyBadgeProps {
  urgency: "high" | "normal" | "low";
}

const RequestUrgencyBadge = ({ urgency }: RequestUrgencyBadgeProps) => {
  switch (urgency) {
    case "high":
      return (
        <Badge className="bg-red-100 text-red-800 border-red-300">High</Badge>
      );
    case "normal":
      return (
        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
          Normal
        </Badge>
      );
    case "low":
      return (
        <Badge className="bg-green-100 text-green-800 border-green-300">
          Low
        </Badge>
      );
    default:
      return <Badge>{urgency}</Badge>;
  }
};

export default RequestUrgencyBadge;
