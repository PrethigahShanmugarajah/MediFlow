import { useEffect, useRef, useState } from "react";
import {
  loadServicesList,
  removeServiceById,
  saveEditedService,
  startEditService,
} from "../Service/ListServicesService";
import {
  addDefaultSlotToForm,
  filterServiceList,
  removeSlotFromForm,
  safeReplaceImagePreview,
  updateSlotInEditForm,
  validateSlotsAndNoDuplicates,
} from "../../../utils/listServicesUtils";
import {
  capitalizeWords,
  formatDateISO,
  getTodayISO,
} from "../../../utils/helpers";
import { toast } from "react-toastify";
import Header from "../Components/Header";
import { ClipLoader } from "react-spinners";
import CardHeader from "../Components/CardHeader";
import EditCard from "../Components/EditCard";
import ViewCard from "../Components/ViewCard";
import ShowMoreButton from "../../../components/ShowMoreButton";
import DeletePopup from "../../../components/DeletePopup";

const ListServices = () => {
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [openDetails, setOpenDetails] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [editForm, setEditForm] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const fileRef = useRef();

  const todayISO = getTodayISO();

  async function fetchServicesService() {
    setLoading(true);
    try {
      await loadServicesList(setServices);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchServicesService();
  }, []);

  function toggleDetails(id) {
    setOpenDetails((prev) => ({ [id]: !prev[id] }));
  }

  async function startEdit(service) {
    await startEditService(service, setEditingId, setEditForm, setOpenDetails);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit() {
    if (!editForm || saveLoading) return;
    const v = validateSlotsAndNoDuplicates(editForm.slots || [], formatDateISO);
    if (!v.ok) {
      toast.error(v.message);
      return;
    }
    setSaveLoading(true);
    try {
      await saveEditedService(editForm, setServices, cancelEdit);
    } finally {
      setSaveLoading(false);
    }
  }

  async function confirmDeleteService() {
    if (!deleteTarget?.id) return;

    setDeleteLoading(true);
    try {
      await removeServiceById(deleteTarget.id, setServices, setOpenDetails);
      setShowAll(false);
      closeDeletePopup();
    } finally {
      setDeleteLoading(false);
    }
  }

  function onImageFileChange(filesOrNull, e) {
    const f = filesOrNull?.[0] || e?.target?.files?.[0];
    if (!f) return;
    const url = safeReplaceImagePreview(editForm?.imagePreview, f);
    setEditForm((prev) => ({
      ...prev,
      imagePreview: url,
      imageFile: f,
    }));
  }

  function addNewSlot() {
    setEditForm((p) => addDefaultSlotToForm(p, todayISO));
  }

  function updateSlot(slotId, field, value) {
    setEditForm((prev) => {
      const { nextForm, errorMsg, dupMsg } = updateSlotInEditForm(
        prev,
        slotId,
        field,
        value,
        todayISO,
      );
      if (errorMsg) toast.error(errorMsg);
      if (dupMsg) toast.error(dupMsg);
      return nextForm;
    });
  }

  function removeSlot(slotId) {
    setEditForm((p) => removeSlotFromForm(p, slotId));
  }

  const filtered = filterServiceList(services, search, filterMode);
  const visible = showAll ? filtered : filtered.slice(0, 6);

  useEffect(() => {
    setShowAll(false);
  }, [search, filterMode]);

  function openDeletePopup(service) {
    setDeleteTarget(service);
    setDeleteOpen(true);
  }

  function closeDeletePopup() {
    if (deleteLoading) return;
    setDeleteOpen(false);
    setDeleteTarget(null);
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl font-serif mx-auto min-h-screen from-indigo-100 via-white to-blue-100">
      <Header
        search={search}
        setSearch={setSearch}
        filterMode={filterMode}
        setFilterMode={setFilterMode}
        onClear={() => {
          setSearch("");
          setFilterMode("all");
          setShowAll(false);
          setOpenDetails({});
          setEditingId(null);
          setEditForm(null);
        }}
      />

      {/* -------- Grid -------- */}
      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4 px-8 py-6 sm:mt-50 xl:mt-0">
            <ClipLoader size={50} color="#6366F1" />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
          {visible.map((svc) => {
            const isOpen = !!openDetails[svc.id];
            const isEditing = editingId === svc.id;

            return (
              <div
                key={svc.id}
                className="bg-white rounded-2xl overflow-hidden transform transition hover:-translate-y-1 hover:shadow-2xl border border-indigo-50"
              >
                <CardHeader
                  svc={svc}
                  isOpen={isOpen}
                  onToggle={() => toggleDetails(svc.id)}
                />

                <div
                  className={`px-4 pb-4 transition-all ${
                    isOpen ? "block" : "hidden"
                  }`}
                >
                  {isEditing ? (
                    <EditCard
                      editForm={editForm}
                      todayISO={todayISO}
                      fileRef={fileRef}
                      onImageFileChange={onImageFileChange}
                      addNewSlot={addNewSlot}
                      updateSlot={updateSlot}
                      removeSlot={removeSlot}
                      cancelEdit={cancelEdit}
                      saveEdit={saveEdit}
                      saveLoading={saveLoading}
                      setEditForm={setEditForm}
                    />
                  ) : (
                    <ViewCard
                      svc={svc}
                      startEdit={startEdit}
                      onRequestDelete={openDeletePopup}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <ShowMoreButton
          total={filtered.length}
          limit={6}
          showAll={showAll}
          onToggle={() => setShowAll((p) => !p)}
          moreText="Show More"
          lessText="Show Less"
          showRemainingCount
          showIcon
        />
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center text-indigo-300 mt-8">
          No services match your search.
        </div>
      )}

      {deleteOpen && (
        <DeletePopup
          onClose={closeDeletePopup}
          onDelete={confirmDeleteService}
          loading={deleteLoading}
          item={deleteTarget?.name}
          title="Delete service?"
          confirmText="Delete"
          closeText="Cancel"
        >
          Do you really want to delete{" "}
          <b>{capitalizeWords(deleteTarget?.name)}</b>? <br />
          This action cannot be undone.
        </DeletePopup>
      )}
    </div>
  );
};

export default ListServices;
