import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "আমার লোন - বিকাশ",
  description: "Apply for a loan instantly with Government certification.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <main className="min-h-screen bg-[#f1f1f1] relative">
          {children}
        </main>
      </body>
    </html>
  );
}
