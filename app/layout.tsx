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
                // Try to get as much detail as possible about the rejection
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
                
                console.error('🚨 PROMISE REJECTION FULL DETAILS:', {
                  reason: event.reason,
                  reasonType: typeof event.reason,
                  reasonStringified: reasonDetails,
                  stack: event.reason?.stack || 'No stack available',
                  message: event.reason?.message || 'No message',
                  name: event.reason?.name || 'No name',
                  url: window.location.href,
                  timestamp: new Date().toISOString(),
                  allKeys: event.reason ? Object.keys(event.reason) : 'No keys'
                });
                
                // Also log the full event object
                console.error('🚨 FULL EVENT OBJECT:', event);
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
