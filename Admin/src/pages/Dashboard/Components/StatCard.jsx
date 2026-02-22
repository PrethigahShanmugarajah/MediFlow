// MediFlow / Admin / src / pages / Dashboard / Components / StatCard.jsx

const StatCard = ({ icon, label, value }) => {
  return (
    <div className="p-4 rounded-full bg-linear-to-br from-indigo-100 to-indigo-50 shadow-sm border border-blue-100">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/80 rounded-full shadow-inner">{icon}</div>
        <div className="flex-1">
          <div className="text-sm text-slate-600">{label}</div>
          <div className="text-xl font-semibold text-slate-800">{value}</div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
