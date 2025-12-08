# Implementation Guide: Craniosynostoses Patient Tracking System

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Phase 1: Foundation](#phase-1-foundation)
4. [Phase 2: Core Patient Management](#phase-2-core-patient-management)
5. [Phase 3: Surgical Workflow](#phase-3-surgical-workflow)
6. [Phase 4: Follow-up & Measurements](#phase-4-follow-up--measurements)
7. [Phase 5: Image Management](#phase-5-image-management)
8. [Phase 6: Analytics & Reporting](#phase-6-analytics--reporting)
9. [Phase 7: Testing & Refinement](#phase-7-testing--refinement)
10. [Phase 8: Deployment](#phase-8-deployment)

---

## Prerequisites

### Required Knowledge
- JavaScript/TypeScript
- React fundamentals
- Node.js and Express.js
- SQL and database design
- REST API design
- Git version control

### Development Environment
- **Node.js**: v18+ LTS
- **npm** or **yarn**: Latest version
- **PostgreSQL**: v14+
- **Git**: v2.30+
- **Code Editor**: VS Code (recommended)
- **Operating System**: macOS, Linux, or Windows with WSL

### Recommended VS Code Extensions
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense
- GitLens
- REST Client

---

## Project Setup

### Step 1: Initialize Project Structure

```bash
# Create project directory
mkdir synostosis_care
cd synostosis_care

# Initialize git repository
git init

# Create main directories
mkdir -p backend frontend docs

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*
logs/
*.log

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# Database
*.db
*.sqlite

# Uploads
uploads/
temp/
EOF
```

### Step 2: Setup Backend

```bash
cd backend

# Initialize npm project
npm init -y

# Install core dependencies
npm install express cors dotenv
npm install @prisma/client
npm install bcrypt jsonwebtoken
npm install express-validator
npm install multer
npm install helmet express-rate-limit

# Install TypeScript and dev dependencies
npm install -D typescript @types/node @types/express
npm install -D @types/cors @types/bcrypt @types/jsonwebtoken
npm install -D @types/multer
npm install -D prisma
npm install -D tsx nodemon
npm install -D @types/jest jest ts-jest supertest @types/supertest
npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
npm install -D prettier eslint-config-prettier
```

### Step 3: Configure TypeScript (Backend)

```bash
# Create tsconfig.json
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "moduleResolution": "node",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
EOF
```

### Step 4: Initialize Prisma

```bash
# Initialize Prisma
npx prisma init

# This creates:
# - prisma/schema.prisma
# - .env file
```

### Step 5: Configure Database Schema

Edit `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            Int       @id @default(autoincrement())
  username      String    @unique @db.VarChar(50)
  email         String    @unique @db.VarChar(100)
  passwordHash  String    @map("password_hash") @db.VarChar(255)
  firstName     String?   @map("first_name") @db.VarChar(100)
  lastName      String?   @map("last_name") @db.VarChar(100)
  role          String    @db.VarChar(50)
  isActive      Boolean   @default(true) @map("is_active")
  lastLogin     DateTime? @map("last_login")
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")

  // Relations
  patientsCreated   Patient[]      @relation("PatientCreatedBy")
  diagnosesCreated  Diagnosis[]    @relation("DiagnosisCreatedBy")
  measurementsCreated Measurement[] @relation("MeasurementCreatedBy")
  surgeriesCreated  Surgery[]      @relation("SurgeryCreatedBy")
  surgeriesPerformed Surgery[]     @relation("SurgeryPerformedBy")
  postopCoursesCreated PostopCourse[] @relation("PostopCourseCreatedBy")
  followupsCreated  Followup[]     @relation("FollowupCreatedBy")
  imagesCreated     Image[]        @relation("ImageCreatedBy")
  auditLogs         AuditLog[]

  @@map("users")
}

model Patient {
  id                  Int       @id @default(autoincrement())
  mrn                 String    @unique @db.VarChar(50)
  firstName           String    @map("first_name") @db.VarChar(100)
  lastName            String    @map("last_name") @db.VarChar(100)
  dateOfBirth         DateTime  @map("date_of_birth") @db.Date
  gender              String?   @db.VarChar(20)
  contactPhone        String?   @map("contact_phone") @db.VarChar(20)
  contactEmail        String?   @map("contact_email") @db.VarChar(100)
  address             String?
  insuranceProvider   String?   @map("insurance_provider") @db.VarChar(100)
  insuranceId         String?   @map("insurance_id") @db.VarChar(50)
  referringPhysician  String?   @map("referring_physician") @db.VarChar(100)
  familyHistory       String?   @map("family_history")
  syndromic           Boolean   @default(false)
  syndromeType        String?   @map("syndrome_type") @db.VarChar(100)
  geneticTesting      String?   @map("genetic_testing")
  notes               String?
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")
  createdById         Int       @map("created_by")
  deletedAt           DateTime? @map("deleted_at")

  // Relations
  createdBy      User          @relation("PatientCreatedBy", fields: [createdById], references: [id])
  diagnoses      Diagnosis[]
  measurements   Measurement[]
  surgeries      Surgery[]
  followups      Followup[]
  images         Image[]

  @@map("patients")
}

model Diagnosis {
  id                    Int      @id @default(autoincrement())
  patientId             Int      @map("patient_id")
  diagnosisDate         DateTime @map("diagnosis_date") @db.Date
  craniosynostosisType  String   @map("craniosynostosis_type") @db.VarChar(50)
  severity              String?  @db.VarChar(20)
  ageAtDiagnosisDays    Int?     @map("age_at_diagnosis_days")
  clinicalPresentation  String?  @map("clinical_presentation")
  associatedConditions  String?  @map("associated_conditions")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")
  createdById           Int      @map("created_by")

  // Relations
  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
  createdBy User    @relation("DiagnosisCreatedBy", fields: [createdById], references: [id])

  @@map("diagnoses")
}

model Measurement {
  id                    Int      @id @default(autoincrement())
  patientId             Int      @map("patient_id")
  measurementDate       DateTime @map("measurement_date") @db.Date
  measurementType       String   @map("measurement_type") @db.VarChar(50)
  headCircumferenceCm   Decimal? @map("head_circumference_cm") @db.Decimal(5, 2)
  cephalicIndex         Decimal? @map("cephalic_index") @db.Decimal(5, 2)
  cvai                  Decimal? @db.Decimal(5, 2)
  anteriorPosteriorMm   Decimal? @map("anterior_posterior_mm") @db.Decimal(6, 2)
  biparietal Mm         Decimal? @map("biparietal_mm") @db.Decimal(6, 2)
  ageAtMeasurementDays  Int?     @map("age_at_measurement_days")
  notes                 String?
  createdAt             DateTime @default(now()) @map("created_at")
  createdById           Int      @map("created_by")

  // Relations
  patient   Patient @relation(fields: [patientId], references: [id], onDelete: Cascade)
  createdBy User    @relation("MeasurementCreatedBy", fields: [createdById], references: [id])

  @@map("measurements")
}

model Surgery {
  id                    Int       @id @default(autoincrement())
  patientId             Int       @map("patient_id")
  surgeryDate           DateTime  @map("surgery_date") @db.Date
  scheduledDate         DateTime? @map("scheduled_date") @db.Date
  procedureType         String    @map("procedure_type") @db.VarChar(100)
  surgicalApproach      String?   @map("surgical_approach")
  primarySurgeonId      Int       @map("primary_surgeon_id")
  surgicalTeam          String?   @map("surgical_team")
  durationMinutes       Int?      @map("duration_minutes")
  estimatedBloodLossMl  Int?      @map("estimated_blood_loss_ml")
  transfusionRequired   Boolean   @default(false) @map("transfusion_required")
  transfusionAmountMl   Int?      @map("transfusion_amount_ml")
  hardwareUsed          String?   @map("hardware_used")
  intraopComplications  String?   @map("intraop_complications")
  operativeNotes        String?   @map("operative_notes")
  ageAtSurgeryDays      Int?      @map("age_at_surgery_days")
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  createdById           Int       @map("created_by")

  // Relations
  patient        Patient       @relation(fields: [patientId], references: [id], onDelete: Cascade)
  primarySurgeon User          @relation("SurgeryPerformedBy", fields: [primarySurgeonId], references: [id])
  createdBy      User          @relation("SurgeryCreatedBy", fields: [createdById], references: [id])
  postopCourse   PostopCourse?
  followups      Followup[]
  images         Image[]

  @@map("surgeries")
}

model PostopCourse {
  id                  Int       @id @default(autoincrement())
  surgeryId           Int       @unique @map("surgery_id")
  icuAdmission        Boolean   @default(false) @map("icu_admission")
  icuDurationHours    Int?      @map("icu_duration_hours")
  hospitalLosDays     Int?      @map("hospital_los_days")
  complications       String?
  complicationTypes   Json?     @map("complication_types")
  woundHealing        String?   @map("wound_healing") @db.VarChar(50)
  medications         String?
  dischargeDate       DateTime? @map("discharge_date") @db.Date
  dischargeNotes      String?   @map("discharge_notes")
  createdAt           DateTime  @default(now()) @map("created_at")
  updatedAt           DateTime  @updatedAt @map("updated_at")
  createdById         Int       @map("created_by")

  // Relations
  surgery   Surgery @relation(fields: [surgeryId], references: [id], onDelete: Cascade)
  createdBy User    @relation("PostopCourseCreatedBy", fields: [createdById], references: [id])

  @@map("postop_courses")
}

model Followup {
  id                      Int       @id @default(autoincrement())
  patientId               Int       @map("patient_id")
  surgeryId               Int?      @map("surgery_id")
  followupDate            DateTime  @map("followup_date") @db.Date
  followupType            String?   @map("followup_type") @db.VarChar(50)
  daysPostSurgery         Int?      @map("days_post_surgery")
  complications           String?
  cosmeticOutcomeSurgeon  Int?      @map("cosmetic_outcome_surgeon")
  cosmeticOutcomeParent   Int?      @map("cosmetic_outcome_parent")
  developmentalStatus     String?   @map("developmental_status")
  revisionNeeded          Boolean   @default(false) @map("revision_needed")
  revisionReason          String?   @map("revision_reason")
  clinicalNotes           String?   @map("clinical_notes")
  createdAt               DateTime  @default(now()) @map("created_at")
  updatedAt               DateTime  @updatedAt @map("updated_at")
  createdById             Int       @map("created_by")

  // Relations
  patient   Patient  @relation(fields: [patientId], references: [id], onDelete: Cascade)
  surgery   Surgery? @relation(fields: [surgeryId], references: [id], onDelete: SetNull)
  createdBy User     @relation("FollowupCreatedBy", fields: [createdById], references: [id])
  images    Image[]

  @@map("followups")
}

model Image {
  id              Int       @id @default(autoincrement())
  patientId       Int       @map("patient_id")
  surgeryId       Int?      @map("surgery_id")
  followupId      Int?      @map("followup_id")
  imageType       String    @map("image_type") @db.VarChar(50)
  imageCategory   String?   @map("image_category") @db.VarChar(50)
  viewType        String?   @map("view_type") @db.VarChar(50)
  filePath        String    @map("file_path") @db.VarChar(500)
  fileName        String    @map("file_name") @db.VarChar(255)
  fileSizeBytes   BigInt?   @map("file_size_bytes")
  mimeType        String?   @map("mime_type") @db.VarChar(100)
  uploadDate      DateTime  @map("upload_date") @db.Date
  description     String?
  annotations     Json?
  createdAt       DateTime  @default(now()) @map("created_at")
  createdById     Int       @map("created_by")

  // Relations
  patient   Patient   @relation(fields: [patientId], references: [id], onDelete: Cascade)
  surgery   Surgery?  @relation(fields: [surgeryId], references: [id], onDelete: SetNull)
  followup  Followup? @relation(fields: [followupId], references: [id], onDelete: SetNull)
  createdBy User      @relation("ImageCreatedBy", fields: [createdById], references: [id])

  @@map("images")
}

model AuditLog {
  id         Int      @id @default(autoincrement())
  userId     Int?     @map("user_id")
  action     String   @db.VarChar(100)
  tableName  String?  @map("table_name") @db.VarChar(50)
  recordId   Int?     @map("record_id")
  changes    Json?
  ipAddress  String?  @map("ip_address") @db.VarChar(50)
  timestamp  DateTime @default(now())

  // Relations
  user User? @relation(fields: [userId], references: [id], onDelete: SetNull)

  @@map("audit_logs")
}
```

### Step 6: Configure Environment Variables

Edit `.env` in backend directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/synostosis_care?schema=public"

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
REFRESH_TOKEN_EXPIRES_IN=7d

# File Upload
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Step 7: Create Backend Directory Structure

```bash
mkdir -p src/{config,controllers,middleware,routes,services,utils,types}
mkdir -p uploads/{images,documents}
mkdir -p tests/{unit,integration}
```

### Step 8: Setup Frontend

```bash
cd ../frontend

# Create Vite React TypeScript project
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install UI and styling libraries
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install UI component library
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install @radix-ui/react-label @radix-ui/react-select
npm install @radix-ui/react-tabs @radix-ui/react-toast
npm install class-variance-authority clsx tailwind-merge
npm install lucide-react

# Install form handling
npm install react-hook-form @hookform/resolvers zod

# Install data fetching
npm install @tanstack/react-query axios

# Install routing
npm install react-router-dom

# Install charts
npm install recharts

# Install date utilities
npm install date-fns

# Install other utilities
npm install react-image-gallery
npm install @types/react-image-gallery -D
```

### Step 9: Configure Tailwind CSS (Frontend)

Edit `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [],
}
```

### Step 10: Create Frontend Directory Structure

```bash
mkdir -p src/{components/{common,layout,patients,surgeries,followups,charts},pages,hooks,contexts,services,utils,types,assets}
```

---

## Phase 1: Foundation

### Step 1.1: Setup Database

```bash
cd backend

# Create PostgreSQL database
createdb synostosis_care

# Or using psql
psql -U postgres
CREATE DATABASE synostosis_care;
\q

# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma Client
npx prisma generate
```

### Step 1.2: Create Basic Backend Server

Create `backend/src/index.ts`:

```typescript
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;
const prisma = new PrismaClient();

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes
app.get('/api/v1', (req: Request, res: Response) => {
  res.json({
    message: 'Craniosynostosis Tracker API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/v1/auth',
      patients: '/api/v1/patients',
      surgeries: '/api/v1/surgeries',
      followups: '/api/v1/followups',
      measurements: '/api/v1/measurements',
      images: '/api/v1/images',
      users: '/api/v1/users'
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`⚡️ Server is running on port ${port}`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

### Step 1.3: Add Scripts to package.json

Edit `backend/package.json`:

```json
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "prisma:migrate": "prisma migrate dev",
    "prisma:generate": "prisma generate",
    "prisma:studio": "prisma studio",
    "test": "jest",
    "lint": "eslint src/**/*.ts",
    "format": "prettier --write \"src/**/*.ts\""
  }
}
```

### Step 1.4: Test Backend Server

```bash
# Start the server
npm run dev

# In another terminal, test the health endpoint
curl http://localhost:5000/health
```

### Step 1.5: Implement Authentication

Create `backend/src/middleware/auth.ts`:

```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: string;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: { code: 'NO_TOKEN', message: 'Authentication token required' }
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'Invalid or expired token' }
    });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Insufficient permissions' }
      });
    }
    next();
  };
};
```

Create `backend/src/controllers/auth.controller.ts`:

```typescript
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Check if user exists
    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ username }, { email }] }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { code: 'USER_EXISTS', message: 'User already exists' }
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        passwordHash,
        firstName,
        lastName,
        role: role || 'viewer'
      },
      select: {
        id: true,
        username: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true
      }
    });

    res.status(201).json({
      success: true,
      data: user,
      message: 'User created successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'REGISTRATION_ERROR', message: 'Failed to register user' }
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await prisma.user.findUnique({ where: { username } });

    if (!user || !user.isActive) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
      });
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.passwordHash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Invalid credentials' }
      });
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    });

    // Generate tokens
    const accessToken = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET!,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        },
        accessToken,
        refreshToken
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { code: 'LOGIN_ERROR', message: 'Failed to login' }
    });
  }
};
```

Create `backend/src/routes/auth.routes.ts`:

```typescript
import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);

