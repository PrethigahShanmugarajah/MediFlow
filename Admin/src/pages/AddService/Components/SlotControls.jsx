// MediFlow / Admin / src / pages / AddService / Components / SlotControls.jsx
import { Calendar, Clock, Plus, Trash2 } from "lucide-react";
import { SelectInput } from "../../../components/FormField/SelectInput";
import {
  ampmOptions,
  dayOptions,
  hourOptions,
  minuteOptions,
  monthOptions,
  yearOptions,
} from "../../../utils/addServiceUtils";

const SlotControls = ({
  slots,
  errors,
  slotDay,
  setSlotDay,
  slotMonth,
  setSlotMonth,
  slotYear,
  setSlotYear,
  slotHour,
  setSlotHour,
  slotMinute,
  setSlotMinute,
  slotAmPm,
  setSlotAmPm,
  onAddSlot,
  onRemoveSlot,
  currentYear,
  currentMonth,
  currentDate,
  days,
}) => {
  const yearOptionsList = yearOptions(currentYear);
  const monthOptionsList = monthOptions({
    slotYear,
    currentYear,
    currentMonth,
  });
  const dayOptionsList = dayOptions({
    days,
    slotYear,
    slotMonth,
    currentYear,
    currentMonth,
    currentDate,
  });

  const hourOptionsList = hourOptions();
  const minuteOptionsList = minuteOptions(5);
  const ampmOptionsList = ampmOptions();

  return (
    <div className="bg-linear-to-br from-white to-indigo-50 rounded-2xl p-4 border border-indigo-50 shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-indigo-700 font-medium">
          <Calendar className="w-5 h-5" /> Slots & Schedule
        </div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">
            {slots.length} slot{slots.length !== 1 ? "s" : ""} added
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 2xl:grid-cols-1 gap-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 min-w-0">
          <SelectInput
            label="Day"
            labelPosition="top"
            size="lg"
            required
            options={dayOptionsList}
            value={slotDay}
            onChange={(v) => setSlotDay(v)}
          />

          <SelectInput
            label="Month"
            labelPosition="top"
            size="lg"
            required
            options={monthOptionsList}
            value={String(slotMonth)}
            onChange={(v) => setSlotMonth(v)}
          />

          <SelectInput
            label="Year"
            labelPosition="top"
            size="lg"
            required
            options={yearOptionsList}
            value={String(slotYear)}
            onChange={(v) => setSlotYear(v)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-3 min-w-0">
          <SelectInput
            label="Hour"
            labelPosition="top"
            size="lg"
            required
            options={hourOptionsList}
            value={slotHour}
            onChange={(v) => setSlotHour(v)}
          />

          <SelectInput
            label="Minute"
            labelPosition="top"
            size="lg"
            required
            options={minuteOptionsList}
            value={slotMinute}
            onChange={(v) => setSlotMinute(v)}
          />

          <SelectInput
            label="AM/PM"
            labelPosition="top"
            size="lg"
            required
            options={ampmOptionsList}
            value={slotAmPm}
            onChange={(v) => setSlotAmPm(v)}
          />
        </div>

        {errors.slots && (
          <p className="text-rose-500 text-sm mt-0">
            At least one time slot is required.
          </p>
        )}
      </div>

      <div className="mb-4">
        <button
          type="button"
          onClick={onAddSlot}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-linear-to-r from-indigo-500 to-cyan-500 text-white font-medium hover:shadow-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" /> Add This Time Slot
        </button>
      </div>

      <div>
        <div className="text-xs text-gray-500 mb-2">
          Added Slots ({slots.length})
        </div>

        <div className="grid xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-1 overflow-auto gap-2 max-h-screen pr-2">
          {slots.length === 0 ? (
            <div className="text-sm text-gray-400 italic px-4 py-2">
              No slots added yet. Select a time and click "Add This Time Slot"
            </div>
          ) : (
            slots.map((s, idx) => (
              <div
                key={s}
                className="flex items-center gap-2 bg-linear-to-r from-indigo-50 to-cyan-50 border border-indigo-100 px-2 py-2 my-1 rounded-full shadow hover:shadow-md transition-shadow min-w-0"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <Clock className="w-4 h-4 xl:w-6 xl:h-6 text-indigo-600" />
                  <div className="text-xs whitespace-nowrap xl:text-xs lg:text-xs lg:whitespace-nowrap xl:whitespace-nowrap font-medium max-w-45 sm:max-w-75 md:max-w-[320px]">
                    {s}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemoveSlot(idx)}
                  className="p-1 rounded-full xl:-mr-1 hover:bg-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-rose-500" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default SlotControls;
