// MediFlow / Admin / src / components / ServiceAppointmentsPage /  components / StatusBadge.jsx
import {
  CheckCheck,
  CheckCircle,
  Clock,
  RotateCcw,
  XCircle,
} from "lucide-react";

const StatusBadge = ({ status }) => {
  const baseClasses =
    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium";

  const statusClasses =
    status === "Pending"
      ? "bg-lime-100 text-lime-800"
      : status === "Confirmed"
        ? "bg-indigo-100 text-indigo-800"
        : status === "Canceled"
          ? "bg-rose-100 text-rose-800"
          : status === "Completed"
            ? "bg-cyan-100 text-cyan-800"
            : status === "Rescheduled"
              ? "bg-emerald-100 text-emerald-800"
              : "bg-gray-100 text-gray-800";

  return (
    <span className={`${baseClasses} ${statusClasses}`}>
      {status === "Pending" && <Clock className="h-4 w-4" />}
      {status === "Confirmed" && <CheckCircle className="h-4 w-4" />}
      {status === "Completed" && <CheckCheck className="h-4 w-4" />}
      {status === "Canceled" && <XCircle className="h-4 w-4" />}
      {status === "Rescheduled" && <RotateCcw className="h-4 w-4" />}

      {status}
    </span>
  );
};

export default StatusBadge;
