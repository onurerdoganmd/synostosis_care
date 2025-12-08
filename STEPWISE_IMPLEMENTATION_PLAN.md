# Stepwise Implementation Plan
## Optimized for Claude.ai Pro

This plan breaks down the craniosynostosis tracking system into **small, manageable phases** that can be completed one at a time without discordance. Each phase is:

✅ **Self-contained** - Can be completed in a single session
✅ **Testable** - Has clear acceptance criteria
✅ **Committable** - Produces working code at the end
✅ **Independent** - Minimal dependencies on future phases

---

## 🎯 How to Use This Plan

### For Each Phase:
1. **Start a new Claude session** (or continue in the same one)
2. **Tell Claude**: "Implement Phase X: [Phase Name]"
3. **Claude will**:
   - Create/modify necessary files
   - Provide code with explanations
   - Test the implementation
   - Commit the working code
4. **You verify** it works as expected
5. **Move to next phase**

### Progress Tracking
Mark completed phases with ✅ as you go:
- [ ] Phase 0: Project Setup
- [ ] Phase 1: Database & Auth Foundation
- [ ] Phase 2: Patient Backend API
- ...and so on

---

## 📋 Phase Overview

| Phase | Focus | Time | Files Created | Testable Output |
|-------|-------|------|---------------|-----------------|
| 0 | Project Setup | 30min | Setup scripts, configs | Server runs |
| 1 | Database & Auth | 1-2h | Schema, auth system | Login works |
| 2 | Patient Backend | 1h | Patient CRUD API | API endpoints work |
| 3 | Patient Frontend | 1-2h | Patient UI components | Can add/view patients |
| 4 | Diagnosis Module | 1h | Diagnosis backend/frontend | Can record diagnosis |
| 5 | Measurements Module | 1h | Measurements system | Can track measurements |
| 6 | Surgery Backend | 1h | Surgery API | Surgery CRUD works |
| 7 | Surgery Frontend | 1-2h | Surgery UI | Can record surgeries |
| 8 | Post-op Module | 1h | Post-op tracking | Can track recovery |
| 9 | Follow-up Module | 1-2h | Follow-up system | Can schedule/track |
| 10 | Image Management | 1-2h | Upload & viewer | Can upload images |
| 11 | Dashboard | 1-2h | Analytics dashboard | See statistics |
| 12 | Reports & Export | 1h | Export functionality | Can export data |

**Total Estimated Time**: 14-20 hours of development across 12 focused sessions

---

## Phase 0: Project Setup & Infrastructure
**Duration**: 30 minutes
**Goal**: Create project structure and verify everything runs

### What Gets Built:
```
synostosis_care/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env
│   └── src/index.ts (basic server)
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── src/App.tsx
└── docker-compose.yml (optional)
```

### Tasks:
1. Initialize backend (Node.js + Express + TypeScript)
2. Initialize frontend (React + TypeScript + Vite)
3. Configure Tailwind CSS
4. Setup environment variables
5. Create basic "Hello World" server
6. Create basic "Hello World" frontend
7. Verify both start without errors

### Acceptance Criteria:
- ✅ `cd backend && npm run dev` starts server on port 5000
- ✅ `cd frontend && npm run dev` starts UI on port 5173
- ✅ Health check endpoint returns 200 OK
- ✅ Frontend displays without errors

### Commit Message:
```
feat: initial project setup with backend and frontend structure

- Initialize Node.js backend with Express and TypeScript
- Initialize React frontend with Vite and TypeScript
- Configure Tailwind CSS for styling
- Add basic health check endpoint
- Verify development servers run successfully
```

---

## Phase 1: Database Schema & Authentication System
**Duration**: 1-2 hours
**Goal**: Complete database with working login system

### What Gets Built:
```
backend/
├── prisma/
│   └── schema.prisma (complete schema - all 10 tables)
├── src/
│   ├── controllers/
│   │   └── auth.controller.ts
│   ├── middleware/
│   │   └── auth.middleware.ts
│   ├── routes/
│   │   └── auth.routes.ts
│   └── utils/
│       └── jwt.utils.ts
```

