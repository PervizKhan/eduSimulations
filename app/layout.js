import "./globals.css";

export const metadata = {
  title: "Pervez Khan Afridi | Interactive Science Lab",
  description: "Learn Physics and Computer Science with interactive simulations designed by Pervez Khan Afridi.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-sky-50 min-h-screen text-slate-900">
        {children}
      </body>
    </html>
  );
}