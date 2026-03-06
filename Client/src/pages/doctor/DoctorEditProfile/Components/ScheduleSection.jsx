// MediFlow / Client / src / pages / doctor / DoctorEditProfile / Components / ScheduleSection.jsx
import { Calendar, Clock, Plus, Trash2, X } from "lucide-react";
import AddDate from "./AddDate";

const ScheduleSection = ({
  doc,
  editing,
  saveMessage,
  addDate,
  addSlot,
  removeDate,
  removeSlot,
}) => {
  const schedule = doc?.schedule || {};
  const hasSchedule = Object.keys(schedule).length > 0;

  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          Schedule & Availability
        </h2>

        <div className="flex items-center gap-3">
          {editing && <AddDate onAdd={addDate} />}
          {saveMessage && (
            <div
              className={`px-4 py-2 rounded-lg border ${
                saveMessage.type === "saving"
                  ? "bg-green-50 text-green-700 border-green-200"
                  : saveMessage.type === "error"
                    ? "bg-red-50 text-red-700 border-red-200"
                    : "bg-indigo-50 text-indigo-700 border-indigo-200"
              }`}
            >
              {saveMessage.text}
            </div>
          )}
        </div>
      </div>

      {!hasSchedule ? (
        <div className="text-center py-10 rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/50">
          <Calendar className="w-12 h-12 text-indigo-400 mx-auto mb-3" />
          <p className="text-indigo-700 font-medium">No schedule added yet</p>
          <p className="text-sm text-indigo-600 mt-1">
            Add dates to create time slots
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {Object.entries(doc.schedule)
            .sort(([a], [b]) => (a > b ? 1 : -1))
            .map(([date, slots]) => (
              <div
                key={date}
                className="group relative bg-linear-to-br from-white to-indigo-50 p-4 sm:p-5 rounded-2xl border border-indigo-100 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-indigo-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-indigo-100">
                      <Calendar className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="font-bold text-base sm:text-lg text-indigo-900">
                        {new Date(date).toLocaleDateString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </div>
                      <div className="text-xs sm:text-sm text-indigo-600">
                        {date}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium px-3 py-1 rounded-full bg-indigo-100 text-indigo-700">
                      {slots.length} slot{slots.length !== 1 ? "s" : ""}
                    </span>
                    <button
                      onClick={() => editing && removeDate(date)}
                      disabled={!editing}
                      className={`p-2 rounded-full cursor-pointer transition-colors ${
                        editing
                          ? "hover:bg-red-50 text-red-500 hover:text-red-600"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {slots.map((slot, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between bg-white px-3 py-2 rounded-full border border-indigo-100 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Clock className="w-4 h-4 text-indigo-600" />
                        <span className="font-medium text-indigo-900 text-sm sm:text-base">
                          {slot}
                        </span>
                      </div>
                      <button
                        onClick={() => editing && removeSlot(date, slot)}
                        disabled={!editing}
                        className={`p-1.5 rounded-full cursor-pointer transition-colors ${
                          editing
                            ? "hover:bg-red-50 text-red-500 hover:text-red-600"
                            : "text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {editing && (
                    <div className="pt-3 border-t border-indigo-100">
                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          className="flex-1 rounded-full px-3 py-2 text-sm border border-indigo-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && e.target.value) {
                              addSlot(date, e.target.value);
                              e.target.value = "";
                            }
                          }}
                          onBlur={(e) => {
                            if (e.target.value) {
                              addSlot(date, e.target.value);
                              e.target.value = "";
                            }
                          }}
                        />
                        <button
                          onClick={(e) => {
                            const input =
                              e.currentTarget.previousElementSibling;
                            if (input.value) {
                              addSlot(date, input.value);
                              input.value = "";
                            }
                          }}
                          className="p-2 rounded-full cursor-pointer bg-indigo-100 text-indigo-700 hover:bg-indigo-200 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default ScheduleSection;
