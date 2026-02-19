// MediFlow / Admin / src / components / ListPage / ListPage.jsx
import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import { toast } from "react-toastify";
import {
  Banknote,
  ChevronDown,
  Search,
  Star,
  Stethoscope,
  Trash2,
  Users,
} from "lucide-react";
import { ClipLoader } from "react-spinners";
import { fetchDoctors } from "../../services/fetch";
import DeletePopup from "../DeletePopup/DeletePopup";
import {
  buildScheduleMap,
  filterDoctors,
  formatDateISO,
  getSortedScheduleDates,
  normalizeDoctors,
} from "./Services";

const ListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [loading, setLoading] = useState(false);
  const [isMobileScreen, setIsMobileScreen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    function onResize() {
      if (typeof window === "undefined") return;
      setIsMobileScreen(window.innerWidth < 640);
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  async function loadDoctors() {
    setLoading(true);

    try {
      const data1 = await fetchDoctors();

      const list = Array.isArray(data1?.data)
        ? data1.data
        : Array.isArray(data1?.doctors)
          ? data1.doctors
          : [];

      setDoctors(normalizeDoctors(list));
    } catch (error) {
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDoctors();
  }, []);

  const filtered = useMemo(
    () => filterDoctors(doctors, query, filterStatus),
    [doctors, query, filterStatus],
  );

  const displayed = useMemo(() => {
    if (showAll) return filtered;
    return filtered.slice(0, 6);
  }, [filtered, showAll]);

  function toggle(id) {
    setExpanded((prev) => (prev === id ? null : id));
  }

  async function removeDoctorConfirmed() {
    if (!deleteTarget) return;

    const deleteId = deleteTarget?._id || deleteTarget?.id;

    setDeleteLoading(true);

    try {
      const response2 = await api.delete(
        API_ROUTES.DOCTORS.DOCTOR_DELETE(deleteId),
      );

      console.log("Delete Doctors API Response:", response2);

      const data2 = response2.data;

      if (data2?.success) {
        toast.success(data2?.message);
        console.log("Delete Doctors Success:", data2?.message);

        setDoctors((prev) => prev.filter((p) => (p._id || p.id) !== deleteId));

        if (expanded === deleteId) setExpanded(null);

        setDeleteTarget(null);
      } else {
        toast.warn(data2?.message);
        console.warn("Delete Doctors Warning:", data2?.message);
      }
    } catch (error2) {
      toast.error(error2?.response?.data?.message || error2?.message);
      console.error("Delete Doctors Error:", error2);
    } finally {
      setDeleteLoading(false);
    }
  }

  function applyStatusFilter(status) {
    setFilterStatus((prev) => (prev === status ? "all" : status));
    setExpanded(null);
    setShowAll(false);
  }

  return (
    <div className="min-h-screen font-serif bg-linear-to-br from-blue-50 via-blue-100 to-white p-4 sm:p-6 md:p-8">
      <header className="max-w-6xl mx-auto mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="p-2 rounded-full bg-white shadow-sm transform transition">
              <Stethoscope size={20} className="text-indigo-600" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold text-indigo-800">
                Find a Doctor
              </h1>
              <p className="text-sm sm:text-md text-indigo-600">
                Look up by name or specialty
              </p>
            </div>
          </div>

          <div className="w-full sm:w-auto mt-3 sm:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center w-full sm:w-96 bg-white rounded-full px-3 py-2 shadow-sm">
              <Search size={16} className="text-indigo-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Doctors, specialization"
                className="ml-3 w-full outline-none text-indigo-700 placeholder-indigo-400 bg-transparent"
              />
            </div>

            <button
              onClick={() => {
                setQuery("");
                setExpanded(null);
                setShowAll(false);
                setFilterStatus("all");
              }}
              className="px-3 py-2 cursor-pointer rounded-full bg-indigo-600 text-white shadow hover:opacity-95 transition w-full sm:w-auto"
            >
              Clear
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-5">
          <button
            onClick={() => applyStatusFilter("available")}
            className={`text-xs px-3 py-1 rounded-full border transition cursor-pointer ${
              filterStatus === "available"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-700 border-indigo-200"
            }`}
          >
            Available
          </button>

          <button
            onClick={() => applyStatusFilter("unavailable")}
            className={`text-xs px-3 py-1 rounded-full transition border cursor-pointer ${
              filterStatus === "unavailable"
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-rose-600 border-rose-100"
            }`}
          >
            Unavailable
          </button>
        </div>
      </header>

      <main className="max-w-6xl grid xl:grid-cols-2 lg:grid-cols-2 lg:gap-3 xl:gap-4 mx-auto space-y-4">
        {loading && (
          <div className="col-span-full flex text-center items-center justify-center  text-black py-8 gap-3">
            <ClipLoader size={18} color="#3B82F6" />
            <span className="text-sm animate-pulse">Loading Doctors...</span>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="col-span-full text-center text-indigo-600 py-8">
            No doctors match you search
          </div>
        )}

        {displayed.map((doc) => {
          const id = doc._id || doc.id;
          const isOpen = expanded === id;
          const isAvailable = doc.availability === "Available";

          const scheduleMap = buildScheduleMap(doc.schedule || {});
          const sortedDates = getSortedScheduleDates(scheduleMap);

          return (
            <article
              key={id}
              className="bg-linear-to-r from-indigo-100/50 to-white rounded-2xl shadow-md border border-indigo-100 overflow-hidden transition-all duration-300"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 md:p-5">
                <img
                  src={doc.imageUrl || doc.image || ""}
                  alt={doc.name}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover border border-indigo-200 shadow-sm mx-auto sm:mx-0"
                />

                <div className="flex-1 min-w-0 w-full">
                  <div className="flex flex-col sm:flex-row sm:items-start items-start justify-between gap-3 w-full">
                    <div className="min-w-0 w-full">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg md:text-xl text-indigo-800 font-medium truncate">
                          {doc.name}
                        </h3>

                        <span
                          className={`ml-0 sm:ml-2 mt-2 sm:mt-0 inline-flex items-center gap-2 text-xs font-medium px-2 py-0.5 rounded-full ${
                            isAvailable
                              ? "bg-indigo-50 text-indigo-700"
                              : "bg-rose-50 text-rose-600"
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isAvailable ? "bg-indigo-600" : "bg-rose-600"
                            }`}
                          />

                          {isAvailable ? "Available" : "Unavailable"}
                        </span>
                      </div>

                      <div className="text-sm text-indigo-600 truncate mt-2 sm:mt-1">
                        {doc.specialization} • {doc.experience} years
                      </div>
                    </div>

                    <div className="flex items-center gap-3 mt-3 sm:mt-0 sm:ml-4">
                      <div className="text-sm text-indigo-700 flex items-center gap-1">
                        <Star size={14} /> {doc.rating}
                      </div>

                      <button
                        onClick={() => toggle(id)}
                        className="p-2 rounded-full cursor-pointer bg-white shadow-sm"
                      >
                        <ChevronDown
                          size={18}
                          className={`transform transition-transform duration-200 ${
                            isOpen ? "rotate-180" : "rotate-0"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="text-xs text-indigo-500">Patients</div>
                    <div className="text-sm text-indigo-700 font-medium flex items-center gap-2">
                      <Users size={14} /> {doc.patients}
                    </div>

                    <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setDeleteTarget(doc)}
                          className="px-3 py-1 rounded-full bg-rose-50 text-rose-600 text-xs flex items-center gap-2 transition"
                        >
                          <Trash2 size={14} /> Delete
                        </button>

                        <div className="text-md font-bold text-indigo-700">
                          Fees:{" "}
                        </div>
                        <div className="text-sm text-indigo-800 font-medium flex items-center gap-1">
                          <Banknote /> {doc.fee}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="px-4 md:px-5 bg-white overflow-auto sm:overflow-visible"
                style={{
                  maxHeight: isOpen ? (isMobileScreen ? 320 : 600) : 0,
                  transition:
                    "max-height 420ms cubic-bezier(.2,.9,.2,1), padding 220ms ease",
                  paddingTop: isOpen ? 16 : 0,
                  paddingBottom: isOpen ? 16 : 0,
                }}
              >
                {isOpen && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <h4 className="text-md font-bold text-indigo-700 mb-1">
                        About
                      </h4>
                      <p className="text-sm text-indigo-600 wrap-break-words whitespace-normal">
                        {doc.about}
                      </p>

                      <div className="mt-4">
                        <div className="text-md text-indigo-700 font-bold">
                          Qualifications
                        </div>
                        <div className="text-sm text-indigo-600 wrap-break-words whitespace-normal">
                          {doc.qualifications}
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="text-md text-indigo-700 font-bold">
                          Schedule
                        </div>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {sortedDates.map((date) => {
                            const slots = scheduleMap[date] || [];
                            return (
                              <div key={date} className="min-w-full md:min-w-0">
                                <div className="text-xs text-indigo-500">
                                  {formatDateISO(date)}
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                  {slots.map((s, i) => (
                                    <span
                                      key={i}
                                      className="text-xs px-3 py-1 rounded-full border border-indigo-100 shadow-sm wrap-break-words"
                                    >
                                      {s}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <aside className="col-span-1 flex flex-col sm:flex-row md:flex-col xl:flex-col lg:flex-col gap-3 items-start md:items-end">
                      <div className="text-md text-indigo-700 font-bold">
                        Success
                      </div>
                      <div className="text-sm text-indigo-700">
                        {doc.success}%
                      </div>

                      <div className="text-md text-indigo-700 font-bold">
                        Patients
                      </div>
                      <div className="text-sm text-indigo-700">
                        {doc.patients}
                      </div>

                      <div className="text-md text-indigo-700 font-bold">
                        Location
                      </div>
                      <div className="text-sm sm:whitespace-nowrap whitespace-normal text-indigo-700">
                        {doc.location}
                      </div>
                    </aside>
                  </div>
                )}
              </div>
            </article>
          );
        })}

        {filtered.length > 6 && (
          <div className="col-span-full flex justify-center mt-4">
            <button
              onClick={() => setShowAll((s) => !s)}
              className="px-5 py-2 cursor-pointer rounded-full bg-white border border-indigo-300 shadow-sm hover:shadow-md transition"
            >
              {showAll ? "Show Less" : `Show more (${filtered.length - 4})`}
            </button>
          </div>
        )}
      </main>

      {deleteTarget && (
        <DeletePopup
          name={deleteTarget?.name}
          loading={deleteLoading}
          onClose={() => {
            if (!deleteLoading) setDeleteTarget(null);
          }}
          onDelete={removeDoctorConfirmed}
        />
      )}
    </div>
  );
};

export default ListPage;
