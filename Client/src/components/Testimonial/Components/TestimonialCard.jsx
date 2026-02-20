// MediFlow / Client / src / components / Testimonial / Components / TestimonialCard.jsx
import RenderStars from "../Utils/RenderStars";

const TestimonialCard = ({ testimonial, direction }) => {
  return (
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
              {RenderStars(testimonial.rating)}
            </div>
          </div>

          <p className="text-gray-700 italic text-sm sm:text-base mt-2 leading-tight">
            "{testimonial.text}"
          </p>

          <div className="flex sm:hidden mt-3">
            {RenderStars(testimonial.rating)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;
