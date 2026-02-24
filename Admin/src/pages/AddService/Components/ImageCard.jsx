// MediFlow / Admin / src / pages / AddService / Components / ImageCard.jsx
import { Image, Plus, Trash2 } from "lucide-react";
import { FileInputField } from "../../../components/FormField/FileInputField";
import { SingleCheckboxField } from "../../../components/FormField/CheckboxField";

const ImageCard = ({
  fileRef,
  imagePreview,
  setImagePreview,
  imageFile,
  setImageFile,
  hasExistingImage,
  setHasExistingImage,
  removeImage,
  setRemoveImage,
  errors,
}) => {
  return (
    <div className="lg:col-span-1 md:col-span-1 col-span-1 flex flex-col items-center">
      <div className="w-full rounded-2xl p-4 shadow-inner flex flex-col items-center gap-4 bg-linear-to-b from-indigo-50 to-cyan-50 border border-indigo-100">
        <div className="w-full h-56 rounded-xl overflow-hidden bg-white flex items-center justify-center border border-indigo-100">
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
                Service image <span className="text-rose-500 ml-1">*</span>
              </div>
            </div>
          )}
        </div>

        <div className="w-full flex gap-2 items-center">
          <div className="flex-1">
            <FileInputField
              name="serviceImage"
              accept="image/*"
              size="l"
              trigger
              TriggerIcon={Plus}
              triggerText={imagePreview ? "Replace Image" : "Upload Image"}
              triggerClassName="flex-1 px-4 py-2 border border-indigo-200 hover:shadow transition-shadow"
              value={imageFile}
              onChange={(files) => {
                const f = files?.[0];
                if (!f) return;

                if (imagePreview && imagePreview.startsWith("blob:")) {
                  URL.revokeObjectURL(imagePreview);
                }

                if (typeof setImageFile === "function") setImageFile(f);
                setImagePreview(URL.createObjectURL(f));
                setRemoveImage(false);
                setHasExistingImage(false);
              }}
            />
            {errors?.image && (
              <p className="text-rose-500 text-sm mt-1">Image is required.</p>
            )}
          </div>

          {(imagePreview || hasExistingImage) && (
            <button
              type="button"
              onClick={() => {
                if (imagePreview && imagePreview.startsWith("blob:")) {
                  try {
                    URL.revokeObjectURL(imagePreview);
                  } catch (error) {}
                }
                setImagePreview(null);
                setImageFile(null);
                if (hasExistingImage) {
                  setRemoveImage(true);
                  setHasExistingImage(false);
                }
                if (fileRef.current) fileRef.current.value = null;
              }}
              className="px-3 py-2 rounded-full bg-white border border-rose-100 hover:shadow transition-shadow"
            >
              <Trash2 className="w-4 h-4 text-rose-500" />
            </button>
          )}
        </div>

        {hasExistingImage && (
          <SingleCheckboxField
            name="remove-img"
            label="Remove existing image"
            labelPosition="right"
            size="xs"
            value={removeImage}
            onChange={(checked) => {
              setRemoveImage(Boolean(checked));

              if (checked) {
                setImagePreview(null);
                setImageFile(null);
                setHasExistingImage(false);
              }
            }}
            className="w-full mt-2"
            labelClassName="text-xs text-gray-600"
            checkboxClassName="rounded"
          />
        )}
      </div>
    </div>
  );
};

export default ImageCard;
