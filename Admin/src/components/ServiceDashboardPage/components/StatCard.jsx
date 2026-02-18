// MediFlow / src / components / ServiceDashboardPage / components / StatCard.jsx

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-full bg-linear-to-br from-indigo-100 to-indigo-50 shadow-sm border border-blue-100 p-4 gap-4 flex items-center">
      <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-700">
        {icon}
      </div>

      <div>
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-lg font-semibold text-slate-800">{value}</div>
      </div>
    </div>
  );
};

export default StatCard;
