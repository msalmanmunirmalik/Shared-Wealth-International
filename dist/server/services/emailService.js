import nodemailer from 'nodemailer';
import handlebars from 'handlebars';
import fs from 'fs';
import path from 'path';
import { log } from '../middleware/logger.js';
class EmailService {
    constructor() {
        this.transporter = null;
        this.config = null;
        this.templates = new Map();
        this.loadTemplates();
    }
    async initialize(config) {
        try {
            this.config = config;
            this.transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.secure,
                auth: config.auth,
                pool: true,
                maxConnections: 5,
                maxMessages: 100,
                rateDelta: 20000,
                rateLimit: 5
            });
            await this.transporter.verify();
            log.info('Email service initialized successfully', {
                host: config.host,
                port: config.port,
                from: config.from
            });
        }
        catch (error) {
            log.error('Failed to initialize email service', { error: error instanceof Error ? error.message : error });
            throw error;
        }
    }
    loadTemplates() {
        const templatesDir = path.join(process.cwd(), 'server', 'templates', 'email');
        if (!fs.existsSync(templatesDir)) {
            fs.mkdirSync(templatesDir, { recursive: true });
            this.createDefaultTemplates(templatesDir);
            return;
        }
        try {
            const templateFiles = fs.readdirSync(templatesDir);
            templateFiles.forEach(file => {
                if (file.endsWith('.html')) {
                    const templateName = path.basename(file, '.html');
                    const htmlPath = path.join(templatesDir, file);
                    const textPath = path.join(templatesDir, `${templateName}.txt`);
                    const html = fs.readFileSync(htmlPath, 'utf8');
                    const text = fs.existsSync(textPath) ? fs.readFileSync(textPath, 'utf8') : undefined;
                    const subjectMatch = html.match(/<!-- SUBJECT: (.+) -->/);
                    const subject = subjectMatch ? subjectMatch[1] : this.formatSubject(templateName);
                    this.templates.set(templateName, {
                        subject,
                        html,
                        text
                    });
                }
            });
            log.info('Email templates loaded', { count: this.templates.size });
        }
        catch (error) {
            log.error('Failed to load email templates', { error: error instanceof Error ? error.message : error });
        }
    }
    createDefaultTemplates(templatesDir) {
        const templates = {
            'welcome': {
                subject: 'Welcome to Shared Wealth International',
                html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Welcome</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1e40af; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { padding: 20px; text-align: center; color: #6b7280; }
        .button { display: inline-block; padding: 12px 24px; background: #1e40af; color: white; text-decoration: none; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to Shared Wealth International</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>Welcome to our platform! We're excited to have you join our community of companies committed to creating shared wealth.</p>
            <p>Your account has been successfully created with the email: <strong>{{email}}</strong></p>
            <p>To get started, please verify your email address by clicking the button below:</p>
            <p style="text-align: center;">
                <a href="{{verificationUrl}}" class="button">Verify Email Address</a>
            </p>
            <p>If you have any questions, feel free to contact our support team.</p>
        </div>
        <div class="footer">
            <p>© 2024 Shared Wealth International. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
                text: `Welcome to Shared Wealth International!

Hello {{name}}!

Welcome to our platform! We're excited to have you join our community of companies committed to creating shared wealth.

Your account has been successfully created with the email: {{email}}

To get started, please verify your email address by visiting: {{verificationUrl}}

If you have any questions, feel free to contact our support team.

© 2024 Shared Wealth International. All rights reserved.`
            },
            'password-reset': {
                subject: 'Password Reset Request',
                html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Password Reset</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { padding: 20px; text-align: center; color: #6b7280; }
        .button { display: inline-block; padding: 12px 24px; background: #dc2626; color: white; text-decoration: none; border-radius: 6px; }
        .warning { background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>We received a request to reset your password for your Shared Wealth International account.</p>
            <p>If you requested this password reset, click the button below to create a new password:</p>
            <p style="text-align: center;">
                <a href="{{resetUrl}}" class="button">Reset Password</a>
            </p>
            <div class="warning">
                <p><strong>Security Notice:</strong></p>
                <ul>
                    <li>This link will expire in {{expiryHours}} hours</li>
                    <li>If you didn't request this reset, please ignore this email</li>
                    <li>Your password will remain unchanged until you create a new one</li>
                </ul>
            </div>
        </div>
        <div class="footer">
            <p>© 2024 Shared Wealth International. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
                text: `Password Reset Request

Hello {{name}}!

We received a request to reset your password for your Shared Wealth International account.

If you requested this password reset, visit the following link to create a new password:
{{resetUrl}}

Security Notice:
- This link will expire in {{expiryHours}} hours
- If you didn't request this reset, please ignore this email
- Your password will remain unchanged until you create a new one

© 2024 Shared Wealth International. All rights reserved.`
            },
            'company-approved': {
                subject: 'Company Application Approved',
                html: `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Company Approved</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #059669; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { padding: 20px; text-align: center; color: #6b7280; }
        .button { display: inline-block; padding: 12px 24px; background: #059669; color: white; text-decoration: none; border-radius: 6px; }
        .success { background: #f0fdf4; border: 1px solid #bbf7d0; padding: 15px; border-radius: 6px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🎉 Congratulations!</h1>
        </div>
        <div class="content">
            <h2>Hello {{name}}!</h2>
            <p>Great news! Your company application for <strong>{{companyName}}</strong> has been approved!</p>
            <div class="success">
                <p><strong>Your company is now part of the Shared Wealth International network!</strong></p>
                <p>This means you can now:</p>
                <ul>
                    <li>Access the full company dashboard</li>
                    <li>Connect with other approved companies</li>
                    <li>Apply for funding opportunities</li>
                    <li>Participate in collaborative projects</li>
                </ul>
            </div>
            <p style="text-align: center;">
                <a href="{{dashboardUrl}}" class="button">Access Your Dashboard</a>
            </p>
            <p>Welcome to our community of companies committed to creating shared wealth!</p>
        </div>
        <div class="footer">
            <p>© 2024 Shared Wealth International. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`,
                text: `🎉 Congratulations!

Hello {{name}}!

Great news! Your company application for {{companyName}} has been approved!

Your company is now part of the Shared Wealth International network!

This means you can now:
- Access the full company dashboard
- Connect with other approved companies
- Apply for funding opportunities
- Participate in collaborative projects

Access your dashboard: {{dashboardUrl}}

Welcome to our community of companies committed to creating shared wealth!

© 2024 Shared Wealth International. All rights reserved.`
            }
        };
        Object.entries(templates).forEach(([name, template]) => {
            const htmlPath = path.join(templatesDir, `${name}.html`);
            const textPath = path.join(templatesDir, `${name}.txt`);
            fs.writeFileSync(htmlPath, template.html);
            fs.writeFileSync(textPath, template.text);
            this.templates.set(name, template);
        });
        log.info('Default email templates created', { count: Object.keys(templates).length });
    }
    formatSubject(templateName) {
        return templateName
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }
    async sendTemplateEmail(data) {
        if (!this.transporter || !this.config) {
            throw new Error('Email service not initialized');
        }
        if (!data.template) {
            throw new Error('Template name is required');
        }
        const template = this.templates.get(data.template);
        if (!template) {
            throw new Error(`Template '${data.template}' not found`);
        }
        try {
            const compiledSubject = handlebars.compile(template.subject);
            const compiledHtml = handlebars.compile(template.html);
            const compiledText = template.text ? handlebars.compile(template.text) : null;
            const subject = compiledSubject(data.templateData || {});
            const html = compiledHtml(data.templateData || {});
            const text = compiledText ? compiledText(data.templateData || {}) : undefined;
            const mailOptions = {
                from: this.config.from,
                to: Array.isArray(data.to) ? data.to.join(', ') : data.to,
                subject,
                html,
                text,
                attachments: data.attachments,
                replyTo: this.config.replyTo
            };
            const result = await this.transporter.sendMail(mailOptions);
            log.info('Email sent successfully', {
                to: data.to,
                subject,
                template: data.template,
                messageId: result.messageId
            });
            return true;
        }
        catch (error) {
            log.error('Failed to send email', {
                to: data.to,
                template: data.template,
                error: error instanceof Error ? error.message : error
            });
            throw error;
        }
    }
    async sendEmail(data) {
        if (!this.transporter || !this.config) {
            throw new Error('Email service not initialized');
        }
        try {
            const mailOptions = {
                from: this.config.from,
                to: Array.isArray(data.to) ? data.to.join(', ') : data.to,
                subject: data.subject,
                html: data.html,
                text: data.text,
                attachments: data.attachments,
                replyTo: this.config.replyTo
            };
            const result = await this.transporter.sendMail(mailOptions);
            log.info('Email sent successfully', {
                to: data.to,
                subject: data.subject,
                messageId: result.messageId
            });
            return true;
        }
        catch (error) {
            log.error('Failed to send email', {
                to: data.to,
                subject: data.subject,
                error: error instanceof Error ? error.message : error
            });
            throw error;
        }
    }
    async sendWelcomeEmail(email, name, verificationUrl) {
        return this.sendTemplateEmail({
            to: email,
            subject: 'Welcome to Shared Wealth International',
            template: 'welcome',
            templateData: {
                name,
                email,
                verificationUrl: verificationUrl || `${process.env.BASE_URL || 'http://localhost:3001'}/auth/verify`
            }
        });
    }
    async sendPasswordResetEmail(email, name, resetUrl, expiryHours = 24) {
        return this.sendTemplateEmail({
            to: email,
            subject: 'Password Reset Request',
            template: 'password-reset',
            templateData: {
                name,
                resetUrl,
                expiryHours
            }
        });
    }
    async sendCompanyApprovalEmail(email, name, companyName) {
        return this.sendTemplateEmail({
            to: email,
            subject: 'Company Application Approved',
            template: 'company-approved',
            templateData: {
                name,
                companyName,
                dashboardUrl: `${process.env.BASE_URL || 'http://localhost:3001'}/user-dashboard`
            }
        });
    }
    async sendCompanyRejectionEmail(email, name, companyName, reason) {
        return this.sendEmail({
            to: email,
            subject: `Company Application Update - ${companyName}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
            <h1>Company Application Update</h1>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <h2>Hello ${name}!</h2>
            <p>Thank you for your interest in joining Shared Wealth International.</p>
            <p>After careful review, we regret to inform you that your application for <strong>${companyName}</strong> has not been approved at this time.</p>
            ${reason ? `<p><strong>Reason:</strong> ${reason}</p>` : ''}
            <p>We encourage you to review our requirements and consider reapplying in the future.</p>
            <p>If you have any questions, please don't hesitate to contact our support team.</p>
          </div>
          <div style="padding: 20px; text-align: center; color: #6b7280;">
            <p>© 2024 Shared Wealth International. All rights reserved.</p>
          </div>
        </div>
      `,
            text: `
Company Application Update

Hello ${name}!

Thank you for your interest in joining Shared Wealth International.

After careful review, we regret to inform you that your application for ${companyName} has not been approved at this time.

${reason ? `Reason: ${reason}` : ''}

We encourage you to review our requirements and consider reapplying in the future.

If you have any questions, please don't hesitate to contact our support team.

© 2024 Shared Wealth International. All rights reserved.
      `
        });
    }
    async sendNotificationEmail(email, subject, message, actionUrl, actionText) {
        return this.sendEmail({
            to: email,
            subject,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: #1e40af; color: white; padding: 20px; text-align: center;">
            <h1>Shared Wealth International</h1>
          </div>
          <div style="padding: 20px; background: #f9fafb;">
            <h2>${subject}</h2>
            <p>${message}</p>
            ${actionUrl && actionText ? `
              <p style="text-align: center;">
                <a href="${actionUrl}" style="display: inline-block; padding: 12px 24px; background: #1e40af; color: white; text-decoration: none; border-radius: 6px;">
                  ${actionText}
                </a>
              </p>
            ` : ''}
          </div>
          <div style="padding: 20px; text-align: center; color: #6b7280;">
            <p>© 2024 Shared Wealth International. All rights reserved.</p>
          </div>
        </div>
      `,
            text: `
${subject}

${message}

${actionUrl && actionText ? `${actionText}: ${actionUrl}` : ''}

© 2024 Shared Wealth International. All rights reserved.
      `
        });
    }
    async testConnection() {
        if (!this.transporter) {
            throw new Error('Email service not initialized');
        }
        try {
            await this.transporter.verify();
            log.info('Email service connection test successful');
            return true;
        }
        catch (error) {
            log.error('Email service connection test failed', { error: error instanceof Error ? error.message : error });
            return false;
        }
    }
    getAvailableTemplates() {
        return Array.from(this.templates.keys());
    }
    async close() {
        if (this.transporter) {
            this.transporter.close();
            this.transporter = null;
            log.info('Email service closed');
        }
    }
}
export const emailService = new EmailService();
export default emailService;
//# sourceMappingURL=emailService.js.map