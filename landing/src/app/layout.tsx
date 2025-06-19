import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Black Unicorn Design Studio",
  description: "Human centered, AI powered design studio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}