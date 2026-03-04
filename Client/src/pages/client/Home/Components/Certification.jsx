// MediFlow / Client / src / pages / Home / Components / Certification.jsx
import { certificationsData } from "../../../../data/client/certificationsData";
import ClientTitle from "../../../../components/client/ClientTitle";
import "../Home.css";

const Certification = () => {
  const duplicatedCertifications = [
    ...certificationsData,
    ...certificationsData,
    ...certificationsData,
  ];

  return (
    <div className="relative py-6 bg-linear-to-br from-indigo-100 via-white to-blue-100 border-b border-indigo-200 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <ClientTitle
            title="Accredited & Trusted"
            description="Recognized by government authorities and certified by international healthcare bodies"
          />

          <div className="inline-flex items-center px-5 py-2.5 bg-blue-500/10 border border-blue-400/30 rounded-full mt-6 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-blue-700 font-semibold tracking-wide text-sm uppercase">
              Accredited & Verified
            </span>
          </div>
        </div>

        <div className="relative mb-10">
          <div className="relative p-4 mx-auto max-w-9xl">
            <div className="flex overflow-hidden">
              <div className="flex certification whitespace-nowrap py-3">
                {duplicatedCertifications.map((cert, index) => (
                  <div
                    key={`cert-${cert.id}-${index}`}
                    className="inline-flex flex-col items-center mx-10 transform transition-all duration-500 group"
                  >
                    <div className="relative">
                      <img
                        src={cert.image}
                        alt={cert.name}
                        className="w-16 h-16 object-contain filter transition-all duration-500"
                      />
                    </div>

                    <span className="mt-3 font-serif italic text-sm font-semibold text-gray-700 text-center max-w-30 leading-tight group-hover:text-blue-700 transition-colors duration-300">
                      {cert.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certification;
