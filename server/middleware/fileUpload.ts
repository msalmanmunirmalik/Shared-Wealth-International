import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { Request } from 'express';

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Create subdirectories for different file types
const subdirs = ['logos', 'documents', 'images', 'general'];
subdirs.forEach(subdir => {
  const dir = path.join(uploadDir, subdir);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// File type validation
const allowedMimeTypes = {
  images: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  logos: ['image/jpeg', 'image/png', 'image/svg+xml'],
  general: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']
};

const maxFileSizes = {
  images: 5 * 1024 * 1024, // 5MB
  documents: 10 * 1024 * 1024, // 10MB
  logos: 2 * 1024 * 1024, // 2MB
  general: 10 * 1024 * 1024 // 10MB
};

// Generate unique filename
const generateUniqueFilename = (originalname: string): string => {
  const ext = path.extname(originalname);
  const name = path.basename(originalname, ext);
  const hash = crypto.randomBytes(16).toString('hex');
  return `${name}-${hash}${ext}`;
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uploadType = req.body.uploadType || 'general';
    const subdir = uploadType === 'logo' ? 'logos' : 
                   uploadType === 'document' ? 'documents' :
                   file.mimetype.startsWith('image/') ? 'images' : 'general';
    cb(null, path.join(uploadDir, subdir));
  },
  filename: (req: Request, file: Express.Multer.File, cb: Function) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {
  const uploadType = req.body.uploadType || 'general';
  const allowedTypes = allowedMimeTypes[uploadType as keyof typeof allowedMimeTypes] || allowedMimeTypes.general;
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB default
    files: 5 // Maximum 5 files per request
  }
});

// Specific upload configurations
export const uploadLogo = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadDir, 'logos'));
    },
    filename: (req, file, cb) => {
      const uniqueName = generateUniqueFilename(file.originalname);
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.logos.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, and SVG files are allowed for logos') as any, false);
    }
  },
  limits: {
    fileSize: maxFileSizes.logos,
    files: 1
  }
});

export const uploadDocument = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadDir, 'documents'));
    },
    filename: (req, file, cb) => {
      const uniqueName = generateUniqueFilename(file.originalname);
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.documents.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and Word documents are allowed') as any, false);
    }
  },
  limits: {
    fileSize: maxFileSizes.documents,
    files: 5
  }
});

export const uploadImage = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(uploadDir, 'images'));
    },
    filename: (req, file, cb) => {
      const uniqueName = generateUniqueFilename(file.originalname);
      cb(null, uniqueName);
    }
  }),
  fileFilter: (req, file, cb) => {
    if (allowedMimeTypes.images.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only JPEG, PNG, GIF, and WebP images are allowed') as any, false);
    }
  },
  limits: {
    fileSize: maxFileSizes.images,
    files: 10
  }
});

// Error handling middleware
export const handleUploadError = (error: any, req: Request, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 10MB.'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({
          success: false,
          message: 'Too many files. Maximum 5 files allowed.'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({
          success: false,
          message: 'Unexpected field name.'
        });
      default:
        return res.status(400).json({
          success: false,
          message: 'File upload error: ' + error.message
        });
    }
  }
  
  if (error.message.includes('Invalid file type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
  
  next(error);
};

// File validation utility
export const validateFile = (file: Express.Multer.File, uploadType: string = 'general') => {
  const allowedTypes = allowedMimeTypes[uploadType as keyof typeof allowedMimeTypes] || allowedMimeTypes.general;
  const maxSize = maxFileSizes[uploadType as keyof typeof maxFileSizes] || maxFileSizes.general;
  
  if (!allowedTypes.includes(file.mimetype)) {
    throw new Error(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
  
  if (file.size > maxSize) {
    throw new Error(`File too large. Maximum size: ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  return true;
};

// Clean up old files utility
export const cleanupOldFiles = async (daysOld: number = 30) => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);
  
  const cleanupDir = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile() && stats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up old file: ${filePath}`);
      }
    });
  };
  
  // Clean up all subdirectories
  subdirs.forEach(subdir => {
    cleanupDir(path.join(uploadDir, subdir));
  });
};

export default upload;
