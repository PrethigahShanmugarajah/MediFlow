// MediFlow / Admin / src / components / Title.jsx

const Title = ({
  title,
  subtitle,
  wrapperClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  disableDefaultTitleStyles = false,
  disableDefaultSubtitleStyles = false,
}) => {
  return (
    <div
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3 ${wrapperClassName}`}
    >
      <div>
        <h1
          className={`
            ${!disableDefaultTitleStyles ? "text-3xl font-semibold text-indigo-800 uppercase" : ""}
            ${titleClassName}
          `}
        >
          {title}
        </h1>

        {subtitle && (
          <p
            className={`
              ${!disableDefaultSubtitleStyles ? "text-sm text-gray-600" : ""}
              ${subtitleClassName}
            `}
          >
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
};

export default Title;
