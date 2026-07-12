# TransitOps — Smart Transport Operations Platform

An end-to-end transport operations platform covering vehicle, driver, dispatch, maintenance, and expense management with enforced business rules and operational analytics.

Built with:
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth
- **Frontend:** React (Vite), React Router, Recharts

## Project Structure

```
transitops/
  backend/     # Express API
  frontend/    # React app
```

## 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env      # edit MONGO_URI / JWT_SECRET if needed
npm run seed               # creates 4 demo users + sample vehicles/drivers
npm run dev                 # starts API on http://localhost:5000
```

Demo logins after seeding (password: `password123`):
| Role | Email |
|---|---|
| Fleet Manager | fleet@transitops.com |
| Driver | driver@transitops.com |
| Safety Officer | safety@transitops.com |
| Financial Analyst | finance@transitops.com |

## 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev                 # starts on http://localhost:5173, proxies /api to :5000
```

Open http://localhost:5173 and log in.

## Roles & Permissions (RBAC)

| Action | Fleet Manager | Driver | Safety Officer | Financial Analyst |
|---|---|---|---|---|
| Manage vehicles | ✅ | view only | view only | view only |
| Manage drivers | ✅ | view only | ✅ | view only |
| Create/dispatch/complete/cancel trips | ✅ | ✅ | view only | view only |
| Log maintenance | ✅ | — | — | — |
| Log fuel | ✅ | ✅ | — | — |
| Log other expenses | ✅ | — | — | ✅ |
| View dashboard/reports | ✅ | ✅ | ✅ | ✅ |

## Business Rules Implemented

- Vehicle registration number is enforced unique.
- Retired / In Shop vehicles are excluded from the dispatch pool.
- Drivers with expired licenses or Suspended status cannot be dispatched.
- A vehicle or driver already On Trip cannot be assigned to a second trip.
- Cargo weight is validated against vehicle max load capacity at both trip creation and dispatch.
- Dispatching a trip sets vehicle + driver to **On Trip**; completing sets them back to **Available**; cancelling a dispatched trip restores **Available**.
- Creating an (open) maintenance record sets the vehicle to **In Shop**; closing it restores **Available** (unless Retired, or another maintenance record is still open).
- Reports compute Fuel Efficiency (distance/fuel), Fleet Utilization, Operational Cost (fuel + maintenance + other expenses), and Vehicle ROI.
- CSV export available from the Reports page.

## Notes / Follow-ups

- **ROI / Revenue:** the spec's ROI formula needs a "Revenue" figure per vehicle, which isn't part of the given data model. The report currently defaults revenue to 0 — add a Revenue/Invoice model and wire it into `backend/routes/reports.js` if you need real ROI numbers.
- **Bonus features not yet built:** PDF export, email reminders for expiring licenses, vehicle document uploads, dark mode. The architecture (Express routes + React pages) is set up so these can be added incrementally.
