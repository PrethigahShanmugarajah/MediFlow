import {
  Banknote,
  Calendar,
  CheckCircle,
  ClipboardList,
  XCircle,
} from "lucide-react";
import StatCard from "../../../components/StatCard";
import { CURRENCY } from "../../../utils/helpers";

const StatsSection = ({ totals }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      <StatCard
        icon={<ClipboardList size={18} />}
        label="Total Services"
        value={totals.totalServices}
      />

      <StatCard
        icon={<Calendar size={18} />}
        label="Total Appointments"
        value={totals.totalAppointments}
      />

      <StatCard
        icon={<Banknote size={18} />}
        label="Total Earnings"
        value={`${CURRENCY} ${totals.totalEarning}`}
      />

      <StatCard
        icon={<CheckCircle size={18} />}
        label="Completed"
        value={totals.totalCompleted}
      />

      <StatCard
        icon={<XCircle size={18} />}
        label="Total Canceled"
        value={totals.totalCanceled}
      />
    </div>
  );
};

export default StatsSection;
