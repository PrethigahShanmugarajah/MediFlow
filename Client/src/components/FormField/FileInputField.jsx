// MediFlow / Client / src / components / FormField / FileInputField.jsx
import { useEffect, useRef } from "react";

const SIZE_CONFIG = {
  xxxs: { height: 24, fontSize: 10, px: "8px" },
  xxs: { height: 28, fontSize: 11, px: "10px" },
  xs: { height: 32, fontSize: 12, px: "12px" },
  s: { height: 36, fontSize: 13, px: "14px" },
  m: { height: 40, fontSize: 14, px: "16px" },
  l: { height: 48, fontSize: 15, px: "18px" },
  xl: { height: 56, fontSize: 16, px: "20px" },
  xxl: { height: 64, fontSize: 18, px: "22px" },
  xxxl: { height: 72, fontSize: 20, px: "24px" },
};

const getSize = (sizeKey) => {
  if (!sizeKey || !SIZE_CONFIG[sizeKey]) {
    console.warn(
      `[FileInputField] "size" prop is required. Use xxxs|xxs|xs|s|m|l|xl|xxl|xxxl`,
    );
    return SIZE_CONFIG.m;
  }
  return SIZE_CONFIG[sizeKey];
};

export const FileInputField = ({
  label,
  labelPosition,
  name,
  accept,
  size,
  className = "",
  inputClassName = "",
  labelClassName = "",
  errorClassName = "",
  trigger = false,
  triggerText,
  TriggerIcon = null,
  triggerClassName = "",
  value,
  onChange,
  error,
  ...rest
}) => {
  const s = getSize(size);
  const inputRef = useRef(null);

  useEffect(() => {
    if ((value === null || value === undefined) && inputRef.current) {
      inputRef.current.value = "";
    }
  }, [value]);

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

  const renderInput = (
    <div className="flex items-center gap-4 flex-wrap">
      <input
        ref={inputRef}
        id={name}
        name={name}
        type="file"
        accept={accept}
        onChange={(e) => {
          const files = e.target.files;
          onChange?.(files && files.length ? files : null, e);
        }}
        className={
          trigger
            ? "hidden"
            : `border border-indigo-100 rounded-full bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer ${inputClassName}`
        }
        style={{
          height: s.height,
          fontSize: `${s.fontSize}px`,
          paddingLeft: s.px,
          paddingRight: s.px,
        }}
        {...rest}
      />

      {trigger && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`inline-flex items-center justify-center gap-2 rounded-full bg-white border border-indigo-200 hover:shadow transition-shadow ${triggerClassName}`}
          style={{
            height: s.height,
            fontSize: `${s.fontSize}px`,
            paddingLeft: s.px,
            paddingRight: s.px,
          }}
        >
          {TriggerIcon && <TriggerIcon size={s.fontSize} />}
          {triggerText}
        </button>
      )}
    </div>
  );

  return (
    <div className={`${wrapperClass} ${className}`}>
      {labelPosition === "top" && renderLabel}
      {labelPosition === "left" && renderLabel}

      {renderInput}

      {labelPosition === "right" && renderLabel}
      {labelPosition === "bottom" && renderLabel}

      {!!error && <p className={errorClassName}>{error}</p>}
    </div>
  );
};
