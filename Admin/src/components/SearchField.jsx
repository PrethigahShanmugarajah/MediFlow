// MediFlow / Admin / src / components / SearchField.jsx
import { Search } from "lucide-react";
import { InputField } from "./FormField/InputField";

const SearchField = ({
  value,
  onChange,
  placeholder = "Search...",
  size = "s",
  className = "",
  inputClassName = "",
  widthClass = "md:w-72",
  unstyled = false,
}) => {
  return (
    <div
      className={`relative ${
        widthClass ? `w-full ${widthClass}` : ""
      } ${className}`}
    >
      {!unstyled && (
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="w-5 h-5 text-indigo-500" />
        </div>
      )}

      <InputField
        name="search"
        type="text"
        size={size}
        placeholder={placeholder}
        value={value}
        onChange={(val) => onChange?.(val)}
        inputClassName={`${!unstyled ? "pl-12" : ""} ${inputClassName}`}
      />
    </div>
  );
};

export default SearchField;
