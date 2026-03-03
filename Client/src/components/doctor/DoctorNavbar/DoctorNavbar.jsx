// MediFlow / Client / src / components / doctor / DoctorNavbar / DoctorNavbar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { Logo } from "../../../assets";
import { Calendar, Edit, Home, LogOut, Menu, X } from "lucide-react";
import "./DoctorNavbar.css";

const STORAGE_KEY = import.meta.env.VITE_STORAGE_KEY;

const DoctorNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const doctorId = useMemo(() => {
    if (params?.id) return params.id;
    const m = (location?.pathname || "").match(/\/doctor-admin\/([^/]+)/);
    return m?.[1] || null;
  }, [params?.id, location?.pathname]);

  const basePath = doctorId
    ? `/doctor-admin/${doctorId}`
    : "/doctor-admin/login";

  const navItems = [
    { label: "Dashboard", to: basePath, Icon: Home, end: true },
    { label: "Appointments", to: `${basePath}/appointments`, Icon: Calendar },
    { label: "Edit Profile", to: `${basePath}/profile/edit`, Icon: Edit },
  ];

  const handleLogout = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: null }),
      );
    } catch {}
    navigate("/doctor-admin/login", { replace: true });
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-transform duration-500 bg-linear-to-br from-indigo-100 via-white to-blue-100 border-b border-indigo-200 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl font-[pacifico] md:px-2 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* -------- Logo -------- */}
            <Link
              to={basePath}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 -ml-3 sm:-ml-4"
            >
              <div className="relative group w-20 h-20 sm:w-24 sm:h-24 lg:w-15 lg:h-15 xl:w-32 xl:h-32">
                <div className="relative flex items-center justify-center overflow-hidden p-2 mx-1 h-full w-full">
                  <img
                    src={Logo}
                    alt="MediFlow Logo"
                    className="w-14 h-14 object-contain"
                  />
                </div>
              </div>

              <div className="block sm:block">
                <h1 className="text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600 tracking-tight">
                  MediFlow
                </h1>

                <p className="text-xs lg:text-xs text-gray-500">
                  Patients’ Health, Our Priority
                </p>
              </div>
            </Link>

            {/* -------- Desktop Navigation -------- */}
            <div className="hidden lg:-mx-5 lg:flex items-center gap-2">
              <div className="flex gap-1 bg-white border border-indigo-200 p-1 rounded-full shadow-lg">
                {navItems.map(({ label, to, Icon, end }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={end}
                    className={({ isActive }) =>
                      `nav-item px-5 md:px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        isActive ? "active" : "text-black hover:text-indigo-600"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="inline-flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {label}
                    </span>
                  </NavLink>
                ))}
              </div>
            </div>

            {/* -------- Actions -------- */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLogout}
                className="btn-add hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-transform duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:text-xs lg:whitespace-nowrap sm:inline-block">
                  Logout
                </span>
              </button>

              {/* -------- Toggle (mobile only) -------- */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-lg hover:bg-indigo-50 transition-colors"
              >
                {isOpen ? (
                  <X className="w-6 h-6 text-black" />
                ) : (
                  <Menu className="w-6 h-6 text-black" />
                )}
              </button>
            </div>
          </div>

          {/* -------- Mobile Navigations -------- */}
          {isOpen && (
            <div className="mobile-menu lg:hidden pb-4 space-y-2 border-t border-indigo-100 pt-4">
              {navItems.map(({ label, to, Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`
                  }
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {label}
                  </span>
                </NavLink>
              ))}

              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-indigo-200 bg-white text-sm font-semibold hover:bg-indigo-50 transition-all"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default DoctorNavbar;
