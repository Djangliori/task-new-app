import './globals.css';

export const metadata = {
  title: 'Task Management App - Next.js Version',
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
      <body>{children}</body>
    </html>
  );
}
