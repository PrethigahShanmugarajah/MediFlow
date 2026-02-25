// MediFlow / Admin / src / pages / ListServices / Service / ListServicesService.jsx
import { fetchServiceByID, fetchServices } from "../../../services/fetch";
import { deleteService, updateService } from "../../../services/mutations";
import {
  applyUpdatedServiceToList,
  buildEditStateFromLatest,
  buildUpdatePayloadFromEditForm,
  normalizeServicesList,
} from "../../../utils/listServicesUtils";

export async function loadServicesList(setServices) {
  try {
    const body = await fetchServices();
    const items = (body && (body.data || body.services || body.items)) || [];
    setServices(normalizeServicesList(items));
  } catch (error) {
    setServices([]);
  }
}

export async function startEditService(
  service,
  setEditingId,
  setEditForm,
  setOpenDetails,
) {
  let latest = service;

  if (service?.id) {
    try {
      const body = await fetchServiceByID(service.id);
      latest = body?.data || body?.service || latest;
    } catch (error) {}
  }

  const normalized = buildEditStateFromLatest(latest);

  setEditingId(normalized.id);
  setEditForm(normalized);
  setOpenDetails({ [normalized.id]: true });
}

export async function saveEditedService(editForm, setServices, cancelEdit) {
  if (!editForm) return;

  try {
    const { id, fd, instructions } = buildUpdatePayloadFromEditForm(editForm);

    const body = await updateService(id, fd);
    if (!body?.success) return;

    const updatedRaw = body?.data || body?.service || null;

    setServices((list) =>
      applyUpdatedServiceToList(list, id, editForm, updatedRaw, instructions),
    );

    cancelEdit();
  } catch (error) {}
}

export async function removeServiceById(id, setServices, setOpenDetails) {
  if (!id) return;

  try {
    const body = await deleteService(id);
    if (!body?.success) return;

    setServices((s) => s.filter((x) => x.id !== id));
    setOpenDetails({});
  } catch (error) {}
}
