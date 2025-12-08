/**
 * Authentication Middleware
 * Protects routes and validates JWT tokens
 * Phase 1 - Authentication System
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt.utils';
import { findUserById } from '../data/database';

// Extend Express Request to include user
export interface AuthRequest extends Request {
  user?: TokenPayload;
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({
        success: false,
        error: {
          code: 'NO_TOKEN',
          message: 'Authentication token is required'
        }
      });
      return;
    }

    // Check format: "Bearer <token>"
    const parts = authHeader.split(' ');

    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_TOKEN_FORMAT',
          message: 'Token must be in format: Bearer <token>'
        }
      });
      return;
    }

    const token = parts[1];

    // Verify token
    let payload: TokenPayload;
    try {
      payload = verifyAccessToken(token);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Invalid token';

      res.status(401).json({
        success: false,
        error: {
          code: 'TOKEN_VERIFICATION_FAILED',
          message: errorMessage
        }
      });
      return;
    }

    // Verify user still exists and is active
    const user = findUserById(payload.id);

    if (!user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_NOT_FOUND',
          message: 'User no longer exists'
        }
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        error: {
          code: 'USER_INACTIVE',
          message: 'User account is inactive'
        }
      });
      return;
    }

    // Attach user payload to request
    req.user = payload;

    // Continue to next middleware
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({
      success: false,
      error: {
        code: 'AUTH_ERROR',
        message: 'Authentication failed'
      }
    });
  }
}

/**
 * Authorization middleware - Check user role
 * Use after authenticate middleware
 */
export function authorize(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      // User should be attached by authenticate middleware
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

      // Check if user role is allowed
      if (!allowedRoles.includes(req.user.role)) {
        res.status(403).json({
          success: false,
          error: {
            code: 'INSUFFICIENT_PERMISSIONS',
            message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
          }
        });
        return;
      }

      // User is authorized
      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'AUTH_ERROR',
          message: 'Authorization failed'
        }
      });
    }
  };
}

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export function optionalAuthenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token present, continue without user
      next();
      return;
    }

    const token = authHeader.split(' ')[1];

    try {
      const payload = verifyAccessToken(token);
      const user = findUserById(payload.id);

      if (user && user.isActive) {
        req.user = payload;
      }
    } catch (error) {
      // Token invalid, but we don't fail the request
      console.log('Optional auth failed:', error);
    }

    next();
  } catch (error) {
    // Don't fail request on optional auth error
    next();
  }
}
