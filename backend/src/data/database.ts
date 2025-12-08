/**
 * Simple JSON-based database for Phase 1
 * This provides user storage for authentication testing
 * Will be replaced with Prisma in future phases
 */

import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(__dirname, '../../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// User type definition
export interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize users file if it doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  fs.writeFileSync(USERS_FILE, JSON.stringify([]), 'utf-8');
}

/**
 * Read all users from file
 */
export function getAllUsers(): User[] {
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return [];
  }
}

/**
 * Write all users to file
 */
function saveUsers(users: User[]): void {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error saving users:', error);
    throw new Error('Failed to save users');
  }
}

/**
 * Find user by username
 */
export function findUserByUsername(username: string): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase());
}

/**
 * Find user by email
 */
export function findUserByEmail(email: string): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

/**
 * Find user by ID
 */
export function findUserById(id: number): User | undefined {
  const users = getAllUsers();
  return users.find(u => u.id === id);
}

/**
 * Create new user
 */
export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const users = getAllUsers();

  // Check if username or email already exists
  if (findUserByUsername(userData.username)) {
    throw new Error('Username already exists');
  }
  if (findUserByEmail(userData.email)) {
    throw new Error('Email already exists');
  }

  // Generate new ID
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;

  const newUser: User = {
    ...userData,
    id: newId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  users.push(newUser);
  saveUsers(users);

  return newUser;
}

/**
 * Update user
 */
export function updateUser(id: number, updates: Partial<User>): User | null {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);

  if (index === -1) {
    return null;
  }

  users[index] = {
    ...users[index],
    ...updates,
    id: users[index].id, // Prevent ID change
    createdAt: users[index].createdAt, // Prevent createdAt change
    updatedAt: new Date().toISOString()
  };

  saveUsers(users);
  return users[index];
}

/**
 * Delete user (for testing - not used in production)
 */
export function deleteUser(id: number): boolean {
  const users = getAllUsers();
  const filteredUsers = users.filter(u => u.id !== id);

  if (filteredUsers.length === users.length) {
    return false; // User not found
  }

  saveUsers(filteredUsers);
  return true;
}

/**
 * Clear all users (for testing only)
 */
export function clearAllUsers(): void {
  saveUsers([]);
}