### Tasks:
1. Install Prisma and PostgreSQL
2. Create complete database schema (all tables from master plan)
3. Run migrations
4. Implement user registration endpoint
5. Implement login endpoint (JWT)
6. Implement authentication middleware
7. Create first admin user script
8. Test login flow

### Database Tables Created:
- users
- patients
- diagnoses
- measurements
- surgeries
- postop_courses
- followups
- images
- audit_logs

### API Endpoints Created:
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login and get JWT token
- `POST /api/v1/auth/refresh` - Refresh access token
- `GET /api/v1/auth/me` - Get current user info

### Acceptance Criteria:
- ✅ Database created with all tables
- ✅ Can register a new user via API
- ✅ Can login and receive JWT token
- ✅ Protected routes require valid token
- ✅ Default admin user exists (username: admin, password: admin123)

### Test Commands:
```bash
# Register user
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"test123","role":"surgeon"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Commit Message:
```
feat: implement complete database schema and authentication system

- Add Prisma schema with all 10 tables for craniosynostosis tracking
- Implement JWT-based authentication with refresh tokens
- Add user registration and login endpoints
- Create authentication middleware for protected routes
- Add script to create default admin user
- Set up PostgreSQL database with migrations
```

---

## Phase 2: Patient Backend API (CRUD)
**Duration**: 1 hour
**Goal**: Complete patient management API

### What Gets Built:
```
backend/src/
├── controllers/
│   └── patient.controller.ts
├── routes/
│   └── patient.routes.ts
├── services/
│   └── patient.service.ts
└── validators/
    └── patient.validator.ts
```

### Tasks:
1. Create patient controller with CRUD operations
2. Create patient service layer (business logic)
3. Add input validation with Zod
4. Implement soft delete (deletedAt field)
5. Add search and filtering
6. Add pagination
7. Test all endpoints with curl/Postman

### API Endpoints Created:
- `GET /api/v1/patients` - List patients (with search, filter, pagination)
- `POST /api/v1/patients` - Create new patient
- `GET /api/v1/patients/:id` - Get patient details
- `PUT /api/v1/patients/:id` - Update patient
- `DELETE /api/v1/patients/:id` - Soft delete patient
- `GET /api/v1/patients/search?q=` - Search patients by name/MRN

### Validation Rules:
- MRN must be unique
- Date of birth required
- First name and last name required
- Email format validation
- Phone number format validation

### Acceptance Criteria:
- ✅ Can create patient via API
- ✅ Can retrieve patient list (returns 200 OK)
- ✅ Can get single patient by ID
- ✅ Can update patient information
- ✅ Can soft delete patient (deletedAt set, not shown in list)
- ✅ Search works by name or MRN
- ✅ Pagination works (limit/offset)
- ✅ All operations require authentication

### Test Commands:
```bash
# Get auth token first
TOKEN="your_jwt_token_here"

# Create patient
curl -X POST http://localhost:5000/api/v1/patients \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "mrn": "MRN001",
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "2024-01-15",
    "gender": "male"
  }'

# List patients
curl http://localhost:5000/api/v1/patients \
  -H "Authorization: Bearer $TOKEN"
```

### Commit Message:
```
feat: implement patient CRUD API with search and pagination

- Add patient controller with full CRUD operations
- Implement patient service layer for business logic
- Add Zod validation for patient data
- Implement soft delete functionality
- Add search by name and MRN
- Add pagination support (limit/offset)
- Protect all endpoints with authentication middleware
```

---

## Phase 3: Patient Frontend UI
**Duration**: 1-2 hours
**Goal**: Working patient management interface

### What Gets Built:
```
frontend/src/
├── components/
│   ├── patients/
│   │   ├── PatientList.tsx
│   │   ├── PatientForm.tsx
│   │   ├── PatientCard.tsx
│   │   └── PatientDetail.tsx
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   └── Modal.tsx
│   └── layout/
│       ├── Layout.tsx
│       ├── Navbar.tsx
│       └── Sidebar.tsx
├── services/
│   ├── api.ts
│   └── patient.service.ts
├── hooks/
│   └── usePatients.ts
├── pages/
│   ├── Patients.tsx
│   └── PatientDetails.tsx
└── types/
    └── patient.types.ts
