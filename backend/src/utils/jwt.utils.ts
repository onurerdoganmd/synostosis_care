/**
 * JWT Utility Functions
 * Handles token generation and verification with comprehensive error handling
 * Phase 1 - Authentication System
 */

import jwt from 'jsonwebtoken';

// Token payload interface
export interface TokenPayload {
  id: number;
  username: string;
  role: string;
}

// Get secrets from environment variables with validation
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

// Validate that secrets are set
if (!JWT_SECRET || !REFRESH_TOKEN_SECRET) {
  throw new Error('JWT_SECRET and REFRESH_TOKEN_SECRET must be set in environment variables');
}

/**
 * Generate access token
 * Short-lived token for API access (default: 15 minutes)
 */
export function generateAccessToken(payload: TokenPayload): string {
  try {
    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'synostosis-care-api',
      subject: payload.id.toString()
    });
  } catch (error) {
    console.error('Error generating access token:', error);
    throw new Error('Failed to generate access token');
  }
}

/**
 * Generate refresh token
 * Long-lived token for refreshing access tokens (default: 7 days)
 */
export function generateRefreshToken(payload: { id: number }): string {
  try {
    return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
      issuer: 'synostosis-care-api',
      subject: payload.id.toString()
    });
  } catch (error) {
    console.error('Error generating refresh token:', error);
    throw new Error('Failed to generate refresh token');
  }
}

/**
 * Verify access token
 * Returns decoded payload if valid, throws error if invalid
 */
export function verifyAccessToken(token: string): TokenPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: 'synostosis-care-api'
    }) as jwt.JwtPayload;

    // Validate payload structure
    if (!decoded.id || !decoded.username || !decoded.role) {
      throw new Error('Invalid token payload structure');
    }

    return {
      id: decoded.id,
      username: decoded.username,
      role: decoded.role
    };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Access token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid access token');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Access token not yet valid');
    } else {
      throw new Error('Token verification failed');
    }
  }
}

/**
 * Verify refresh token
 * Returns user ID if valid, throws error if invalid
 */
export function verifyRefreshToken(token: string): number {
  try {
    const decoded = jwt.verify(token, REFRESH_TOKEN_SECRET, {
      issuer: 'synostosis-care-api'
    }) as jwt.JwtPayload;

    if (!decoded.id) {
      throw new Error('Invalid refresh token payload');
    }

    return decoded.id;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error('Refresh token expired');
    } else if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('Invalid refresh token');
    } else if (error instanceof jwt.NotBeforeError) {
      throw new Error('Refresh token not yet valid');
    } else {
      throw new Error('Refresh token verification failed');
    }
  }
}

/**
 * Decode token without verification (for debugging only)
 * DO NOT use for authentication - only for testing/debugging
 */
export function decodeToken(token: string): jwt.JwtPayload | null {
  try {
    return jwt.decode(token) as jwt.JwtPayload;
  } catch (error) {
    return null;
  }
}

/**
 * Check if token is expired (without throwing error)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded || !decoded.exp) {
      return true;
    }
    return decoded.exp * 1000 < Date.now();
  } catch (error) {
    return true;
  }
}

/**
 * Get token expiration time
 */
export function getTokenExpiration(token: string): Date | null {
  try {
    const decoded = jwt.decode(token) as jwt.JwtPayload;
    if (!decoded || !decoded.exp) {
      return null;
    }
    return new Date(decoded.exp * 1000);
  } catch (error) {
    return null;
  }
}
