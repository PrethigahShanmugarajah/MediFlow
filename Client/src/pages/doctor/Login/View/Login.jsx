import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Logo } from "../../../../assets";
import { loginDoctorApi } from "../Service/loginService";
import { InputField } from "../../../../components/common/FormField/InputField";
import { ClipLoader } from "react-spinners";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({
      ...s,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const result = await loginDoctorApi({
        formData,
        storageKey: STORAGE_KEY,
      });
      if (!result.ok) {
        if (result.message) toast.error(result.message);
        return;
      }
      navigate(`/doctor-admin/${result.doctorId}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 via-white to-indigo-100 relative font-serif overflow-hidden">
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 cursor-pointer flex items-center gap-2 text-blue-800 font-semibold hover:text-blue-600 transition-all duration-300"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Home
      </button>

      <div className="relative z-10 bg-white/60 backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-[90%] max-w-md border border-blue-100 transition-all duration-500 hover:shadow-blue-300/50">
        <div className="flex justify-center mb-6">
          <img
            src={Logo}
            alt="MediFlow Logo"
            className="w-28 h-28 object-contain drop-shadow-lg"
          />
        </div>

        <h2 className="text-3xl font-bold text-center text-indigo-700 tracking-wide mb-2">
          Doctor Portal
        </h2>
        <p className="text-center text-blue-600 mb-6 text-sm">
          Log in to manage your profile and appointments.
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <InputField
            type="email"
            name="email"
            required
            placeholder="doctor@example.com"
            value={formData.email}
            onChange={(_, e) => handleChange(e)}
            size="m"
            className=""
            inputClassName=""
          />

          <div className="relative">
            <InputField
              type={showPassword ? "text" : "password"}
              name="password"
              required
              placeholder="********"
              value={formData.password}
              onChange={(_, e) => handleChange(e)}
              size="m"
            />

            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              className="absolute right-4 top-6 -translate-y-1/2 p-2 rounded-full "
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full py-3 bg-linear-to-r from-indigo-400 to-blue-600 text-white font-semibold rounded-full"
          >
            {busy ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={20} color="#FFFFFF" />
              </div>
            ) : (
              <span>Login</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
