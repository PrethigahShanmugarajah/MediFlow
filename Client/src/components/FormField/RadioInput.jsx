// MediFlow / Client / src / components / FormField / RadioInput.jsx

const SIZE_CONFIG = {
  xs: { height: 28, fontSize: 12 },
  sm: { height: 32, fontSize: 13 },
  md: { height: 40, fontSize: 14 },
  lg: { height: 48, fontSize: 15 },
  xl: { height: 56, fontSize: 16 },
};

const getSize = (sizeKey) => {
  if (!sizeKey || !SIZE_CONFIG[sizeKey]) {
    console.warn(
      `[RadioInput] "size" prop is required. Use size="xs|sm|md|lg|xl".`,
    );
    return SIZE_CONFIG.md;
  }
  return SIZE_CONFIG[sizeKey];
};

export const RadioInput = ({
  label,
  labelPosition,
  name,
  options = [],
  value = "",
  onChange,
  size,
  className = "",
  labelClassName = "",
  groupClassName = "",
  optionClassName = "",
  isDisabled = false,
  disabledVariant = "default",
  error,
  errorClassName = "",
}) => {
  const s = getSize(size);
  const isMutedDisabled = isDisabled && disabledVariant === "muted";

  const isHorizontal = labelPosition === "left" || labelPosition === "right";

  const wrapperClass =
    labelPosition === "left" || labelPosition === "right"
      ? "flex items-center gap-3"
      : labelPosition === "top" || labelPosition === "bottom"
        ? "flex flex-col gap-2"
        : "";

  const renderLabel = label ? (
    <span className={labelClassName}>{label}</span>
  ) : null;

  const renderOptions = (
    <div
      className={groupClassName}
      role="radiogroup"
      aria-disabled={isDisabled}
    >
      {options.map((opt) => {
        const checked = String(value) === String(opt.value);

        const base =
          "inline-flex items-center justify-center rounded-full border transition-all select-none";

        const active = "bg-indigo-600 text-white border-indigo-600";

        const inactive = "bg-white text-indigo-700 border-indigo-200";

        const mutedDisabled =
          "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";

        const normalDisabled =
          "bg-gray-200 text-gray-500 border-gray-200 cursor-not-allowed";

        const finalDisabledClass = isMutedDisabled
          ? mutedDisabled
          : normalDisabled;

        return (
          <label
            key={opt.value}
            className={`${base} ${optionClassName} ${
              isDisabled ? finalDisabledClass : checked ? active : inactive
            }`}
            style={{
              height: s.height,
              fontSize: `${s.fontSize}px`,
              cursor: isDisabled ? "not-allowed" : "pointer",
            }}
          >
            <input
              type="radio"
              name={name}
              value={opt.value}
              checked={checked}
              onChange={() => {
                if (isDisabled) return;
                onChange?.(opt.value, opt);
              }}
              className="hidden"
              disabled={isDisabled}
            />
            {opt.label ?? opt.value}
          </label>
        );
      })}
    </div>
  );

  return (
    <div className={`${wrapperClass} ${className}`}>
      {labelPosition === "top" && renderLabel}
      {labelPosition === "left" && renderLabel}

      {renderOptions}

      {labelPosition === "right" && renderLabel}
      {labelPosition === "bottom" && renderLabel}

      {!!error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};
