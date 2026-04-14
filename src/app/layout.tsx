import type { Metadata } from "next";
import { AppSidebar } from "@/components/layout/sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Parris Life Dashboard",
    template: "%s | Parris Life Dashboard",
  },
  description: "Personal life dashboard for Josh Parris.",
};

export const viewport = {
  themeColor: "#f8fafc",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased font-sans bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex h-screen">
          <AppSidebar />
          <div className="flex-1 flex flex-col overflow-hidden">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