```

### Tasks:
1. Setup React Query for data fetching
2. Create API service layer
3. Build patient list table component
4. Build patient form (add/edit)
5. Build patient detail view
6. Add search functionality
7. Add pagination controls
8. Style with Tailwind CSS

### Pages Created:
- **/patients** - List all patients
- **/patients/new** - Add new patient
- **/patients/:id** - View patient details
- **/patients/:id/edit** - Edit patient

### Features:
- Search patients by name or MRN
- Sort by columns (name, DOB, MRN)
- Pagination (10, 25, 50 per page)
- Form validation (React Hook Form + Zod)
- Success/error notifications
- Loading states
- Responsive design

### Acceptance Criteria:
- ✅ Patient list displays all patients from API
- ✅ Search box filters patients in real-time
- ✅ Can click "Add Patient" and see form
- ✅ Form validation works (required fields, valid dates)
- ✅ Can submit form and patient appears in list
- ✅ Can click on patient to see details
- ✅ Can edit patient from detail view
- ✅ Can delete patient (with confirmation)
- ✅ UI is responsive (works on mobile)

### Commit Message:
```
feat: implement patient management UI with full CRUD

- Add patient list page with search and pagination
- Create patient form with validation (React Hook Form + Zod)
- Implement patient detail view page
- Add common UI components (Button, Input, Table, Modal)
- Set up React Query for data fetching and caching
- Create patient service layer for API calls
- Add layout components (Navbar, Sidebar)
- Style all components with Tailwind CSS
```

---

## Phase 4: Diagnosis Module
**Duration**: 1 hour
**Goal**: Record and display craniosynostosis diagnosis

### What Gets Built:
```
backend/src/
├── controllers/diagnosis.controller.ts
├── routes/diagnosis.routes.ts
└── services/diagnosis.service.ts

frontend/src/
├── components/diagnosis/
│   ├── DiagnosisForm.tsx
│   └── DiagnosisCard.tsx
└── services/diagnosis.service.ts
```

### Tasks:
1. Create diagnosis backend API
2. Add diagnosis types validation
3. Calculate age at diagnosis automatically
4. Create diagnosis form component
5. Add to patient detail page
6. Display diagnosis information

### API Endpoints:
- `POST /api/v1/patients/:id/diagnosis` - Add diagnosis
- `GET /api/v1/patients/:id/diagnosis` - Get patient diagnosis
- `PUT /api/v1/diagnosis/:id` - Update diagnosis

### Diagnosis Types Supported:
- Sagittal
- Coronal (Unilateral)
- Coronal (Bilateral)
- Metopic
- Lambdoid
- Multiple Sutures

### Acceptance Criteria:
- ✅ Can add diagnosis to patient
- ✅ Diagnosis type dropdown has all types
- ✅ Age at diagnosis calculated from DOB automatically
- ✅ Severity levels work (mild, moderate, severe)
- ✅ Diagnosis displays on patient detail page
- ✅ Can edit existing diagnosis
- ✅ Form validation works

### Commit Message:
```
feat: implement diagnosis module for craniosynostosis classification

- Add diagnosis CRUD API endpoints
- Implement automatic age calculation at diagnosis
- Create diagnosis form with type selection
- Add severity grading (mild/moderate/severe)
- Display diagnosis information on patient detail page
- Add validation for all diagnosis fields
```

---

## Phase 5: Measurements Module
**Duration**: 1 hour
**Goal**: Track head measurements over time

### What Gets Built:
```
backend/src/
├── controllers/measurement.controller.ts
├── routes/measurement.routes.ts
└── services/measurement.service.ts

