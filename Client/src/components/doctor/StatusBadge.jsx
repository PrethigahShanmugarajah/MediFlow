// MediFlow / Client / src / components / doctor / StatusBadge.jsx
import {
  BadgeCheck,
  CheckCircle,
  Clock,
  RefreshCcw,
  XCircle,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const normalizedStatus = {
    pending: "Pending",
    confirmed: "Confirmed",
    cancelled: "Canceled",
    canceled: "Canceled",
    complete: "Completed",
    completed: "Completed",
    rescheduled: "Rescheduled",
  };

  const statusKey = normalizedStatus[status?.toLowerCase()] || status;

  const statusMap = {
    Pending: {
      classes: "bg-fuchsia-100 text-fuchsia-800",
      icon: <Clock className="h-4 w-4" />,
    },
    Confirmed: {
      classes: "bg-indigo-100 text-indigo-800",
      icon: <CheckCircle className="h-4 w-4" />,
    },
    Canceled: {
      classes: "bg-rose-100 text-rose-800",
      icon: <XCircle className="h-4 w-4" />,
    },
    Completed: {
      classes: "bg-amber-100 text-amber-800",
      icon: <BadgeCheck className="h-4 w-4" />,
    },
    Rescheduled: {
      classes: "bg-emerald-100 text-emerald-800",
      icon: <RefreshCcw className="h-4 w-4" />,
    },
  };

  const config = statusMap[statusKey] || {
    classes: "bg-gray-100 text-gray-800",
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm ${config.classes}`}
    >
      {config.icon}
      {statusKey}
    </span>
  );
};

export default StatusBadge;
