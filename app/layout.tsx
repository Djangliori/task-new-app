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
        <script src="/error-tracking.js" async />
      </head>
      <body>{children}</body>
    </html>
  );
}
