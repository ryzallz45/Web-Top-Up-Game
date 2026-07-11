import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameTopup - Platform Top-Up Game Terpercaya",
  description:
    "Platform top-up game terpercaya dengan proses cepat, aman, dan harga terbaik. Top up Mobile Legends, Free Fire, Genshin Impact, dan game populer lainnya.",
  keywords: [
    "top up game",
    "beli diamond",
    "mobile legends",
    "free fire",
    "genshin impact",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
