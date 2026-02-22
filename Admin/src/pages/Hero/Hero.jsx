// MediFlow / Admin / src / pages / Hero / Hero.jsx
import Logo from "../../assets/Logo.png";
import InfoCard from "./Components/InfoCard";

const Hero = ({ role = "admin", userName = "Doctor" }) => {
  const isDoctor = role === "doctor";
  const docName = userName.replace(/^dr\.?\s*/i, "");

  const INFO_ITEMS = [
    {
      title: "Controlled Access",
      description: "Ensure data privacy with role-specific login permissions.",
    },
    {
      title: "Live Operations Monitoring",
      description: "Track hospital activity and patient movement in real-time.",
    },
    {
      title: "Doctor's Dashboard",
      description:
        "Intuitive and fast interface designed for medical professionals.",
    },
  ];

  return (
    <div className="min-h-screen font-sans bg-linear-to-br from-indigo-50 via-white to-blue-100">
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
                  alt="MediFlow Logo"
                  className="w-50 h-50 object-contain"
                />
              </div>

              <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-900 mb-2">
                {isDoctor ? (
                  `Welcome, Dr. ${docName}`
                ) : (
                  <span className="uppercase">
                    Welcome to MediFlow Admin Panel
                  </span>
                )}
              </h1>

              <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed mb-6">
                {isDoctor
                  ? "Easily access patient records, manage appointments, and review medical reports securely from your personalized dashboard."
                  : "Oversee hospital operations, manage staff and patient records, and configure system settings effortlessly from a centralized control panel."}
              </p>

              {/* -------- Infomation Cards -------- */}
              <div className="mx-auto max-w-3xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                {INFO_ITEMS.map((item, index) => (
                  <InfoCard
                    key={index}
                    title={item.title}
                    description={item.description}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Hero;
