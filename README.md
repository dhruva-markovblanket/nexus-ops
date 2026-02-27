<div align="center">
  <img src="./frontend/public/vite.svg" alt="Nexus Ops Enterprise" width="120" />
</div>

<h1 align="center">Nexus Ops Enterprise</h1>

<p align="center">
  <strong>A premium, 3D-accelerated, dark-mode B2B university management ecosystem.</strong><br>
  Built with React 19, Vite, Prisma ORM, standard JWT Authentication, and WebGL Three.js Topology mapping.
</p>

## Architecture & Tech Stack

This project uses a separated Frontend/Backend microservice configuration.

**Frontend:**
- **Framework:** React 19 + Vite + React Router DOM v7
- **Styling:** Tailwind CSS (Dark Glassmorphism UI)
- **State Management:** Zustand
- **API Fetching:** Axios (with Interceptors & Auth Tokens)
- **Visualizations:** Recharts (Data) + `@react-three/fiber` & `@react-three/drei` (3D Interactive Campuses)
- **Animations:** Framer Motion

**Backend:**
- **Server:** Node.js + Express
- **Database:** SQLite (Embedded, zero-config)
- **ORM:** Prisma v5.22.0
- **Security:** Helmet (Headers), Express-Rate-Limit (DDoS protection), JWT, BcryptJS

---

## Installation & Setup

### Prerequisites
- Node.js (v18+ recommended)
- NPM or Pnpm

### 1. Database & Backend Configuration

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Database & Prisma Schema:**
   The SQLite database will be generated automatically. Push the schema:
   ```bash
   npx prisma db push
   ```

3. **Seed the Database:**
   This populates the platform with 3 departments, 15 teachers, 90 students, and dummy courses, assignments, and audit logs.
   ```bash
   node prisma/seed.js
   ```

4. **Environment Variables:**
   Create a `.env` file in the `backend/` directory (already created locally if you used the AI):
   ```env
   PORT=4000
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="nexus_super_secret_key_2026_xyz"
   FRONTEND_URL="http://localhost:5173"
   ```

5. **Start the API Server:**
   ```bash
   npm run dev
   # Server runs on http://localhost:4000
   ```

### 2. Frontend Configuration

Open a **new** terminal window and navigate to the frontend directory:
```bash
cd frontend
```

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Variables:**
   Create a `.env` file in the `frontend/` directory (already created locally via AI):
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

3. **Start the Vite Dev Server:**
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

---

## Test Accounts (Seeded Data)

The `seed.js` script creates standardized test users for immediate testing.
*All accounts use the password: `password123`*

### Admin Portal
- **Email:** `admin@nexus.edu`
- **Role:** Full Access (Security Logs, Announcements, Users, Departments)

### Teacher Portals
- **Email:** `teacherX@nexus.edu` *(Where X is 1 through 15)*
- **Role:** Faculty Access (Gradebooks, Attendance, Course Syllabi, Assignments)

### Student Portals
- **Email:** `studentY@nexus.edu` *(Where Y is 1 through 90)*
- **Role:** Student Access (Timetables, 3D Campus Maps, Grade Transcripts, Submissions)

---

## High-Level Capabilities

* **3D Security Logging:** Admins view a live 3D web-traffic map parsing server nodes against IP threat levels.
* **3D Campus Navigation:** Students navigate an isometric 3D rendering of the university campus using `@react-three/drei`.
* **Deep Architectural Routing:** Nested URL layouts (`/student/:tab`, `/teacher/:tab`) mapped directly to React Suspense modules preventing unnecessary core re-renders.
* **Axios Vault:** Tokenized network intercepts blocking 401s globally via Zustand validation.

---

> _"Developed for high-grade visual integrity and zero-friction database interactions via Prisma."_
