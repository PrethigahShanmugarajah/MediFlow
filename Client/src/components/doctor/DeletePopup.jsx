import { X } from "lucide-react";
import { ClipLoader } from "react-spinners";

const DeletePopup = ({
  onClose,
  onDelete,
  loading = false,
  item,
  title,
  description,
  confirmText,
  closeText,
  children,
}) => {
  const body = children ?? description;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md rounded-xl border border-gray-300 bg-white p-6 shadow-lg">
        <button
          type="button"
          onClick={onClose}
          disabled={!!loading}
          className="absolute top-4 right-4 cursor-pointer text-black hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        <div className="mt-2 text-center">
          <h4 className="mb-2 text-lg font-semibold text-indigo-600">
            {title || "Are you sure?"}
          </h4>

          <p className="text-sm text-black">
            {body ? (
              body
            ) : (
              <>
                Do you really want to delete <b>{item}</b>? <br />
                This action cannot be undone.
              </>
            )}
          </p>

          <div className="mt-5 flex justify-center gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={!!loading}
              className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-black transition disabled:cursor-not-allowed disabled:opacity-60"
            >
              {closeText || "Close"}
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={!!loading}
              className={`min-w-22.5 cursor-pointer rounded-lg px-4 py-2 transition flex items-center justify-center disabled:cursor-not-allowed ${
                loading
                  ? "border border-indigo-300 bg-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? <ClipLoader size={18} color="#3B82F6" /> : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
