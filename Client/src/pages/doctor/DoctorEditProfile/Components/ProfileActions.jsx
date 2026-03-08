import { Save } from "lucide-react";
import { ClipLoader } from "react-spinners";

const ProfileActions = ({ editing, saveMessage, onReset, onSave }) => {
  const isSaving = saveMessage?.type === "saving";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-indigo-100">
      <div className="text-sm text-gray-500">
        {editing
          ? "Make changes and save your profile"
          : "View and edit your profile"}
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
        <button
          onClick={onReset}
          className="px-6 py-3 rounded-full cursor-pointer border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-200 font-medium w-full sm:w-auto text-center"
        >
          Reset to Server
        </button>

        <button
          onClick={onSave}
          disabled={!editing || isSaving}
          className="group relative overflow-hidden bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-6 py-3 rounded-full cursor-pointer shadow-lg transition-all duration-300 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed w-full sm:w-auto text-center"
        >
          {saveMessage?.type === "saving" ? (
            <div className="relative flex items-center justify-center">
              <ClipLoader size={18} color="#FFFFFF" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <div className="relative flex items-center gap-2 justify-center">
                <Save className="w-4 h-4" />
                <span className="font-medium">Save Profile</span>
              </div>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ProfileActions;
