// MediFlow / Client / src / components / common / FormField / SelectInput.jsx
import { useEffect, useMemo, useState } from "react";
import Select, { components } from "react-select";
import { X } from "lucide-react";

const SIZE_CONFIG = {
  xxxs: {
    height: 22,
    fontSize: 10,
    icon: 10,
    paddingLeft: 4,
    indicatorPadding: "0 0px",
    separatorHeight: 8,
    separatorMargin: "0 4px",
    indicatorsPaddingRight: 4,
    indicatorsGap: 2,
    optionPadding: "6px 10px",
  },

  xxs: {
    height: 26,
    fontSize: 11,
    icon: 11,
    paddingLeft: 6,
    indicatorPadding: "0 0px",
    separatorHeight: 10,
    separatorMargin: "0 6px",
    indicatorsPaddingRight: 6,
    indicatorsGap: 2,
    optionPadding: "8px 12px",
  },

  xs: {
    height: 28,
    fontSize: 12,
    icon: 12,
    paddingLeft: 8,
    indicatorPadding: "0 0px",
    separatorHeight: 12,
    separatorMargin: "0 6px",
    indicatorsPaddingRight: 6,
    indicatorsGap: 2,
    optionPadding: "10px 14px",
  },

  s: {
    height: 32,
    fontSize: 13,
    icon: 14,
    paddingLeft: 10,
    indicatorPadding: "0 0px",
    separatorHeight: 14,
    separatorMargin: "0 8px",
    indicatorsPaddingRight: 8,
    indicatorsGap: 3,
    optionPadding: "11px 15px",
  },

  m: {
    height: 40,
    fontSize: 14,
    icon: 16,
    paddingLeft: 12,
    indicatorPadding: "0 0px",
    separatorHeight: 18,
    separatorMargin: "0 10px",
    indicatorsPaddingRight: 10,
    indicatorsGap: 4,
    optionPadding: "12px 16px",
  },

  lg: {
    height: 50,
    fontSize: 15,
    icon: 18,
    paddingLeft: 14,
    indicatorPadding: "0 0px",
    separatorHeight: 22,
    separatorMargin: "0 10px",
    indicatorsPaddingRight: 12,
    indicatorsGap: 5,
    optionPadding: "12px 16px",
  },

  xl: {
    height: 56,
    fontSize: 16,
    icon: 20,
    paddingLeft: 16,
    indicatorPadding: "0 0px",
    separatorHeight: 26,
    separatorMargin: "0 12px",
    indicatorsPaddingRight: 14,
    indicatorsGap: 6,
    optionPadding: "14px 18px",
  },

  xxl: {
    height: 64,
    fontSize: 18,
    icon: 22,
    paddingLeft: 18,
    indicatorPadding: "0 0px",
    separatorHeight: 30,
    separatorMargin: "0 14px",
    indicatorsPaddingRight: 16,
    indicatorsGap: 8,
    optionPadding: "16px 20px",
  },

  xxxl: {
    height: 72,
    fontSize: 20,
    icon: 24,
    paddingLeft: 22,
    indicatorPadding: "0 0px",
    separatorHeight: 34,
    separatorMargin: "0 16px",
    indicatorsPaddingRight: 20,
    indicatorsGap: 10,
    optionPadding: "18px 22px",
  },
};

const getSize = (sizeKey) => {
  if (!sizeKey || !SIZE_CONFIG[sizeKey]) {
    console.warn(
      `[SelectInput] "size" prop is required. Use xxxs|xxs|xs|s|m|lg|xl|xxl|xxxl. Received:`,
      sizeKey,
    );
    return SIZE_CONFIG.m;
  }
  return SIZE_CONFIG[sizeKey];
};

const BeforeClearSeparator = ({ selectProps }) => {
  const s = getSize(selectProps.size);
  return (
    <div
      style={{
        width: "1px",
        height: s.separatorHeight,
        backgroundColor: "#E0E7FF",
        margin: s.separatorMargin,
        flexShrink: 0,
      }}
    />
  );
};

