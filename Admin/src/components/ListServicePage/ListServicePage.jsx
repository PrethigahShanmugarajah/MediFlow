// MediFlow / Admin / src / components / ListServicePage / ListServicePage.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Calendar,
  Check,
  ChevronDown,
  Edit2,
  Image,
  ImageIcon,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import {
  ampmOptions,
  availabilityOptions,
  buildDaySelectOptions,
  buildMonthSelectOptions,
  buildYearSelectOptions,
  convertSlotsForUI,
  convertSlotsMapToArray,
  daysInMonth,
  findDuplicateInSlots,
  formatDateHuman,
  getTodayISO,
  hourOptions,
  minuteOptions,
  pad2,
  slotsToFormattedStrings,
  sortSlotsForDisplay,
  splitISO,
  validateSlots,
} from "./Services";
import api from "../../api/axios";
import API_ROUTES from "../../api/api_route";
import { toast } from "react-toastify";
import { fetchServiceById, fetchServices } from "../../services/fetch";
import {
  FileInputField,
  InputField,
  SelectInput,
  TextAreaField,
} from "../FormField/FormField";
import DeletePopup from "../DeletePopup/DeletePopup";

const ListServicePage = () => {
  const [services, setServices] = useState([]);
  const [openDetails, setOpenDetails] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("all");
  const [editForm, setEditForm] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const { control, setValue } = useForm();

  const todayISO = getTodayISO();

  const slotDateFieldName = (svcId, slotId) => `slots.${svcId}.${slotId}.date`;

  const baseYear = Number(todayISO.split("-")[0]);
  const monthSelectOptions = buildMonthSelectOptions();
  const yearSelectOptions = buildYearSelectOptions({ baseYear, count: 6 });

  async function loadServices() {
    try {
      const data1 = await fetchServices();

      if (data1?.success) {
        const items = data1?.data || data1?.services || data1?.items || [];

        const normalized = (items || []).map((s) => ({
          id: s._id || s.id,
          name: s.name,
          about: s.about || "",
          instructions: s.instructions || s.preInstructions || [],
          instructionsText: (s.instructions || s.preInstructions || []).join(
            "\n",
          ),
          price: s.price ?? s.fee ?? 0,
          available: s.available ?? s.availability === "Available",
          image: s.image || s.imageUrl || s.imageSrc || s.imageSmall || "",
          slots: Array.isArray(s.slots)
            ? convertSlotsForUI(s.slots)
            : s.slots && typeof s.slots === "object"
              ? convertSlotsMapToArray(s.slots)
              : [],
          _raw: s,
        }));

        setServices(normalized);
      } else {
        setServices([]);
      }
    } catch (error1) {
      setServices([]);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  function toggleDetails(id) {
    setOpenDetails((prev) => ({ [id]: !prev[id] }));
  }

  async function startEdit(service) {
    let latest = service;

    if (service?.id) {
      try {
        const data2 = await fetchServiceById(service.id);

        if (data2?.success) {
          latest = data2.data || data2.service || latest;
        }
      } catch (error2) {
        console.error("Fetch Service Error:", error2);
      }
    }

    const normalized = {
      id: latest?._id || latest?.id,
      name: latest?.name || "",
      about: latest?.about || "",
      instructionsText: (
        latest?.instructions ||
        latest?.preInstructions ||
        []
      ).join("\n"),
      price: latest?.price ?? latest?.fee ?? 0,
      available:
        latest?.available ?? latest?.availability === "Available" ?? true,
      imagePreview: latest?.imageUrl || latest?.image || latest?.imageSrc || "",
      imageFile: null,
      slots: sortSlotsForDisplay(
        Array.isArray(latest?.slots)
          ? convertSlotsForUI(latest.slots)
          : convertSlotsMapToArray(latest?.slots),
      ),
    };

    setEditingId(normalized.id);
    setEditForm(normalized);
    setValue("name", normalized.name);
    setValue("price", String(normalized.price ?? ""));

    setValue(
      `availability.${normalized.id}`,
      normalized.available ? "true" : "false",
    );

    setValue(`about.${normalized.id}`, normalized.about || "");
    setValue(
      `instructionsText.${normalized.id}`,
      normalized.instructionsText || "",
    );

    (normalized.slots || []).forEach((slot) => {
      const iso = slot.date || todayISO;

      const { y, m, d } = splitISO(iso, todayISO);

      setValue(`slots.${normalized.id}.${slot.id}.date`, iso);

      setValue(`slots.${normalized.id}.${slot.id}.day`, d);
      setValue(`slots.${normalized.id}.${slot.id}.month`, m);
      setValue(`slots.${normalized.id}.${slot.id}.year`, y);

      setValue(`slots.${normalized.id}.${slot.id}.hour`, slot.hour || "10");
      setValue(
        `slots.${normalized.id}.${slot.id}.minute`,
        String(slot.minute || "00").padStart(2, "0"),
      );
      setValue(`slots.${normalized.id}.${slot.id}.ampm`, slot.ampm || "AM");
    });

    setOpenDetails({ [normalized.id]: true });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditForm(null);
  }

  async function saveEdit() {
    if (!editForm) return;

    if ((editForm.slots || []).length > 0) {
      const validation = validateSlots(editForm.slots || []);
      if (!validation.valid) {
        toast.error(validation.message);
        return;
      }

      const dupKey = findDuplicateInSlots(editForm.slots || []);
      if (dupKey) {
        const [date, hour, minute, ampm] = dupKey.split("|");
        toast.error(
          `Duplicate slot detected: ${formatDateHuman(date)} — ${hour}:${minute} ${ampm}`,
        );
        return;
      }
    }

    try {
      const fd = new FormData();
      fd.append("name", editForm.name || "");
      fd.append("about", editForm.about || "");
      fd.append("price", String(Number(editForm.price || 0)));
      fd.append(
        "availability",
        editForm.available ? "available" : "unavailable",
      );

      const instructions = (editForm.instructionsText || "")
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);

      fd.append("instructions", JSON.stringify(instructions));

      const slotsFormatted = slotsToFormattedStrings(editForm.slots || []);
      fd.append("slots", JSON.stringify(slotsFormatted));

      if (editForm.imageFile) {
        fd.append("image", editForm.imageFile);
      }

      const response3 = await api.put(
        API_ROUTES.SERVICE.SERVICE_UPDATE(editForm.id),
        fd,
      );

      console.log("Update Service API Response:", response3);
      const data3 = response3.data;

      if (data3?.success) {
        toast.success(data3?.message);
        console.log("Update Service Success:", data3?.message);

        const updatedRaw = data3?.data || data3?.service || null;

        setServices((list) =>
          list.map((s) =>
            s.id === editForm.id
              ? {
                  id: editForm.id,
                  name: editForm.name,
                  about: editForm.about,
                  instructions: instructions,
                  instructionsText: instructions.join("\n"),
                  price: Number(editForm.price) || 0,
                  available: !!editForm.available,
                  image:
                    updatedRaw?.imageUrl ||
                    updatedRaw?.image ||
                    editForm.imagePreview ||
                    s.image,
                  slots:
                    updatedRaw?.slots && Array.isArray(updatedRaw.slots)
                      ? convertSlotsForUI(updatedRaw.slots)
                      : editForm.slots || s.slots,
                  _raw: updatedRaw || s._raw,
                }
              : s,
          ),
        );

        cancelEdit();
      } else {
        toast.warn(data3?.message || "Update service with warning");
        console.warn("Update Service Warning:", data3?.message);
      }
    } catch (error3) {
      toast.error(error3?.response?.data?.message || error3?.message);
      console.error("Update Service Error:", error3);
    }
  }

  function openDeletePopup(service) {
    setDeleteTarget({ id: service.id, name: service.name });
    setShowDelete(true);
  }

  function closeDeletePopup() {
    if (deleteLoading) return;
    setShowDelete(false);
    setDeleteTarget(null);
  }

  async function confirmDeleteService() {
    if (!deleteTarget?.id) return;

    try {
      setDeleteLoading(true);

      const response4 = await api.delete(
        API_ROUTES.SERVICE.SERVICE_DELETE(deleteTarget.id),
      );

      const data4 = response4.data;

      console.log("Delete Service API Response:", response4);

      if (data4?.success) {
        toast.success(data4?.message);
        console.log("Deleet Service Success:", data4?.message);

        setServices((s) => s.filter((x) => x.id !== deleteTarget.id));
        setOpenDetails({});
        closeDeletePopup();
      } else {
        toast.warn(data4?.message || "Delete service with warning");
        console.warn("Delete Service Warning:", data4?.message);
      }
    } catch (error4) {
      toast.error(error4?.response?.data?.message || error4?.message);
      console.error("Delete Service Error:", error4);
    } finally {
      setDeleteLoading(false);
    }
  }

  function addNewSlot() {
    const nextId =
      (editForm.slots?.reduce((a, b) => {
        const idA = Number(String(a.id || "0").replace(/\D/g, "")) || 0;
        const idB = Number(String(b.id || "0").replace(/\D/g, "")) || 0;
        return Math.max(idA, idB);
      }, 0) || 0) + 1;
    const newSlot = {
      id: `s-${nextId}`,
      date: todayISO,
      hour: "10",
      minute: "00",
      ampm: "AM",
    };
    setEditForm((p) => ({ ...p, slots: [...(p.slots || []), newSlot] }));
  }

  function updateSlot(slotId, field, value) {
    setEditForm((p) => {
      if (field === "date" && value) {
        if (value < todayISO) {
          toast.error(
            "Cannot select a past date. Choose today or a future date.",
          );
          return p;
        }
      }

      const newSlots = (p.slots || []).map((s) =>
        s.id === slotId ? { ...s, [field]: value } : s,
      );

      const dupKey = findDuplicateInSlots(newSlots || []);
      if (dupKey) {
        const [date, hour, minute, ampm] = dupKey.split("|");
        toast.error(
          `Duplicate slot detected: ${formatDateHuman(
            date,
          )} — ${hour}:${minute} ${ampm}`,
        );
      }

      return { ...p, slots: newSlots };
    });
  }

  function removeSlot(slotId) {
    setEditForm((p) => ({
      ...p,
      slots: (p.slots || []).filter((s) => s.id !== slotId),
    }));
  }

  const filtered = services
    .filter((s) => s.name.toLowerCase().includes(search.trim().toLowerCase()))
    .filter((s) => {
      if (filterMode === "all") return true;
      if (filterMode === "available") return s.available === true;
      if (filterMode === "unavailable") return s.available === false;
      return true;
    });

  return (
    <div className="p-4 sm:p-6 max-w-6xl font-serif mx-auto min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-white">
      {/* -------- Header -------- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div className="w-full md:w-auto">
          <h1 className="text-2xl md:text-3xl font-extrabold text-indigo-700">
            Services
          </h1>
          <p className="text-sm text-indigo-500 mt-1">
            Manage your services — edit, schedule slots or remove
          </p>
        </div>

        <div className="flex flex-col md:flex-col items-stretch md:items-center gap-3 w-full md:w-auto">
          <div className="w-full sm:w-fit">
            <div className="flex w-full bg-white border border-indigo-100 rounded-full p-1">
              {["all", "available", "unavailable"].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setFilterMode(mode)}
                  className={`flex-1 sm:flex-none px-4 py-1.5 text-sm rounded-full transition whitespace-nowrap ${
                    filterMode === mode
                      ? "bg-indigo-600 text-white"
                      : "text-indigo-700"
                  }`}
                >
                  {mode === "all"
                    ? "All"
                    : mode === "available"
                      ? "Available"
                      : "Unavailable"}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full md:w-auto">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-indigo-300" />
            </div>

            <InputField
              control={control}
              name="search"
              type="text"
              placeholder="Search services..."
              unstyled={false}
              inputClassName="pl-12 md:w-72"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* -------- Grid -------- */}
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((svc) => {
          const isOpen = !!openDetails[svc.id];
          const isEditing = editingId === svc.id;

          return (
            <div
              key={svc.id}
              className="bg-white rounded-2xl overflow-hidden transform transition hover:-translate-y-1 hover:shadow-2xl border border-indigo-50"
            >
              <div
                className="flex flex-col sm:flex-row sm:items-start gap-4 p-4 cursor-pointer"
                onClick={() => toggleDetails(svc.id)}
              >
                <div className="w-full sm:w-20 h-40 sm:h-20 rounded-lg overflow-hidden bg-indigo-50 ring-1 ring-indigo-50 shrink-0">
                  {svc.image ? (
                    <img
                      src={svc.image}
                      alt={svc.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-300">
                      <Image />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-indigo-700 truncate">
                        {svc.name}
                      </h2>
                      <p className="text-sm text-indigo-500 mt-1 line-clamp-2">
                        {svc.about}
                      </p>
                    </div>

                    <div className="text-left sm:text-right mt-2 sm:mt-0">
                      <div className="text-md font-semibold text-indigo-700">
                        LKR {svc.price}
                      </div>
                      <div
                        className={`text-xs mt-1 inline-flex items-center gap-1 px-2 py-1 rounded-full ${
                          svc.available
                            ? "bg-indigo-50 text-indigo-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {svc.available ? (
                          <>
                            <Check className="w-3 h-3" /> Available
                          </>
                        ) : (
                          <>
                            <X className="w-3 h-3" /> Unavailable
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex items-center gap-2 font-bold text-sm text-indigo-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {svc.slots.length} slot{svc.slots.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                <div className="pl-3 self-start sm:self-center">
                  <ChevronDown
                    className={`w-6 h-6 transition-transform ${
                      isOpen ? "rotate-180 text-indigo-400" : "text-indigo-300"
                    }`}
                  />
                </div>
              </div>

              <div
                className={`px-4 pb-4 transition-all ${
                  isOpen ? "block" : "hidden"
                }`}
              >
                {isEditing ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="w-full sm:w-36 h-36 rounded-lg overflow-hidden bg-indigo-50 ring-1 ring-indigo-50 shrink-0">
                        {editForm?.imagePreview ? (
                          <img
                            src={editForm.imagePreview}
                            alt="preview"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-indigo-300">
                            <ImageIcon />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 space-y-2">
                        <InputField
                          control={control}
                          name="name"
                          type="text"
                          inputClassName=""
                          onChange={(e) => {
                            setEditForm((p) => ({
                              ...p,
                              name: e.target.value,
                            }));
                            setValue("name", e.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        />

                        <InputField
                          control={control}
                          name="price"
                          type="number"
                          placeholder="Price"
                          inputClassName=""
                          onChange={(e) => {
                            setEditForm((p) => ({
                              ...p,
                              price: e.target.value,
                            }));
                            setValue("price", e.target.value, {
                              shouldDirty: true,
                              shouldValidate: true,
                            });
                          }}
                        />

                        <div className="mt-1 flex items-center gap-2">
                          <div className="w-full">
                            <SelectInput
                              control={control}
                              name={`availability.${svc.id}`}
                              label="Availability"
                              options={availabilityOptions}
                              selectClassName="w-full"
                              rules={{ required: "Availability is required" }}
                              onChange={(opt) => {
                                const isAvailable = opt?.value === "true";
                                setEditForm((p) => ({
                                  ...p,
                                  available: isAvailable,
                                }));

                                setValue(`availability.${svc.id}`, opt?.value, {
                                  shouldDirty: true,
                                  shouldValidate: true,
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div className="mt-2">
                          <FileInputField
                            control={control}
                            name="image"
                            label="Change image"
                            accept="image/*"
                            className="cursor-pointer"
                            inputClassName="w-full file:px-4 file:py-1 file:text-indigo-700 hover:border-indigo-400"
                            trigger={false}
                            rules={{
                              validate: (files) => {
                                const f = files?.[0];
                                if (!f) return true;
                                if (!f.type?.startsWith("image/"))
                                  return "Only image files are allowed";
                                return true;
                              },
                            }}
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (!f) return;

                              if (
                                editForm?.imagePreview &&
                                editForm.imagePreview.startsWith("blob:")
                              ) {
                                try {
                                  URL.revokeObjectURL(editForm.imagePreview);
                                } catch (err) {}
                              }

                              const url = URL.createObjectURL(f);
                              setEditForm((prev) => ({
                                ...prev,
                                imagePreview: url,
                                imageFile: f,
                              }));
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <TextAreaField
                        control={control}
                        name={`about.${svc.id}`}
                        label="About"
                        rows={3}
                        textareaClassName="min-h-17"
                        rules={{ required: "About is required" }}
                        value={editForm.about}
                        onChange={(e) => {
                          setEditForm((p) => ({ ...p, about: e.target.value }));
                          setValue(`about.${svc.id}`, e.target.value, {
                            shouldDirty: true,
                            shouldValidate: true,
                          });
                        }}
                      />
                    </div>

                    <div>
                      <TextAreaField
                        control={control}
                        name={`instructionsText.${svc.id}`}
                        label="Instructions (one per line)"
                        rows={4}
                        textareaClassName="min-h-20"
                        rules={{
                          required: "Instructions are required",
                        }}
                        value={editForm.instructionsText}
                        onChange={(e) => {
                          setEditForm((p) => ({
                            ...p,
                            instructionsText: e.target.value,
                          }));

                          setValue(
                            `instructionsText.${svc.id}`,
                            e.target.value,
                            {
                              shouldDirty: true,
                              shouldValidate: true,
                            },
                          );
                        }}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-sm text-indigo-600">
                          Slots
                        </label>
                        <button
                          onClick={addNewSlot}
                          type="button"
                          className="inline-flex cursor-pointer items-center gap-2 text-sm px-2 py-1 rounded-full border border-indigo-100"
                        >
                          <Plus className="w-4 h-4" /> Add slot
                        </button>
                      </div>

                      <div className="space-y-2 mt-2">
                        {(editForm.slots || []).map((slot, idx) => {
                          const isLast =
                            idx === (editForm.slots || []).length - 1;

                          const { y, m, d } = splitISO(slot.date, todayISO);
                          const daySelectOptions = buildDaySelectOptions({
                            year: y,
                            month: m,
                          });

                          const setISO = (newY, newM, newD) => {
                            const max = daysInMonth(newY, newM);
                            const safeD = pad2(Math.min(Number(newD), max));
                            const iso = `${newY}-${newM}-${safeD}`;

                            updateSlot(slot.id, "date", iso);
                            setValue(slotDateFieldName(svc.id, slot.id), iso, {
                              shouldValidate: true,
                              shouldDirty: true,
                            });

                            setValue(`slots.${svc.id}.${slot.id}.day`, safeD);
                            setValue(`slots.${svc.id}.${slot.id}.month`, newM);
                            setValue(`slots.${svc.id}.${slot.id}.year`, newY);
                          };

                          return (
                            <div
                              key={slot.id}
                              className={`w-full pb-3 ${isLast ? "" : "border-b border-gray-200"}`}
                            >
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-center w-full">
                                <SelectInput
                                  control={control}
                                  name={`slots.${svc.id}.${slot.id}.day`}
                                  options={daySelectOptions}
                                  placeholder="Day"
                                  selectClassName="w-full"
                                  value={d}
                                  onChange={(opt) =>
                                    setISO(y, m, opt?.value || d)
                                  }
                                />

                                <SelectInput
                                  control={control}
                                  name={`slots.${svc.id}.${slot.id}.month`}
                                  options={monthSelectOptions}
                                  placeholder="Month"
                                  selectClassName="w-full"
                                  value={m}
                                  onChange={(opt) =>
                                    setISO(y, opt?.value || m, d)
                                  }
                                />

                                <SelectInput
                                  control={control}
                                  name={`slots.${svc.id}.${slot.id}.year`}
                                  options={yearSelectOptions}
                                  placeholder="Year"
                                  selectClassName="w-full"
                                  value={y}
                                  onChange={(opt) =>
                                    setISO(opt?.value || y, m, d)
                                  }
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center w-full mt-1.5">
                                <SelectInput
                                  control={control}
                                  name={`slots.${svc.id}.${slot.id}.hour`}
                                  options={hourOptions}
                                  placeholder="Hour"
                                  selectClassName="w-full"
                                  rules={{ required: "Hour is required" }}
                                  onChange={(opt) => {
                                    const value = opt?.value || "";
                                    updateSlot(slot.id, "hour", value);
                                    setValue(
                                      `slots.${svc.id}.${slot.id}.hour`,
                                      value,
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      },
                                    );
                                  }}
                                />

                                <SelectInput
                                  control={control}
                                  name={`slots.${svc.id}.${slot.id}.minute`}
                                  options={minuteOptions}
                                  placeholder="Min"
                                  selectClassName="w-full"
                                  rules={{ required: "Minute is required" }}
                                  onChange={(opt) => {
                                    const value = opt?.value || "";
                                    updateSlot(slot.id, "minute", value);
                                    setValue(
                                      `slots.${svc.id}.${slot.id}.minute`,
                                      value,
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      },
                                    );
                                  }}
                                />

                                <SelectInput
                                  control={control}
                                  name={`slots.${svc.id}.${slot.id}.ampm`}
                                  options={ampmOptions}
                                  placeholder="AM/PM"
                                  selectClassName="w-full"
                                  rules={{ required: "AM/PM is required" }}
                                  onChange={(opt) => {
                                    const value = opt?.value || "";
                                    updateSlot(slot.id, "ampm", value);
                                    setValue(
                                      `slots.${svc.id}.${slot.id}.ampm`,
                                      value,
                                      {
                                        shouldDirty: true,
                                        shouldValidate: true,
                                      },
                                    );
                                  }}
                                />

                                <button
                                  type="button"
                                  onClick={() => removeSlot(slot.id)}
                                  className="p-1 rounded-full border border-rose-500 bg-rose-300 justify-self-end sm:justify-self-auto"
                                >
                                  <X className="text-rose-700" size={20} />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-2 rounded-full bg-rose-600 text-white w-full sm:w-auto"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="px-3 py-2 rounded-full cursor-pointer bg-indigo-600 text-white w-full sm:w-auto"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-md font-bold text-indigo-700">
                        About
                      </h3>
                      <p className="text-md text-indigo-500 mt-1">
                        {svc.about}
                      </p>
                    </div>

                    <div>
                      <h3 className="text-md font-bold text-indigo-700">
                        Instructions
                      </h3>
                      <ul className="list-disc list-inside text-md text-indigo-500 mt-1 space-y-1">
                        {svc.instructions.map((p, i) => (
                          <li key={i}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h3 className="text-md font-bold text-indigo-700">
                        Slots
                      </h3>

                      <div className="mt-2 text-sm text-indigo-600">
                        {svc.slots.length === 0 ? (
                          <div className="text-indigo-300">
                            No slots scheduled
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-2">
                            {sortSlotsForDisplay(svc.slots).map((slot) => (
                              <div
                                key={slot.id}
                                className="flex items-center gap-2 rounded-xl border border-indigo-100 bg-indigo-50 px-3 py-2 font-bold"
                              >
                                <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
                                <span className="truncate">
                                  {formatDateHuman(slot.date)} — {slot.hour}:
                                  {String(slot.minute).padStart(2, "0")}{" "}
                                  {slot.ampm}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                      <button
                        onClick={() => startEdit(svc)}
                        className="inline-flex bg-indigo-200 cursor-pointer items-center gap-2 px-3 py-2 rounded-full border border-indigo-300"
                      >
                        <Edit2 className="w-4 h-4 text-indigo-600" />{" "}
                        <span className="text-indigo-700">Edit</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openDeletePopup(svc);
                        }}
                        className="inline-flex items-center bg-rose-200 cursor-pointer gap-2 px-3 py-2 rounded-full border text-red-600"
                        type="button"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center text-indigo-300 mt-8">
          No services match your search.
        </div>
      )}

      {showDelete && (
        <DeletePopup
          onClose={closeDeletePopup}
          onDelete={confirmDeleteService}
          loading={deleteLoading}
          name={deleteTarget?.name}
          title="Are you sure?"
          message={
            <>
              Do you really want to delete <b>{deleteTarget?.name}</b>? <br />
              This action cannot be undone.
            </>
          }
          confirmText="Delete"
        />
      )}
    </div>
  );
};

export default ListServicePage;
