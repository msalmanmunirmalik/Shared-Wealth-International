export interface EmailTemplate {
    subject: string;
    html: string;
    text?: string;
}
export interface EmailData {
    to: string | string[];
    subject: string;
    template?: string;
    templateData?: Record<string, any>;
    html?: string;
    text?: string;
    attachments?: Array<{
        filename: string;
        content: Buffer | string;
        contentType?: string;
    }>;
}
export interface EmailConfig {
    host: string;
    port: number;
    secure: boolean;
    auth: {
        user: string;
        pass: string;
    };
    from: string;
    replyTo?: string;
}
declare class EmailService {
    private transporter;
    private config;
    private templates;
    constructor();
    initialize(config: EmailConfig): Promise<void>;
    private loadTemplates;
    private createDefaultTemplates;
    private formatSubject;
    sendTemplateEmail(data: EmailData): Promise<boolean>;
    sendEmail(data: EmailData): Promise<boolean>;
    sendWelcomeEmail(email: string, name: string, verificationUrl?: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, name: string, resetUrl: string, expiryHours?: number): Promise<boolean>;
    sendCompanyApprovalEmail(email: string, name: string, companyName: string): Promise<boolean>;
    sendCompanyRejectionEmail(email: string, name: string, companyName: string, reason?: string): Promise<boolean>;
    sendNotificationEmail(email: string, subject: string, message: string, actionUrl?: string, actionText?: string): Promise<boolean>;
    testConnection(): Promise<boolean>;
    getAvailableTemplates(): string[];
    close(): Promise<void>;
}
export declare const emailService: EmailService;
export default emailService;
//# sourceMappingURL=emailService.d.ts.map