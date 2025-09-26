import crypto from 'crypto';
const defaultConfig = {
    secret: process.env.CSRF_SECRET || 'default-csrf-secret-change-in-production',
    cookieName: '_csrf',
    headerName: 'x-csrf-token',
    tokenLength: 32,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    ignorePaths: ['/api/health', '/api/auth/signin']
};
export class CSRFProtection {
    constructor(config = {}) {
        this.config = { ...defaultConfig, ...config };
    }
    generateToken() {
        return crypto.randomBytes(this.config.tokenLength).toString('hex');
    }
    createSignature(token) {
        return crypto
            .createHmac('sha256', this.config.secret)
            .update(token)
            .digest('hex');
    }
    verifySignature(token, signature) {
        const expectedSignature = this.createSignature(token);
        return crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expectedSignature, 'hex'));
    }
    extractToken(req) {
        const headerToken = req.headers[this.config.headerName];
        if (headerToken) {
            return headerToken;
        }
        const bodyToken = req.body?._csrf || req.body?.csrf_token;
        if (bodyToken) {
            return bodyToken;
        }
        const queryToken = req.query._csrf;
        if (queryToken) {
            return queryToken;
        }
        return null;
    }
    shouldIgnore(req) {
        if (this.config.ignoreMethods.includes(req.method)) {
            return true;
        }
        const path = req.path;
        return this.config.ignorePaths.some(ignorePath => path.startsWith(ignorePath));
    }
    middleware() {
        return (req, res, next) => {
            if (this.shouldIgnore(req)) {
                return next();
            }
            if (!req.session) {
                return res.status(500).json({
                    success: false,
                    error: 'Session not available',
                    message: 'Session middleware must be configured before CSRF middleware'
                });
            }
            let csrfToken = req.session.csrfToken;
            if (!csrfToken) {
                csrfToken = this.generateToken();
                req.session.csrfToken = csrfToken;
            }
            res.locals.csrfToken = csrfToken;
            req.csrfToken = () => csrfToken;
            if (!this.config.ignoreMethods.includes(req.method)) {
                const providedToken = this.extractToken(req);
                if (!providedToken) {
                    console.warn(`CSRF: No token provided for ${req.method} ${req.path}`);
                    return res.status(403).json({
                        success: false,
                        error: 'CSRF token missing',
                        message: 'A CSRF token is required for this operation'
                    });
                }
                const tokenParts = providedToken.split('.');
                if (tokenParts.length !== 2) {
                    console.warn(`CSRF: Invalid token format for ${req.method} ${req.path}`);
                    return res.status(403).json({
                        success: false,
                        error: 'Invalid CSRF token format',
                        message: 'The CSRF token format is invalid'
                    });
                }
                const [token, signature] = tokenParts;
                if (!this.verifySignature(token, signature)) {
                    console.warn(`CSRF: Token verification failed for ${req.method} ${req.path}`);
                    return res.status(403).json({
                        success: false,
                        error: 'Invalid CSRF token',
                        message: 'The CSRF token is invalid or has expired'
                    });
                }
                if (token !== req.session.csrfToken) {
                    console.warn(`CSRF: Token mismatch for ${req.method} ${req.path}`);
                    return res.status(403).json({
                        success: false,
                        error: 'CSRF token mismatch',
                        message: 'The CSRF token does not match the session'
                    });
                }
            }
            next();
        };
    }
    generateSignedToken(sessionToken) {
        const signature = this.createSignature(sessionToken);
        return `${sessionToken}.${signature}`;
    }
    tokenEndpoint() {
        return (req, res) => {
            if (!req.session?.csrfToken) {
                return res.status(500).json({
                    success: false,
                    error: 'Session not initialized',
                    message: 'CSRF token not available'
                });
            }
            const signedToken = this.generateSignedToken(req.session.csrfToken);
            res.json({
                success: true,
                csrfToken: signedToken,
                message: 'CSRF token generated successfully'
            });
        };
    }
}
export const csrfProtection = new CSRFProtection({
    secret: process.env.CSRF_SECRET || 'wealth-pioneers-csrf-secret-2024',
    cookieName: '_wealth_pioneers_csrf',
    headerName: 'x-csrf-token',
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
    ignorePaths: [
        '/api/health',
        '/api/auth/signin',
        '/api/auth/signout',
        '/api/auth/refresh'
    ]
});
export default csrfProtection;
//# sourceMappingURL=csrf.js.map