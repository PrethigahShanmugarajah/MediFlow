// MediFlow / Admin / src / components / FormField / TextAreaField.jsx
import { useEffect, useMemo, useState } from "react";

const SIZE_CONFIG = {
  xxxs: { fontSize: 10, px: "8px", py: "6px", radius: "10px" },
  xxs: { fontSize: 11, px: "10px", py: "7px", radius: "12px" },
  xs: { fontSize: 12, px: "12px", py: "8px", radius: "14px" },
  s: { fontSize: 13, px: "14px", py: "9px", radius: "16px" },
  m: { fontSize: 14, px: "16px", py: "10px", radius: "18px" },
  l: { fontSize: 15, px: "18px", py: "12px", radius: "20px" },
  xl: { fontSize: 16, px: "20px", py: "14px", radius: "22px" },
  xxl: { fontSize: 18, px: "22px", py: "16px", radius: "24px" },
  xxxl: { fontSize: 20, px: "24px", py: "18px", radius: "26px" },
};

const getSize = (sizeKey) => {
  if (!sizeKey || !SIZE_CONFIG[sizeKey]) {
    console.warn(
      `[TextAreaField] "size" prop is required. Use xxxs|xxs|xs|s|m|l|xl|xxl|xxxl`,
    );
    return SIZE_CONFIG.m;
  }
  return SIZE_CONFIG[sizeKey];
};

export const TextAreaField = ({
  label,
  labelPosition,
  name,
  placeholder,
  rows,
  className = "",
  textareaClassName = "",
  labelClassName = "",
  errorClassName = "",
  size,
  value,
  onChange,
  onBlur,
  error,
  ...rest
}) => {
  const BP_MIN = { base: 0, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

  const rules = useMemo(() => {
    if (!size) return [{ bp: "base", value: "m" }];

    const tokens = String(size).trim().split(/\s+/);

    if (!tokens.some((t) => t.includes(":"))) {
      return [{ bp: "base", value: size }];
    }

    const out = [{ bp: "base", value: tokens[0] }];

    tokens.forEach((t) => {
      if (!t.includes(":")) return;
      const [bp, val] = t.split(":");
      if (!(bp in BP_MIN) || !val) return;
      out.push({ bp, value: val });
    });

    return out;
  }, [size]);

  const hasResponsive = rules.some((r) => r.bp !== "base");

  const [vw, setVw] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth : 1024,
  );

  useEffect(() => {
    if (!hasResponsive) return;
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [hasResponsive]);

  const resolvedSize = useMemo(() => {
    let picked = rules[0]?.value || "m";
    rules.forEach((r) => {
      if (vw >= (BP_MIN[r.bp] ?? 0)) picked = r.value;
    });
    return picked;
  }, [rules, vw]);

  const s = getSize(resolvedSize);
  const wrapperClass =
    labelPosition === "left" || labelPosition === "right"
      ? "flex items-start gap-3"
      : labelPosition === "top" || labelPosition === "bottom"
        ? "flex flex-col gap-2"
        : "";

  const renderLabel = label ? (
    <label htmlFor={name} className={`block ${labelClassName}`}>
      {label}
      {rest.required && <span className="text-red-500 ml-1">*</span>}
    </label>
  ) : null;

  return (
    <div className={`${wrapperClass} ${className}`}>
      {labelPosition === "top" && renderLabel}
      {labelPosition === "left" && renderLabel}

      <div className="w-full">
        <textarea
          id={name}
          name={name}
          rows={rows}
          placeholder={placeholder}
          className={`border border-indigo-100 bg-white shadow-sm w-full focus:outline-none focus:border-indigo-400 transition-all resize-none ${textareaClassName}`}
          style={{
            fontSize: `${s.fontSize}px`,
            paddingLeft: s.px,
            paddingRight: s.px,
            paddingTop: s.py,
            paddingBottom: s.py,
            borderRadius: s.radius,
          }}
          {...(value !== undefined ? { value } : {})}
          onChange={(e) => onChange?.(e.target.value, e)}
          onBlur={(e) => onBlur?.(e.target.value, e)}
          {...rest}
        />

        {!!error && (
          <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>
            {error}
          </p>
        )}
      </div>

      {labelPosition === "right" && renderLabel}
      {labelPosition === "bottom" && renderLabel}
    </div>
  );
};
