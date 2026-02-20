// MediFlow / Client / src / components / FormField / InputField.jsx

export const InputField = ({
  label,
  name,
  type,
  placeholder = "",
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  unstyled = false,
  value,
  onChange,
  onBlur,
  error,
  ...rest
}) => {
  const baseInput =
    "p-3 rounded-full border border-indigo-100 bg-white shadow-sm w-full focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100";

  const unstyledInput =
    "w-full bg-transparent p-0 border-0 shadow-none rounded-none outline-none focus:outline-none focus:ring-0";

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-medium mb-1 text-black ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${unstyled ? unstyledInput : baseInput} ${inputClassName}`}
        {...(value !== undefined ? { value } : {})}
        onChange={(e) => onChange?.(e.target.value, e)}
        onBlur={(e) => onBlur?.(e.target.value, e)}
        {...rest}
      />

      {!!error && (
        <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};
