"use client";

import Link from "next/link";
import { useState } from "react";
import { Gamepad2, Menu, X, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-dark-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <Gamepad2 className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-bold text-dark-900">GameTopup</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/games"
            className="text-sm font-medium text-dark-600 transition-colors hover:text-primary-600"
          >
            Semua Game
          </Link>
          <Link
            href="/games?category=popular"
            className="text-sm font-medium text-dark-600 transition-colors hover:text-primary-600"
          >
            Populer
          </Link>
          <Link
            href="/games?category=new"
            className="text-sm font-medium text-dark-600 transition-colors hover:text-primary-600"
          >
            Terbaru
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/checkout"
            className="relative rounded-lg p-2 text-dark-600 hover:bg-dark-100"
          >
            <ShoppingCart className="h-5 w-5" />
          </Link>

          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-dark-600 hover:bg-dark-100"
            >
              <User className="h-5 w-5" />
              <span className="hidden sm:inline">Masuk</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-dark-200 bg-white py-2 shadow-lg">
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-dark-700 hover:bg-dark-50"
                >
                  <LogOut className="h-4 w-4" />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-dark-700 hover:bg-dark-50"
                >
                  <User className="h-4 w-4" />
                  Daftar
                </Link>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="rounded-lg p-2 text-dark-600 hover:bg-dark-100 md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-dark-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/games"
              className="rounded-lg px-3 py-2 text-sm font-medium text-dark-600 hover:bg-dark-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Semua Game
            </Link>
            <Link
              href="/games?category=popular"
              className="rounded-lg px-3 py-2 text-sm font-medium text-dark-600 hover:bg-dark-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Populer
            </Link>
            <Link
              href="/games?category=new"
              className="rounded-lg px-3 py-2 text-sm font-medium text-dark-600 hover:bg-dark-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Terbaru
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
