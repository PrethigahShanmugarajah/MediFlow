// MediFlow / Client / src / pages / doctor / DoctorEditProfile / Components / AboutSection.jsx
import { Info } from "lucide-react";
import { TextAreaField } from "../../../../components/common/FormField/TextAreaField";

const AboutSection = ({ doc, setDoc, editing }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <Info className="w-4 h-4 text-indigo-600" />
        </div>
        About
      </h2>
      <div className="relative">
        <TextAreaField
          name="about"
          rows={4}
          value={doc?.about || ""}
          placeholder="Tell patients about your expertise, approach, and philosophy..."
          size="l"
          textareaClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          disabled={!editing}
          onChange={(val) => editing && setDoc((d) => ({ ...d, about: val }))}
          maxLength={500}
        />

        <div className="absolute bottom-3 right-3 text-xs text-gray-400">
          {(doc.about || "").length}/500
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
