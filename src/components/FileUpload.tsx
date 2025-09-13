import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { fileUploadService, FileUploadResponse } from '@/services/fileUploadService';
import { 
  Upload, 
  X, 
  File, 
  Image, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Download,
  Trash2,
  Eye
} from 'lucide-react';

interface FileUploadProps {
  uploadType?: 'general' | 'logo' | 'document' | 'image';
  multiple?: boolean;
  maxFiles?: number;
  relatedEntityType?: string;
  relatedEntityId?: string;
  onUploadComplete?: (files: FileUploadResponse[]) => void;
  onUploadError?: (error: string) => void;
  className?: string;
  disabled?: boolean;
}

interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
  result?: FileUploadResponse;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  uploadType = 'general',
  multiple = false,
  maxFiles = 5,
  relatedEntityType,
  relatedEntityId,
  onUploadComplete,
  onUploadError,
  className = '',
  disabled = false
}) => {
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    
    if (fileArray.length === 0) return;
    
    if (!multiple && fileArray.length > 1) {
      toast({
        title: 'Error',
        description: 'Only one file can be uploaded at a time',
        variant: 'destructive'
      });
      return;
    }
    
    if (fileArray.length > maxFiles) {
      toast({
        title: 'Error',
        description: `Maximum ${maxFiles} files allowed`,
        variant: 'destructive'
      });
      return;
    }

    // Validate files
    const validationErrors: string[] = [];
    fileArray.forEach(file => {
      const validation = fileUploadService.validateFile(file, uploadType);
      if (!validation.isValid) {
        validationErrors.push(`${file.name}: ${validation.errors.join(', ')}`);
      }
    });

    if (validationErrors.length > 0) {
      toast({
        title: 'Validation Error',
        description: validationErrors.join('; '),
        variant: 'destructive'
      });
      onUploadError?.(validationErrors.join('; '));
      return;
    }

    // Create uploading file objects
    const newUploadingFiles: UploadingFile[] = fileArray.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      progress: 0,
      status: 'uploading'
    }));

    setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

    try {
      if (multiple) {
        // Upload multiple files
        const result = await fileUploadService.uploadMultipleFiles(
          fileArray,
          uploadType,
          relatedEntityType,
          relatedEntityId
        );

        // Update uploading files with results
        setUploadingFiles(prev => 
          prev.map(uploadingFile => {
            const uploadedFile = result.uploadedFiles.find(
              f => f.originalName === uploadingFile.file.name
            );
            
            if (uploadedFile) {
              return {
                ...uploadingFile,
                progress: 100,
                status: 'success' as const,
                result: uploadedFile
              };
            } else {
              return {
                ...uploadingFile,
                progress: 100,
                status: 'error' as const,
                error: 'Upload failed'
              };
            }
          })
        );

        if (result.uploadedFiles.length > 0) {
          onUploadComplete?.(result.uploadedFiles);
          toast({
            title: 'Upload Complete',
            description: `${result.uploadedFiles.length} file(s) uploaded successfully`
          });
        }

        if (result.errors && result.errors.length > 0) {
          toast({
            title: 'Upload Errors',
            description: result.errors.join('; '),
            variant: 'destructive'
          });
          onUploadError?.(result.errors.join('; '));
        }
      } else {
        // Upload single file
        const file = fileArray[0];
        const uploadingFile = newUploadingFiles[0];
        
        try {
          const result = await fileUploadService.uploadFile(
            file,
            uploadType,
            relatedEntityType,
            relatedEntityId
          );

          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadingFile.id 
                ? {
                    ...f,
                    progress: 100,
                    status: 'success' as const,
                    result
                  }
                : f
            )
          );

          onUploadComplete?.([result]);
          toast({
            title: 'Upload Complete',
            description: 'File uploaded successfully'
          });
        } catch (error) {
          setUploadingFiles(prev => 
            prev.map(f => 
              f.id === uploadingFile.id 
                ? {
                    ...f,
                    progress: 100,
                    status: 'error' as const,
                    error: error instanceof Error ? error.message : 'Upload failed'
                  }
                : f
            )
          );

          const errorMessage = error instanceof Error ? error.message : 'Upload failed';
          onUploadError?.(errorMessage);
          toast({
            title: 'Upload Error',
            description: errorMessage,
            variant: 'destructive'
          });
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onUploadError?.(errorMessage);
      toast({
        title: 'Upload Error',
        description: errorMessage,
        variant: 'destructive'
      });
    }
  }, [uploadType, multiple, maxFiles, relatedEntityType, relatedEntityId, onUploadComplete, onUploadError, toast]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    if (disabled) return;
    
    const files = e.dataTransfer.files;
    handleFileSelect(files);
  }, [disabled, handleFileSelect]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileSelect(files);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [handleFileSelect]);

  const removeUploadingFile = useCallback((id: string) => {
    setUploadingFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="h-4 w-4" />;
    if (file.type.includes('pdf') || file.type.includes('document')) return <FileText className="h-4 w-4" />;
    return <File className="h-4 w-4" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {/* Upload Area */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          isDragOver 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <CardContent className="flex flex-col items-center justify-center p-8">
          <Upload className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            {isDragOver ? 'Drop files here' : 'Upload Files'}
          </h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            {multiple 
              ? `Drag and drop up to ${maxFiles} files here, or click to select`
              : 'Drag and drop a file here, or click to select'
            }
          </p>
          <Badge variant="outline" className="mb-4">
            {uploadType.charAt(0).toUpperCase() + uploadType.slice(1)}
          </Badge>
          <Button 
            type="button" 
            variant="outline" 
            disabled={disabled}
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
          >
            Choose Files
          </Button>
        </CardContent>
      </Card>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        onChange={handleFileInputChange}
        className="hidden"
        accept={
          uploadType === 'logo' 
            ? 'image/jpeg,image/png,image/svg+xml'
            : uploadType === 'document'
            ? 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            : uploadType === 'image'
            ? 'image/jpeg,image/png,image/gif,image/webp'
            : '*'
        }
      />

      {/* Uploading Files */}
      {uploadingFiles.length > 0 && (
        <div className="mt-4 space-y-2">
          {uploadingFiles.map((uploadingFile) => (
            <Card key={uploadingFile.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  {getFileIcon(uploadingFile.file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {uploadingFile.file.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {fileUploadService.formatFileSize(uploadingFile.file.size)}
                    </p>
                  </div>
                  {getStatusIcon(uploadingFile.status)}
                </div>
                
                {uploadingFile.status === 'uploading' && (
                  <div className="flex items-center space-x-2">
                    <Progress value={uploadingFile.progress} className="w-20" />
                    <span className="text-xs text-gray-500">{uploadingFile.progress}%</span>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeUploadingFile(uploadingFile.id)}
                  className="ml-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              {uploadingFile.status === 'error' && uploadingFile.error && (
                <Alert className="mt-2" variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{uploadingFile.error}</AlertDescription>
                </Alert>
              )}
              
              {uploadingFile.status === 'success' && uploadingFile.result && (
                <div className="mt-2 flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(uploadingFile.result!.publicUrl, '_blank')}
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = uploadingFile.result!.publicUrl;
                      link.download = uploadingFile.result!.originalName;
                      link.click();
                    }}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;
