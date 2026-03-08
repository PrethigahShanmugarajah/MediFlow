import { NoImage, NoPersonImage } from "../../assets";

/* -------- Pad a number with leading zero -------- */
export function pad(n) {
  return String(n ?? 0).padStart(2, "0");
}

/* -------- Build appointment time string -------- */
export function buildTimeString(item) {
  let time = item.time || "";

  if (!time) {
    if (item.hour !== undefined && item.minute !== undefined && item.ampm) {
      time = `${item.hour}:${pad(item.minute)} ${item.ampm}`;
    } else if (item.hour !== undefined && item.ampm) {
      time = `${item.hour}:00 ${item.ampm}`;
    }
  }

  return time;
}

/* -------- Get payment method from appointment -------- */
export function getPaymentMethod(item) {
  return (item.payment && item.payment.method) || "Cash";
}

/* -------- Get basic appointment status -------- */
export function getAppointmentStatus(item) {
  return (
    item.status ||
    (item.payment && item.payment.status === "Paid" ? "Confirmed" : "Pending")
  );
}

/* -------- Convert date + time string to JS Date -------- */
export function parseDateTime(dateStr, timeStr) {
  const fast = new Date(`${dateStr} ${timeStr}`);
  if (!isNaN(fast)) return fast;

  const parts = (dateStr || "").split(" ");
  if (parts.length === 3) {
    const [d, m, y] = parts;
    const months = {
      Jan: 0,
      Feb: 1,
      Mar: 2,
      Apr: 3,
      May: 4,
      Jun: 5,
      Jul: 6,
      Aug: 7,
      Sep: 8,
      Oct: 9,
      Nov: 10,
      Dec: 11,
    };
    const month = months[m];
    let [t, ampm] = (timeStr || "").split(" ");
    let [hh, mm] = (t || "0:00").split(":");
    hh = Number(hh || 0);
    mm = Number(mm || 0);

    if (ampm === "PM" && hh !== 12) hh += 12;
    if (ampm === "AM" && hh === 12) hh = 0;

    return new Date(Number(y), month, Number(d), hh, mm);
  }

  const iso = new Date(dateStr);
  if (!isNaN(iso)) return iso;
  return new Date();
}

/* -------- Decide status of appointment -------- */
export function computeStatus(item) {
  const now = new Date();
  if (!item) return "Pending";

  if (item.status === "Canceled") return "Canceled";
  if (item.status === "Rescheduled") {
    if (
      item.rescheduledTo &&
      item.rescheduledTo.date &&
      item.rescheduledTo.time
    ) {
      const dt = parseDateTime(
        item.rescheduledTo.date,
        item.rescheduledTo.time,
      );
      if (now >= dt) return "Completed";
    }
    return "Rescheduled";
  }
  if (item.status === "Completed") return "Completed";
  if (item.status === "Confirmed") {
    const dtConfirmed = parseDateTime(item.date, item.time);
    if (now >= dtConfirmed) return "Completed";
    return "Confirmed";
  }
  if (item.status === "Pending") {
    const dtPending = parseDateTime(item.date, item.time);
    if (now >= dtPending) return "Completed";
    return "Pending";
  }

  const dt = parseDateTime(item.date, item.time);
  if (now >= dt) return "Completed";
  return item.confirmed ? "Confirmed" : "Pending";
}

/* -------- Convert rescheduled info to uniform format  -------- */
export function normalizeRescheduled(rt) {
  if (!rt) return null;

  if (rt.date && rt.time) {
    return {
      date: rt.date,
      time: rt.time,
    };
  }

  if (
    rt.date &&
    (rt.hour !== undefined || rt.minute !== undefined || rt.ampm)
  ) {
    const hour = rt.hour ?? 0;
    const minute = rt.minute ?? 0;
    const ampm = rt.ampm ?? "";

    return {
      date: rt.date,
      time: `${hour}:${pad(minute)} ${ampm}`,
    };
  }

  return {
    date: rt.date || rt.dateString || "",
    time:
      rt.time ||
      (rt.hour !== undefined
        ? `${rt.hour}:${pad(rt.minute || 0)} ${rt.ampm || ""}`
        : rt.timeString || ""),
  };
}

/* -------- Map raw doctor appointment to uniform object -------- */
export function mapDoctorAppointment(a) {
  const id = a._id || a.id || String(a._id || "");
  const doctorObj =
    typeof a.doctorId === "object" && a.doctorId ? a.doctorId : {};

  const image =
    doctorObj.imageUrl ||
    doctorObj.image ||
    doctorObj.avatar ||
    a.doctorImage?.url ||
    a.doctorImage ||
    NoPersonImage;

  const doctorName =
    (doctorObj.name && String(doctorObj.name).trim()) ||
    (a.doctorName && String(a.doctorName).trim()) ||
    (a.doctor && String(a.doctor).trim()) ||
    (a.patientName && String(a.patientName).trim()) ||
    "Doctor";

  return {
    id,
    image,
    doctor: doctorName,
    patientName: a.patientName || a.patient || "Patient",
    specialization:
      doctorObj.specialization || a.specialization || a.speciality || "",
    experience: doctorObj.experience || a.experience || "",
    date: a.date || "",
    time: buildTimeString(a),
    payment: getPaymentMethod(a),
    status: getAppointmentStatus(a),
    rescheduledTo: normalizeRescheduled(
      a.rescheduledTo || {
        date: a.rescheduledDate,
        time: a.rescheduledTime,
      },
    ),
  };
}

/* -------- Map raw service appointment to uniform object -------- */
export function mapServiceAppointment(s) {
  const id = s._id || s.id || String(s._id || "");
  const svc = typeof s.serviceId === "object" && s.serviceId ? s.serviceId : {};

  const image =
    svc.imageUrl ||
    svc.image ||
    svc.imageSmall ||
    s.serviceImage?.url ||
    s.serviceImage ||
    NoImage;

  return {
    id,
    image,
    name: s.serviceName || svc.name || svc.title || "Service",
    patientName: s.patientName || s.patient || "Patient",
    price: s.fees ?? s.amount ?? s.price ?? 0,
    date: s.date || "",
    time: buildTimeString(s),
    payment: getPaymentMethod(s),
    status: getAppointmentStatus(s),
    rescheduledTo:
      getAppointmentStatus(s) === "Rescheduled"
        ? normalizeRescheduled({
            date: s.rescheduledTo?.date || s.rescheduledDate || s.date,
            time: s.rescheduledTo?.time,
            hour: s.rescheduledTo?.hour ?? s.hour,
            minute: s.rescheduledTo?.minute ?? s.minute,
            ampm: s.rescheduledTo?.ampm ?? s.ampm,
          })
        : normalizeRescheduled(s.rescheduledTo || null),
  };
}

/* -------- Get appointments array from API response -------- */
export function getAppointmentsArray(data) {
  const fetched = data?.appointments ?? data?.data ?? data ?? [];
  return Array.isArray(fetched) ? fetched : [];
}

/* -------- Filter only doctor appointments -------- */
export function filterDoctorAppointments(arr) {
  return arr.filter((a) => {
    return (
      (a.doctorId !== undefined && a.doctorId !== null) ||
      !!a.doctorName ||
      !a.serviceId
    );
  });
}
