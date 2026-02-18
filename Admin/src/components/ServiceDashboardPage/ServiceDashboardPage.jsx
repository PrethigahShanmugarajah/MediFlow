// MediFlow / Admin / src / components / ServiceDashboardPage / ServiceDashboardPage.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Banknote,
  Calendar,
  CheckCircle,
  ClipboardList,
  Search,
  XCircle,
} from "lucide-react";
import StatCard from "./components/StatCard";
import {
  calculateTotals,
  extractServicesList,
  filterServices,
  formatCurrencyLKR,
  getVisibleServices,
  INITIAL_COUNT,
  normalizeService,
  normalizeServicesList,
  POLL_MS,
} from "./Services";
import { ClipLoader } from "react-spinners";
import { fetchServiceAppointmentsStats } from "../../services/fetch";

const ServiceDashboardPage = ({ services: servicesProp = null }) => {
  const [services, setServices] = useState(
    Array.isArray(servicesProp) ? servicesProp.map(normalizeService) : [],
  );
  const [loading, setLoading] = useState(!Array.isArray(servicesProp));
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  const mountedRef = useRef(true);
  const fetchingRef = useRef(false);
  const pollHandleRef = useRef(null);

  async function fetchServices({ showLoading = true } = {}) {
    if (fetchingRef.current) return;
    fetchingRef.current = true;

    try {
      if (showLoading) {
        setLoading(true);
        setError(null);
      }

      const data = await fetchServiceAppointmentsStats();

      if (data?.success) {
        const list = extractServicesList(data);
        const normalized = normalizeServicesList(list, normalizeService);

        if (mountedRef.current) {
          setServices(normalized);
          setError(null);
        }
      } else {
        if (mountedRef.current) {
          setError(data?.message || "Failed to load services");
        }
      }
    } catch (error) {
      if (mountedRef.current) {
        setError(
          error?.response?.data?.message ||
            error?.message ||
            "Failed to load services",
        );
      }
    } finally {
      if (mountedRef.current && showLoading) setLoading(false);
      fetchingRef.current = false;
    }
  }

  useEffect(() => {
    window.refreshServices = () => fetchServices({ showLoading: true });
    return () => {
      try {
        delete window.refreshServices;
      } catch {}
    };
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    if (Array.isArray(servicesProp)) {
      setServices(servicesProp.map(normalizeService));
      setLoading(false);
      return () => {
        mountedRef.current = false;
      };
    }

    fetchServices({ showLoading: true });
    function startPolling() {
      if (pollHandleRef.current) return;
      pollHandleRef.current = setInterval(() => {
        if (document.visibilityState === "visible")
          fetchServices({ showLoading: false });
      }, POLL_MS);
    }

    function stopPolling() {
      if (pollHandleRef.current) {
        clearInterval(pollHandleRef.current);
        pollHandleRef.current = null;
      }
    }

    startPolling();

    function onFocus() {
      fetchServices({ showLoading: false });
    }
    window.addEventListener("focus", onFocus);

    function onServicesUpdated() {
      fetchServices({ showLoading: false });
    }
    window.addEventListener("services:updated", onServicesUpdated);

    function onStorage(e) {
      if (e?.key === "service_bookings_updated") {
        fetchServices({ showLoading: false });
      }
    }
    window.addEventListener("storage", onStorage);

    function onVisibilityChange() {
      if (document.visibilityState === "visible") {
        fetchServices({ showLoading: false });
      }
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      mountedRef.current = false;
      stopPolling();
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("services:updated", onServicesUpdated);
      window.removeEventListener("storage", onStorage);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [servicesProp]);

  const filteredServices = useMemo(
    () => filterServices(services, searchQuery),
    [services, searchQuery],
  );

  const visibleServices = useMemo(
    () => getVisibleServices(filteredServices, showAll, INITIAL_COUNT),
    [filteredServices, showAll],
  );

  const totals = useMemo(
    () => calculateTotals(filteredServices),
    [filteredServices],
  );

  function formatCurrency(v) {
    return `LKR ${Number(v || 0).toLocaleString()}`;
  }

  return (
    <div className="min-h-screen font-serif p-4 sm:p-6 bg-linear-to-b from-indigo-50 via-indigo-25 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center md:items-center justify-between mb-6 gap-3 md:gap-6 lg:gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold text-indigo-800">
              Service Dashboard
            </h1>

            <p className="text-sm text-gray-600">
              Overview of services, appointments and earnings
            </p>
          </div>

          <div className="mt-3 sm:mt-0 flex items-center gap-3">
            <div className="text-xs text-black">
              {loading ? (
                <div className="col-span-full flex text-center items-center justify-center  text-black py-8 gap-3">
                  <ClipLoader size={18} color="#3B82F6" />
                  <span className="text-sm animate-pulse">Loading ...</span>
                </div>
              ) : (
                `${filteredServices.length} services${
                  filteredServices.length !== 1 ? "s" : ""
                }`
              )}
            </div>

            <button
              onClick={() => {
                if (Array.isArray(servicesProp)) return;
                fetchServices({ showLoading: true });
              }}
              className={`px-3 py-1 rounded-full text-sm ${
                Array.isArray(servicesProp)
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-white text-indigo-600 border border-indigo-200 hover:shadow-sm"
              }`}
              title={
                Array.isArray(servicesProp)
                  ? "Services provided by parent component"
                  : "Refresh"
              }
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<ClipboardList size={18} />}
            label="Total Services"
            value={totals.totalServices}
          />

          <StatCard
            icon={<Calendar size={18} />}
            label="Total Appointments"
            value={totals.totalAppointments}
          />

          <StatCard
            icon={<Banknote size={18} />}
            label="Total Earnings"
            value={totals.totalEarning}
          />

          <StatCard
            icon={<CheckCircle size={18} />}
            label="Completed"
            value={totals.totalCompleted}
          />

          <StatCard
            icon={<XCircle size={18} />}
            label="Canceled"
            value={totals.totalCanceled}
          />
        </div>

        <div className="mb-6 flex justify-start">
          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-200 w-full sm:w-64">
            <Search size={16} className="text-indigo-700" />
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-sm outline-none"
            />

            {searchQuery.length > 0 && (
              <XCircle
                size={16}
                className="text-rose-500 cursor-pointer"
                onClick={() => setSearchQuery("")}
              />
            )}
          </div>
        </div>

        {/* -------- Tablet View -------- */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border-b border-transparent">
          <div className="hidden md:grid lg:hidden grid-cols-5 items-center gap-6 px-4 py-3 text-sm text-gray-600 bg-indigo-50">
            <div className="text-center text-xs font-medium">Service</div>
            <div className="text-center text-xs font-medium">Appointments</div>
            <div className="text-center text-xs font-medium">Completed</div>
            <div className="text-center text-xs font-medium">Canceled</div>
            <div className="text-center text-xs font-medium">Earning</div>
          </div>

          {/* -------- Desktop View -------- */}
          <div className="hidden lg:grid md:text-xs lg:text-xs xl:text-md grid-cols-12 items-center gap-4 px-4 py-3 text-sm text-gray-600 bg-indigo-50">
            <div className="col-span-5">Service</div>
            <div className="col-span-2">Price</div>
            <div className="col-span-1 text-center text-xs font-medium">
              Appointments
            </div>
            <div className="col-span-1 text-center text-xs font-medium">
              Completed
            </div>
            <div className="col-span-1 text-center text-xs font-medium">
              Canceled
            </div>
            <div className="col-span-2 text-right">Earning</div>
          </div>

          <div className="divide-y divide-transparent min-w-full">
            {loading ? (
              <div className="col-span-full flex text-center items-center justify-center  text-black py-8 gap-3">
                <ClipLoader size={18} color="#3B82F6" />
                <span className="text-sm animate-pulse">
                  Loading Appointments...
                </span>
              </div>
            ) : error ? (
              <div className="px-4 py-6 text-center text-red-600">
                Error: {error}
              </div>
            ) : visibleServices.length === 0 ? (
              <div className="px-4 py-6 text-center text-gray-500">
                No services found.
              </div>
            ) : (
              visibleServices.map((s) => {
                const earning = s.completed * s.price;
                return (
                  <div
                    key={s.id}
                    className="px-4 py-4 font-serif hover:shadow-md transition bg-white md:bg-transparent"
                  >
                    {/* -------- Tablet View -------- */}
                    <div className="hidden md:grid lg:hidden grid-cols-5 items-center gap-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 ring-1 ring-indigo-100">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="min-w-0">
                          <div className="text-sm font-medium text-indigo-800 whitespace-nowrap">
                            {s.name}
                          </div>

                          <div className="text-xs text-gray-500">
                            {formatCurrencyLKR(s.price)}
                          </div>
                        </div>
                      </div>

                      <div className="text-center text-sm">
                        {s.totalAppointments}
                      </div>
                      <div className="text-sm text-center text-indigo-700">
                        {s.completed}
                      </div>
                      <div className="text-sm text-center text-rose-500">
                        {s.canceled}
                      </div>
                      <div className="text-sm text-right">
                        {formatCurrency(earning)}
                      </div>
                    </div>

                    {/* -------- Desktop View -------- */}
                    <div className="hidden lg:grid grid-cols-12 items-center gap-4">
                      <div className="col-span-5 flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl overflow-hidden ring-1 ring-indigo-100 bg-gray-200">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <h3 className="font-semibold md:text-xs lg:text-lg xl:text-lg text-indigo-800">
                          {s.name}
                        </h3>
                      </div>

                      <div className="col-span-2">
                        {formatCurrencyLKR(s.price)}
                      </div>

                      <div className="col-span-1 text-center">
                        {s.totalAppointments}
                      </div>

                      <div className="col-span-1 text-center">
                        {s.completed}
                      </div>

                      <div className="col-span-1 text-center">{s.canceled}</div>

                      <div className="col-span-2 text-right">
                        {formatCurrency(earning)}
                      </div>
                    </div>

                    {/* -------- Mobile View -------- */}
                    <div className="md:hidden flex flex-col gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-14 h-14 rounded-lg overflow-hidden bg-gray-200 ring-1 ring-indigo-100">
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-3">
                            <h3 className="font-semibold text-xs text-indigo-800">
                              {s.name}
                            </h3>
                            <div className="text-sm font-medium">
                              {formatCurrencyLKR(s.price)}
                            </div>
                          </div>

                          <div className="mt-2 flex flex-wrap gap-2 text-xs text-black">
                            <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-full ring-1 ring-indigo-100">
                              <Calendar size={14} />
                              <span className="leading-none">
                                {s.totalAppointments} Appointments
                              </span>
                            </div>

                            <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-full ring-1 ring-indigo-100">
                              <CheckCircle size={14} />
                              <span className="leading-none text-indigo-700">
                                {s.completed} Completed
                              </span>
                            </div>

                            <div className="flex items-center gap-2 bg-rose-50 px-2 py-1 rounded-full ring-1 ring-rose-100">
                              <XCircle size={14} />
                              <span className="leading-none text-rose-500">
                                {s.canceled} Canceled
                              </span>
                            </div>

                            <div className="flex items-center gap-2 bg-indigo-50 px-2 py-1 rounded-full ring-1 ring-indigo-100">
                              <Banknote size={14} />
                              <span className="leading-none">
                                Total Earning : {formatCurrency(earning)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {filteredServices.length > INITIAL_COUNT && (
          <div className="px-6 py-4 border-t border-blue-50 flex justify-center">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="px-4 py-2 rounded-full bg-white border border-blue-200 shadow-sm hover:bg-blue-50 transition"
            >
              {showAll
                ? "Show less"
                : `Show more(${filteredServices.length - INITIAL_COUNT})`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDashboardPage;
