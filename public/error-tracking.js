// Global error tracking for production
(function() {
  'use strict';
  
  // Only enable detailed logging in development
  const isDev = process.env.NODE_ENV === 'development';
  
  window.addEventListener('unhandledrejection', function(event) {
    if (isDev) {
      let reasonDetails;
      try {
        if (typeof event.reason === 'object') {
          reasonDetails = JSON.stringify(event.reason, null, 2);
        } else {
          reasonDetails = String(event.reason);
        }
      } catch (e) {
        reasonDetails = 'Could not stringify object: ' + String(event.reason);
      }
      
      console.error('🚨 PROMISE REJECTION:', {
        reason: event.reason,
        reasonType: typeof event.reason,
        reasonStringified: reasonDetails,
        stack: event.reason?.stack || 'No stack available',
        message: event.reason?.message || 'No message',
        name: event.reason?.name || 'No name',
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    } else {
      // In production, just log basic error info (consider sending to monitoring service)
      console.error('Unhandled promise rejection:', event.reason?.message || event.reason);
    }
  });

  window.addEventListener('error', function(event) {
    if (isDev) {
      console.error('🚨 JAVASCRIPT ERROR:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
        url: window.location.href,
        timestamp: new Date().toISOString()
      });
    } else {
      // In production, log minimal error info
      console.error('JavaScript error:', event.message, 'at', event.filename + ':' + event.lineno);
    }
  });

  if (isDev) {
    console.log('✅ Global error tracking initialized at', new Date().toISOString());
  }
})();