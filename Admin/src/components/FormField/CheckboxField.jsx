import { useEffect, useMemo, useState } from "react";

const SIZE_CONFIG = {
  xxxs: { box: 12, fontSize: 10, gap: 6 },
  xxs: { box: 14, fontSize: 11, gap: 7 },
  xs: { box: 16, fontSize: 12, gap: 8 },
  s: { box: 18, fontSize: 13, gap: 9 },
  m: { box: 20, fontSize: 14, gap: 10 },
  l: { box: 22, fontSize: 15, gap: 11 },
  xl: { box: 24, fontSize: 16, gap: 12 },
  xxl: { box: 26, fontSize: 18, gap: 13 },
  xxxl: { box: 28, fontSize: 20, gap: 14 },
};

const getSize = (sizeKey) => {
  if (!sizeKey || !SIZE_CONFIG[sizeKey]) {
    console.warn(
      `[CheckboxField] "size" prop is required. Use xxxs|xxs|xs|s|m|l|xl|xxl|xxxl`,
    );
    return SIZE_CONFIG.m;
  }
  return SIZE_CONFIG[sizeKey];
};

/* -------- Single Checkbox -------- */
export const SingleCheckboxField = ({
  name,
  label,
  labelPosition,
  size,
  value,
  onChange,
  className = "",
  labelClassName = "",
  checkboxClassName = "",
  errorClassName = "",
  isDisabled = false,
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
    <div className={className}>
      <div
        className={`flex gap-2 ${containerDir} ${
          isVertical ? "items-start" : "items-center"
        } ${isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        onClick={() => {
          if (isDisabled) return;
          onChange?.(!value);
        }}
      >
        <input
          type="checkbox"
          name={name}
          checked={!!value}
          disabled={isDisabled}
          onChange={(e) => onChange?.(e.target.checked, e)}
          onClick={(e) => e.stopPropagation()}
          className={`rounded border border-indigo-200 text-indigo-600 focus:ring-indigo-200 ${checkboxClassName}`}
          style={{ width: s.box, height: s.box }}
          {...rest}
        />

        {label && (
          <span className={labelClassName} style={{ fontSize: s.fontSize }}>
            {label}
          </span>
        )}
      </div>

      {!!error && (
        <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};

/* -------- Multi Checkbox -------- */
const toggleValue = (arr, val) => {
  const list = Array.isArray(arr) ? arr : [];
  return list.some((x) => String(x) === String(val))
    ? list.filter((x) => String(x) !== String(val))
    : [...list, val];
};

export const MultiCheckboxField = ({
  label,
  labelPosition,
  name,
  size,
  options = [],
  value = [],
  onChange,
  direction,
  className = "",
  labelClassName = "",
  optionClassName = "",
  checkboxClassName = "",
  errorClassName = "",
  isDisabled = false,
  error,
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
    <span className={labelClassName} style={{ fontSize: s.fontSize }}>
      {label}
    </span>
  ) : null;

  const dirClass = direction === "col" ? "flex flex-col" : "flex flex-wrap";

  return (
    <div className={`${wrapperClass} ${className}`}>
      {(labelPosition === "top" || labelPosition === "left") && renderLabel}

      <div
        className={dirClass}
        style={{ gap: s.gap }}
        role="group"
        aria-disabled={isDisabled}
      >
        {options.map((opt) => {
          const checked = (Array.isArray(value) ? value : []).some(
            (x) => String(x) === String(opt.value),
          );

          return (
            <label
              key={opt.value}
              className={`flex items-center gap-2 ${
                isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              } ${optionClassName}`}
              onClick={(e) => {
                e.preventDefault();
                if (isDisabled) return;
                const next = toggleValue(value, opt.value);
                onChange?.(next, opt);
              }}
            >
              <input
                type="checkbox"
                name={name}
                checked={checked}
                disabled={isDisabled}
                onChange={(e) => {
                  if (isDisabled) return;
                  const next = toggleValue(value, opt.value);
                  onChange?.(next, opt, e);
                }}
                onClick={(e) => e.stopPropagation()}
                className={`rounded border border-indigo-200 text-indigo-600 focus:ring-indigo-200 ${checkboxClassName}`}
                style={{ width: s.box, height: s.box }}
              />

              <span style={{ fontSize: s.fontSize }}>
                {opt.label ?? opt.value}
              </span>
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
