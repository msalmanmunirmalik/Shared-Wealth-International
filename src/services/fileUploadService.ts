// File upload service for frontend
// Use environment variable for API URL, fallback based on domain
const getApiBaseUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  
  // Production domains - use same domain to avoid CORS
  if (hostname === 'sharedwealth.net' || 
      hostname === 'www.sharedwealth.net' || 
      hostname.includes('onrender.com')) {
    return `${protocol}//${hostname}/api`;
  }
  
  // Development - use localhost
  return 'http://localhost:8080/api';
};

const API_BASE_URL = getApiBaseUrl();

export interface FileUploadResponse {
  id: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  uploadType: string;
  publicUrl: string;
  uploadedAt: string;
}

export interface MultipleFileUploadResponse {
  uploadedFiles: FileUploadResponse[];
  errors?: string[];
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

class FileUploadService {
  private getAuthHeaders(): Headers {
    const headers = new Headers();
    
    // Add auth token if available
    const session = localStorage.getItem('session');
    if (session) {
      try {
        const sessionData = JSON.parse(session);
        const token = sessionData.access_token || sessionData.session?.access_token;
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
      } catch (error) {
        console.error('Error parsing session from localStorage:', error);
      }
    }
    
    return headers;
  }

  /**
   * Upload a single file
   */
  async uploadFile(
    file: File, 
    uploadType: 'general' | 'logo' | 'document' | 'image' = 'general',
    relatedEntityType?: string,
    relatedEntityId?: string
  ): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadType', uploadType);
    
    if (relatedEntityType) {
      formData.append('relatedEntityType', relatedEntityType);
    }
    if (relatedEntityId) {
      formData.append('relatedEntityId', relatedEntityId);
    }

    const response = await fetch(`${API_BASE_URL}/files/upload`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[], 
    uploadType: 'general' | 'logo' | 'document' | 'image' = 'general',
    relatedEntityType?: string,
    relatedEntityId?: string
  ): Promise<MultipleFileUploadResponse> {
    const formData = new FormData();
    
    files.forEach(file => {
      formData.append('files', file);
    });
    
    formData.append('uploadType', uploadType);
    
    if (relatedEntityType) {
      formData.append('relatedEntityType', relatedEntityType);
    }
    if (relatedEntityId) {
      formData.append('relatedEntityId', relatedEntityId);
    }

    const response = await fetch(`${API_BASE_URL}/files/upload-multiple`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Upload company logo
   */
  async uploadLogo(file: File, companyId?: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('logo', file);
    
    if (companyId) {
      formData.append('companyId', companyId);
    }

    const response = await fetch(`${API_BASE_URL}/files/upload-logo`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Upload document
   */
  async uploadDocument(file: File, documentType?: string): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('document', file);
    
    if (documentType) {
      formData.append('documentType', documentType);
    }

    const response = await fetch(`${API_BASE_URL}/files/upload-document`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Upload image
   */
  async uploadImage(file: File): Promise<FileUploadResponse> {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/files/upload-image`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: formData
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get file information
   */
  async getFile(id: string): Promise<FileUploadResponse> {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Get user's files
   */
  async getUserFiles(uploadType?: string): Promise<FileUploadResponse[]> {
    const url = new URL(`${API_BASE_URL}/files/user/files`);
    if (uploadType) {
      url.searchParams.append('uploadType', uploadType);
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data;
  }

  /**
   * Delete file
   */
  async deleteFile(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/files/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders()
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
  }

  /**
   * Get file URL for serving
   */
  getFileUrl(filename: string, type: 'logo' | 'document' | 'image' | 'general' = 'general'): string {
    return `${API_BASE_URL}/files/serve/${filename}?type=${type}`;
  }

  /**
   * Validate file before upload
   */
  validateFile(file: File, uploadType: 'general' | 'logo' | 'document' | 'image' = 'general'): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // File size validation
    const maxSizes = {
      general: 10 * 1024 * 1024, // 10MB
      logo: 2 * 1024 * 1024, // 2MB
      document: 10 * 1024 * 1024, // 10MB
      image: 5 * 1024 * 1024 // 5MB
    };

    if (file.size > maxSizes[uploadType]) {
      errors.push(`File size must be less than ${Math.round(maxSizes[uploadType] / 1024 / 1024)}MB`);
    }

    // File type validation
    const allowedTypes = {
      general: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
      logo: ['image/jpeg', 'image/png', 'image/svg+xml'],
      document: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      image: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    };

    if (!allowedTypes[uploadType].includes(file.type)) {
      errors.push(`Invalid file type. Allowed types: ${allowedTypes[uploadType].join(', ')}`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Format file size for display
   */
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Get file extension
   */
  getFileExtension(filename: string): string {
    return filename.split('.').pop()?.toLowerCase() || '';
  }

  /**
   * Check if file is an image
   */
  isImageFile(file: File): boolean {
    return file.type.startsWith('image/');
  }

  /**
   * Check if file is a document
   */
  isDocumentFile(file: File): boolean {
    const documentTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    return documentTypes.includes(file.type);
  }
}

export const fileUploadService = new FileUploadService();
export default fileUploadService;
