// MediFlow / Client / src / components / Testimonial / Utils / RenderStars.jsx
import { Star } from "lucide-react";

const RenderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`w-5 h-5 ${i < rating ? "text-lime-400" : "text-gray-400"}`}
      fill="currentColor"
      stroke="none"
    />
  ));

export default RenderStars;
