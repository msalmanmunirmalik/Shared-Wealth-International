import { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            csrfToken?: () => string;
        }
    }
}
declare module 'express-session' {
    interface SessionData {
        csrfToken?: string;
    }
}
export interface CSRFConfig {
    secret: string;
    cookieName?: string;
    headerName?: string;
    tokenLength?: number;
    ignoreMethods?: string[];
    ignorePaths?: string[];
}
export declare class CSRFProtection {
    private config;
    constructor(config?: Partial<CSRFConfig>);
    private generateToken;
    private createSignature;
    private verifySignature;
    private extractToken;
    private shouldIgnore;
    middleware(): (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
    generateSignedToken(sessionToken: string): string;
    tokenEndpoint(): (req: Request, res: Response) => Response<any, Record<string, any>> | undefined;
}
export declare const csrfProtection: CSRFProtection;
export default csrfProtection;
//# sourceMappingURL=csrf.d.ts.map