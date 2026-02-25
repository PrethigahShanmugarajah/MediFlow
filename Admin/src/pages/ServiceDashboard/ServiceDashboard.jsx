// MediFlow / Admin / src / pages / ServiceDashboard / ServiceDashboard.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import {
  computeServiceTotals,
  filterServices,
  normalizeService,
} from "../../utils/serviceDashboardUtils";
import { getServiceDashboardServices } from "./Service/ServiceDashboardService";
import RefreshBlock from "./Components/RefreshBlock";
import StatsSection from "./Components/StatsSection";
import ServiceTable from "./Components/ServiceTable";
import ShowMoreButton from "../../components/ShowMoreButton";
import Title from "../../components/Title";
import SearchField from "../../components/SearchField";

const ServiceDashboard = ({ services: servicesProp = null }) => {
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

      const normalized = await getServiceDashboardServices();

      if (mountedRef.current) {
        setServices(normalized);
        setError(null);
      }
    } catch (err) {
      console.error("Service fetch error:", err);
      if (mountedRef.current) {
        setError(err.message || "Failed to load services");
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
      }, 10000);
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

  const INITIAL_COUNT = 8;
  const visibleServices = showAll
    ? filteredServices
    : filteredServices.slice(0, INITIAL_COUNT);

  const totals = useMemo(
    () => computeServiceTotals(filteredServices),
    [filteredServices],
  );

  useEffect(() => {
    setShowAll(false);
  }, [searchQuery]);

  return (
    <div className="min-h-screen font-serif p-4 sm:p-6 from-indigo-100 via-white to-blue-100">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center md:items-center justify-between mb-6 gap-3 md:gap-6 lg:gap-3">
          <Title
            title="Service Dashboard"
            subtitle="Overview of services, appointments and earnings"
          />

          <RefreshBlock
            loading={loading}
            count={filteredServices.length}
            isPropMode={Array.isArray(servicesProp)}
            onRefresh={() => {
              if (Array.isArray(servicesProp)) return;
              fetchServices({ showLoading: true });
            }}
          />
        </div>

        <StatsSection totals={totals} />

        <div className="mb-6 flex justify-start">
          <div className="relative w-full sm:w-64">
            <SearchField
              value={searchQuery}
              onChange={(val) => setSearchQuery(val)}
              placeholder="Search services..."
              size="s"
              showClear
              unstyled={false}
            />
          </div>
        </div>

        <ServiceTable
          loading={loading}
          error={error}
          services={visibleServices}
        />

        <ShowMoreButton
          id="services-show-more"
          total={filteredServices.length}
          limit={INITIAL_COUNT}
          showAll={showAll}
          onToggle={() => setShowAll((s) => !s)}
          showIcon
        />
      </div>
    </div>
  );
};

export default ServiceDashboard;