frontend/src/
├── components/measurements/
│   ├── MeasurementForm.tsx
│   ├── MeasurementTable.tsx
│   └── MeasurementChart.tsx
└── services/measurement.service.ts
```

### Tasks:
1. Create measurements backend API
2. Add measurement validation (reasonable ranges)
3. Create measurement form
4. Create measurement history table
5. Add growth chart visualization (Recharts)
6. Calculate changes over time

### API Endpoints:
- `POST /api/v1/patients/:id/measurements` - Add measurement
- `GET /api/v1/patients/:id/measurements` - Get all measurements
- `PUT /api/v1/measurements/:id` - Update measurement
- `DELETE /api/v1/measurements/:id` - Delete measurement

### Measurements Tracked:
- **Head Circumference (HC)** - in cm
- **Cephalic Index (CI)** - ratio
- **Cranial Vault Asymmetry Index (CVAI)** - in mm
- **Anterior-Posterior Diameter** - in mm
- **Biparietal Diameter** - in mm

### Measurement Types:
- Preoperative
- Postoperative (immediate)
- Follow-up (3mo, 6mo, 1yr, 2yr, 5yr)

### Features:
- Timeline view of measurements
- Growth chart (HC over time)
- Comparison view (pre-op vs follow-up)
- Age-standardized percentiles

### Acceptance Criteria:
- ✅ Can add measurements to patient
- ✅ Measurements display in chronological order
- ✅ Growth chart shows HC over time
- ✅ Can edit past measurements
- ✅ Age at measurement calculated automatically
- ✅ Form has validation (no negative numbers)
- ✅ Chart updates when new measurement added

### Commit Message:
```
feat: implement measurements module with growth tracking

- Add measurements CRUD API endpoints
- Create measurement form for all cranial metrics
- Implement measurement history table with timeline view
- Add growth chart visualization using Recharts
- Calculate age at measurement automatically
- Add measurement type categorization (preop/postop/followup)
- Implement data validation for measurement ranges
```

---

## Phase 6: Surgery Backend API
**Duration**: 1 hour
**Goal**: Complete surgery management API

### What Gets Built:
```
backend/src/
├── controllers/surgery.controller.ts
├── routes/surgery.routes.ts
├── services/surgery.service.ts
└── validators/surgery.validator.ts
```

### Tasks:
1. Create surgery CRUD endpoints
2. Add procedure type validation
3. Link surgeries to patients
4. Calculate age at surgery
5. Add duration and blood loss tracking
6. Link to primary surgeon (user)

### API Endpoints:
- `POST /api/v1/patients/:id/surgeries` - Create surgery
- `GET /api/v1/patients/:id/surgeries` - Get patient surgeries
- `GET /api/v1/surgeries/:id` - Get surgery details
- `PUT /api/v1/surgeries/:id` - Update surgery
- `DELETE /api/v1/surgeries/:id` - Delete surgery
- `GET /api/v1/surgeries` - List all surgeries (admin)

### Procedure Types:
- Strip Craniectomy
- Cranial Vault Remodeling (CVR)
- Fronto-Orbital Advancement (FOA)
- Posterior Vault Distraction
- Spring-Assisted Cranioplasty
- Endoscopic Strip Craniectomy
- Helmet Therapy

### Data Tracked:
- Surgery date (scheduled vs actual)
- Procedure type and approach
- Primary surgeon
- Surgical team members
- Duration (minutes)
- Estimated blood loss (mL)
- Transfusion requirement
- Hardware used
- Intra-operative complications
- Operative notes

### Acceptance Criteria:
- ✅ Can create surgery record via API
- ✅ Surgery linked to patient correctly
- ✅ Age at surgery calculated from DOB
- ✅ Primary surgeon linked to user table
- ✅ Procedure type validation works
- ✅ Can retrieve all surgeries for a patient
- ✅ Can update surgery details
- ✅ All fields save correctly

### Commit Message:
```
feat: implement surgery management API

- Add surgery CRUD endpoints
- Implement procedure type validation (7 types)
- Link surgeries to patients and surgeons
- Calculate age at surgery automatically
- Track operative details (duration, blood loss, hardware)
- Add intra-operative complications tracking
- Implement surgical team documentation
```

---

## Phase 7: Surgery Frontend UI
**Duration**: 1-2 hours
**Goal**: Complete surgery recording interface

### What Gets Built:
```
frontend/src/
├── components/surgeries/
│   ├── SurgeryForm.tsx
│   ├── SurgeryList.tsx
│   ├── SurgeryCard.tsx
│   └── SurgeryDetail.tsx
├── services/surgery.service.ts
└── pages/
    └── SurgeryDetails.tsx
