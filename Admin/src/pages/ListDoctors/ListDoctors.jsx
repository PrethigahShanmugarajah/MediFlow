// MediFlow / Admin / src / pages / ListDoctors / ListDoctors.jsx
import { useEffect, useMemo, useState } from "react";
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
import ShowMoreButton from "../../components/ShowMoreButton";
import Header from "./Components/Header";

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
    <div className="p-4 sm:p-6 max-w-6xl font-serif mx-auto min-h-screen from-indigo-100 via-white to-blue-100">
      <Header
        query={query}
        setQuery={setQuery}
        filterStatus={filterStatus}
        applyStatusFilter={applyStatusFilter}
        onClear={() => {
          setQuery("");
          setExpanded(null);
          setShowAll(false);
          setFilterStatus("all");
        }}
      />

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
      </main>

      <ShowMoreButton
        id="filtered-show-more"
        total={filtered.length}
        limit={6}
        showAll={showAll}
        onToggle={() => setShowAll((s) => !s)}
        showIcon
      />

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
