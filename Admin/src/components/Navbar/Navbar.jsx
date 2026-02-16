// MediFlow / Admin / src / components / Navbar / Navbar.jsx
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Logo from "../../assets/Logo.png";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  Calendar,
  CalendarDays,
  Grid,
  Home,
  Key,
  List,
  LogOut,
  Menu,
  PlusSquare,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useAuth, useClerk, useUser } from "@clerk/clerk-react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  const navInnerRef = useRef(null);
  const indicatorRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const clerk = useClerk?.();
  const { getToken, isLoaded: authLoaded } = useAuth();
  const { isSignedIn, user, isLoaded: userLoaded } = useUser();

  const moveIndicator = useCallback(() => {
    const container = navInnerRef.current;
    const ind = indicatorRef.current;
    if (!container || !ind) return;

    const active = container.querySelector(".nav-item.active");
    if (!active) {
      ind.style.opacity = "0";
      return;
    }

    const containerRect = container.getBoundingClientRect();
    const activeRect = active.getBoundingClientRect();

    const left = activeRect.left - containerRect.left + container.scrollLeft;
    const width = activeRect.width;

    ind.style.transform = `translateX(${left}px)`;
    ind.style.width = `${width}px`;
    ind.style.opacity = "1";
  }, []);

  useLayoutEffect(() => {
    moveIndicator();
    const t = setTimeout(() => {
      moveIndicator();
    }, 120);
    return () => clearTimeout(t);
  }, [location.pathname, moveIndicator]);

  useEffect(() => {
    const container = navInnerRef.current;
    if (!container) return;

    const onScroll = () => {
      moveIndicator();
    };
    container.addEventListener("scroll", onScroll, { passive: true });

    const ro = new ResizeObserver(() => {
      moveIndicator();
    });
    ro.observe(container);
    if (container.parentElement) ro.observe(container.parentElement);

    window.addEventListener("resize", moveIndicator);

    moveIndicator();

    return () => {
      container.removeEventListener("scroll", onScroll);
      ro.disconnect();
      window.removeEventListener("resize", moveIndicator);
    };
  }, [moveIndicator]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    let mounted = true;
    const storeToken = async () => {
      if (!authLoaded || !userLoaded) return;
      if (!isSignedIn) {
        try {
          localStorage.removeItem("clerk_token");
        } catch (error) {}

        return;
      }

      try {
        if (getToken) {
          const token = await getToken();
          if (!mounted) return;
          if (token) {
            try {
              localStorage.setItem("clerk_token", token);
            } catch (error) {
              console.warn(
                "Failed to write clerk token is localStorage:",
                error,
              );
            }
          }
        }
      } catch (error) {
        console.warn("Could not retrive Clerk token:", error);
      }
    };

    storeToken();
    return () => {
      mounted = false;
    };
  }, [isSignedIn, authLoaded, userLoaded, getToken]);

  const handleOpenSignIn = () => {
    if (!clerk || !clerk.openSignIn) {
      console.warn("Clerk is not available");
      return;
    }
    clerk.openSignIn();
    navigate("/home");
  };

  const handleSignOut = async () => {
    if (!clerk || !clerk.signOut) {
      console.warn("Clerk is not available");
      return;
    }

    try {
      await clerk.signOut();
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      try {
        localStorage.removeItem("clerk_token");
      } catch (error) {}
      navigate("/");
    }
  };

  return (
    <header className="relative font-serif">
      <nav className="mx-auto max-w-7xl lg:px-7 xl:px-2 px-4 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-18 h-18 rounded-full" />
            <Link to="/">
              <div className="text-3xl xl:block lg:text-xs xl:text-xl font-bold text-blue-700">
                MediFlow
              </div>

              <div className="text-xs xl:block text-gray-500">
                Your Health, Our Priority
              </div>
            </Link>
          </div>

          {/* -------- Desktop Navigation -------- */}
          <div className="hidden lg:flex items-center justify-center relative">
            <div className="glow relative rounded-3xl p-1 bg-linear-to-r from-indigo-100 via-indigo-200 to-indigo-100">
              <div className="relative flex items-center">
                <div
                  ref={navInnerRef}
                  tabIndex={0}
                  className="center-inner relative whitespace-nowrap rounded-3xl bg-white/95 lg:px-2 px-4 py-2 flex items-center gap-2 shadow-lg border border-gray-100 overflow-x-auto"
                  style={{ WebkitOverflowScrolling: "touch" }}
                >
                  <CenterNavItem
                    to="/home"
                    label="Dashboard"
                    icon={<Home size={16} />}
                  />

                  <CenterNavItem
                    to="/add"
                    label="Add Doctor"
                    icon={<UserPlus size={16} />}
                  />

                  <CenterNavItem
                    to="/list"
                    label="List Doctors"
                    icon={<Users size={16} />}
                  />

                  <CenterNavItem
                    to="/appointments"
                    label="Appointments"
                    icon={<Calendar size={16} />}
                  />

                  <CenterNavItem
                    to="/service-dashboard"
                    label="Service Dashboard"
                    icon={<Grid size={16} />}
                  />

                  <CenterNavItem
                    to="/add-service"
                    label="Add Service"
                    icon={<PlusSquare size={16} />}
                  />

                  <CenterNavItem
                    to="/list-service"
                    label="List Services"
                    icon={<List size={16} />}
                  />

                  <CenterNavItem
                    to="/service-appointments"
                    label="Service Appointments"
                    icon={<CalendarDays size={16} />}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* -------- Right Side -------- */}
          <div className="flex items-center gap-3">
            {isSignedIn ? (
              <button
                onClick={handleSignOut}
                className="hidden lg:flex items-center gap-2 rounded-full bg-linear-to-r from-violet-500 to-purple-600 text-white px-6 py-2.5 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <div className="hidden lg:flex items-center gap-2">
                <button
                  onClick={handleOpenSignIn}
                  className="flex items-center gap-2 rounded-full bg-linear-to-r from-indigo-500 to-blue-600 text-white px-6 py-2.5 text-sm font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Key className="w-4 h-4" />
                  <span>Login</span>
                </button>
              </div>
            )}

            {/* -------- Mobile Toggle -------- */}
            <button
              onClick={() => setOpen((v) => !v)}
              className="lg:hidden p-2"
            >
              {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* -------- Mobile Navigation -------- */}
        {open && (
          <div
            className="fixed inset-0 z-10 lg:hidden cursor-pointer"
            onClick={() => setOpen(false)}
          />
        )}

        {open && (
          <div className="mt-3 lg:hidden z-20 relative" id="mobile-menu">
            <div className="rounded-xl bg-white shadow-md p-3 space-y-2 border border-gray-300 bg-linear-to-b from-indigo-100 to-white">
              <MobileItem
                to="/home"
                label="Dashboard"
                icon={<Home size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/add"
                label="Add Doctor"
                icon={<UserPlus size={16} />}
                onClick={() => setOpen(false)}
              />
              <MobileItem
                to="/list"
                label="List Doctors"
                icon={<Users size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/appointments"
                label="Appointments"
                icon={<Calendar size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/service-dashboard"
                label="Service Dashboard"
                icon={<Grid size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/add-service"
                label="Add Service"
                icon={<PlusSquare size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/list-service"
                label="List Services"
                icon={<List size={16} />}
                onClick={() => setOpen(false)}
              />

              <MobileItem
                to="/service-appointments"
                label="Service Appointments"
                icon={<CalendarDays size={16} />}
                onClick={() => setOpen(false)}
              />

              <div className="pt-2 mt-2 border-t border-gray-300">
                {isSignedIn ? (
                  <button
                    onClick={() => {
                      handleSignOut();
                      setOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-linear-to-r from-violet-500 to-purple-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        handleOpenSignIn();
                        setOpen(false);
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-full bg-linear-to-r from-indigo-500 to-blue-600 text-white font-medium shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Key className="w-4 h-4" />
                      Login
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;

function CenterNavItem({ to, icon, label }) {
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
}

function MobileItem({ to, icon, label, onClick }) {
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
}
