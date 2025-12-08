"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
// Middleware
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Craniosynostosis Tracker API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Craniosynostosis Patient Tracking System API',
        version: '1.0.0',
        status: 'active'
    });
});
// API info endpoint
app.get('/api/v1', (req, res) => {
    res.json({
        message: 'Craniosynostosis Tracker API v1',
        version: '1.0.0',
        endpoints: {
            health: '/health',
            auth: '/api/v1/auth (Phase 1)',
            patients: '/api/v1/patients (Phase 2+)',
            surgeries: '/api/v1/surgeries (Phase 6+)',
            followups: '/api/v1/followups (Phase 9+)',
            measurements: '/api/v1/measurements (Phase 5+)',
            images: '/api/v1/images (Phase 10+)'
        }
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        error: {
            code: 'NOT_FOUND',
            message: 'Endpoint not found'
        }
    });
});
// Error handling middleware
app.use((err, req, res, next) => {
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
//# sourceMappingURL=index.js.map