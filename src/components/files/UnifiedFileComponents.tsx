import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiService } from "@/services/api";
import {
  Upload,
  Download,
  Eye,
  Share2,
  Trash2,
  Edit,
  File,
  Image,
  Video,
  Music,
  FileText,
  BarChart3,
  Search,
  Filter,
  MoreVertical,
  Copy,
  ExternalLink
} from "lucide-react";

interface FileItemProps {
  file: any;
  onDownload?: (fileId: string) => void;
  onShare?: (fileId: string) => void;
  onEdit?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  onView?: (fileId: string) => void;
  className?: string;
}

export const FileItem: React.FC<FileItemProps> = ({
  file,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  onView,
  className = ""
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getFileIcon = (mimetype: string) => {
    if (mimetype.startsWith('image/')) return <Image className="w-5 h-5 text-blue-500" />;
    if (mimetype.startsWith('video/')) return <Video className="w-5 h-5 text-purple-500" />;
    if (mimetype.startsWith('audio/')) return <Music className="w-5 h-5 text-green-500" />;
    if (mimetype === 'application/pdf') return <FileText className="w-5 h-5 text-red-500" />;
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            {getFileIcon(file.mimetype)}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {file.original_name}
            </h3>
            <p className="text-xs text-gray-500 mt-1">
              {formatFileSize(file.size)} • {formatDate(file.created_at)}
            </p>
            {file.description && (
              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                {file.description}
              </p>
            )}
            {file.tags && file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {file.tags.slice(0, 3).map((tag: string, index: number) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {file.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{file.tags.length - 3}
                  </Badge>
                )}
              </div>
            )}
          </div>
          <div className="flex-shrink-0 relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="h-8 w-8 p-0"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
            {isMenuOpen && (
              <div className="absolute right-0 top-8 bg-white border rounded-md shadow-lg z-10 min-w-[120px]">
                <div className="py-1">
                  {onView && (
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        onView(file.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </button>
                  )}
                  {onDownload && (
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        onDownload(file.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                  )}
                  {onShare && (
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        onShare(file.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </button>
                  )}
                  {onEdit && (
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        onEdit(file.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </button>
                  )}
                  {onDelete && (
                    <button
                      className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        onDelete(file.id);
                        setIsMenuOpen(false);
                      }}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface FileUploadProps {
  context?: string;
  contextId?: string;
  onUploadComplete?: (files: any[]) => void;
  multiple?: boolean;
  className?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  context = 'general',
  contextId,
  onUploadComplete,
  multiple = false,
  className = ""
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    handleFileUpload(files);
  };

  const handleFileUpload = async (files: File[]) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      if (multiple) {
        files.forEach(file => {
          formData.append('files', file);
        });
      } else {
        formData.append('file', files[0]);
      }

      formData.append('context', context);
      if (contextId) {
        formData.append('contextId', contextId);
      }

      const endpoint = multiple ? '/files/upload/multiple' : '/files/upload';
      const response = await apiService.request(endpoint, {
        method: 'POST',
        body: formData
      });

      if (response.success) {
        setUploadProgress(100);
        toast({
          title: "Success",
          description: `${files.length} file(s) uploaded successfully`,
        });
        
        if (onUploadComplete) {
          onUploadComplete(multiple ? response.data : [response.data]);
        }
      } else {
        throw new Error(response.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload files",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-4 text-gray-400" />
        <p className="text-sm text-gray-600 mb-2">
          {isDragging ? 'Drop files here' : 'Drag and drop files here, or click to select'}
        </p>
        <p className="text-xs text-gray-500 mb-4">
          Supports images, documents, videos, and audio files (max 10MB each)
        </p>
        <Button
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading...' : 'Select Files'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
        />
      </div>
      
      {isUploading && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface FileListProps {
  files: any[];
  onDownload?: (fileId: string) => void;
  onShare?: (fileId: string) => void;
  onEdit?: (fileId: string) => void;
  onDelete?: (fileId: string) => void;
  onView?: (fileId: string) => void;
  className?: string;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  onDownload,
  onShare,
  onEdit,
  onDelete,
  onView,
  className = ""
}) => {
  if (files.length === 0) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <File className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
        <p className="text-gray-500">Upload some files to get started.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {files.map((file) => (
        <FileItem
          key={file.id}
          file={file}
          onDownload={onDownload}
          onShare={onShare}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
};

interface FileManagerProps {
  context?: string;
  contextId?: string;
  userId?: string;
  className?: string;
}

export const UnifiedFileManager: React.FC<FileManagerProps> = ({
  context = 'general',
  contextId,
  userId,
  className = ""
}) => {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileType, setFileType] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadFiles();
  }, [context, contextId, userId, searchTerm, fileType]);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      let response;
      
      if (userId) {
        response = await apiService.getUserFiles(userId, {
          search: searchTerm,
          type: fileType,
          limit: 50
        });
      } else if (context && contextId) {
        response = await apiService.getFilesByContext(context, contextId, {
          search: searchTerm,
          type: fileType,
          limit: 50
        });
      } else {
        response = await apiService.getUserFiles('current', {
          search: searchTerm,
          type: fileType,
          limit: 50
        });
      }

      if (response.success) {
        setFiles(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to load files",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading files:', error);
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async (fileId: string) => {
    try {
      const response = await apiService.request(`/files/${fileId}/download`);
      if (response.success) {
        // Handle file download
        window.open(`/api/files/${fileId}/download`, '_blank');
      }
    } catch (error) {
      console.error('Download error:', error);
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      const response = await apiService.deleteFile(fileId);
      if (response.success) {
        toast({
          title: "Success",
          description: "File deleted successfully",
        });
        loadFiles();
      } else {
        throw new Error(response.message || 'Delete failed');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive"
      });
    }
  };

  const handleUploadComplete = (uploadedFiles: any[]) => {
    setFiles(prev => [...uploadedFiles, ...prev]);
    setShowUpload(false);
  };

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-32">
              <CardContent className="p-4">
                <div className="animate-pulse space-y-2">
                  <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
                  <div className="bg-gray-200 h-3 w-1/2 rounded"></div>
                  <div className="bg-gray-200 h-3 w-1/4 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Files</h2>
          <p className="text-sm text-gray-600">
            {files.length} file{files.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Button onClick={() => setShowUpload(!showUpload)}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Files
        </Button>
      </div>

      {/* Upload Section */}
      {showUpload && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
          </CardHeader>
          <CardContent>
            <FileUpload
              context={context}
              contextId={contextId}
              onUploadComplete={handleUploadComplete}
              multiple={true}
            />
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={fileType}
            onChange={(e) => setFileType(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="">All Types</option>
            <option value="image">Images</option>
            <option value="video">Videos</option>
            <option value="audio">Audio</option>
            <option value="application/pdf">PDFs</option>
            <option value="application/msword">Documents</option>
          </select>
        </div>
      </div>

      {/* File List */}
      <FileList
        files={files}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />
    </div>
  );
};
