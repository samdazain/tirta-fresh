import type { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
    subsets: ["latin"],
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "Tirta Fresh - Admin Panel",
    description: "Admin Panel untuk Depot Air Mineral Tirta Fresh",
};

export default function AdminRootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={`${poppins.variable} antialiased font-poppins bg-gray-50`}>
                {children}
            </body>
        </html>
    );
}