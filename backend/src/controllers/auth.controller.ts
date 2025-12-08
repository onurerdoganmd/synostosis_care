/**
 * Authentication Controller
 * Handles user registration, login, and token refresh
 * Phase 1 - Authentication System
 *
 * SECURITY NOTES:
 * - Password hashing: bcrypt with 12 rounds (industry standard)
 * - JWT tokens: Short-lived access tokens (15min) + refresh tokens (7d)
 * - Input validation: Comprehensive checks on all inputs
 * - Error messages: Generic to prevent information leakage
 */

import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import {
  createUser,
  findUserByUsername,
  findUserByEmail,
  findUserById,
  updateUser
} from '../data/database';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.utils';
import { AuthRequest } from '../middleware/auth.middleware';

// Password hashing rounds (12 is recommended for security vs performance balance)
const SALT_ROUNDS = 12;

/**
 * Register new user
 * POST /api/v1/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { username, email, password, firstName, lastName, role } = req.body;

    // Validation: Required fields
    if (!username || !email || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Username, email, and password are required'
        }
      });
      return;
    }

    // Validation: Username format (alphanumeric, 3-50 chars)
    if (!/^[a-zA-Z0-9_]{3,50}$/.test(username)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_USERNAME',
          message: 'Username must be 3-50 alphanumeric characters'
        }
      });
      return;
    }

    // Validation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_EMAIL',
          message: 'Invalid email format'
        }
      });
      return;
    }

    // Validation: Password strength (minimum 8 characters)
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must be at least 8 characters long'
        }
      });
      return;
    }

    // Validation: Password complexity (at least one letter and one number)
    if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
      res.status(400).json({
        success: false,
        error: {
          code: 'WEAK_PASSWORD',
          message: 'Password must contain at least one letter and one number'
        }
      });
      return;
    }

    // Check if username already exists
    if (findUserByUsername(username)) {
      res.status(409).json({
        success: false,
        error: {
          code: 'USERNAME_EXISTS',
          message: 'Username already taken'
        }
      });
      return;
    }

    // Check if email already exists
    if (findUserByEmail(email)) {
      res.status(409).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'Email already registered'
        }
      });
      return;
    }

    // Hash password (bcrypt with 12 rounds)
    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const newUser = createUser({
      username,
      email,
      passwordHash,
      firstName: firstName || null,
      lastName: lastName || null,
      role: role || 'viewer', // Default role
      isActive: true
    });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role
    });

    const refreshToken = generateRefreshToken({
      id: newUser.id
    });

    // Return success (DO NOT return password hash)
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          role: newUser.role,
          createdAt: newUser.createdAt
        },
        accessToken,
        refreshToken
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REGISTRATION_ERROR',
        message: 'Failed to register user'
      }
    });
  }
}

/**
 * Login user
 * POST /api/v1/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { username, password } = req.body;

    // Validation: Required fields
    if (!username || !password) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_FIELDS',
          message: 'Username and password are required'
        }
      });
      return;
    }

    // Find user by username
    const user = findUserByUsername(username);

    // Generic error message to prevent username enumeration
    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password'
        }
      });
      return;
    }

    // Check if user is active
    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          code: 'ACCOUNT_INACTIVE',
          message: 'Account is inactive'
        }
      });
      return;
    }

    // Verify password
    const passwordValid = await bcrypt.compare(password, user.passwordHash);

    if (!passwordValid) {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid username or password'
        }
      });
      return;
    }

    // Update last login timestamp
    updateUser(user.id, { lastLogin: new Date().toISOString() });

    // Generate tokens
    const accessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    const refreshToken = generateRefreshToken({
      id: user.id
    });

    // Return success
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
      error: {
        code: 'LOGIN_ERROR',
        message: 'Login failed'
      }
    });
  }
}

/**
 * Refresh access token
 * POST /api/v1/auth/refresh
 */
export async function refreshToken(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;

    // Validation: Refresh token required
    if (!refreshToken) {
      res.status(400).json({
        success: false,
        error: {
          code: 'MISSING_TOKEN',
          message: 'Refresh token is required'
        }
      });
      return;
    }

    // Verify refresh token
    let userId: number;
    try {
      userId = verifyRefreshToken(refreshToken);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid token';
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_REFRESH_TOKEN',
          message: errorMessage
        }
      });
      return;
    }

    // Find user
    const user = findUserById(userId);

    if (!user || !user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found or inactive'
        }
      });
      return;
    }

    // Generate new access token
    const newAccessToken = generateAccessToken({
      id: user.id,
      username: user.username,
      role: user.role
    });

    // Return new access token
    res.json({
      success: true,
      data: {
        accessToken: newAccessToken
      },
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'REFRESH_ERROR',
        message: 'Failed to refresh token'
      }
    });
  }
}

/**
 * Get current user info
 * GET /api/v1/auth/me
 * Requires authentication
 */
export function getCurrentUser(req: AuthRequest, res: Response): void {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'User not authenticated'
        }
      });
      return;
    }

    // Get full user details
    const user = findUserById(req.user.id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User not found'
        }
      });
      return;
    }

    // Return user info (without password hash)
    res.json({
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'SERVER_ERROR',
        message: 'Failed to get user info'
      }
    });
  }
}
