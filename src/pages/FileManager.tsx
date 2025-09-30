import React, { useState, useEffect } from 'react';
import { Upload, File, Folder, Download, Trash2, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/files/FileUpload';
import { apiService } from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface FileData {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  uploadType: string;
  uploadedAt: string;
  uploadedBy: string;
  relatedEntityType: string;
  relatedEntityId: string;
}

const FileManagerPage: React.FC = () => {
  const { user } = useAuth();
  const [files, setFiles] = useState<FileData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getUserFiles();
      if (response.success) {
        setFiles(response.data);
      }
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setIsLoading(false);
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
    if (mimeType.includes('video')) return '🎥';
    if (mimeType.includes('audio')) return '🎵';
    return '📁';
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.originalFilename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || file.mimeType.startsWith(filterType);
    return matchesSearch && matchesFilter;
  });

  const fileTypes = [
    { type: 'all', label: 'All Files', count: files.length },
    { type: 'image', label: 'Images', count: files.filter(f => f.mimeType.startsWith('image/')).length },
    { type: 'application', label: 'Documents', count: files.filter(f => f.mimeType.startsWith('application/')).length },
    { type: 'text', label: 'Text Files', count: files.filter(f => f.mimeType.startsWith('text/')).length },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">File Manager</h1>
              <p className="text-gray-600 mt-2">
                Manage and organize your uploaded files
              </p>
            </div>
            <Button onClick={() => setShowUpload(!showUpload)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
          </div>
        </div>

        {/* File Upload Section */}
        {showUpload && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Upload New Files</CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload
                entityType="user"
                entityId={user?.id || ''}
                maxFiles={10}
                maxSize={50}
                acceptedTypes={['image/*', 'application/pdf', 'text/*', 'video/*', 'audio/*']}
                onUploadComplete={() => {
                  loadFiles();
                  setShowUpload(false);
                }}
              />
            </CardContent>
          </Card>
        )}

        {/* File Type Filters */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {fileTypes.map((fileType) => (
              <Button
                key={fileType.type}
                variant={filterType === fileType.type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(fileType.type)}
              >
                {fileType.label}
                <Badge variant="secondary" className="ml-2">
                  {fileType.count}
                </Badge>
              </Button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <Input
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Files Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse mt-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredFiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFiles.map((file) => (
              <Card key={file.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getFileIcon(file.mimeType)}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{file.originalFilename}</h3>
                      <p className="text-sm text-gray-500">{formatFileSize(file.fileSize)}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {file.uploadType}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {file.mimeType.split('/')[0]}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-4">
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Folder className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No files found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'No files match your search criteria.' : 'Upload your first file to get started.'}
              </p>
              <Button onClick={() => setShowUpload(true)}>
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default FileManagerPage;
