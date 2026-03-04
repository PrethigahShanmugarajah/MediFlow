// MediFlow / Client / src / components / common / ShowMoreButton.jsx
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";

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
  alwaysShow = false,
  to,
}) => {
  const remaining = Math.max(0, total - limit);

  const shouldShow = alwaysShow || total > limit;
  if (!shouldShow) return null;

  const label = showAll
    ? lessText
    : showRemainingCount
      ? `${moreText} (${remaining})`
      : moreText;

  const content = (
    <>
      {label}
      {showIcon &&
        (showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
    </>
  );

  return (
    <div
      id={id ? `${id}-wrapper` : undefined}
      className={`flex justify-center mt-4 ${wrapperClassName}`}
      style={wrapperStyle}
    >
      {to ? (
        <Link
          id={id}
          to={to}
          style={style}
          className={`px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm hover:shadow-sm hover:bg-blue-50 transition flex mb-4 items-center gap-2 ${className}`}
        >
          {content}
        </Link>
      ) : (
        <button
          id={id}
          type="button"
          onClick={onToggle}
          style={style}
          className={`px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm hover:shadow-sm hover:bg-blue-50 transition flex mb-4 items-center gap-2 ${className}`}
        >
          {content}
        </button>
      )}
    </div>
  );
};

export default ShowMoreButton;
