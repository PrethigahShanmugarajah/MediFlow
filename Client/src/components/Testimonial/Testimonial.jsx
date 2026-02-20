// MediFlow / Client / src / components / Testimonial / Testimonial.jsx
import { useMemo, useRef, useState } from "react";
import "./Testimonial.css";
import { testimonials } from "./Data/TestimonialData";
import { useAutoScroll } from "./Hooks/useAutoScroll";
import TestimonialCard from "./Components/TestimonialCard";

const Testimonial = () => {
  const scrollRefLeft = useRef(null);
  const scrollRefRight = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const leftTestimonials = useMemo(
    () => testimonials.filter((t) => t.type === "doctor"),
    [],
  );

  const rightTestimonials = useMemo(
    () => testimonials.filter((t) => t.type === "patient"),
    [],
  );

  useAutoScroll({
    leftRef: scrollRefLeft,
    rightRef: scrollRefRight,
    isPaused,
    speed: 0.5,
  });

  return (
    <div className="min-h-[70vh] bg-linear-to-br from-slate-50 to-blue-50 py-10 px-4 relative overflow-hidden">
      <div className="max-w-6xl font-serif mx-auto text-center mb-8 sm:mb-12">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-linear-to-br from-blue-600 to-green-600 mb-3">
          Voice of Trust
        </h2>

        <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto">
          Real stories from doctors and patients sharing their psotive
          experiences with out healthcare platform.
        </p>
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* -------- Left Side -------- */}
        <div className="relative font-serif border-2 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border-blue-200">
          <div className="py-2 font-semibold text-md sm:text-lg rounded-t-2xl text-center bg-blue-100 text-blue-700">
            👩‍⚕️ Medical Professionals
          </div>

          <div
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            ref={scrollRefLeft}
            className="h-56 sm:h-72 md:h-90 lg:h-100 overflow-y-auto no-scrollbar p-3 sm:p-4"
          >
            {[...leftTestimonials, ...leftTestimonials].map((t, i) => (
              <TestimonialCard
                key={`L-${i}`}
                testimonial={t}
                direction="left"
              />
            ))}
          </div>
        </div>

        {/* -------- Right Side -------- */}
        <div className="relative font-serif border-2 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border-green-200">
          <div className="py-2 font-semibold text-md sm:text-lg rounded-t-2xl text-center bg-green-100 text-green-700">
            🧑‍💼 Patients
          </div>

          <div
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            ref={scrollRefLeft}
            className="h-56 sm:h-72 md:h-90 lg:h-100 overflow-y-auto no-scrollbar p-3 sm:p-4"
          >
            {[...rightTestimonials, ...rightTestimonials].map((t, i) => (
              <TestimonialCard
                key={`R-${i}`}
                testimonial={t}
                direction="right"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
