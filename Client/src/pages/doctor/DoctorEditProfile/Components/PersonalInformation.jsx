// MediFlow / Client / src / pages / doctor / DoctorEditProfile / Components / PersonalInformation.jsx
import {
  Banknote,
  Briefcase,
  CheckCircle,
  Clock,
  GraduationCap,
  MapPin,
  Star,
  User,
} from "lucide-react";
import { InputField } from "../../../../components/common/FormField/InputField";

const PersonalInformation = ({ doc, setDoc, editing }) => {
  return (
    <div className="mb-8">
      <h2 className="text-xl sm:text-2xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
          <User className="w-4 h-4 text-indigo-600" />
        </div>
        Personal Information
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <User />
                </span>
                Name
              </span>
            }
            labelPosition="top"
            name="name"
            type="text"
            value={doc.name || ""}
            onChange={(val) => editing && setDoc((d) => ({ ...d, name: val }))}
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Briefcase />
                </span>
                Specialization
              </span>
            }
            labelPosition="top"
            name="specialization"
            type="text"
            value={doc.specialization || ""}
            onChange={(val) =>
              editing && setDoc((d) => ({ ...d, specialization: val }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Clock />
                </span>
                Experience
              </span>
            }
            labelPosition="top"
            name="experience"
            type="text"
            value={doc.experience || ""}
            onChange={(val) =>
              editing && setDoc((d) => ({ ...d, experience: val }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <GraduationCap />
                </span>
                Qualifications
              </span>
            }
            labelPosition="top"
            name="qualifications"
            type="text"
            value={doc.qualifications || ""}
            onChange={(val) =>
              editing && setDoc((d) => ({ ...d, qualifications: val }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <MapPin />
                </span>
                Location
              </span>
            }
            labelPosition="top"
            name="location"
            type="text"
            value={doc.location || ""}
            onChange={(val) =>
              editing && setDoc((d) => ({ ...d, location: val }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <User />
                </span>
                Patients
              </span>
            }
            labelPosition="top"
            name="patients"
            type="number"
            min={0}
            value={doc.patients ?? ""}
            onChange={(val) =>
              editing &&
              setDoc((d) => ({
                ...d,
                patients: val === "" ? "" : Number(val),
              }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <CheckCircle />
                </span>
                Success
              </span>
            }
            labelPosition="top"
            name="success"
            type="number"
            min={0}
            value={doc.success ?? ""}
            onChange={(val) =>
              editing &&
              setDoc((d) => ({
                ...d,
                success: val === "" ? "" : Number(val),
              }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Star />
                </span>
                Rating
              </span>
            }
            labelPosition="top"
            name="rating"
            type="number"
            min={0}
            max={5}
            step={0.1}
            value={doc.rating ?? ""}
            onChange={(val) =>
              editing &&
              setDoc((d) => ({
                ...d,
                rating: val === "" ? "" : parseFloat(val),
              }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>

        <div className="group">
          <InputField
            label={
              <span className="flex items-center gap-2">
                <span
                  className={`flex items-center justify-center p-1.5 w-8 h-8 rounded-full ${
                    editing
                      ? "bg-indigo-100 text-indigo-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  <Banknote />
                </span>
                Fee (LKR)
              </span>
            }
            labelPosition="top"
            name="fee"
            type="number"
            min={0}
            step={1}
            value={doc.fee ?? ""}
            onChange={(val) =>
              editing &&
              setDoc((d) => ({
                ...d,
                fee: val === "" ? "" : Number(val),
              }))
            }
            disabled={!editing}
            readOnly={!editing}
            size="m"
            labelClassName="font-semibold text-indigo-800"
            inputClassName={`${editing ? "" : "text-gray-600 cursor-not-allowed"}`}
          />
        </div>
      </div>
    </div>
  );
};

export default PersonalInformation;
