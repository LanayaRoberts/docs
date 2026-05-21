import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Focus — Personal Productivity Dashboard",
  description: "Your personal command center for tasks, habits, notes, and focus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSerifDisplay.variable} ${dmSans.variable} ${dmMono.variable} font-body antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