```

### Tasks:
1. Create multi-step surgery form
2. Add procedure type dropdown
3. Add surgeon selection (from users)
4. Create surgery timeline view
5. Add surgery detail page
6. Style all components

### Form Sections:
1. **Basic Information**
   - Scheduled date
   - Actual surgery date
   - Procedure type
   - Primary surgeon

2. **Operative Details**
   - Surgical approach
   - Duration
   - Estimated blood loss
   - Transfusion details
   - Hardware used

3. **Team & Notes**
   - Surgical team members
   - Intra-operative complications
   - Operative notes

### Features:
- Multi-step form with progress indicator
- Form validation at each step
- Save draft functionality
- Surgery timeline on patient page
- Expandable surgery cards
- Print-friendly surgery summary

### Acceptance Criteria:
- ✅ Can access surgery form from patient page
- ✅ Multi-step form works smoothly
- ✅ All procedure types in dropdown
- ✅ Surgeon dropdown shows active surgeons
- ✅ Form validation prevents invalid data
- ✅ Can save and see surgery in patient timeline
- ✅ Surgery detail page shows all information
- ✅ Can edit existing surgery

### Commit Message:
```
feat: implement surgery recording UI with multi-step form

- Create multi-step surgery form with 3 sections
- Add procedure type and surgeon selection dropdowns
- Implement surgery timeline view on patient page
- Create detailed surgery view page
- Add form validation for all surgery fields
- Implement save draft functionality
- Style surgery components with Tailwind CSS
```

---

## Phase 8: Post-operative Course Module
**Duration**: 1 hour
**Goal**: Track post-operative recovery

### What Gets Built:
```
backend/src/
├── controllers/postop.controller.ts
├── routes/postop.routes.ts
└── services/postop.service.ts

frontend/src/
└── components/postop/
    ├── PostopForm.tsx
    └── PostopCard.tsx
```

### Tasks:
1. Create post-op backend API (1-to-1 with surgery)
2. Add complication tracking
3. Create post-op form
4. Display on surgery detail page
5. Add complication categorization

### API Endpoints:
- `POST /api/v1/surgeries/:id/postop` - Add post-op course
- `GET /api/v1/surgeries/:id/postop` - Get post-op course
- `PUT /api/v1/postop/:id` - Update post-op course

### Data Tracked:
- ICU admission (yes/no)
- ICU duration (hours)
- Hospital length of stay (days)
- Complications (categorical)
  - Bleeding/Hematoma
  - Infection
  - CSF Leak
  - Seizures
  - Need for revision
- Wound healing status
- Discharge date and notes

### Features:
- Complication checklist
- Hospital stay timeline
- Automatic LOS calculation
- Wound healing status tracker

### Acceptance Criteria:
- ✅ Can add post-op course to surgery
- ✅ ICU admission tracking works
- ✅ LOS calculated automatically from dates
- ✅ Complications saved as JSON array
- ✅ Post-op displays on surgery detail page
- ✅ Can update post-op information
- ✅ Form validation works

### Commit Message:
```
feat: implement post-operative course tracking

- Add post-op course API (1-to-1 with surgery)
- Implement complication tracking with categories
- Create post-op form with complication checklist
- Add ICU admission and duration tracking
- Calculate hospital length of stay automatically
- Display post-op course on surgery detail page
- Add wound healing status tracking
```

---

## Phase 9: Follow-up Module
**Duration**: 1-2 hours
**Goal**: Schedule and track follow-up visits

### What Gets Built:
```
backend/src/
├── controllers/followup.controller.ts
├── routes/followup.routes.ts
└── services/followup.service.ts

