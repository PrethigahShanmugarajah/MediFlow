// MediFlow / Admin / src / components / FormField / FormField.jsx
import { X } from "lucide-react";
import { useEffect, useMemo, useRef } from "react";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { components } from "react-select";

export const FileInputField = ({
  control,
  label,
  name,
  rules,
  accept = "image/*",
  className = "",
  inputClassName = "",
  previewClassName = "",
  labelClassName = "",
  errorClassName = "",
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-2 text-black ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={null}
        render={({ field, fieldState }) => {
          const file = field.value?.[0] || null;

          const inputRef = useRef(null);

          const previewUrl = useMemo(() => {
            if (!file) return "";
            return URL.createObjectURL(file);
          }, [file]);

          useEffect(() => {
            if (!field.value && inputRef.current) {
              inputRef.current.value = "";
            }
          }, [field.value]);

          useEffect(() => {
            return () => {
              if (previewUrl) URL.revokeObjectURL(previewUrl);
            };
          }, [previewUrl]);

          return (
            <>
              <div className="flex items-center gap-4 flex-wrap">
                <input
                  ref={inputRef}
                  type="file"
                  accept={accept}
                  onChange={(e) => {
                    const files = e.target.files;
                    field.onChange(files && files.length ? files : null);
                  }}
                  className={`
                    w-44 border border-indigo-100 rounded-full p-2 text-sm bg-white
                    focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100
                    cursor-pointer
                    ${inputClassName}
                  `}
                  {...rest}
                />

                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className={`
                      h-20 w-20 rounded-full object-cover border border-indigo-200 shadow
                      ${previewClassName}
                    `}
                  />
                )}
              </div>

              {fieldState.error && (
                <p className={`text-red-500 text-sm mt-2 ${errorClassName}`}>
                  {fieldState.error.message}
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );
};

export const InputField = ({
  control,
  label,
  name,
  rules,
  type,
  placeholder = "",
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-1 text-black ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <input
              {...field}
              type={type}
              placeholder={placeholder}
              className={`
                p-3 rounded-full border border-indigo-100 bg-white shadow-sm w-full
                focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100
                ${inputClassName}
              `}
              {...rest}
            />

            {fieldState.error && (
              <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

const BeforeClearSeparator = () => (
  <div
    style={{
      width: "1px",
      height: "22px",
      backgroundColor: "#E0E7FF",
      margin: "0 10px",
      flexShrink: 0,
    }}
  />
);

const ClearIndicator = (props) => {
  const { innerProps, clearValue, hasValue } = props;

  if (!hasValue) return null;

  return (
    <div
      {...innerProps}
      onMouseDown={(e) => {
        e.preventDefault();
        e.stopPropagation();
        clearValue();
      }}
      onTouchEnd={(e) => {
        e.preventDefault();
        e.stopPropagation();
        clearValue();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: "0 6px",
        cursor: "pointer",
      }}
      className="hover:text-indigo-600"
      aria-label="Clear selected value"
    >
      <X size={16} />
    </div>
  );
};

const IndicatorsContainer = (props) => {
  const { hasValue } = props;

  return (
    <components.IndicatorsContainer {...props}>
      <BeforeClearSeparator />
      {hasValue && <ClearIndicator {...props} />}
      <components.DropdownIndicator {...props} />
    </components.IndicatorsContainer>
  );
};

export const SelectInput = ({
  control,
  label,
  name,
  rules,
  options = [],
  placeholder,
  className = "",
  labelClassName = "",
  selectClassName = "",
  errorClassName = "",
  ...rest
}) => {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-1 text-black ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <Controller
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <Select
              {...field}
              isClearable
              components={{
                IndicatorsContainer,
                DropdownIndicator: components.DropdownIndicator,
                IndicatorSeparator: () => null,
                ClearIndicator: () => null,
              }}
              options={options}
              placeholder={
                placeholder || (label ? `Select ${label}` : "Select")
              }
              value={options.find((o) => o.value === field.value) || null}
              onChange={(opt) => {
                const value = opt?.value || "";
                field.onChange(value);
                rest?.onChange?.(opt);
              }}
              className={selectClassName}
              styles={{
                control: (base, state) => ({
                  ...base,
                  cursor: "pointer",
                  backgroundColor: "white",
                  borderRadius: "9999px",
                  minHeight: "48px",
                  height: "48px",
                  paddingLeft: "12px",
                  borderWidth: "1px",
                  borderColor: state.isFocused ? "#818CF8" : "#E0E7FF",
                  boxShadow: state.isFocused ? "0 0 0 2px #E0E7FF" : "none",
                  "&:hover": { borderColor: "#818CF8" },
                }),

                singleValue: (base) => ({
                  ...base,
                  color: "#000000",
                }),

                input: (base) => ({
                  ...base,
                  color: "#000000",
                }),

                valueContainer: (base) => ({
                  ...base,
                  padding: "0",
                }),

                indicatorsContainer: (base) => ({
                  ...base,
                  height: "48px",
                  paddingRight: "10px",
                }),

                dropdownIndicator: (base) => ({
                  ...base,
                  padding: "0 2px",
                  cursor: "pointer",
                }),

                clearIndicator: (base) => ({
                  ...base,
                  padding: "0 6px",
                  color: "#111827",
                  cursor: "pointer",
                  ":hover": { color: "#4F46E5" },
                }),

                menu: (base) => ({
                  ...base,
                  marginTop: "4px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  zIndex: 50,
                }),

                menuList: (base) => ({
                  ...base,
                  paddingTop: 0,
                  paddingBottom: 0,
                }),

                option: (base, state) => ({
                  ...base,
                  cursor: "pointer",
                  padding: "12px 16px",
                  backgroundColor: state.isSelected
                    ? "#6366F1"
                    : state.isFocused
                      ? "#EEF2FF"
                      : "white",
                  color: state.isSelected ? "white" : "#000000",
                }),
              }}
            />

            {fieldState.error && (
              <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
};

export const TextAreaField = ({
  control,
  name,
  rules,
  placeholder,
  rows = 3,
  className = "",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={`w-full ${className}`}>
          <textarea
            {...field}
            rows={rows}
            placeholder={placeholder}
            className="
              p-3 rounded-xl border border-indigo-100 bg-white
              placeholder:text-gray-400 shadow-sm w-full
              focus:outline-none focus:border-indigo-400
              focus:ring-2 focus:ring-indigo-100
              transition-all resize-none
            "
          />

          {fieldState.error && (
            <p className="text-red-500 text-sm mt-1">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
