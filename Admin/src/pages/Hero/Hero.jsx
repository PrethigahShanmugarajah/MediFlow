// MediFlow / Admin / src / pages / Hero / Hero.jsx
import Logo from "../../assets/Logo.png";

const Hero = ({ role = "admin", userName = "Doctor" }) => {
  const isDoctor = role === "doctor";

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-blue-50 via-blue-100 to-white">
      <main className="flex items-center pt-28 justify-center px-6 py-16">
        <section className="w-full max-w-4xl">
          <div className="relative">
            <div className="absolute -inset-8 -z-10 flex items-center justify-center">
              <div className="w-full h-44 md:h-56 rounded-3xl bg-indigo-100/60 blur-3xl"></div>
            </div>

            <div className="bg-white/90 backdrop-blur-sm border border-indigo-100 rounded-3xl shadow-xl p-8 md:p-12 text-center">
              <div className="mx-auto mb-4 w-24 h-24 flex items-center justify-center">
                <img
                  src={Logo}
                  alt="Logo"
                  className="w-50 h-50 object-contain"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-2">
                {isDoctor
                  ? `Welcome, Dr. ${userName}`
                  : "WELCOME TO MEDIFLOW ADMIN PANEL"}
              </h1>

              <p className="text-gray-500 max-w-2xl mx-auto leading-relaxed mb-6">
                {isDoctor
                  ? "Access your patient records, manage appointments, and review medical reports securely from your dashboard."
                  : "Manage hospital operations, doctors, staff, patient records, and system settings from a centralized control panel."}
              </p>

              {/* -------- Info Cards -------- */}
              <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-left">
                  <h3 className="font-semibold text-indigo-800">
                    Secure Access
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Role-based login with protected medical data.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-left">
                  <h3 className="font-semibold text-indigo-800">
                    Real-time Management
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Monitor hospital activity and patient flow.
                  </p>
                </div>

                <div className="p-4 rounded-lg bg-indigo-50 border border-indigo-100 text-left">
                  <h3 className="font-semibold text-indigo-800">
                    Medical Dashboard
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Clean, fast, and doctor-friendly interface.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;
