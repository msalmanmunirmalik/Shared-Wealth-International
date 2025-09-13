import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.js';
import { emailService, EmailData } from '../services/emailService.js';
import { ApiResponse } from '../types/index.js';
import { body, validationResult } from 'express-validator';

export class EmailController {
  /**
   * Send custom email
   */
  static async sendEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { to, subject, template, templateData, html, text, attachments } = req.body;

      const emailData: EmailData = {
        to,
        subject,
        template,
        templateData,
        html,
        text,
        attachments
      };

      await emailService.sendEmail(emailData);

      res.json({
        success: true,
        data: { message: 'Email sent successfully' }
      });
    } catch (error) {
      console.error('Send email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Send welcome email
   */
  static async sendWelcomeEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { email, name, verificationUrl } = req.body;

      await emailService.sendWelcomeEmail(email, name, verificationUrl);

      res.json({
        success: true,
        data: { message: 'Welcome email sent successfully' }
      });
    } catch (error) {
      console.error('Send welcome email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Send password reset email
   */
  static async sendPasswordResetEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { email, name, resetUrl, expiryHours } = req.body;

      await emailService.sendPasswordResetEmail(email, name, resetUrl, expiryHours);

      res.json({
        success: true,
        data: { message: 'Password reset email sent successfully' }
      });
    } catch (error) {
      console.error('Send password reset email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Send company approval email
   */
  static async sendCompanyApprovalEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { email, name, companyName } = req.body;

      await emailService.sendCompanyApprovalEmail(email, name, companyName);

      res.json({
        success: true,
        data: { message: 'Company approval email sent successfully' }
      });
    } catch (error) {
      console.error('Send company approval email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Send company rejection email
   */
  static async sendCompanyRejectionEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { email, name, companyName, reason } = req.body;

      await emailService.sendCompanyRejectionEmail(email, name, companyName, reason);

      res.json({
        success: true,
        data: { message: 'Company rejection email sent successfully' }
      });
    } catch (error) {
      console.error('Send company rejection email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Send notification email
   */
  static async sendNotificationEmail(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array().map(error => error.msg)
        });
      }

      const { email, subject, message, actionUrl, actionText } = req.body;

      await emailService.sendNotificationEmail(email, subject, message, actionUrl, actionText);

      res.json({
        success: true,
        data: { message: 'Notification email sent successfully' }
      });
    } catch (error) {
      console.error('Send notification email error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Test email service
   */
  static async testEmailService(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const isConnected = await emailService.testConnection();
      
      if (isConnected) {
        res.json({
          success: true,
          data: { 
            message: 'Email service is working correctly',
            templates: emailService.getAvailableTemplates()
          }
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Email service connection failed'
        });
      }
    } catch (error) {
      console.error('Test email service error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get available email templates
   */
  static async getEmailTemplates(req: AuthenticatedRequest, res: Response<ApiResponse<any>>) {
    try {
      const templates = emailService.getAvailableTemplates();
      
      res.json({
        success: true,
        data: { templates }
      });
    } catch (error) {
      console.error('Get email templates error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}

// Validation rules
export const emailValidation = {
  sendEmail: [
    body('to')
      .isEmail()
      .withMessage('Valid email address is required'),
    body('subject')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Subject must be between 1 and 200 characters'),
    body('html')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('HTML content is required if no template is provided'),
    body('template')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Template name must be provided if no HTML is provided')
  ],

  sendWelcomeEmail: [
    body('email')
      .isEmail()
      .withMessage('Valid email address is required'),
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('verificationUrl')
      .optional()
      .isURL()
      .withMessage('Verification URL must be a valid URL')
  ],

  sendPasswordResetEmail: [
    body('email')
      .isEmail()
      .withMessage('Valid email address is required'),
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('resetUrl')
      .isURL()
      .withMessage('Reset URL must be a valid URL'),
    body('expiryHours')
      .optional()
      .isInt({ min: 1, max: 168 })
      .withMessage('Expiry hours must be between 1 and 168')
  ],

  sendCompanyApprovalEmail: [
    body('email')
      .isEmail()
      .withMessage('Valid email address is required'),
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('companyName')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Company name must be between 1 and 255 characters')
  ],

  sendCompanyRejectionEmail: [
    body('email')
      .isEmail()
      .withMessage('Valid email address is required'),
    body('name')
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Name must be between 1 and 100 characters'),
    body('companyName')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Company name must be between 1 and 255 characters'),
    body('reason')
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage('Reason must be between 1 and 500 characters')
  ],

  sendNotificationEmail: [
    body('email')
      .isEmail()
      .withMessage('Valid email address is required'),
    body('subject')
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage('Subject must be between 1 and 200 characters'),
    body('message')
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Message must be between 1 and 1000 characters'),
    body('actionUrl')
      .optional()
      .isURL()
      .withMessage('Action URL must be a valid URL'),
    body('actionText')
      .optional()
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage('Action text must be between 1 and 100 characters')
  ]
};
