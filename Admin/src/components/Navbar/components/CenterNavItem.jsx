// Admin / src / components / Navbar / components / CenterNavItem.jsx
import { NavLink } from "react-router-dom";

const CenterNavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      end
      className={({ isActive }) =>
        `nav-item ${
          isActive ? "active" : ""
        } 'relative flex flex-col lg:text-xs lg:-mx-2 xl:text-md items-center gap-1 px-3 py-2 rounded-lg transition-all text-sm' ${
          isActive
            ? "text-indigo-400 font-semibold"
            : "text-black hover:text-indigo-600"
        }`
      }
    >
      <span>{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

export default CenterNavItem;
