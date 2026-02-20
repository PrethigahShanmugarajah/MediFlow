// MediFlow / Client / src / components / Certification / Certification.jsx
import C1 from "../../assets/C1.png";
import C2 from "../../assets/C2.png";
import C3 from "../../assets/C3.png";
import C4 from "../../assets/C4.png";
import C5 from "../../assets/C5.png";
import C6 from "../../assets/C6.png";
import C7 from "../../assets/C7.png";
import C8 from "../../assets/C8.png";
import C9 from "../../assets/C9.png";
import C10 from "../../assets/C10.png";
import './Certification.css'

const Certification = () => {
  const certifications = [
    {
      id: 1,
      name: "Lanka Health Board",
      image: C1,
      alt: "Lanka Health Board Certification",
      type: "government",
    },
    {
      id: 2,
      name: "Island Medical Authority",
      image: C2,
      alt: "Island Medical Authority Approval",
      type: "government",
    },
    {
      id: 3,
      name: "Ceylon Quality Council",
      image: C3,
      alt: "Ceylon Quality Council Accreditation",
      type: "healthcare",
    },
    {
      id: 4,
      name: "Lanka Clinical Commission",
      image: C4,
      alt: "Lanka Clinical Commission Certification",
      type: "international",
    },
    {
      id: 5,
      name: "National Safety Federation",
      image: C5,
      alt: "National Safety Federation Recognition",
      type: "healthcare",
    },
    {
      id: 6,
      name: "Lanka Medical Authority",
      image: C6,
      alt: "Lanka Medical Authority License",
      type: "government",
    },
    {
      id: 7,
      name: "Asian Healthcare Council",
      image: C7,
      alt: "Asian Healthcare Council Certification",
      type: "international",
    },
    {
      id: 8,
      name: "Lanka Medical Board",
      image: C8,
      alt: "Lanka Medical Board Approval",
      type: "healthcare",
    },
    {
      id: 9,
      name: "Public Health Institute",
      image: C9,
      alt: "Public Health Institute Accreditation",
      type: "government",
    },
    {
      id: 10,
      name: "Ceylon Medical Authority",
      image: C10,
      alt: "Ceylon Medical Authority Certification",
      type: "international",
    },
  ];

  const duplicatedCertifications = [
    ...certifications,
    ...certifications,
    ...certifications,
  ];

  return (
    <div className="relative py-6 bg-linear-to-brfrom-indigo-50 via-blue-50 to-fuchsia-50 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-br from-transparent via-blue-400 to-transparent opacity-60"></div>
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="grid grid-cols-12 gap-4 w-full h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border border-blue-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="relative inline-block">
            <div className="absolute -left-20 top-1/2 w-16 h-0.5 bg-linear-to-br from-transparent to-blue-400"></div>
            <div className="absolute -right-20 top-1/2 w-16 h-0.5 bg-linear-to-br from-transparent to-fuchsia-400"></div>

            <h2 className="text-3xl lg:text-6xl font-serif text-gray-900 mb-4 tracking-tight">
              <span className="bg-linear-to-br from-blue-600 via-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                Certified & Excellence
              </span>
            </h2>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed font-light tracking-wide">
            Government recognized and internationally accredited healthcare
            standards
          </p>

          <div className="inline-flex items-center px-5 py-2.5 bg-blue-500/10 border border-blue-400/30 rounded-full mt-6 backdrop-blur-sm">
            <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse mr-3"></div>
            <span className="text-blue-700 font-semibold tracking-wide text-sm">
              Officially Certified
            </span>
          </div>
        </div>

        <div className="relative mb-10">
          <div className="relative mb-10">
            <div className="flex overflow-hidden">
              <div className="flex animate-marquee-single whitespace-nowrap py-3">
                {duplicatedCertifications.map((cert, index) => (
                  <div
                    key={`cert-${cert.id}-${index}`}
                    className="inline-flex flex-col items-center mx-10 transform transition-all duration-500 group cursor-pointer"
                  >
                    <div className="relative">
                      <img
                        src={cert.image}
                        alt={cert.alt}
                        className="w-16 h-16 object-contain filter transition-all duration-500"
                      />
                    </div>

                    <span className="mt-3 font-serif italic text-sm font-semibold text-black text-center max-w-30 leading-tight group-hover:text-blue-700 transition-colors duration-300">
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
