import './globals.css';

export const metadata = {
  title: 'Task Manager',
  description:
    'A comprehensive task management web application with automated deployment',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ka">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Global error tracking for debugging
              window.addEventListener('unhandledrejection', function(event) {
                console.error('🚨 UNCAUGHT PROMISE REJECTION DETAILS:', {
                  reason: event.reason,
                  reasonType: typeof event.reason,
                  stack: event.reason?.stack || 'No stack available',
                  message: event.reason?.message || String(event.reason),
                  url: window.location.href,
                  timestamp: new Date().toISOString()
                });
              });
              
              window.addEventListener('error', function(event) {
                console.error('🚨 GLOBAL JAVASCRIPT ERROR:', {
                  message: event.message,
                  filename: event.filename,
                  lineno: event.lineno,
                  colno: event.colno,
                  error: event.error,
                  url: window.location.href,
                  timestamp: new Date().toISOString()
                });
              });
              
              console.log('✅ Global error tracking initialized at', new Date().toISOString());
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