export default router;
```

Update `backend/src/index.ts` to include auth routes:

```typescript
// Add after other imports
import authRoutes from './routes/auth.routes';

// Add after middleware
app.use('/api/v1/auth', authRoutes);
```

### Step 1.6: Create Initial Admin User

Create `backend/src/scripts/createAdmin.ts`:

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  const passwordHash = await bcrypt.hash('admin123', 12);

  const admin = await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@synostosis.care',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    }
  });

  console.log('Admin user created:', admin);
}

createAdmin()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run it:

```bash
tsx src/scripts/createAdmin.ts
```

### Step 1.7: Setup Basic Frontend

Create `frontend/src/App.tsx`:

```typescript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/common/PrivateRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
```

This guide continues with detailed implementation steps for each phase. Due to length constraints, I've provided the foundation and setup. The remaining phases would follow similar detailed patterns for:

- Phase 2: Patient CRUD operations
- Phase 3: Surgery management
- Phase 4: Follow-up tracking
- Phase 5: Image management
- Phase 6: Analytics
- Phase 7: Testing
- Phase 8: Deployment

Would you like me to continue with specific phases in detail?

---

## Quick Start Commands

```bash
# Backend
cd backend
npm run dev

# Frontend (in another terminal)
cd frontend
npm run dev

# Database management
cd backend
npx prisma studio        # Open database GUI
npx prisma migrate dev   # Create new migration
npx prisma db seed       # Seed database
```

## Next Steps

1. Follow each phase sequentially
2. Test thoroughly after each phase
3. Commit code regularly
4. Document any customizations
5. Review security before deployment

For detailed implementation of remaining phases, refer to the phase-specific documentation or request additional sections.
