# 🏥 MediFlow

[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6-green?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4-lightgrey?logo=express)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-UI-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![Clerk](https://img.shields.io/badge/Clerk-Authentication-purple)](https://clerk.com/)

---

# 🏥 About MediFlow

**MediFlow** is a full-stack **Hospital Management System (HMS)** built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js).**

It provides a digital healthcare platform where **patients, doctors, and administrators** can efficiently manage hospital workflows.

The system allows patients to book appointments, doctors to manage schedules, and administrators to control services, doctors, and overall hospital operations.

This project simulates a **real-world hospital management platform**, focusing on:

- Modern and responsive healthcare UI
- Real-time appointment scheduling
- Secure authentication
- Doctor and service management
- Patient record handling

A **portfolio-ready full-stack healthcare application.**

---

# ✨ Features

## 👤 Patient Features

- Browse doctors
- View doctor profiles and specialities
- Book doctor appointments
- Book medical services
- View appointment history
- Track appointment status
- Responsive modern UI
- Secure authentication using **Clerk**

---

## 👨‍⚕️ Doctor Features

- Doctor dashboard
- Manage doctor profile
- Set availability schedule
- View patient appointments
- Update appointment status
- Manage consultation schedules

---

## 🛠 Admin Features

- Admin dashboard
- Add and manage doctors
- Manage hospital services
- Manage appointments
- Upload doctor and service images
- View hospital statistics
- Manage system data

---

# 🛠️ Technologies Used

## Frontend

- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Toastify
- Clerk Authentication

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- REST APIs
- JWT Authentication
- Cloudinary (Image Upload)

---

# 📸 Screenshots

## 👤 Client (Patient Side)

### Home

![Home](./ScreenShorts/Client/Home.png)

### Doctors

![Doctors](./ScreenShorts/Client/Doctors.png)

### Doctor Detail

![Doctor Detail](./ScreenShorts/Client/Doctor_Detail.png)

### Services

![Services](./ScreenShorts/Client/Services.png)

### Service Detail

![Service Detail](./ScreenShorts/Client/Service_Detail.png)

### Appointments

![Appointments](./ScreenShorts/Client/Appointments.png)

### Contact

![Contact](./ScreenShorts/Client/Contact.png)

---

## 👨‍⚕️ Doctor Panel

### Doctor Dashboard

![Doctor Dashboard](./ScreenShorts/Doctor/Doctor_Dashboard.png)

### Doctor Appointments

![Doctor Appointments](./ScreenShorts/Doctor/Doctor_Appointments.png)

### Edit Profile

![Edit Profile](./ScreenShorts/Doctor/Edit_Profile.png)

---

## 🛠 Admin Panel

### Hero

![Hero](./ScreenShorts/Admin/Hero.png)

### Dashboard

![Dashboard](./ScreenShorts/Admin/Dashboard.png)

### Add Doctor

![Add Doctor](./ScreenShorts/Admin/Add_Doctor.png)

### List Doctors

![List Doctors](./ScreenShorts/Admin/List_Doctors.png)

### Appointments

![Appointments](./ScreenShorts/Admin/Appointments.png)

### Service Dashboard

![Service Dashboard](./ScreenShorts/Admin/Service_Dashboard.png)

### Add Service

![Add Service](./ScreenShorts/Admin/Add_Service.png)

### List Services

![List Services](./ScreenShorts/Admin/List_Services.png)

### Service Appointments

![Service Appointments](./ScreenShorts/Admin/Service_Appointments.png)

---

# ⚙️ How to Run the Project

## 1️⃣ Clone Repository

```bash
git clone https://github.com/PrethigahShanmugarajah/MediFlow.git
cd MediFlow
```

---

## 2️⃣ Backend Setup (Server)

```bash
cd Server
npm install
npm run server
```

---

## 3️⃣ Client Setup (Patient & Doctor)

```bash
cd Client
npm install
npm run dev
```

---

## 4️⃣ Admin Panel Setup

```bash
cd Admin
npm install
npm run dev
```

---

# 🔑 Environment Variables

## 📂 Server (.env)

```
PORT=
CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
MONGODB_URL=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
JWT_SECRET=
JWT_EXPIRES_IN=
STRIPE_SECRET_KEY=
FRONTEND_URL=
ADMIN_URL=
```

---

## 📂 Client (.env)

```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_STORAGE_KEY=
VITE_BASEURL=
VITE_EMERGENCY_PHONE=
VITE_PHONE=
VITE_EMAIL=
VITE_LOCATION=
VITE_CLIENT=
VITE_ADMIN=
VITE_LINK=
VITE_CURRENCY=
VITE_WHATSAPP_PHONE=
VITE_CLINIC_HOURS_TEXT=
VITE_MAP_IFRAME_SRC=
```

---

## 📂 Admin (.env)

```
VITE_CLERK_PUBLISHABLE_KEY=
VITE_BASEURL=
VITE_CURRENCY=
```

---

# 👨‍💻 Author

**Prethigah Shanmugarajah (2020/2021)** <br>
Department of Software Engineering <br>
Faculty of Computing <br>
Sabaragamuwa University of Sri Lanka

---
