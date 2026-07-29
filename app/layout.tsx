import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { FooterWrapper } from "@/components/layout/FooterWrapper";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Portfolio — UI/UX Designer & Front-End Developer",
  description:
    "Crafting premium digital experiences at the intersection of design and engineering. UI/UX Designer & Front-End Developer specializing in React, Next.js, and Figma.",
  keywords: ["UI/UX Design", "Front-End Development", "React", "Next.js", "Figma", "Portfolio"],
  openGraph: {
    title: "Portfolio — UI/UX Designer & Front-End Developer",
    description:
      "Crafting premium digital experiences at the intersection of design and engineering.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 pb-nav">{children}</main>
          <FooterWrapper />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
