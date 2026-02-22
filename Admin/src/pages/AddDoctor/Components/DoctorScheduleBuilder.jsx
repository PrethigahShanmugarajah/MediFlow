// MediFlow / Admin / src / pages / AddDoctor / Components / DoctorScheduleBuilder.jsx
import { Calendar, Plus } from "lucide-react";
import { InputField } from "../../../components/FormField/InputField";
import { SelectInput } from "../../../components/FormField/SelectInput";
import SlotList from "./SlotList";
import {
  ampmOptions,
  hourOptions,
  minuteOptions,
} from "../../../utils/addDoctorUtils";

const DoctorScheduleBuilder = ({
  today,
  slotDate,
  setSlotDate,
  slotHour,
  setSlotHour,
  slotMinute,
  setSlotMinute,
  slotAmpm,
  setSlotAmpm,
  addSlotToForm,
  form,
  removeSlot,
  getFlatSlots,
}) => {
  return (
    <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 md:col-span-2">
      <div className="flex items-center gap-3 mb-4">
        <Calendar className="text-indigo-600" />
        <p className="text-lg font-semibold text-indigo-800">
          Add Schedule Slots
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <InputField
          name="slotDate"
          type="date"
          label="Date"
          labelPosition="top"
          size="m"
          value={slotDate}
          onChange={(val) => setSlotDate(val)}
          min={today}
          required
          className="sm:w-auto mt-0"
          inputClassName=""
        />

        <SelectInput
          size="lg"
          label="Hour"
          labelPosition="top"
          value={slotHour}
          options={hourOptions}
          placeholder="Hour"
          onChange={(val) => setSlotHour(val)}
          required
          className="sm:w-auto mt-0"
          selectClassName=""
        />

        <SelectInput
          size="lg"
          label="Minute"
          labelPosition="top"
          value={slotMinute}
          options={minuteOptions}
          placeholder="Minute"
          onChange={(val) => setSlotMinute(val)}
          isClearable={false}
          required
          className="sm:w-auto mt-0"
        />

        <SelectInput
          size="lg"
          label="AM / PM"
          labelPosition="top"
          value={slotAmpm}
          options={ampmOptions}
          onChange={(val) => setSlotAmpm(val)}
          isClearable={false}
          required
          className="sm:w-auto mt-0"
        />

        <button
          type="button"
          onClick={addSlotToForm}
          className="px-5 py-3 bg-indigo-500 text-white rounded-full flex items-center gap-2 w-full sm:w-auto justify-center mt-8"
        >
          <Plus size={18} /> Add Slot
        </button>
      </div>

      <SlotList
        schedule={form.schedule}
        getFlatSlots={getFlatSlots}
        onRemove={removeSlot}
      />
    </div>
  );
};

export default DoctorScheduleBuilder;
