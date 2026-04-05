# EduNest ERP — Multi-Tenant Auth Rebuild

## Current State
- All 6 dashboards exist: Student, Teacher, Fee Manager, Principal, Admin, Super Admin
- Hard-coded seed data in `seedData.ts` (students, teachers, Aravali Institute, etc.)
- Quick Demo login buttons on the login page bypass real auth
- Auth context uses in-memory mock users seeded at boot
- No real password management hierarchy
- No real college isolation — all data visible to all admins
- Backend (main.mo) has basic structure but auth is frontend-mocked

## Requested Changes (Diff)

### Add
- Super Admin account hardcoded with credentials: ID=`vikassirvi77288`, email=`vikassirvi001@gmail.com`, password=`vikas@sirvi_77288`
- Super Admin can create colleges (tenants) — each college has: name, code, address, logo, createdAt
- Super Admin can create Admin accounts and assign them to a college, setting their password
- Admin can create users (Student, Teacher, Fee Manager, Principal) within their own college, setting their passwords
- Strict data isolation: each user only sees data belonging to their `collegeId`
- Password management UI: Super Admin → sets Admin passwords; Admin → sets passwords for all roles in their college
- Login page: Username/ID + Password (no Quick Demo buttons)
- Backend Motoko: persistent storage of colleges, users, with collegeId-based isolation
- Role-based routing: each role goes to their own dashboard after login

### Modify
- Login page: remove all Quick Demo buttons, remove self-registration toggle, use single login form
- AuthContext: replace mock seed data with backend-driven auth (call Motoko canister)
- seedData.ts: remove all hardcoded demo data
- Super Admin Dashboard: replace demo data with real college/admin management UI
- Admin Dashboard: replace demo data with real user management UI scoped to their collegeId
- All dashboards: data must be filtered by collegeId of the logged-in user
- Footer: "© 2026. Made by Vikas Sirvi"

### Remove
- All Quick Demo login buttons
- All hardcoded seed data (students, teachers, fee records, Aravali Institute data)
- Self-registration toggle from admin panel (keep as future stub only)
- StudentRegistrationForm public page (keep as stub if needed)

## Implementation Plan

1. **Backend (Motoko)**
   - Persistent storage: `colleges: HashMap<CollegeId, College>`, `users: HashMap<UserId, User>`
   - User record: `{ id, username, email, passwordHash, role, collegeId, createdBy, createdAt }`
   - College record: `{ id, name, code, address, status, createdAt }`
   - Bootstrap Super Admin on first deploy with fixed credentials
   - Auth APIs: `login(username, password) -> Result<Session, Text>`, `logout()`
   - College APIs (Super Admin only): `createCollege(...)`, `listColleges()`, `getCollege(id)`
   - User APIs: `createUser(...)` — Super Admin creates Admins; Admin creates their college's users
   - Data isolation: every query filters by caller's `collegeId`
   - Student/Teacher/Fee/Principal data APIs scoped to `collegeId`

2. **Frontend**
   - Login page: single form — username/email + password, no demo buttons
   - AuthContext: calls backend `login()`, stores session token + role + collegeId in localStorage
   - Super Admin Dashboard:
     - Colleges tab: list colleges, "Add College" form
     - Admins tab: list admins per college, "Add Admin" form (set email + password)
   - Admin Dashboard:
     - Users tab: list students/teachers/fee managers/principals for their college
     - "Add User" form with role selector + password field
     - All data strictly filtered by own collegeId
   - Other dashboards (Student, Teacher, Fee Manager, Principal): empty state when no data, no seed data
   - Remove seedData.ts imports everywhere
   - All dashboard data calls include collegeId from auth context