frontend/src/
├── components/followups/
│   ├── FollowupForm.tsx
│   ├── FollowupList.tsx
│   ├── FollowupTimeline.tsx
│   └── FollowupCard.tsx
└── services/followup.service.ts
```

### Tasks:
1. Create follow-up backend API
2. Add follow-up type validation
3. Calculate days post-surgery
4. Create follow-up form
5. Create follow-up timeline
6. Add outcome rating system

### API Endpoints:
- `POST /api/v1/patients/:id/followups` - Create follow-up
- `GET /api/v1/patients/:id/followups` - Get patient follow-ups
- `GET /api/v1/followups/:id` - Get follow-up details
- `PUT /api/v1/followups/:id` - Update follow-up
- `GET /api/v1/followups/upcoming` - Get upcoming appointments

### Follow-up Types:
- Post-op 2 weeks
- Post-op 6 weeks
- 3 months
- 6 months
- 1 year
- 2 years
- 5 years
- Other/Unscheduled

### Data Tracked:
- Follow-up date
- Days post-surgery (auto-calculated)
- Complications since last visit
- Cosmetic outcome (surgeon rating 1-5)
- Cosmetic outcome (parent rating 1-5)
- Developmental status
- Revision needed (yes/no + reason)
- Clinical notes

### Features:
- Follow-up timeline visualization
- Upcoming appointments dashboard
- Overdue visit alerts
- Star rating for outcomes
- Linked to specific surgery

### Acceptance Criteria:
- ✅ Can schedule follow-up appointment
- ✅ Days post-surgery calculated automatically
- ✅ Follow-up types dropdown works
- ✅ Star ratings work (1-5)
- ✅ Follow-up timeline displays on patient page
- ✅ Upcoming appointments show on dashboard
- ✅ Can edit follow-up information
- ✅ Revision needed flag works

### Commit Message:
```
feat: implement follow-up scheduling and tracking

- Add follow-up CRUD API endpoints
- Implement follow-up type categorization
- Calculate days post-surgery automatically
- Create follow-up form with outcome ratings
- Add follow-up timeline visualization
- Implement upcoming appointments dashboard
- Track cosmetic outcomes (surgeon and parent ratings)
- Add revision tracking with reason documentation
```

---

## Phase 10: Image Upload & Management
**Duration**: 1-2 hours
**Goal**: Upload and view medical images

### What Gets Built:
```
backend/src/
├── controllers/image.controller.ts
├── routes/image.routes.ts
├── services/image.service.ts
└── middleware/upload.middleware.ts

frontend/src/
└── components/images/
    ├── ImageUpload.tsx
    ├── ImageGallery.tsx
    ├── ImageViewer.tsx
    └── ImageCard.tsx
```

### Tasks:
1. Setup Multer for file uploads
2. Create image upload endpoint
3. Create image retrieval endpoint
4. Implement image categorization
5. Build upload component
6. Build gallery component
7. Build image viewer (with zoom)

### API Endpoints:
- `POST /api/v1/images/upload` - Upload image(s)
- `GET /api/v1/patients/:id/images` - Get patient images
- `GET /api/v1/images/:id` - Get image file
- `DELETE /api/v1/images/:id` - Delete image
- `PUT /api/v1/images/:id` - Update image metadata

### Image Types:
- CT Scan
- 3D Reconstruction
- Clinical Photo
- X-ray
- MRI

### Image Categories:
- Preoperative
- Postoperative
- Follow-up

### View Types (for photos):
- Frontal
- Lateral (Left)
- Lateral (Right)
- Top
- Oblique

### Features:
- Drag-and-drop upload
- Multiple file upload
- Image preview before upload
- Categorization during upload
- Gallery view with filters
- Lightbox viewer with zoom
- Before/after comparison view
- Thumbnail generation

### Acceptance Criteria:
- ✅ Can upload images via drag-drop or click
- ✅ Multiple images upload at once
- ✅ Image metadata saves correctly (type, category, view)
- ✅ Images display in gallery on patient page
- ✅ Can filter images by type and category
- ✅ Click image opens full-screen viewer
- ✅ Viewer has zoom and navigation
- ✅ Can delete images
- ✅ File size validation works (max 50MB)
- ✅ File type validation (jpg, png, dcm)

### Commit Message:
```
feat: implement medical image upload and management

- Add Multer middleware for file uploads
- Implement image upload endpoint with validation
- Create image retrieval and deletion endpoints
- Add image categorization (type, category, view)
- Build drag-and-drop upload component
- Create image gallery with filtering
- Implement image viewer with zoom functionality
- Add before/after comparison view
- Generate thumbnails for performance
```

---

## Phase 11: Dashboard & Analytics
**Duration**: 1-2 hours
**Goal**: Overview dashboard with statistics

### What Gets Built:
```
backend/src/
├── controllers/analytics.controller.ts
├── routes/analytics.routes.ts
└── services/analytics.service.ts

