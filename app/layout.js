import './globals.css';

export const metadata = {
  title: 'FATA IT Academy — Pre-Matric Foundation Course',
  description: 'Interactive simulations for Class 9-12 Physics and Mathematics',
  keywords: 'physics, mathematics, simulations, education, FATA, Pakistan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-slate-900">
        {children}
      </body>
    </html>
  );
}