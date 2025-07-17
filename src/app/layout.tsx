import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/providers/NextAuthProvider";
import { PostHogProvider } from "@/components/posthog-provider";
import dynamic from "next/dynamic";

const PostHogPageView = dynamic(() => import("@/components/PostHogPageView"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "AcademicIQ - Your AI Study Assistant",
  description:
    "Accelerate your learning with AI-powered study plans and resources",
  openGraph: {
    url: "https://www.academiciq.ink/",
    siteName: "AcademicIQ - Your AI Study Assistant",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://www.academiciq.ink/thumbnail.png",
        width: 1200,
        height: 630,
        alt: "AcademicIQ - Your AI Study Assistant",
      },
    ],
  },
  twitter: {
    title: "AcademicIQ - Your AI Study Assistant",
    description:
      "Accelerate your learning with AI-powered study plans and resources",
    images: "https://www.academiciq.ink/thumbnail.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${lexend.variable} font-sans antialiased min-h-screen bg--background`}
      >
        <NextAuthProvider>
          <PostHogProvider>
            <PostHogPageView />
            {children}
            <Toaster />
          </PostHogProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
