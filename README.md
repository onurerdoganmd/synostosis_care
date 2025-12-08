# Craniosynostoses Patient Tracking System

A comprehensive web-based application for managing and tracking patients diagnosed with craniosynostosis from initial presentation through long-term follow-up.

## 🏥 Overview

This system enables neurosurgeons, plastic surgeons, residents, and medical staff to:
- 📋 Record detailed patient demographics and medical history
- 🧠 Document craniosynostosis type and severity
- 📊 Track pre-operative assessments and imaging
- ⚕️ Manage surgical procedures and operative details
- 📈 Monitor post-operative outcomes and complications
- 📅 Record long-term follow-up measurements and imaging
- 📑 Generate reports and analyze treatment outcomes

## 📚 Documentation

### Getting Started
1. **[PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)** - Understand the proven architecture for medical tracking applications
2. **[MASTER_PLAN_TEMPLATE.md](./MASTER_PLAN_TEMPLATE.md)** - Complete master plan for the craniosynostosis tracking system
3. **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step implementation instructions

### Quick Links
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Development](#-development)
- [Contributing](#-contributing)

## ✨ Features

### Patient Management
- Comprehensive patient registration and demographics
- Medical history tracking (family history, syndromic classification)
- Genetic testing documentation
- Multiple craniosynostosis type support (sagittal, coronal, metopic, lambdoid, multiple)

### Diagnosis & Assessment
- Pre-operative measurements (HC, CI, CVAI)
- CT scan and 3D reconstruction uploads
- Clinical photography management
- Severity grading and classification

### Surgical Management
- Multiple procedure types:
  - Strip craniectomy
  - Cranial vault remodeling (CVR)
  - Fronto-orbital advancement (FOA)
  - Posterior vault distraction
  - Spring-assisted cranioplasty
  - Endoscopic procedures
  - Helmet therapy
- Detailed operative documentation
- Surgical team tracking
- Hardware and blood loss tracking

### Post-operative Care
- ICU and hospital stay tracking
- Complication documentation
- Immediate post-op follow-up
- Wound healing assessment

### Long-term Follow-up
- Scheduled follow-up visits (3mo, 6mo, 1yr, 2yr, 5yr)
- Growth measurement tracking over time
- Cosmetic outcome assessments (surgeon + parent ratings)
- Developmental milestone tracking
- Revision surgery documentation

### Analytics & Reporting
- Individual patient reports and timelines
- Growth curve visualizations
- Before/after image comparisons
- Cohort analysis by craniosynostosis type
- Complication rate tracking
- Data export for research (CSV/Excel)

### System Administration
- Role-based access control (Admin, Surgeon, Resident, Nurse, Researcher, Viewer)
- User management
- Activity audit logging
- HIPAA-compliant security

## 🛠 Technology Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui + Radix UI
- **Forms**: React Hook Form + Zod
- **State**: React Context API + TanStack Query
- **Charts**: Recharts
- **Routing**: React Router v6

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL 14+
- **ORM**: Prisma
- **Authentication**: JWT
- **Validation**: Zod
- **File Upload**: Multer
- **Security**: Helmet, bcrypt, CORS

### DevOps
- **Version Control**: Git
- **Containerization**: Docker + Docker Compose
- **Testing**: Jest + Supertest
- **CI/CD**: GitHub Actions

## 📦 Installation

### Prerequisites
- Node.js 18+ LTS
- PostgreSQL 14+
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/synostosis_care.git
cd synostosis_care
```

### 2. Setup Backend
```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database credentials

# Setup database
createdb synostosis_care

# Run migrations
npx prisma migrate dev

# Generate Prisma client
npx prisma generate

# Create admin user
tsx src/scripts/createAdmin.ts
```

### 3. Setup Frontend
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env
# Edit .env if needed
```

### 4. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 5. Access the Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000
- Database GUI: `npx prisma studio` (in backend directory)

### Default Credentials
- Username: `admin`
- Password: `admin123`

**⚠️ IMPORTANT: Change the default admin password immediately after first login!**

## 🚀 Usage

### For Clinicians

#### Adding a New Patient
1. Navigate to **Add Patient** from the main menu
2. Fill in patient demographics and medical history
3. Document diagnosis details and craniosynostosis type
4. Upload pre-operative images and measurements
5. Save the patient record

#### Recording a Surgery
1. Open the patient's profile
2. Click **Add Surgery**
3. Select procedure type and fill in operative details
4. Document intra-operative details and complications
5. Save the surgical record

#### Follow-up Visits
1. Open the patient's profile
2. Navigate to **Follow-ups** tab
3. Click **Add Follow-up**
4. Record measurements, outcomes, and observations
5. Upload follow-up images
6. Schedule next appointment

### For Researchers

#### Exporting Data
1. Navigate to **Reports** section
2. Select date range and filters
3. Choose export format (CSV/Excel)
4. Download anonymized dataset

#### Analyzing Outcomes
1. Go to **Analytics** dashboard
2. View statistics by craniosynostosis type
3. Analyze complication rates
4. Compare surgical approaches
5. Generate custom reports

## 💻 Development

### Project Structure
```
synostosis_care/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── controllers/           # Route controllers
│   │   ├── middleware/            # Auth, validation, etc.
│   │   ├── routes/                # API routes
│   │   ├── services/              # Business logic
│   │   ├── utils/                 # Helper functions
│   │   └── index.ts               # Entry point
│   ├── uploads/                   # Uploaded files
│   └── tests/                     # Backend tests
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── contexts/              # React contexts
│   │   ├── hooks/                 # Custom hooks
│   │   ├── services/              # API services
│   │   ├── utils/                 # Utilities
│   │   └── types/                 # TypeScript types
│   └── public/                    # Static assets
├── docs/                          # Additional documentation
├── PROJECT_OVERVIEW.md            # Architecture overview
├── MASTER_PLAN_TEMPLATE.md        # Master plan
├── IMPLEMENTATION_GUIDE.md        # Implementation guide
└── README.md                      # This file
```

### Available Scripts

#### Backend
```bash
npm run dev          # Start development server with hot reload
npm run build        # Build for production
npm run start        # Start production server
npm run test         # Run tests
npm run lint         # Lint code
npm run format       # Format code with Prettier
npx prisma studio    # Open database GUI
npx prisma migrate dev  # Create and apply migration
```

#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests
npm run lint         # Lint code
```

### Database Management

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Reset database (WARNING: Deletes all data)
npx prisma migrate reset

# Generate Prisma Client after schema changes
npx prisma generate

# View and edit data in browser
npx prisma studio

# Seed database with sample data
npx prisma db seed
```

### API Documentation

#### Base URL
```
http://localhost:5000/api/v1
```

#### Authentication
```http
POST /auth/register      # Register new user
POST /auth/login         # Login
POST /auth/refresh       # Refresh access token
```

#### Patients
```http
GET    /patients         # List all patients
POST   /patients         # Create patient
GET    /patients/:id     # Get patient details
PUT    /patients/:id     # Update patient
DELETE /patients/:id     # Soft delete patient
```

#### Surgeries
```http
GET    /surgeries                    # List all surgeries
POST   /surgeries                    # Create surgery
GET    /surgeries/:id                # Get surgery details
PUT    /surgeries/:id                # Update surgery
GET    /patients/:id/surgeries       # Get patient surgeries
```

#### Follow-ups
```http
GET    /followups                    # List all follow-ups
POST   /followups                    # Create follow-up
GET    /followups/:id                # Get follow-up details
GET    /patients/:id/followups       # Get patient follow-ups
```

#### Measurements
```http
GET    /measurements                 # List measurements
POST   /measurements                 # Create measurement
GET    /patients/:id/measurements    # Get patient measurements
```

#### Images
```http
POST   /images/upload                # Upload image
GET    /images/:id                   # Get image
GET    /patients/:id/images          # Get patient images
DELETE /images/:id                   # Delete image
```

### Testing

```bash
# Backend tests
cd backend
npm test

# Run specific test file
npm test -- auth.test.ts

# Run tests with coverage
npm test -- --coverage

# Frontend tests
cd frontend
npm test
```

## 🔒 Security

### Authentication & Authorization
- JWT-based authentication with refresh tokens
- Role-based access control (RBAC)
- Session timeout after inactivity
- Secure password hashing with bcrypt (12 rounds)

### Data Protection
- HTTPS/TLS encryption in production
- SQL injection prevention via Prisma ORM
- XSS protection with input sanitization
- CSRF token validation
- Rate limiting on API endpoints
- Audit logging for all data access

### File Upload Security
- File type validation
- File size limits (50MB max)
- Virus scanning (recommended for production)
- Secure file storage with access control

### HIPAA Compliance Considerations
- Encrypted data at rest and in transit
- Access logging and audit trails
- Role-based access control
- Automatic session timeouts
- Data backup and recovery procedures
- Business Associate Agreements required

**⚠️ Note:** This system provides security features but requires proper configuration, hosting, and operational procedures to achieve full HIPAA compliance. Consult with legal and compliance experts before using in production.

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
pg_isready

# Check connection string in .env
# Format: postgresql://user:password@localhost:5432/database_name

# Test connection
psql -U username -d synostosis_care
```

### Prisma Issues
```bash
# Regenerate Prisma Client
npx prisma generate

# Reset database (WARNING: Deletes data)
npx prisma migrate reset

# Check migration status
npx prisma migrate status
```

### Port Already in Use
```bash
# Find process using port
lsof -i :5000  # For backend
lsof -i :5173  # For frontend

# Kill process
kill -9 <PID>
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📈 Roadmap

### Phase 1: MVP (Current)
- ✅ Core patient management
- ✅ Surgery tracking
- ✅ Follow-up management
- ✅ Basic reporting

### Phase 2: Enhanced Features
- [ ] Advanced analytics dashboard
- [ ] Automated growth curve generation
- [ ] PDF report generation
- [ ] Email notifications for follow-ups
- [ ] Bulk data import/export

### Phase 3: Advanced Features
- [ ] DICOM integration for medical imaging
- [ ] AI-assisted measurement calculations
- [ ] Mobile app (iOS/Android)
- [ ] Telemedicine integration
- [ ] Multi-center support

### Phase 4: Research Tools
- [ ] Advanced statistical analysis
- [ ] Machine learning outcome predictions
- [ ] Publication-ready report generation
- [ ] Research cohort builder
- [ ] Integration with clinical trial systems

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Code Review Process
1. All PRs require at least one approval
2. All tests must pass
3. Code coverage should not decrease
4. Documentation must be updated

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Development Team** - Initial work and architecture

## 🙏 Acknowledgments

- Inspired by the needs of craniosynostosis treatment centers
- Built with modern web technologies and best practices
- Designed with input from neurosurgeons and medical professionals

## 📞 Support

For questions, issues, or feature requests:

- **Issue Tracker**: [GitHub Issues](https://github.com/yourusername/synostosis_care/issues)
- **Documentation**: See docs folder for detailed guides
- **Email**: support@synostosis.care

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Core patient management
- Surgery tracking
- Follow-up management
- Basic reporting and analytics
- User authentication and authorization
- Image upload and management

---

**Built with ❤️ for better craniosynostosis patient care**
