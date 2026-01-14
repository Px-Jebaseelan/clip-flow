import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ClipFlow",
  description: "Screen recorder and video editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className="antialiased bg-white text-slate-900 font-sans"
      >
        {children}
      </body>
    </html>
  );
}
