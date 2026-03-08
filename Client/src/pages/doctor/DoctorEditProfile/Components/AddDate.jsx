import { useState } from "react";
import { InputField } from "../../../../components/common/FormField/InputField";
import { Plus } from "lucide-react";

const AddDate = ({ onAdd }) => {
  const [value, setValue] = useState("");

  const handleAdd = () => {
    if (value) {
      onAdd(value);
      setValue("");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <InputField
        name="scheduleDate"
        type="date"
        value={value}
        onChange={(val) => setValue(val)}
        min={new Date().toISOString().split("T")[0]}
        size="s"
        className="max-w-36"
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <button
        onClick={handleAdd}
        className="flex items-center gap-2 bg-linear-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium">Add Date</span>
      </button>
    </div>
  );
};

export default AddDate;
