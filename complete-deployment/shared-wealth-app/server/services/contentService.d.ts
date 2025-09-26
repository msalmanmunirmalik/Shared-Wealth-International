import { ApiResponse, PaginationParams, PaginatedResponse } from '../types/index.js';
export interface FundingOpportunity {
    id: string;
    title: string;
    category: string;
    description: string;
    amount: string;
    deadline: string;
    eligibility: string;
    url: string;
    status: 'active' | 'inactive' | 'expired';
    created_at: string;
    updated_at: string;
}
export interface NewsArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    author: string;
    status: 'draft' | 'published' | 'archived';
    published_at?: string;
    created_at: string;
    updated_at: string;
}
export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'document' | 'video' | 'link' | 'tool';
    url: string;
    category: string;
    tags: string[];
    status: 'active' | 'inactive';
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
    status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
}
export declare class ContentService {
    static createFundingOpportunity(data: Omit<FundingOpportunity, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<FundingOpportunity>>;
    static updateFundingOpportunity(id: string, data: Partial<FundingOpportunity>): Promise<ApiResponse<FundingOpportunity>>;
    static deleteFundingOpportunity(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static getFundingOpportunities(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<FundingOpportunity> | FundingOpportunity[]>>;
    static createNewsArticle(data: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<NewsArticle>>;
    static updateNewsArticle(id: string, data: Partial<NewsArticle>): Promise<ApiResponse<NewsArticle>>;
    static deleteNewsArticle(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static getNewsArticles(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<NewsArticle> | NewsArticle[]>>;
    static createEvent(data: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<ApiResponse<Event>>;
    static updateEvent(id: string, data: Partial<Event>): Promise<ApiResponse<Event>>;
    static deleteEvent(id: string): Promise<ApiResponse<{
        message: string;
    }>>;
    static getEvents(pagination?: PaginationParams): Promise<ApiResponse<PaginatedResponse<Event> | Event[]>>;
}
//# sourceMappingURL=contentService.d.ts.map