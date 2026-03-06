// MediFlow / Client / src / pages / doctor / DoctorEditProfile / Components / ProfileImageHeader.jsx
import { Image } from "lucide-react";
import { FileInputField } from "../../../../components/common/FormField/FileInputField";

const ProfileImageHeader = ({
  doc,
  imagePreview,
  editing,
  handleImageChange,
}) => {
  return (
    <div className="relative h-24 sm:h-28 md:h-32 bg-linear-to-r from-indigo-400 to-indigo-600">
      <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 md:left-8 md:transform-none">
        <div className="relative group">
          <img
            src={imagePreview || ""}
            alt={doc.name}
            className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 md:ml-23 rounded-full object-cover border-4 border-white shadow-2xl"
          />

          <div className="absolute bottom-2 right-2">
            <FileInputField
              name="doctorImage"
              accept="image/*"
              trigger
              TriggerIcon={Image}
              triggerText=""
              size="s"
              onChange={(files, e) => handleImageChange(e)}
              disabled={!editing}
              triggerClassName={`!p-2 !w-auto !min-w-0 rounded-full shadow-lg ${
                editing
                  ? "text-indigo-600 cursor-pointer"
                  : "text-gray-600 cursor-not-allowed"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileImageHeader;
