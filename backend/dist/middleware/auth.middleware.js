"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.checkOwnership = exports.authorizeAdmin = exports.protect = void 0;
const config_1 = require("../config");
const jwt = __importStar(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const logger_1 = __importDefault(require("../config/logger"));
const protect = async (req, res, next) => {
    try {
        let token;
        // Get token from Authorization header
        if (req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        // Get token from cookie
        else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }
        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
        }
        // Verify token
        const decoded = jwt.verify(token, config_1.config.jwt.secret);
        // Check if user exists
        const user = await db_1.default.user.findUnique({
            where: { id: decoded.id },
            select: {
                id: true,
                email: true,
                username: true,
                isActive: true,
            },
        });
        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route',
            });
        }
        // Add user to request object
        req.user = {
            id: user.id,
            email: user.email,
            username: user.username,
        };
        next();
    }
    catch (error) {
        logger_1.default.error('Auth middleware error:', error);
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token',
            });
        }
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                success: false,
                message: 'Token expired',
            });
        }
        res.status(401).json({
            success: false,
            message: 'Not authorized to access this route',
        });
    }
};
exports.protect = protect;
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            message: 'Access denied. Admin privileges required',
        });
    }
};
exports.authorizeAdmin = authorizeAdmin;
// Middleware to check ownership of resources
const checkOwnership = (resourceType) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.id;
            const resourceId = req.params.id;
            if (!userId || !resourceId) {
                return res.status(400).json({
                    success: false,
                    message: 'Missing user ID or resource ID',
                });
            }
            let resource;
            switch (resourceType) {
                case 'bookmark':
                    resource = await db_1.default.bookmark.findUnique({
                        where: { id: resourceId },
                        select: { userId: true },
                    });
                    break;
                case 'folder':
                    resource = await db_1.default.folder.findUnique({
                        where: { id: resourceId },
                        select: { userId: true },
                    });
                    break;
                case 'tag':
                    resource = await db_1.default.tag.findUnique({
                        where: { id: resourceId },
                        select: { userId: true },
                    });
                    break;
                case 'collection':
                    resource = await db_1.default.collection.findUnique({
                        where: { id: resourceId },
                        select: { userId: true, ownerId: true },
                    });
                    break;
                default:
                    return res.status(400).json({
                        success: false,
                        message: 'Invalid resource type',
                    });
            }
            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: `${resourceType} not found`,
                });
            }
            // Check if the user is the owner of the resource
            if (resource.userId !== userId && resource.ownerId !== userId) {
                // For collections and folders, check if the user has collaboration rights
                if (resourceType === 'collection') {
                    const collaborator = await db_1.default.collectionCollaborator.findUnique({
                        where: {
                            collectionId_userId: {
                                collectionId: resourceId,
                                userId,
                            },
                        },
                    });
                    if (!collaborator) {
                        return res.status(403).json({
                            success: false,
                            message: 'Not authorized to access this resource',
                        });
                    }
                    // Check if the operation requires admin or edit rights
                    const requiresEditRights = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
                    if (requiresEditRights && collaborator.permission === 'view') {
                        return res.status(403).json({
                            success: false,
                            message: 'You do not have permission to modify this resource',
                        });
                    }
                }
                else if (resourceType === 'folder') {
                    const collaborator = await db_1.default.folderCollaborator.findUnique({
                        where: {
                            folderId_userId: {
                                folderId: resourceId,
                                userId,
                            },
                        },
                    });
                    if (!collaborator) {
                        return res.status(403).json({
                            success: false,
                            message: 'Not authorized to access this resource',
                        });
                    }
                    // Check if the operation requires admin or edit rights
                    const requiresEditRights = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);
                    if (requiresEditRights && collaborator.permission === 'view') {
                        return res.status(403).json({
                            success: false,
                            message: 'You do not have permission to modify this resource',
                        });
                    }
                }
                else {
                    return res.status(403).json({
                        success: false,
                        message: 'Not authorized to access this resource',
                    });
                }
            }
            next();
        }
        catch (error) {
            logger_1.default.error('Check ownership middleware error:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while checking resource ownership',
            });
        }
    };
};
exports.checkOwnership = checkOwnership;
// Middleware to validate request body against Zod schema
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            return res.status(400).json({
                success: false,
                message: 'Validation error',
                errors: error.errors,
            });
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=auth.middleware.js.map