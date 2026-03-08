import { ChevronDown, ChevronUp } from "lucide-react";

const ShowMoreButton = ({
  id,
  total = 0,
  limit = 6,
  showAll = false,
  onToggle,
  className = "",
  wrapperClassName = "",
  style = {},
  wrapperStyle = {},
  moreText = "Show More",
  lessText = "Show Less",
  showRemainingCount = true,
  showIcon = false,
}) => {
  const remaining = Math.max(0, total - limit);

  if (total <= limit) return null;

  return (
    <div
      id={id ? `${id}-wrapper` : undefined}
      className={`flex justify-center mt-4 ${wrapperClassName}`}
      style={wrapperStyle}
    >
      <button
        id={id}
        type="button"
        onClick={onToggle}
        style={style}
        className={`px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm hover:shadow-sm hover:bg-blue-50 transition flex mb-4 items-center gap-2 ${className}`}
      >
        {showAll ? (
          <>
            {lessText}
            {showIcon && <ChevronUp size={16} />}
          </>
        ) : (
          <>
            {showRemainingCount ? `${moreText} (${remaining})` : moreText}
            {showIcon && <ChevronDown size={16} />}
          </>
        )}
      </button>
    </div>
  );
};

export default ShowMoreButton;
