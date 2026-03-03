// MediFlow / Client / src / components / common / ApiError.jsx

const ApiError = ({
  message,
  onRetry,
  retryText = "Retry",
  className = "",
  children,
}) => {
  if (!message) return null;

  return (
    <div className={`text-center mb-6 ${className}`} role="alert">
      <div className="text-sm text-red-600 mb-3">{message}</div>

      <div className="flex flex-col items-center gap-4">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="px-8 py-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200 mt-4"
          >
            {retryText}
          </button>
        )}

        {children}
      </div>
    </div>
  );
};

export default ApiError;
