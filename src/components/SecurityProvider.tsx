import React, { useEffect, ReactNode } from 'react';
import { SecurityHeaders, CSRFProtection, JWTSecurity } from '@/lib/security';

interface SecurityProviderProps {
  children: ReactNode;
}

export const SecurityProvider: React.FC<SecurityProviderProps> = ({ children }) => {
  useEffect(() => {
    // Apply security headers (Helmet equivalent)
    SecurityHeaders.applySecurityHeaders();

    // Initialize CSRF protection
    CSRFProtection.createToken();

    // Initialize JWT security
    const initializeJWT = async () => {
      try {
        await JWTSecurity.initializeJwks(
          import.meta.env.VITE_SUPABASE_URL || 'https://ewqwjduvjkddknpqpmfr.supabase.co'
        );
      } catch (error) {
        console.error('Failed to initialize JWT security:', error);
      }
    };

    initializeJWT();

    // Security monitoring and logging
    const securityLogger = {
      log: (message: string, data?: any) => {
        if (import.meta.env.DEV) {
          console.log(`[SECURITY] ${message}`, data);
        }
        // In production, you might want to send this to a security monitoring service
      },
      warn: (message: string, data?: any) => {
        console.warn(`[SECURITY WARNING] ${message}`, data);
        // Log security warnings
      },
      error: (message: string, data?: any) => {
        console.error(`[SECURITY ERROR] ${message}`, data);
        // Log security errors
      }
    };

    // Monitor for potential security issues
    const securityMonitor = {
      // Monitor for XSS attempts
      detectXSS: () => {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.innerHTML.includes('javascript:') || script.innerHTML.includes('onload=')) {
            securityLogger.warn('Potential XSS attempt detected', { script: script.innerHTML });
          }
        });
      },

      // Monitor for iframe injection attempts
      detectIframeInjection: () => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          const src = iframe.getAttribute('src');
          if (src && !src.startsWith('https://') && !src.startsWith('http://')) {
            securityLogger.warn('Potential iframe injection detected', { src });
          }
        });
      },

      // Monitor for suspicious DOM modifications
      detectSuspiciousDOM: () => {
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                    securityLogger.warn('Dynamic script/iframe injection detected', { 
                      tagName: element.tagName,
                      attributes: Array.from(element.attributes).map(attr => ({ name: attr.name, value: attr.value }))
                    });
                  }
                }
              });
            }
          });
        });

        observer.observe(document.body, {
          childList: true,
          subtree: true
        });

        return observer;
      },

      // Monitor for console access attempts
      detectConsoleAccess: () => {
        const originalConsole = { ...console };
        
        // Override console methods to detect unauthorized access
        Object.keys(console).forEach(key => {
          if (typeof console[key as keyof Console] === 'function') {
            console[key as keyof Console] = (...args: any[]) => {
              // Log console access in development
              if (import.meta.env.DEV) {
                securityLogger.log(`Console access: ${key}`, args);
              }
              
              // Call original method
              (originalConsole[key as keyof Console] as any)(...args);
            };
          }
        });
      }
    };

    // Initialize security monitoring
    securityMonitor.detectXSS();
    securityMonitor.detectIframeInjection();
    const domObserver = securityMonitor.detectSuspiciousDOM();
    securityMonitor.detectConsoleAccess();

    // Log security initialization
    securityLogger.log('Security system initialized successfully');

    // Cleanup function
    return () => {
      if (domObserver) {
        domObserver.disconnect();
      }
      securityLogger.log('Security system cleanup completed');
    };
  }, []);

  // Additional security measures
  useEffect(() => {
    // Prevent right-click context menu (optional security measure)
    const preventContextMenu = (e: MouseEvent) => {
      if (import.meta.env.PROD) {
        e.preventDefault();
      }
    };

    // Prevent F12, Ctrl+Shift+I, Ctrl+U (optional security measure)
    const preventDevTools = (e: KeyboardEvent) => {
      if (import.meta.env.PROD) {
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && e.key === 'I') ||
          (e.ctrlKey && e.key === 'u')
        ) {
          e.preventDefault();
        }
      }
    };

    // Prevent drag and drop of sensitive elements
    const preventDragDrop = (e: DragEvent) => {
      if (e.target && (e.target as Element).closest('[data-sensitive]')) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener('contextmenu', preventContextMenu);
    document.addEventListener('keydown', preventDevTools);
    document.addEventListener('dragstart', preventDragDrop);
    document.addEventListener('drop', preventDragDrop);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', preventContextMenu);
      document.removeEventListener('keydown', preventDevTools);
      document.removeEventListener('dragstart', preventDragDrop);
      document.removeEventListener('drop', preventDragDrop);
    };
  }, []);

  return <>{children}</>;
};

export default SecurityProvider;
