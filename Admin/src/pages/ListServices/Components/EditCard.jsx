// MediFlow / Admin / src / pages / ListServices / Components / EditCard.jsx
import { Image, Plus, X } from "lucide-react";
import { InputField } from "../../../components/FormField/InputField";
import { SelectInput } from "../../../components/FormField/SelectInput";
import { FileInputField } from "../../../components/FormField/FileInputField";
import { TextAreaField } from "../../../components/FormField/TextAreaField";
import {
  ampmOptions,
  availabilityOptions,
  hourOptions,
  minuteOptions,
} from "../../../utils/listServicesUtils";

const EditCard = ({
  editForm,
  todayISO,
  fileRef,
  onImageFileChange,
  addNewSlot,
  updateSlot,
  removeSlot,
  cancelEdit,
  saveEdit,
  setEditForm,
}) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-36 h-36 rounded-lg overflow-hidden bg-indigo-50 ring-1 ring-indigo-50 shrink-0">
          {editForm?.imagePreview ? (
            <img
              src={editForm.imagePreview}
              alt="preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-indigo-300">
              <Image />
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <InputField
            name="serviceName"
            type="text"
            size="m"
            placeholder="Service name"
            value={editForm.name}
            onChange={(val) => setEditForm((p) => ({ ...p, name: val }))}
            className="w-full"
          />

          <InputField
            name="servicePrice"
            type="number"
            size="m"
            placeholder="LKR 499"
            value={editForm.price}
            onChange={(val) =>
              setEditForm((p) => ({
                ...p,
                price: val,
              }))
            }
            className="mt-2"
          />

          <div className="mt-1 flex items-center gap-2">
            <SelectInput
              label="Availability"
              size="m"
              labelClassName="mb-0"
              value={editForm.available ? "true" : "false"}
              options={availabilityOptions}
              isClearable={false}
              onChange={(val) =>
                setEditForm((p) => ({
                  ...p,
                  available: val === "true",
                }))
              }
              className="w-full sm:w-56 mt-2"
            />
          </div>

          <div className="mt-2">
            <FileInputField
              label="Change image"
              labelPosition="top"
              name="serviceImage"
              accept="image/*"
              size="xs sm:s md:m lg:l xl:xl 2xl:xxl"
              className="w-full"
              inputClassName="w-full"
              labelClassName="text-sm mb-1 text-indigo-700"
              onChange={onImageFileChange}
              ref={fileRef}
            />
          </div>
        </div>
      </div>

      <div>
        <TextAreaField
          label="About"
          labelPosition="top"
          name="serviceAbout"
          size="m"
          textareaClassName="min-h-30"
          value={editForm.about}
          onChange={(val) => setEditForm((p) => ({ ...p, about: val }))}
        />
      </div>

      <div>
        <TextAreaField
          label="Instructions (one per line)"
          labelPosition="top"
          name="serviceInstructions"
          size="m xl:s"
          className="w-full"
          labelClassName="block text-md font-bold mb-1 text-indigo-600"
          textareaClassName="min-h-30"
          value={editForm.instructionsText}
          onChange={(val) =>
            setEditForm((p) => ({
              ...p,
              instructionsText: val,
            }))
          }
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="block text-sm text-indigo-600">Slots</label>
          <button
            onClick={addNewSlot}
            type="button"
            className="inline-flex items-center gap-2 text-sm px-2 py-1 rounded-full border border-indigo-100"
          >
            <Plus className="w-4 h-4" /> Add slot
          </button>
        </div>

        <div className="space-y-2 mt-2">
          {(editForm.slots || []).map((slot) => (
            <div
              key={slot.id}
              className="flex flex-col sm:flex-row sm:items-center gap-4 xl:gap-1 w-full"
            >
              <InputField
                name={`slot-date-${slot.id}`}
                type="date"
                size="xs xl:xxs"
                value={slot.date}
                onChange={(val) => updateSlot(slot.id, "date", val)}
                required
                min={todayISO}
                className="w-full sm:w-auto"
              />

              <div className="flex gap-2 items-center w-full sm:w-auto flex-wrap sm:flex-nowrap">
                <div className="w-full min-w-24 sm:w-32 xl:w-28">
                  <SelectInput
                    size="m xl:s"
                    value={slot.hour}
                    options={hourOptions}
                    isClearable={false}
                    onChange={(val) => updateSlot(slot.id, "hour", val)}
                    className="w-full"
                  />
                </div>

                <div className="w-full min-w-24 sm:w-32 xl:w-28">
                  <SelectInput
                    size="m xl:s"
                    value={slot.minute}
                    options={minuteOptions}
                    isClearable={false}
                    onChange={(val) => updateSlot(slot.id, "minute", val)}
                    className="w-full"
                  />
                </div>

                <div className="w-full min-w-24 sm:w-32 xl:w-28">
                  <SelectInput
                    size="m xl:s"
                    value={slot.ampm}
                    options={ampmOptions}
                    isClearable={false}
                    onChange={(val) => updateSlot(slot.id, "ampm", val)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="shrink-0">
                <button
                  onClick={() => removeSlot(slot.id)}
                  className="p-1 rounded-full cursor-pointer border-rose-500 bg-rose-300 border text-black"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-2 justify-end">
        <button
          onClick={cancelEdit}
          className="px-3 py-2 rounded-full cursor-pointer border-rose-600 bg-rose-300 border w-full sm:w-auto"
        >
          Cancel
        </button>

        <button
          onClick={saveEdit}
          className="px-3 py-2 rounded-full cursor-pointer bg-indigo-600 text-white w-full sm:w-auto"
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default EditCard;
