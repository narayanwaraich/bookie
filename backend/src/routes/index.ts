import { Router } from 'express';
import authRoutes from './auth.routes';
import bookmarkRoutes from './bookmark.routes';
import folderRoutes from './folder.routes';
import tagRoutes from './tag.routes';
import collectionRoutes from './collection.routes'; 
import importExportRoutes from './importExport.routes';
import userRoutes from './user.routes'; 
import syncRoutes from './sync.routes'; 
import { protect } from '../middleware/auth.middleware'; 
import { config } from '../config'; // Import config for potential version reading

const mainRouter = Router(); // Renamed from router to mainRouter
const v1Router = Router(); // Create a router specifically for v1 routes

// --- Public Routes (Not versioned directly, or keep outside /api/v1) ---

// Health check route (remains at /health)
mainRouter.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API version route (Example - could list available versions)
mainRouter.get('/version', (req, res) => {
  // Consider fetching version from package.json dynamically
  res.status(200).json({ currentVersion: 'v1', apiBasePath: '/api/v1' }); 
});

// --- API v1 Routes ---

// Authentication routes (typically not versioned or handled separately)
// Mounting under /api/v1/auth
v1Router.use('/auth', authRoutes);

// Protected resource routes - apply protect middleware here
v1Router.use('/bookmarks', protect, bookmarkRoutes);
v1Router.use('/folders', protect, folderRoutes);
v1Router.use('/tags', protect, tagRoutes);
v1Router.use('/collections', protect, collectionRoutes); 
v1Router.use('/import-export', protect, importExportRoutes);
v1Router.use('/users', protect, userRoutes); // User profile, password change, etc.
v1Router.use('/sync', protect, syncRoutes); // Data synchronization

// Mount the v1 router under the /v1 path
mainRouter.use('/v1', v1Router);

export default mainRouter; // Export the main router
