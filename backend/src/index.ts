import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import patientRoutes from './routes/patient.routes';

// Load environment variables
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 5000;

// Middleware
// Support multiple CORS origins for dev and Docker
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Craniosynostosis Tracker API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root endpoint
app.get('/', (_req: Request, res: Response) => {
  res.json({
    message: 'Craniosynostosis Patient Tracking System API',
    version: '1.0.0',
    status: 'active'
  });
});

// API info endpoint
app.get('/api/v1', (_req: Request, res: Response) => {
  res.json({
    message: 'Craniosynostosis Tracker API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/v1/auth',
      patients: '/api/v1/patients (Phase 2+)',
      surgeries: '/api/v1/surgeries (Phase 6+)',
      followups: '/api/v1/followups (Phase 9+)',
      measurements: '/api/v1/measurements (Phase 5+)',
      images: '/api/v1/images (Phase 10+)'
    }
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/patients', patientRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint not found'
    }
  });
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: any) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    }
  });
});

// Start server
app.listen(port, () => {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🏥 Craniosynostosis Patient Tracking System');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`⚡️ Server running on port ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${port}/health`);
  console.log(`📡 API endpoint: http://localhost:${port}/api/v1`);
  console.log('═══════════════════════════════════════════════════════');
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});
