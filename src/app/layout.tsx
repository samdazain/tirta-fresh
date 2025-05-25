import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";
import { ToastProvider } from "@/context/ToastContext";

// Load Poppins font with various weights
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Tirta Fresh",
  description: "Depot Air Mineral Tuban Terpercaya!",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '32x32' },
    ],
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body
        className={`${poppins.variable} antialiased bg-white font-poppins`}
      >
        <ConditionalLayout>
          <ToastProvider>
            {children}
          </ToastProvider>
        </ConditionalLayout>
      </body>
    </html>
  );
}