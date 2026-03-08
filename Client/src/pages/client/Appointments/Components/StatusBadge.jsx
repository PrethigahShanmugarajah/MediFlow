import {
  BadgeCheck,
  CheckCircle,
  Clock,
  RefreshCcw,
  XCircle,
} from "lucide-react";

const StatusBadge = ({ itemStatus }) => {
  if (itemStatus === "Completed")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-amber-100 text-amber-700 border border-amber-200 flex items-center gap-1">
        <BadgeCheck className="w-3" /> Completed
      </span>
    );

  if (itemStatus === "Confirmed")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1">
        <CheckCircle className="w-3" /> Confirmed
      </span>
    );

  if (itemStatus === "Pending")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-fuchsia-100 text-fuchsia-700 border border-fuchsia-200 flex items-center gap-1">
        <Clock className="w-3" /> Pending
      </span>
    );

  if (itemStatus === "Canceled")
    return (
      <span className="px-3 py-1 rounded-full font-semibold text-xs bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
        <XCircle className="w-3" /> Canceled
      </span>
    );

  return (
    <span className="px-3 py-1 rounded-full font-semibold text-xs bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
      <RefreshCcw className="w-3" /> Rescheduled
    </span>
  );
};

export default StatusBadge;
