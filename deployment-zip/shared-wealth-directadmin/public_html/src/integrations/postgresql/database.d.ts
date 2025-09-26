export declare class DatabaseService {
    static query(text: string, params?: any[]): Promise<any>;
    static insert(table: string, data: Record<string, any>): Promise<any>;
    static update(table: string, id: string, data: Record<string, any>): Promise<any>;
    static delete(table: string, id: string): Promise<boolean>;
    static findById(table: string, id: string): Promise<any>;
    static findAll(table: string, options?: {
        where?: Record<string, any>;
        selectColumns?: string[];
        limit?: number;
        offset?: number;
    }): Promise<any[]>;
    static findOne(table: string, options?: {
        where?: Record<string, any>;
        selectColumns?: string[];
    }): Promise<any>;
    static count(table: string, options?: {
        where?: Record<string, any>;
    }): Promise<number>;
    static transaction<T>(callback: (client: any) => Promise<T>): Promise<T>;
    static healthCheck(): Promise<boolean>;
}
//# sourceMappingURL=database.d.ts.map