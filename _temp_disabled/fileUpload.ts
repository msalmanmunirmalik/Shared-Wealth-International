import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';

// File upload configuration
const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '10485760'); // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Create subdirectories
const subdirs = ['logos', 'documents', 'images', 'temp'];
subdirs.forEach(subdir => {
  const dirPath = path.join(UPLOAD_DIR, subdir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = UPLOAD_DIR;
    
    // Determine subdirectory based on file type
    if (file.fieldname === 'logo' || ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      uploadPath = path.join(UPLOAD_DIR, 'logos');
    } else if (ALLOWED_DOCUMENT_TYPES.includes(file.mimetype)) {
      uploadPath = path.join(UPLOAD_DIR, 'documents');
    } else {
      uploadPath = path.join(UPLOAD_DIR, 'temp');
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Multer configuration
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 5 // Maximum 5 files per request
  },
  fileFilter: fileFilter
});

// Image processing utility
export const processImage = async (inputPath: string, outputPath: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
} = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 80,
    format = 'jpeg'
  } = options;

  try {
    await sharp(inputPath)
      .resize(width, height, { 
        fit: 'inside',
        withoutEnlargement: true 
      })
      .jpeg({ quality })
      .toFile(outputPath);
    
    return outputPath;
  } catch (error) {
    console.error('Image processing error:', error);
    throw new Error('Failed to process image');
  }
};

// Logo processing utility
export const processLogo = async (inputPath: string, outputDir: string) => {
  const filename = path.basename(inputPath, path.extname(inputPath));
  
  try {
    // Create different sizes
    const sizes = [
      { name: 'small', width: 64, height: 64 },
      { name: 'medium', width: 128, height: 128 },
      { name: 'large', width: 256, height: 256 }
    ];

    const processedFiles: Array<{
      size: string;
      path: string;
      width: number;
      height: number;
    }> = [];

    for (const size of sizes) {
      const outputPath = path.join(outputDir, `${filename}-${size.name}.jpg`);
      await processImage(inputPath, outputPath, {
        width: size.width,
        height: size.height,
        quality: 90
      });
      processedFiles.push({
        size: size.name,
        path: outputPath,
        width: size.width,
        height: size.height
      });
    }

    return processedFiles;
  } catch (error) {
    console.error('Logo processing error:', error);
    throw new Error('Failed to process logo');
  }
};

// File cleanup utility
export const cleanupFile = async (filePath: string) => {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Cleaned up file: ${filePath}`);
    }
  } catch (error) {
    console.error('File cleanup error:', error);
  }
};

// Get file info utility
export const getFileInfo = (filePath: string) => {
  try {
    const stats = fs.statSync(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      isFile: stats.isFile(),
      isDirectory: stats.isDirectory()
    };
  } catch (error) {
    console.error('Get file info error:', error);
    return null;
  }
};

// File validation utility
export const validateFile = (file: any) => {
  const errors: string[] = [];

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    errors.push(`File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`);
  }

  // Check file type
  const allowedTypes = [...ALLOWED_IMAGE_TYPES, ...ALLOWED_DOCUMENT_TYPES];
  if (!allowedTypes.includes(file.mimetype)) {
    errors.push(`File type ${file.mimetype} is not allowed`);
  }

  // Check file extension
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.pdf', '.txt', '.doc', '.docx'];
  const fileExtension = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.includes(fileExtension)) {
    errors.push(`File extension ${fileExtension} is not allowed`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Generate file URL utility
export const generateFileUrl = (filePath: string, baseUrl: string = process.env.BASE_URL || 'http://localhost:3001') => {
  const relativePath = path.relative(process.cwd(), filePath);
  return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
};

// File upload middleware for different types
export const uploadLogo = upload.single('logo');
export const uploadDocument = upload.single('document');
export const uploadMultiple = upload.array('files', 5);

// Error handling middleware
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Too many files. Maximum 5 files allowed.'
      });
    }
    if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Unexpected file field.'
      });
    }
  }
  
  if (error.message.includes('File type')) {
    return res.status(400).json({
      success: false,
      message: error.message
    });
  }

  next(error);
};
