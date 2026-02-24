// MediFlow / Admin / src / pages / AddService / Components / AddServiceHeader.jsx
import { CheckCircle } from "lucide-react";
import { ClipLoader } from "react-spinners";

const AddServiceHeader = ({ serviceId, submitting, onReset }) => {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-linear-to-r from-indigo-700 to-cyan-600 bg-clip-text">
          {serviceId ? "Edit Service" : "Add Service"}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a beautiful service card with unique time slots
        </p>
      </div>

      <div className="flex w-full sm:w-auto flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="w-full sm:w-auto px-4 py-2 cursor-pointer rounded-full bg-white border border-indigo-100 hover:shadow transition-shadow duration-200"
        >
          Reset
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex justify-center items-center gap-2 w-full sm:w-auto px-5 py-2 rounded-full bg-linear-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-60"
        >
          {submitting ? (
            <>
              <div className="flex items-center justify-center w-full">
                <ClipLoader size={20} color="#FFFFFF" />
              </div>
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />{" "}
              {serviceId ? "Update Service" : "Save Service"}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default AddServiceHeader;
