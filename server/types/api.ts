/**
 * API Response types for consistent response formatting
 */

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  total?: number;
  has_more?: boolean;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

export interface ContentFilters extends PaginationParams, SortParams, FilterParams {
  type?: string;
  is_published?: boolean;
  company_id?: string;
  user_id?: string;
  tags?: string[];
  search?: string;
}

export interface SocialFilters extends PaginationParams, SortParams, FilterParams {
  user_id?: string;
  content_id?: string;
  connection_type?: string;
  reaction_type?: string;
}

export interface DashboardFilters extends PaginationParams, SortParams, FilterParams {
  period?: string;
  sections?: string[];
  user_id?: string;
}

export interface FileFilters extends PaginationParams, SortParams, FilterParams {
  context_type?: string;
  context_id?: string;
  file_type?: string;
  user_id?: string;
}

export interface UserFilters extends PaginationParams, SortParams, FilterParams {
  role?: string;
  status?: string;
  search?: string;
}
