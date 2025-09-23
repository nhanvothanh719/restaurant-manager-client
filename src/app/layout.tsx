import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import Header from "@/components/header";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import AppProvider from "@/app/app-provider";
import SlideSession from "@/components/slide-session";

const interFont = Inter({
  subsets: ["vietnamese"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | My restaurant", // Nếu page có `metadata.title` thì title của page sẽ được áp dụng theo template này
    default: "My restaurant", // Title của page nếu không khai báo `metadata.title``
  },
  description: "Application serving for my restaurant",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${interFont.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <AppProvider>
            <Header />
            {children}
            <SlideSession />
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
