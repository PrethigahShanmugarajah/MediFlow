// MediFlow / Client / src / components / DoctorsPage / Components / DoctorsError.jsx

const DoctorsError = ({ error, onRetry }) => (
  <div className="text-center mb-6">
    <div className="text-sm text-red-600 mb-2">{error}</div>
    <div className="flex items-center justify-center gap-3">
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-full bg-indigo-600 text-white"
      >
        Retry
      </button>
    </div>
  </div>
);

export default DoctorsError;
