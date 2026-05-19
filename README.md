# Appointment Scheduler Monorepo

Welcome to the Appointment Scheduler monorepo. This workspace contains the scheduling core package and a demo web application demonstrating its features.

## 📂 Workspace Structure

* **`packages/react-easy-appointments`**: The core npm library containing the flexible compound-component calendar, styling files, testing suites, and components (`Calendar`, `WeekView`, `MonthView`, `BookingModal`, and `AdminPanel`).
* **`apps/web`**: A lightweight React SPA built with Vite and Tailwind CSS v4 that consumes the local package and provides dark mode switching, user swappers, and responsive scheduling.

---

## 🚀 Quick Start (Development)

This repository uses **pnpm** and workspaces.

### 1. Install Dependencies
Install dependencies from the root directory:
```bash
pnpm install
```

### 2. Run Local Development Server
Start both the package build watcher and the web app dev server concurrently:
```bash
pnpm dev
```
Open your browser and navigate to `http://localhost:5173/` (or the port shown in your terminal).

### 3. Run Test Suite
To run all unit and integration tests inside the package:
```bash
pnpm test
```

### 4. Build Workspace
Build both the package distribution bundles and the production client bundle of the web app:
```bash
pnpm build
```

---

## 📦 Package Release & Deployment

Refer to the package README at [`packages/react-easy-appointments/README.md`](./packages/react-easy-appointments/README.md) for detailed APIs, headless integrations, and custom BEM/CSS variable overrides.

## License

MIT License.
