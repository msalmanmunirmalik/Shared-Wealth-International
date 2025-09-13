import React, { useState, useRef } from 'react';
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { fileUploadService } from '@/services/fileUploadService';
import { toast } from 'sonner';

interface FileUploadProps {
  entityType: 'company' | 'project' | 'event' | 'user';
  entityId: string;
  onUploadComplete?: (files: any[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
}

interface UploadedFile {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  uploadType: string;
  uploadedAt: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  entityType,
  entityId,
  onUploadComplete,
  maxFiles = 5,
  maxSize = 10, // 10MB default
  acceptedTypes = ['image/*', 'application/pdf', 'text/*'],
  className = ''
}) => {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (selectedFiles: FileList | File[]) => {
    const fileArray = Array.from(selectedFiles);
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach(file => {
      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        errors.push(`${file.name} is too large (max ${maxSize}MB)`);
        return;
      }

      // Check file type
      const isValidType = acceptedTypes.some(type => {
        if (type.endsWith('/*')) {
          return file.type.startsWith(type.slice(0, -1));
        }
        return file.type === type;
      });

      if (!isValidType) {
        errors.push(`${file.name} has an invalid file type`);
        return;
      }

      // Check total files limit
      if (files.length + validFiles.length >= maxFiles) {
        errors.push(`Maximum ${maxFiles} files allowed`);
        return;
      }

      validFiles.push(file);
    });

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error));
    }

    if (validFiles.length > 0) {
      setFiles(prev => [...prev, ...validFiles]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = files.map(async (file, index) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('entityType', entityType);
        formData.append('entityId', entityId);
        formData.append('uploadType', 'document');

        const response = await fileUploadService.uploadFile(formData);
        
        // Update progress
        setUploadProgress(((index + 1) / files.length) * 100);
        
        return response;
      });

      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(result => result.success);
      
      setUploadedFiles(prev => [...prev, ...successfulUploads.map(r => r.data)]);
      setFiles([]);
      
      onUploadComplete?.(successfulUploads.map(r => r.data));
      toast.success(`${successfulUploads.length} file(s) uploaded successfully!`);
      
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType === 'application/pdf') return '📄';
    if (mimeType.startsWith('text/')) return '📝';
    return '📁';
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <Card
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <Upload className="h-12 w-12 mx-auto text-gray-400" />
            <div>
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <p className="text-gray-500">
                Drag and drop files here, or click to select
              </p>
            </div>
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
            >
              Choose Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept={acceptedTypes.join(',')}
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
              className="hidden"
            />
            <p className="text-sm text-gray-400">
              Max {maxFiles} files, {maxSize}MB each
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Selected Files */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Selected Files ({files.length})</h4>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getFileIcon(file.type)}</span>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
            
            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{Math.round(uploadProgress)}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
            
            <Button
              onClick={uploadFiles}
              disabled={isUploading || files.length === 0}
              className="w-full mt-4"
            >
              {isUploading ? 'Uploading...' : `Upload ${files.length} File(s)`}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-3">Uploaded Files ({uploadedFiles.length})</h4>
            <div className="space-y-2">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="font-medium">{file.originalFilename}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.fileSize)}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