frontend/src/
├── components/dashboard/
│   ├── StatCard.tsx
│   ├── ChartCard.tsx
│   ├── RecentActivity.tsx
│   └── UpcomingAppointments.tsx
└── pages/
    └── Dashboard.tsx
```

### Tasks:
1. Create analytics API endpoints
2. Calculate key statistics
3. Build stat cards
4. Create charts (procedure types, outcomes)
5. Add recent activity feed
6. Add upcoming appointments widget

### API Endpoints:
- `GET /api/v1/analytics/overview` - Dashboard stats
- `GET /api/v1/analytics/surgeries` - Surgery statistics
- `GET /api/v1/analytics/outcomes` - Outcome analysis
- `GET /api/v1/analytics/activity` - Recent activity

### Statistics Displayed:
- Total patients
- Total surgeries
- Pending follow-ups
- Recent surgeries (last 30 days)
- Patients by diagnosis type (pie chart)
- Surgeries by procedure type (bar chart)
- Average age at surgery
- Complication rate

### Widgets:
1. **Quick Stats** - 4 stat cards
2. **Surgery Distribution** - Pie chart
3. **Monthly Surgeries** - Line chart
4. **Recent Activity** - Timeline
5. **Upcoming Appointments** - List
6. **Overdue Follow-ups** - Alert list

### Acceptance Criteria:
- ✅ Dashboard loads with all stats
- ✅ Stat cards show correct numbers
- ✅ Charts display data correctly
- ✅ Recent activity shows last 10 actions
- ✅ Upcoming appointments sorted by date
- ✅ Overdue follow-ups highlighted in red
- ✅ Dashboard auto-refreshes data
- ✅ Responsive on mobile

### Commit Message:
```
feat: implement analytics dashboard with statistics

- Add analytics API endpoints for dashboard data
- Create stat cards for key metrics
- Implement charts for surgeries and outcomes (Recharts)
- Add recent activity feed
- Create upcoming appointments widget
- Display overdue follow-ups with alerts
- Add surgery distribution by type (pie chart)
- Implement monthly surgery trend (line chart)
```

---

## Phase 12: Reports & Data Export
**Duration**: 1 hour
**Goal**: Export data for research and reporting

### What Gets Built:
```
backend/src/
├── controllers/export.controller.ts
├── routes/export.routes.ts
└── services/export.service.ts

frontend/src/
└── components/reports/
    ├── ExportForm.tsx
    └── ReportGenerator.tsx
```

### Tasks:
1. Create export API endpoint
2. Implement CSV generation
3. Add date range filtering
4. Create export UI
5. Add anonymization option
6. Generate patient summary PDF (optional)

### API Endpoints:
- `GET /api/v1/export/patients` - Export patients CSV
- `GET /api/v1/export/surgeries` - Export surgeries CSV
- `GET /api/v1/export/outcomes` - Export outcomes CSV
- `GET /api/v1/export/full` - Export complete dataset
- `POST /api/v1/reports/patient/:id` - Generate patient PDF

### Export Options:
- Date range selection
- Data type selection (patients, surgeries, follow-ups)
- Anonymize data (remove names, MRN)
- Include images (yes/no)
- Format: CSV, JSON, Excel

### Features:
- Custom date range picker
- Select specific data fields
- Preview before export
- Anonymization toggle
- Download as CSV/JSON
- Patient summary report (PDF)

### Acceptance Criteria:
- ✅ Can select date range for export
- ✅ CSV download works for all data types
- ✅ Anonymization removes PHI correctly
- ✅ Export includes all selected fields
- ✅ Can generate patient summary report
- ✅ Report includes measurements and images
- ✅ Download triggers automatically
- ✅ Only authorized users can export

### Commit Message:
```
feat: implement data export and reporting functionality

