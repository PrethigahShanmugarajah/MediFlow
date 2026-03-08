import { Banknote, Calendar, CheckCircle, XCircle } from "lucide-react";
import StatCard from "./StatCard";
import { CURRENCY } from "../../../../utils/helpers";

const StatsSection = ({
  totalAppointments,
  completedAppointments,
  cancelledAppointments,
  totalEarnings,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        label="Total Appointments"
        value={totalAppointments}
        icon={<Calendar className="w-5 h-5" />}
      />

      <StatCard
        label="Total Earnings"
        value={`${CURRENCY} ${totalEarnings}`}
        icon={<Banknote className="w-5 h-5" />}
      />

      <StatCard
        label="Completed"
        value={completedAppointments}
        icon={<CheckCircle className="w-5 h-5" />}
      />

      <StatCard
        label="Cancelled"
        value={cancelledAppointments}
        icon={<XCircle className="w-5 h-5" />}
      />
    </div>
  );
};

export default StatsSection;
