# MediBook Mobile App — Expo React Native

A complete healthcare mobile app with **Patient** and **Doctor** portals. Modern UI built with Expo Router, React Query, Zustand, and expo-linear-gradient.

---

## 🚀 Quick Setup

### 1. Install dependencies
```bash
cd medibook/mobile
npm install
```

### 2. Set your backend URL
Edit `src/api/client.ts`:
```ts
// Android Emulator
export const API_BASE = 'http://10.0.2.2:4000/api/v1';

// iOS Simulator
export const API_BASE = 'http://localhost:4000/api/v1';

// Real device (use your machine's local IP)
export const API_BASE = 'http://192.168.1.100:4000/api/v1';
```

### 3. Start the app
```bash
npx expo start

# Android
npx expo start --android

# iOS
npx expo start --ios
```

---

## 📱 App Structure

```
app/
├── index.tsx              ← Splash + redirect
├── _layout.tsx            ← Root layout (QueryClient, SafeArea)
├── (auth)/
│   ├── welcome.tsx        ← Onboarding screen
│   ├── login.tsx          ← Login with demo accounts
│   └── register.tsx       ← Registration
├── (patient)/             ← Patient portal (tab navigation)
│   ├── index.tsx          ← Home dashboard
│   ├── doctors.tsx        ← Find & search doctors
│   ├── appointments.tsx   ← All appointments with status tabs
│   ├── prescriptions.tsx  ← Digital prescriptions + PDF
│   ├── profile.tsx        ← Profile & settings menu
│   ├── appointment-detail.tsx  ← Full appointment details
│   ├── doctor-detail.tsx       ← Doctor profile + slot booking
│   ├── favorites.tsx           ← Favorite doctors
│   ├── payments.tsx            ← Payment history + receipts
│   ├── family.tsx              ← Family members CRUD
│   ├── notifications.tsx       ← All notifications
│   ├── edit-profile.tsx        ← Edit personal info
│   └── change-password.tsx     ← Change password
└── (doctor)/              ← Doctor portal (teal tab navigation)
    ├── index.tsx          ← Doctor home dashboard
    ├── appointments.tsx   ← Schedule with date filter
    ├── patients.tsx       ← All patients grid
    ├── slots.tsx          ← Manage time slots
    ├── profile.tsx        ← Doctor profile menu
    ├── appointment-detail.tsx  ← Details + vitals recording
    ├── patient-detail.tsx      ← Patient history + Rx
    ├── write-prescription.tsx  ← RxNorm drug search + create/edit
    ├── earnings.tsx            ← Revenue dashboard
    ├── notifications.tsx       ← Notifications
    ├── reviews.tsx             ← Patient reviews + rating
    ├── edit-profile.tsx        ← Edit doctor profile
    └── change-password.tsx     ← Change password
```

---

## 🎨 Design System

- **Colors:** Brand blue (`#1e6fe8`), Teal (`#02c9b3`), Dark (`#0f172a`)
- **Fonts:** System font with weights 400–900
- **Radius:** Consistent `Radius.xl` (20px), `Radius['2xl']` (24px)
- **Shadows:** `Shadow.sm`, `Shadow.md`, `Shadow.brand`, `Shadow.teal`
- **Gradients:** Brand (`#1e6fe8` → `#02c9b3`), Dark (`#0f172a` → `#1e293b`)

---

## 🔐 Demo Accounts

| Role    | Email             | Password   |
|---------|-------------------|------------|
| Patient | user@demo.com     | User@123   |
| Doctor  | doctor@demo.com   | Doctor@123 |

---

## 📦 Key Packages

| Package                      | Usage                        |
|------------------------------|------------------------------|
| `expo-router`                | File-based navigation        |
| `@tanstack/react-query`      | Server state management      |
| `zustand`                    | Auth state + SecureStore     |
| `expo-linear-gradient`       | Gradient backgrounds/buttons |
| `expo-secure-store`          | JWT token storage            |
| `expo-blur`                  | iOS tab bar blur effect      |
| `expo-haptics`               | Tactile feedback             |
| `@expo/vector-icons`         | Ionicons throughout          |
| `react-native-toast-message` | Success/error toasts         |
| `date-fns`                   | Date formatting              |
| `axios`                      | HTTP client with interceptors|

---

## ✅ Features

### Patient Portal
- 🏠 Home dashboard with stats, upcoming appointments, specialities, top doctors
- 🔍 Doctor search with speciality filters, sort by rating/fee/experience
- 📅 Book appointments with date picker + real-time slot availability
- ❤️ Favorite doctors with add/remove
- 📋 View digital prescriptions with PDF download (via RxNorm API)
- 💊 Medicine details with dosage, timing, duration, instructions
- 💳 Payment history with receipt viewing
- 👨‍👩‍👧 Family member management (add/delete multiple patients)
- 🔔 Real-time notifications
- 👤 Profile edit + password change

### Doctor Portal
- 🏠 Dashboard with today's schedule, stats, quick actions
- 📅 Appointment schedule with date filter + status tabs + "Today" button
- 👥 Patient list with search + medical history view
- ⏰ Slot management — add multiple windows per day (e.g., 10am–1pm + 4pm–6pm)
- 🩺 Record/update vitals for any patient (6 fields: temp, BP, HR, weight, height, SpO2)
- 💊 Write prescriptions with **RxNorm API** drug autocomplete
- 📝 Edit prescriptions (full update with medicine changes)
- 💰 Earnings dashboard with monthly breakdown
- ⭐ Reviews and ratings
- ✅ Confirm / mark appointments as completed
- 🔔 Notifications management

---

## 🔌 Backend API Required

Make sure your MediBook backend is running on port 4000.

Backend setup:
```bash
cd medibook/backend
npm install
cp .env.example .env  # Configure DATABASE_URL etc.
npx prisma db push
npx ts-node prisma/seed.ts
npm run start:dev
```
