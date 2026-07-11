import Script from "next/script";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import SessionProvider from "@/components/providers/SessionProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GameTopup - Platform Top-Up Game Terpercaya",
  description:
    "Platform top-up game terpercaya dengan proses cepat, aman, dan harga terbaik.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <SessionProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </SessionProvider>
        <Script
          src={process.env.MIDTRANS_IS_PRODUCTION === "true"
            ? "https://app.midtrans.com/snap/snap.js"
            : "https://app.sandbox.midtrans.com/snap/snap.js"
          }
          data-client-key={process.env.MIDTRANS_CLIENT_KEY || ""}
          strategy="lazyOnload"
        />
      </body>
    </html>
  );
}
