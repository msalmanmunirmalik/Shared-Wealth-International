export interface User {
    id: string;
    email: string;
    password_hash: string;
    role: 'user' | 'admin' | 'superadmin';
    created_at: string;
    updated_at: string;
}
export interface UserResponse {
    id: string;
    email: string;
    role: string;
    created_at: string;
}
export interface Session {
    user: UserResponse;
    access_token: string;
}
export interface Company {
    id: string;
    name: string;
    description: string;
    industry: string;
    size: 'startup' | 'small' | 'medium' | 'large';
    location: string;
    website?: string;
    logo?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
}
export interface NetworkConnection {
    id: string;
    company_id: string;
    connected_company_id: string;
    connection_strength: number;
    shared_projects: number;
    collaboration_score: number;
    created_at: string;
}
export interface FundingOpportunity {
    id: string;
    title: string;
    category: string;
    description: string;
    amount: string;
    deadline: string;
    eligibility: string;
    url: string;
    created_at: string;
}
export interface ForumPost {
    id: string;
    user_id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
    updated_at: string;
}
export interface Event {
    id: string;
    title: string;
    description: string;
    start_date: string;
    end_date: string;
    location: string;
    max_participants: number;
    created_at: string;
}
export interface Message {
    id: string;
    sender_id: string;
    recipient_id: string;
    message: string;
    created_at: string;
}
export interface AdminStats {
    totalUsers: number;
    totalCompanies: number;
    pendingCompanies: number;
    approvedCompanies: number;
}
export interface SignInRequest {
    email: string;
    password: string;
}
export interface SignUpRequest {
    email: string;
    password: string;
}
export interface ResetPasswordRequest {
    email: string;
}
export interface CreateCompanyRequest {
    name: string;
    description: string;
    industry: string;
    size: 'startup' | 'small' | 'medium' | 'large';
    location: string;
    website?: string;
}
export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
    iat: number;
    exp: number;
}
export interface QueryOptions {
    where?: Record<string, any>;
    selectColumns?: string[];
    limit?: number;
    offset?: number;
}
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    message?: string;
    errors?: string[];
}
export interface PaginationParams {
    page: number;
    limit: number;
}
export interface PaginatedResponse<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
//# sourceMappingURL=index.d.ts.map