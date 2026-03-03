// MediFlow / Client / src / components / FormField / RadioInput.jsx
import { useEffect, useMemo, useState } from "react";

const SIZE_CONFIG = {
  xxs: { height: 26, fontSize: 11, px: "8px" },
  xs: { height: 30, fontSize: 12, px: "10px" },
  sm: { height: 34, fontSize: 13, px: "12px" },
  md: { height: 40, fontSize: 14, px: "14px" },
  lg: { height: 48, fontSize: 15, px: "16px" },
  xl: { height: 56, fontSize: 16, px: "18px" },
  xxl: { height: 64, fontSize: 18, px: "20px" },
  xxxl: { height: 72, fontSize: 20, px: "24px" },
};

const getSize = (sizeKey) => {
  if (!sizeKey || !SIZE_CONFIG[sizeKey]) {
    console.warn(
      `[RadioInput] "size" prop is required. Use xxs|xs|sm|md|lg|xl|xxl|xxxl.`,
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
  const BP_MIN = { base: 0, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 };

  const rules = useMemo(() => {
    if (!size) return [{ bp: "base", value: "md" }];

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
    let picked = rules[0]?.value || "md";
    rules.forEach((r) => {
      if (vw >= (BP_MIN[r.bp] ?? 0)) picked = r.value;
    });
    return picked;
  }, [rules, vw]);

  const s = getSize(resolvedSize);

  const isMutedDisabled = isDisabled && disabledVariant === "muted";

  const wrapperClass =
    labelPosition === "left" || labelPosition === "right"
      ? "flex items-center gap-3"
      : labelPosition === "top" || labelPosition === "bottom"
        ? "flex flex-col gap-2"
        : "";

  const renderLabel = label ? (
    <span className={labelClassName}>{label}</span>
  ) : null;

  return (
    <div className={`${wrapperClass} ${className}`}>
      {(labelPosition === "top" || labelPosition === "left") && renderLabel}

      <div
        className={groupClassName}
        role="radiogroup"
        aria-disabled={isDisabled}
      >
        {options.map((opt) => {
          const checked = String(value) === String(opt.value);

          const base =
            "inline-flex items-center justify-center rounded-full border transition-all select-none";

          const active = "bg-indigo-600 text-white border-indigo-600 shadow-sm";

          const inactive =
            "bg-white text-indigo-700 border-indigo-200 hover:border-indigo-300";

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
                paddingLeft: s.px,
                paddingRight: s.px,
                fontSize: `${s.fontSize}px`,
                cursor: isDisabled ? "not-allowed" : "pointer",
              }}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                disabled={isDisabled}
                onChange={() => {
                  if (isDisabled) return;
                  onChange?.(opt.value, opt);
                }}
                className="hidden"
              />
              {opt.label ?? opt.value}
            </label>
          );
        })}
      </div>

      {(labelPosition === "right" || labelPosition === "bottom") && renderLabel}

      {!!error && (
        <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};
