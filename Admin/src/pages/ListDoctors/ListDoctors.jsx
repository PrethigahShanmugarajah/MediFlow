// MediFlow / Admin / src / pages / ListDoctors / ListDoctors.jsx
import { useEffect, useMemo, useState } from "react";
import { Search, Stethoscope } from "lucide-react";
import {
  ensureDoctorPrefix,
  filterDoctors,
} from "../../utils/listDoctorsUtils";
import {
  getDoctorsForList,
  removeDoctorById,
} from "./Service/ListDoctorsService";
import { ClipLoader } from "react-spinners";
import DoctorCard from "./Components/DoctorCard";
import DeletePopup from "../../components/DeletePopup";

const ListDoctors = () => {
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

  async function fetchDoctorsService() {
    setLoading(true);
    try {
      const normalized = await getDoctorsForList();
      setDoctors(normalized);
    } catch (error) {
      console.error("Network error fetching doctors", error);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDoctorsService();
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

  function openDeletePopup(doc) {
    setDeleteTarget(doc);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeleteLoading(true);

    try {
      await removeDoctorById(deleteTarget._id || deleteTarget.id);

      setDoctors((prev) =>
        prev.filter(
          (d) => (d._id || d.id) !== (deleteTarget._id || deleteTarget.id),
        ),
      );

      if (expanded === (deleteTarget._id || deleteTarget.id)) {
        setExpanded(null);
      }

      setDeleteTarget(null);
    } catch (error) {
      console.error("Delete error:", error);
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
    <div className="min-h-screen font-serif bg-linear-to-br from-indigo-100 via-white to-blue-100 p-4 sm:p-6 md:p-8">
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
                Search by name or specialization
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
            className={`text-xs px-3 py-1 rounded-full transition border cursor-pointer ${
              filterStatus === "available"
                ? "bg-indigo-600 text-white border-indigo-600"
                : "bg-white text-indigo-700 border-indigo-200"
            }`}
          >
            Available
          </button>

          <button
            onClick={() => applyStatusFilter("unavailable")}
            className={`text-xs px-3 py-1 rounded-full transition border ${
              filterStatus === "unavailable"
                ? "bg-red-600 text-white border-red-600"
                : "bg-white text-red-600 border-red-100"
            } cursor-pointer`}
          >
            Unavailable
          </button>
        </div>
      </header>

      <main className="max-w-6xl grid xl:grid-cols-2 lg:grid-cols-2 lg:gap-3 xl:gap-4 mx-auto space-y-4">
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 px-8 py-6">
              <ClipLoader size={50} color="#6366F1" />
            </div>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="col-span-full flex justify-center items-center py-10">
            <div className="text-center text-indigo-600 text-lg font-medium">
              No doctors match your search
            </div>
          </div>
        )}

        {displayed.map((doc) => {
          const id = doc._id || doc.id;

          return (
            <DoctorCard
              key={id}
              doc={doc}
              isOpen={expanded === id}
              isMobileScreen={isMobileScreen}
              onToggle={() => toggle(id)}
              onDelete={() => openDeletePopup(doc)}
            />
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
          item={deleteTarget.name}
          loading={deleteLoading}
          onClose={() => !deleteLoading && setDeleteTarget(null)}
          onDelete={confirmDelete}
          confirmText="Delete"
          title="Delete Doctor"
          description={
            <>
              Do you really want to delete{" "}
              <b>{ensureDoctorPrefix(deleteTarget.name)}</b>? <br />
              This action cannot be undone.
            </>
          }
        />
      )}
    </div>
  );
};

export default ListDoctors;
