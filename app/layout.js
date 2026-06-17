import "./globals.css";

export const metadata = {
  title: "EducationSimulation - Physics & Chemistry Learning",
  description: "Interactive, gamified physics and chemistry simulations for K-12 students",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gradient-to-b from-sky via-white to-grass/20 min-h-screen">
        {children}
      </body>
    </html>
  );
}
