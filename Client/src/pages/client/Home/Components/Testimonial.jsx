// MediFlow / Client / src / pages / Home / Components / Testimonial.jsx
import { useEffect, useRef, useState } from "react";
import { Star, Stethoscope, User } from "lucide-react";
import "../Home.css";
import { testimonialsData } from "../../../../data/client/testimonialsData";
import Title from "../../../../components/common/Title";

const Testimonial = () => {
  const scrollRefLeft = useRef(null);
  const scrollRefRight = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const leftTestimonials = testimonialsData.filter((t) => t.type === "doctor");
  const rightTestimonials = testimonialsData.filter(
    (t) => t.type === "patient",
  );

  useEffect(() => {
    const scrollLeft = scrollRefLeft.current;
    const scrollRight = scrollRefRight.current;
    if (!scrollLeft || !scrollRight) return;

    let scrollSpeed = 0.5;
    let rafId;

    const smoothScroll = () => {
      if (!isPaused) {
        scrollLeft.scrollTop += scrollSpeed;
        scrollRight.scrollTop -= scrollSpeed;

        if (scrollLeft.scrollTop >= scrollLeft.scrollHeight / 2) {
          scrollLeft.scrollTop = 0;
        }
        if (scrollRight.scrollTop <= 0) {
          scrollRight.scrollTop = scrollRight.scrollHeight / 2;
        }
      }
      rafId = requestAnimationFrame(smoothScroll);
    };

    rafId = requestAnimationFrame(smoothScroll);
    return () => cancelAnimationFrame(rafId);
  }, [isPaused]);

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className="w-5 h-5 inline-block"
        fill={i < rating ? "#F472B6" : "#6B7280"}
        stroke="none"
      />
    ));

  const TestimonialCard = ({ testimonial, direction }) => (
    <div
      className={`bg-white font-[pacifico] rounded-xl shadow-lg p-4 sm:p-5 mb-4 transition-transform duration-300 border-l-4 w-full max-w-xl mx-auto ${
        direction === "left"
          ? "border-green-400 hover:shadow-green-100"
          : "border-blue-400 hover:shadow-blue-100"
      }`}
    >
      <div className="flex items-start space-x-3 sm:space-x-4">
        <img
          src={testimonial.image}
          alt={testimonial.name}
          className="w-12 h-12 sm:w-14 sm:h-14 object-cover rounded-full border border-gray-200 shadow-sm"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4
                className={`font-semibold text-sm sm:text-base ${
                  direction === "left" ? "text-green-800" : "text-blue-800"
                }`}
              >
                {testimonial.name}
              </h4>
              <p className="text-xs sm:text-sm text-gray-600">
                {testimonial.role}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-1">
              {renderStars(testimonial.rating)}
            </div>
          </div>

          <p className="text-gray-700 italic text-sm sm:text-base mt-2 leading-tight">
            "{testimonial.text}"
          </p>

          <div className="flex sm:hidden mt-3">
            {renderStars(testimonial.rating)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-[70vh] bg-linear-to-br from-blue-100 via-white to-indigo-100 py-10 px-4 relative overflow-hidden">
      <div className="max-w-6xl font-serif mx-auto text-center mb-8 sm:mb-12">
        <Title
          title="Trusted Care Stories"
          description="Hear genuine experiences from doctors and patients using MediFlow to simplify and enhance their healthcare journey."
        />
      </div>

      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 max-w-5xl mx-auto items-stretch"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative font-serif border-2 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border-green-200">
          <div className="flex p-2 font-semibold text-md sm:text-lg rounded-t-2xl text-center bg-green-100 text-green-700 gap-2">
            <Stethoscope /> Medical Professionals
          </div>

          <div
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            ref={scrollRefLeft}
            className="h-56 sm:h-72 md:h-90 lg:h-100 overflow-y-hidden testimonial-no-scrollbar p-3 sm:p-4"
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

        <div className="relative font-serif border-2 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border-blue-200">
          <div className="flex p-2 font-semibold text-md sm:text-lg rounded-t-2xl text-center bg-blue-100 text-blue-700 gap-2">
            <User /> Patients
          </div>

          <div
            onTouchStart={() => setIsPaused(true)}
            onTouchEnd={() => setIsPaused(false)}
            ref={scrollRefRight}
            className="h-56 sm:h-72 md:h-90 lg:h-100 overflow-y-hidden testimonial-no-scrollbar p-3 sm:p-4"
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