- Add CSV export endpoints for all data types
- Implement date range filtering for exports
- Create export UI with customization options
- Add data anonymization for research use
- Implement field selection for custom exports
- Generate patient summary reports
- Add authorization checks for export features
```

---

## 🎉 Phase 13: Final Polish & Deployment
**Duration**: 1-2 hours
**Goal**: Production-ready application

### Tasks:
1. Add loading spinners to all async operations
2. Improve error messages
3. Add form field hints/tooltips
4. Test all user flows
5. Fix any bugs found
6. Add app-wide search
7. Improve mobile responsiveness
8. Write deployment documentation
9. Create .env.example files
10. Add backup scripts

### Acceptance Criteria:
- ✅ All pages have loading states
- ✅ Error messages are user-friendly
- ✅ Forms have helpful validation messages
- ✅ No console errors in browser
- ✅ Mobile UI works well
- ✅ App-wide search works
- ✅ Ready for deployment

### Commit Message:
```
chore: final polish and production preparation

- Add loading states to all async operations
- Improve error messages and user feedback
- Add form field hints and validation messages
- Fix mobile responsiveness issues
- Implement app-wide search functionality
- Add deployment documentation
- Create environment variable templates
- Add database backup scripts
```

---

## 🚀 Quick Reference: Starting Each Phase

### Template for Starting a Phase

When you're ready to start a phase, simply tell Claude:

```
"Implement Phase X: [Phase Name]"
```

For example:
```
"Implement Phase 0: Project Setup & Infrastructure"
```

Claude will:
1. ✅ Create all necessary files
2. ✅ Write the code with explanations
3. ✅ Test the implementation
4. ✅ Commit the code with proper message
5. ✅ Confirm what works and what to test next

---

## 📊 Progress Checklist

Copy this checklist and update as you complete each phase:

```markdown
## Implementation Progress

### Core Infrastructure
- [ ] Phase 0: Project Setup ✅ (30 min)
- [ ] Phase 1: Database & Auth ✅ (1-2h)

### Patient Management
- [ ] Phase 2: Patient Backend API ✅ (1h)
- [ ] Phase 3: Patient Frontend UI ✅ (1-2h)
- [ ] Phase 4: Diagnosis Module ✅ (1h)
- [ ] Phase 5: Measurements Module ✅ (1h)

### Surgery Management
- [ ] Phase 6: Surgery Backend API ✅ (1h)
- [ ] Phase 7: Surgery Frontend UI ✅ (1-2h)
- [ ] Phase 8: Post-op Module ✅ (1h)

### Follow-up & Media
- [ ] Phase 9: Follow-up Module ✅ (1-2h)
- [ ] Phase 10: Image Management ✅ (1-2h)

### Analytics & Export
- [ ] Phase 11: Dashboard & Analytics ✅ (1-2h)
- [ ] Phase 12: Reports & Export ✅ (1h)

### Finalization
- [ ] Phase 13: Final Polish ✅ (1-2h)

**Total Time Invested**: _____ hours
**Completion**: ____%
```

---

## 🎯 Success Tips

1. **Complete one phase at a time** - Don't skip ahead
2. **Test after each phase** - Verify it works before moving on
3. **Commit after each phase** - Keep git history clean
4. **Take breaks** - Each phase is a natural stopping point
5. **Ask questions** - If unclear, ask Claude to explain
6. **Customize as needed** - Feel free to adjust based on your needs

---

## 🆘 Troubleshooting

### If a Phase Fails:
1. Check error messages carefully
2. Verify all dependencies installed
3. Check .env variables are set
4. Try restarting dev servers
5. Ask Claude: "Help me debug Phase X - I'm getting error: [error message]"

### If You Need to Modify a Phase:
Tell Claude:
```
"I want to modify Phase X to also include [feature]"
```

### If You Want to Skip a Phase:
Tell Claude:
```
"Skip Phase X for now, let's do Phase Y instead"
```

---

## 📝 Notes

- Each phase builds on previous ones
- Phases 2-5 can be done in different order if needed
- Phases 6-8 should be done in order (surgery → postop)
- Phase 10 (images) can be done anytime after Phase 3
- Phase 11-13 should be done last

---

**Ready to start? Tell Claude:**

```
"Let's begin! Implement Phase 0: Project Setup & Infrastructure"
```

Good luck! 🚀
