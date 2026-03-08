import { Image, Plus, Trash2 } from "lucide-react";
import { FileInputField } from "../../../components/FormField/FileInputField";

const DoctorImageCard = ({ fileRef, form, setForm, errors }) => {
  const imagePreview = form?.imagePreview || "";
  const imageFile = form?.imageFile || null;

  function onPick(files) {
    const f = files?.[0];
    if (!f) return;

    setForm((p) => {
      if (p.imagePreview && p.imagePreview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(p.imagePreview);
        } catch {}
      }

      return {
        ...p,
        imageFile: f,
        imagePreview: URL.createObjectURL(f),
      };
    });
  }

  function onRemove() {
    setForm((p) => {
      if (p.imagePreview && p.imagePreview.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(p.imagePreview);
        } catch {}
      }
      return { ...p, imageFile: null, imagePreview: "" };
    });

    if (fileRef?.current) fileRef.current.value = "";
  }

  return (
    <div className="md:col-span-2 flex flex-col items-center">
      <div className="rounded-2xl p-4 shadow-inner flex flex-col items-center gap-4 bg-linear-to-b from-indigo-50 to-cyan-50 border border-indigo-100">
        <div className="w-50 h-50 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-indigo-100">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center text-indigo-400">
              <Image className="w-10 h-10" />
              <div className="mt-2 text-sm">
                Doctor image <span className="text-rose-500 ml-1">*</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex gap-2 items-center">
          <div className="flex-1">
            <FileInputField
              name="doctorImage"
              accept="image/*"
              size="l"
              trigger
              TriggerIcon={Plus}
              triggerText={imagePreview ? "Replace Image" : "Upload Image"}
              triggerClassName="flex-1 px-4 py-2 border border-indigo-200 hover:shadow transition-shadow"
              value={imageFile}
              onChange={onPick}
            />

            {errors?.image && (
              <p className="text-rose-500 text-sm mt-1">Image is required.</p>
            )}
          </div>

          {imagePreview && (
            <button
              type="button"
              onClick={onRemove}
              className="px-3 py-2 rounded-full bg-white border border-rose-100 hover:shadow transition-shadow"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorImageCard;
