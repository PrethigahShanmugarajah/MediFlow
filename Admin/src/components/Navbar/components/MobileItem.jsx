// Admin / src / components / Navbar / components / MobileItem.jsx
import { NavLink } from "react-router-dom";

const MobileItem = ({ to, icon, label, onClick }) => {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      end
      className={({ isActive }) =>
        `flex items-center gap-3 px-2 py-2 rounded-md ${
          isActive
            ? "bg-indigo-50 text-indigo-600"
            : "hover:bg-gray-50 text-black"
        }
        `
      }
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </NavLink>
  );
};

export default MobileItem;