const ClearIndicator = (props) => {
  const { innerProps, clearValue, hasValue, selectProps } = props;

  const isMutedDisabled =
    selectProps.isDisabled && selectProps.disabledVariant === "muted";

  if (!hasValue) return null;

  const s = getSize(selectProps.size);

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
        padding: s.indicatorPadding,
        cursor: isMutedDisabled ? "not-allowed" : "pointer",
        color: isMutedDisabled ? "#9CA3AF" : "#111827",
      }}
      className={!isMutedDisabled ? "hover:text-indigo-600" : ""}
      aria-label="Clear selected value"
    >
      <X size={s.icon} />
    </div>
  );
};

const IndicatorsContainer = (props) => {
  const { hasValue } = props;

  return (
    <components.IndicatorsContainer {...props}>
      <BeforeClearSeparator selectProps={props.selectProps} />
      {hasValue && <ClearIndicator {...props} />}
      <components.DropdownIndicator {...props} />
    </components.IndicatorsContainer>
  );
};

export const SelectInput = ({
  label,
  options = [],
  placeholder,
  className = "",
  labelClassName = "",
  selectClassName = "",
  errorClassName = "",
  disabledVariant = "default",
  isDisabled = false,
  isClearable = true,
  size,
  value = "",
  onChange,
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
      if (!BP_MIN[bp] || !val) return;
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

  const selectedOption = options.find((o) => o.value === value) || null;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          className={`block text-sm font-medium mb-3 text-black ${labelClassName}`}
        >
          {label}{" "}
          {rest.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <Select
        size={resolvedSize}
        disabledVariant={disabledVariant}
        isDisabled={isDisabled}
        isClearable={isClearable}
        className={selectClassName}
        classNamePrefix="react-select"
        options={options}
        placeholder={placeholder || (label ? `Select ${label}` : "Select")}
        value={selectedOption}
        onChange={(opt) => {
          const nextValue = opt?.value || "";
          onChange?.(nextValue, opt);
        }}
        components={{
          IndicatorsContainer,
          DropdownIndicator: components.DropdownIndicator,
          IndicatorSeparator: () => null,
          ClearIndicator: () => null,
        }}
        styles={{
          control: (base, state) => {
            const isMutedDisabledNow =
              state.isDisabled && disabledVariant === "muted";

            return {
              ...base,
              cursor: state.isDisabled ? "not-allowed" : "pointer",
              backgroundColor: isMutedDisabledNow ? "#F9FAFB" : "white",
              borderRadius: "9999px",
              minHeight: s.height,
              height: s.height,
              paddingLeft: s.paddingLeft,
              borderWidth: "1px",
              borderColor: isMutedDisabledNow
                ? "#E5E7EB"
                : state.isFocused
                  ? "#818CF8"
                  : "#E0E7FF",
              boxShadow:
                state.isFocused && !state.isDisabled
                  ? "0 0 0 2px #E0E7FF"
                  : "none",
              "&:hover": {
                borderColor: isMutedDisabledNow ? "#E5E7EB" : "#818CF8",
              },
            };
          },

          singleValue: (base, state) => {
            const isMutedDisabledNow =
              state.isDisabled && disabledVariant === "muted";

            return {
              ...base,
              fontSize: `${s.fontSize}px`,
              color: isMutedDisabledNow ? "#9CA3AF" : "#000000",
            };
          },

          placeholder: (base, state) => {
            const isMutedDisabledNow =
              state.isDisabled && disabledVariant === "muted";

            return {
              ...base,
              fontSize: `${s.fontSize}px`,
              color: isMutedDisabledNow ? "#9CA3AF" : base.color,
            };
          },

          input: (base) => ({
            ...base,
            color: "#000000",
            fontSize: `${s.fontSize}px`,
          }),

          valueContainer: (base) => ({
            ...base,
            padding: "0",
          }),

          indicatorsContainer: (base) => ({
            ...base,
            height: s.height,
            paddingRight: s.indicatorsPaddingRight,
            gap: s.indicatorsGap,
          }),

          dropdownIndicator: (base) => ({
            ...base,
            padding: s.indicatorPadding,
            cursor: "pointer",
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
            padding: s.optionPadding,
            fontSize: `${s.fontSize}px`,
            backgroundColor: state.isSelected
              ? "#6366F1"
              : state.isFocused
                ? "#EEF2FF"
                : "white",
            color: state.isSelected ? "white" : "#000000",
          }),
        }}
        {...rest}
      />

      {!!error && (
        <p className={`text-red-500 text-sm mt-1 ${errorClassName}`}>{error}</p>
      )}
    </div>
  );
};
