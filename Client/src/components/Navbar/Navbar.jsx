// MediFlow / Client / src / components / Navbar / Navbar.jsx
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useClerk, UserButton } from "@clerk/clerk-react";
import { Logo } from "../../assets";
import { Key, Menu, Stethoscope, X } from "lucide-react";
import "./Navbar.css";

const STORAGE_KEY = import.meta.env.STORAGE_KEY;

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isDoctorLoggedIn, setIsDoctorLoggedIn] = useState(() => {
    try {
      return Boolean(localStorage.getItem(STORAGE_KEY));
    } catch {
      return false;
    }
  });
  const location = useLocation();
  const navRef = useRef(null);
  const clerk = useClerk();
  const navigate = useNavigate();

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
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) {
        setIsDoctorLoggedIn(Boolean(e.newValue));
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && navRef.current && !navRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Doctors", href: "/doctors" },
    { label: "Services", href: "/services" },
    { label: "Appointments", href: "/appointments" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <nav
        className={`sticky top-0 z-50 bg-white/95 backdrop-blur-md transition-transform duration-500 bg-linear-to-br from-indigo-100 via-white to-blue-100 border-b border-indigo-200 ${
          showNavbar ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="max-w-7xl font-[pacifico] md:px-2 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* -------- Logo -------- */}
            <Link to="/" className="flex items-center gap-3 -ml-3 sm:-ml-4">
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

            <div className="hidden lg:-mx-5 lg:flex items-center gap-2">
              <div className="flex gap-1 bg-white border border-indigo-200 p-1 rounded-full shadow-lg">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      to={item.href}
                      className={`nav-item px-5 md:px-4 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${
                        isActive
                          ? "active"
                          : "text-gray-700 hover:text-indigo-600"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <SignedOut>
                {/* -------- Doctor Login -------- */}
                <Link
                  to="/doctor-admin/login"
                  className="btn-add hidden lg:inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-semibold transition-transform duration-200"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span className="hidden lg:text-xs lg:whitespace-nowrap sm:inline-block">
                    Doctor Admin
                  </span>
                </Link>

                {/* -------- Patient Login -------- */}
                <button
                  onClick={() => clerk.openSignIn()}
                  className="btn-login hidden lg:flex lg:text-sm items-center gap-2 bg-linear-to-r from-indigo-400 to-blue-600 text-white px-6 py-2.5 rounded-full font-semibold hover:shadow-xl transition-all duration-300 cursor-default"
                >
                  <Key className="w-4 h-4" /> Login
                </button>
              </SignedOut>

              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>

              {/* -------- To Toggle -------- */}
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
              {navItems.map((item, idx) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={idx}
                    to={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "bg-indigo-500 text-white"
                        : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}

              <SignedOut>
                <Link
                  to="/doctor-admin/login"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-indigo-200 bg-white text-sm font-semibold hover:bg-indigo-50 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  Doctor Admin
                </Link>

                <div className="w-full mt-3">
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      clerk.openSignIn();
                    }}
                    className="w-full cursor-default md:rounded-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-500 to-blue-600 text-white py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all"
                  >
                    Login
                  </button>
                </div>
              </SignedOut>
            </div>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
