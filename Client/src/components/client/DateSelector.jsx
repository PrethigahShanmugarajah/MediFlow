const DateSelector = ({ dates = [], selectedDate, onSelectDate }) => {
  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="inline-grid grid-flow-col auto-cols-max gap-3 sm:grid sm:grid-flow-row sm:auto-cols-auto sm:grid-cols-3 md:grid-cols-7 lg:grid-cols-5 xl:grid-cols-6">
        {dates.map((date) => {
          const isSelected =
            selectedDate?.toDateString() === date.toDateString();

          return (
            <button
              key={date.toISOString()}
              onClick={() => onSelectDate(date)}
              className={`p-2 sm:p-3 rounded-full cursor-pointer border-2 transition-all whitespace-nowrap ${
                isSelected
                  ? "bg-linear-to-br from-indigo-500 to-blue-500 text-white border-indigo-500 shadow-lg"
                  : "bg-white text-gray-700 border-indigo-100"
              }`}
            >
              <div className="text-center">
                <div className="text-xs sm:text-sm opacity-80">
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>

                <div className="text-xl sm:text-2xl font-bold">
                  {date.getDate()}
                </div>

                <div className="text-xs opacity-80">
                  {date.toLocaleDateString("en-US", { month: "short" })}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default DateSelector;
