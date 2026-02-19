// MediFlow / Admin / src / components / FormField / FormField.jsx
import { X } from "lucide-react";
import { useEffect, useRef } from "react";
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
  trigger = false,
  triggerText,
  TriggerIcon = null,
  triggerClassName = "",
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

          useEffect(() => {
            if (!field.value && inputRef.current) {
              inputRef.current.value = "";
            }
          }, [field.value]);

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
                  className={
                    trigger
                      ? "hidden"
                      : `w-44 border border-indigo-100 rounded-full p-2 text-sm bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer ${inputClassName}`
                  }
                  {...rest}
                />

                {trigger && (
                  <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    className={`w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-white border border-indigo-200 hover:shadow transition-shadow ${triggerClassName}`}
                  >
                    {TriggerIcon ? <TriggerIcon className="w-4 h-4" /> : null}
                    {triggerText}
                  </button>
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
  unstyled = false,
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
              className={`${unstyled ? unstyledInput : baseInput} ${inputClassName}`}
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

const BeforeClearSeparator = ({ selectProps }) => {
  const isSmall = String(selectProps.className || "")
    .split(" ")
    .includes("status-small");

  return (
    <div
      style={{
        width: "1px",
        height: isSmall ? "14px" : "22px",
        backgroundColor: "#E0E7FF",
        margin: isSmall ? "0 0px" : "0 10px",
        flexShrink: 0,
      }}
    />
  );
};

const ClearIndicator = (props) => {
  const { innerProps, clearValue, hasValue, selectProps } = props;

  const isMutedDisabled =
    selectProps.isDisabled && selectProps.disabledVariant === "muted";

  const isSmall = String(selectProps.className || "")
    .split(" ")
    .includes("status-small");

  if (!hasValue) return null;

  return (
    <div
      {...innerProps}
      onMouseDown={(e) => {
        if (isMutedDisabled) return;
        e.preventDefault();
        e.stopPropagation();
        clearValue();
      }}
      onTouchEnd={(e) => {
        if (isMutedDisabled) return;
        e.preventDefault();
        e.stopPropagation();
        clearValue();
      }}
      style={{
        display: "flex",
        alignItems: "center",
        padding: isSmall ? "0 0px" : "0 6px",
        cursor: isMutedDisabled ? "not-allowed" : "pointer",
        color: isMutedDisabled ? "#9CA3AF" : "#111827",
      }}
      className={!isMutedDisabled ? "hover:text-indigo-600" : ""}
      aria-label="Clear selected value"
    >
      <X size={isSmall ? 12 : 16} />
    </div>
  );
};

const IndicatorsContainer = (props) => {
  const { hasValue, selectProps } = props;

  const isSmall = String(selectProps?.className || "")
    .split(" ")
    .includes("status-small");

  return (
    <components.IndicatorsContainer {...props}>
      {/* {!isSmall && <BeforeClearSeparator selectProps={selectProps} />} */}
      <BeforeClearSeparator selectProps={selectProps} />
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
  disabledVariant = "default",
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
              isDisabled={rest.isDisabled}
              disabledVariant={disabledVariant}
              className={selectClassName}
              classNamePrefix="react-select"
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
              styles={{
                control: (base, state) => {
                  const isMutedDisabled =
                    state.isDisabled && disabledVariant === "muted";
                  const isSmall = String(state.selectProps?.className || "")
                    .split(" ")
                    .includes("status-small");

                  return {
                    ...base,
                    cursor: state.isDisabled ? "not-allowed" : "pointer",
                    backgroundColor: isMutedDisabled ? "#F9FAFB" : "white",
                    borderRadius: "9999px",

                    minHeight: isSmall ? "32px" : "48px",
                    height: isSmall ? "32px" : "48px",
                    paddingLeft: isSmall ? "8px" : "12px",

                    borderWidth: "1px",
                    borderColor: isMutedDisabled
                      ? "#E5E7EB"
                      : state.isFocused
                        ? "#818CF8"
                        : "#E0E7FF",
                    boxShadow:
                      state.isFocused && !state.isDisabled
                        ? "0 0 0 2px #E0E7FF"
                        : "none",
                    "&:hover": {
                      borderColor: isMutedDisabled ? "#E5E7EB" : "#818CF8",
                    },
                  };
                },

                singleValue: (base, state) => {
                  const isSmall = String(state.selectProps?.className || "")
                    .split(" ")
                    .includes("status-small");

                  return {
                    ...base,
                    fontSize: isSmall ? "13px" : base.fontSize,
                    color:
                      state.isDisabled && disabledVariant === "muted"
                        ? "#9CA3AF"
                        : "#000000",
                  };
                },

                input: (base) => ({
                  ...base,
                  color: "#000000",
                }),

                valueContainer: (base) => ({
                  ...base,
                  padding: "0",
                }),

                indicatorsContainer: (base, state) => {
                  const isSmall = String(state.selectProps?.className || "")
                    .split(" ")
                    .includes("status-small");

                  return {
                    ...base,
                    height: isSmall ? "32px" : "48px",
                    paddingRight: isSmall ? "2px" : "10px",
                    gap: isSmall ? "2px" : base.gap,
                  };
                },

                dropdownIndicator: (base, state) => {
                  const isSmall = String(state.selectProps?.className || "")
                    .split(" ")
                    .includes("status-small");

                  return {
                    ...base,
                    padding: isSmall ? "0 1px" : "0 2px",
                    cursor: "pointer",
                  };
                },

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
  label,
  name,
  rules,
  placeholder = "",
  rows = 3,
  className = "",
  textareaClassName = "",
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
        name={name}
        control={control}
        rules={rules}
        render={({ field, fieldState }) => (
          <>
            <textarea
              {...field}
              rows={rows}
              placeholder={placeholder}
              className={`
                p-3 rounded-xl border border-indigo-100 bg-white
                placeholder:text-gray-400 shadow-sm w-full
                focus:outline-none focus:border-indigo-400
                focus:ring-0 focus:ring-indigo-100
                transition-all resize-none
                ${textareaClassName}
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

export const CheckboxField = ({
  control,
  name,
  label,
  rules,
  labelPosition,
  className = "",
  labelClassName = "",
  checkboxClassName = "",
  errorClassName = "",
  ...rest
}) => {
  const isVertical = labelPosition === "top" || labelPosition === "bottom";

  const containerDir =
    labelPosition === "left"
      ? "flex-row-reverse"
      : labelPosition === "top"
        ? "flex-col-reverse"
        : labelPosition === "bottom"
          ? "flex-col"
          : "flex-row";

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <div className={`${className}`}>
          <div
            className={`
              flex items-center gap-2 cursor-pointer
              ${containerDir}
              ${isVertical ? "items-start" : "items-center"}
            `}
            onClick={() => field.onChange(!field.value)}
          >
            <input
              type="checkbox"
              checked={!!field.value}
              onChange={(e) => field.onChange(e.target.checked)}
              onClick={(e) => e.stopPropagation()}
              className={`
                w-4 h-4 rounded border border-indigo-200
                text-indigo-600 focus:ring-indigo-200
                cursor-pointer
                ${checkboxClassName}
              `}
              {...rest}
            />

            {label && (
              <span className={`text-sm ${labelClassName}`}>{label}</span>
            )}
          </div>

          {fieldState.error && (
            <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
};
