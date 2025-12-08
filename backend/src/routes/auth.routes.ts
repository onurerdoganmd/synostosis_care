/**
 * Authentication Routes
 * Handles user registration, login, token refresh, and user info
 * Phase 1 - Authentication System
 */

import { Router } from 'express';
import { register, login, refreshToken, getCurrentUser } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

/**
 * @route   POST /api/v1/auth/register
 * @desc    Register new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and get tokens
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/v1/auth/refresh
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh', refreshToken);

/**
 * @route   GET /api/v1/auth/me
 * @desc    Get current user information
 * @access  Private (requires authentication)
 */
router.get('/me', authenticate, getCurrentUser);

export default router;
