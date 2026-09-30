# 🛡️ Harvest International School - IT Asset Management System

A full-stack IT Asset Management (ITAM) web application designed to track, assign, and manage school hardware inventory (laptops, tablets, desktops, and accessories) across staff and departments.

---

## 🚀 Key Features

- **🔐 Secure Admin Authentication**: JWT-based authentication with bcrypt password hashing.
- **📊 Real-time Dashboard**: Overview of key inventory metrics (Total, Available, Assigned, Under Repair) and recent assignment activity.
- **💻 Asset Inventory Management**: 
  - Track devices by **Asset Tag** and **Serial Number**.
  - Search and filter hardware by type and status.
  - Add, edit, view details, and safely delete unassigned assets.
  - Export current hardware inventory to **CSV**.
- **👨‍🏫 Staff Directory & Custody Tracking**:
  - View staff members and equipment currently in their custody.
  - Full historical log of all past device checkouts and returns per staff member.
- **🔄 Equipment Checkout & Return Workflow**:
  - Assign available assets to staff with automatic status updates.
  - Process asset returns with state transitions (`available`, `under_repair`, `maintenance`).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Data Export**: PapaParse

### Backend
- **Runtime**: Node.js
- **Framework**: Express (v5)
- **Database**: MySQL + Sequelize ORM
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`

---

## 📁 Project Structure

```text
assetmanagment/
├── backend/
│   ├── src/
│   │   ├── config/          # Sequelize database connection setup
│   │   ├── controller/      # Express request handlers for Assets, Staff, Assignments, Users
│   │   ├── middleware/      # JWT authentication middleware
│   │   ├── models/          # Sequelize models (Asset, Staff, AssetAssignment, Users)
│   │   ├── routes/          # Express route definitions
│   │   └── validation/      # Request payload validation scripts
│   └── .env                 # Environment variables (DB credentials, JWT Secret)
└── frontend/
    ├── src/
    │   ├── api/             # Fetch client & HTTP wrapper
    │   ├── components/      # Reusable UI components (Sidebar, Navbar, Button, Input, Select, etc.)
    │   ├── context/         # AuthContext for global authentication state
    │   ├── pages/           # Dashboard, Assets, Staff, Assignments, Detail & Edit pages
    │   └── routes/          # Protected & public application routing
    └── vite.config.js       # Vite configuration with React & Tailwind CSS plugins
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- MySQL Server (v8+)

### 1. Backend Setup

1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=8080
   DB_NAME=itam
   DB_USER=root
   DB_PASSWORD=your_mysql_password
   DB_HOST=localhost
   DB_PORT=3306
   JWT_SECRET=your_jwt_secret_key
   ```
4. Create the MySQL database:
   ```sql
   CREATE DATABASE itam;
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The server will automatically connect, synchronize database tables, and seed the default admin account (`admin@harvest.in` / `Test@123`).*

### 2. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Verification Commands

To run linting and production build checks on the frontend:

```bash
cd frontend
npm run lint
npm run build
```

---
