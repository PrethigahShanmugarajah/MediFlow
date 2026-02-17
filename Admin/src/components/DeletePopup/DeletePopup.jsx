// MediFlow / Admin / src / components / DeletePopup / DeletePopup.jsx
import { X } from "lucide-react";
import { ClipLoader } from "react-spinners";

function cleanDoctorName(name = "") {
  return String(name)
    .replace(/^dr\.?\s*/i, "")
    .trim();
}

const DeletePopup = ({ onClose, onDelete, loading, name }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white p-6 rounded-xl w-96 relative shadow-lg border border-gray-300">
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 text-black hover:text-gray-700 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="text-center mt-4">
          <h4 className="mb-2 text-lg font-semibold text-indigo-600">
            Are you sure?
          </h4>

          <p className="text-black text-sm">
            Do you really want to delete <b>Dr. {cleanDoctorName(name)}</b>?{" "}
            <br />
            This action cannot be undone.
          </p>

          <div className="flex justify-center mt-5 gap-3">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 rounded-lg text-black bg-white border border-gray-300 transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              onClick={onDelete}
              disabled={loading}
              className={`px-4 py-2 rounded-lg transition cursor-pointer flex items-center justify-center min-w-22.5 ${
                loading
                  ? "bg-white border border-gray-300"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? <ClipLoader size={18} color="#3B82F6" /> : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeletePopup;
