import { BeatLoader } from "react-spinners";

const RefreshBlock = ({ loading, count, isPropMode, onRefresh }) => {
  const label = loading ? (
    <BeatLoader size={6} color="#6366F1" />
  ) : (
    `${count} service${count !== 1 ? "s" : ""}`
  );

  return (
    <div className="mt-3 sm:mt-0 flex items-center gap-3">
      <div className="text-xs text-slate-600">{label}</div>

      <button
        onClick={onRefresh}
        className={`px-3 py-1 rounded-full text-sm ${
          isPropMode
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white text-indigo-600 border border-indigo-200 hover:shadow-sm"
        }`}
        title={isPropMode ? "Services provided by parent component" : "Refresh"}
      >
        Refresh
      </button>
    </div>
  );
};

export default RefreshBlock;
