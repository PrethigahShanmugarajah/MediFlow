// MediFlow / Client / src / components / AvatarSkeletonCard.jsx

const AvatarSkeletonCard = ({
  count = 8,
  columns = "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}) => {
  return (
    <div className={`grid ${columns} gap-6 sm:gap-8 justify-items-center`}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full max-w-90 animate-pulse bg-white/80 backdrop-blur-md rounded-3xl p-6 flex flex-col items-center text-center"
        >
          <div className="mb-4 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 bg-indigo-100 rounded-full" />
          <div className="h-5 bg-indigo-100 rounded w-3/4 mb-2" />
          <div className="h-4 bg-indigo-100 rounded w-1/2 mb-3" />
          <div className="h-8 bg-indigo-100 rounded w-full mt-4" />
        </div>
      ))}
    </div>
  );
};

export default AvatarSkeletonCard;
