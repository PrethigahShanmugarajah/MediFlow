import {
  capitalizeWords,
  formatDateISO,
  formatParagraph,
} from "../../../utils/helpers";
import {
  buildScheduleMap,
  getSortedScheduleDates,
} from "../../../utils/listDoctorsUtils";

const DoctorExpandedDetails = ({ doc, isMobileScreen }) => {
  const scheduleMap = buildScheduleMap(doc.schedule || {});
  const sortedDates = getSortedScheduleDates(scheduleMap);

  return (
    <div
      className={`px-4 md:px-5 bg-white transition-all duration-500 ease-out ${
        isMobileScreen ? "max-h-80" : "max-h-150"
      } overflow-y-auto scrollbar-none py-4`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <h4 className="text-md font-bold text-indigo-700 mb-1">About</h4>
          <p className="text-sm text-indigo-600 wrap-break-word whitespace-normal">
            {formatParagraph(doc.about)}
          </p>

          <div className="mt-4">
            <div className="text-md text-indigo-700 font-bold">
              Qualifications
            </div>
            <div className="text-sm text-indigo-600 wrap-break-word whitespace-normal">
              {capitalizeWords(doc.qualifications)}
            </div>
          </div>

          <div className="mt-4">
            <div className="text-md text-indigo-700 font-bold">Schedule</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {sortedDates.map((date) => {
                const slots = scheduleMap[date] || [];
                return (
                  <div key={date} className="min-w-full md:min-w-0">
                    <div className="text-xs text-indigo-500">
                      {formatDateISO(date)}
                    </div>

                    <div className="mt-1 flex flex-wrap gap-2">
                      {slots.map((s, i) => (
                        <span
                          key={i}
                          className="text-xs px-3 py-1 rounded-full border border-indigo-100 shadow-sm wrap-break-word"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <aside className="col-span-1 flex flex-col sm:flex-row md:flex-col xl:flex-col lg:flex-col gap-3 items-start md:items-end">
          <div className="flex items-center justify-between gap-1">
            <div className="text-md text-indigo-700 font-bold">Success:</div>
            <div className="text-md text-indigo-700">{doc.success}%</div>
          </div>

          <div className="flex items-center justify-between gap-1">
            <div className="text-md text-indigo-700 font-bold">Patients:</div>
            <div className="text-md text-indigo-700">{doc.patients}</div>
          </div>

          <div className="flex items-center justify-between gap-1">
            <div className="text-md text-indigo-700 font-bold">Location:</div>
            <div className="text-md sm:whitespace-nowrap whitespace-normal text-indigo-700">
              {capitalizeWords(doc.location)}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default DoctorExpandedDetails;
