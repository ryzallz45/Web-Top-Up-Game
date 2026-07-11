import Link from "next/link";
import { Gamepad2 } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-dark-200 bg-dark-900">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <Gamepad2 className="h-8 w-8 text-primary-400" />
              <span className="text-xl font-bold text-white">GameTopup</span>
            </Link>
            <p className="mt-4 text-sm text-dark-400">
              Platform top-up game terpercaya dengan proses cepat dan aman.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Menu
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/games" className="text-sm text-dark-400 hover:text-white">
                  Semua Game
                </Link>
              </li>
              <li>
                <Link href="/games?category=popular" className="text-sm text-dark-400 hover:text-white">
                  Populer
                </Link>
              </li>
              <li>
                <Link href="/games?category=new" className="text-sm text-dark-400 hover:text-white">
                  Terbaru
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Bantuan
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-sm text-dark-400 hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-dark-400 hover:text-white">
                  Syarat & Ketentuan
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-dark-400 hover:text-white">
                  Kebijakan Privasi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Hubungi Kami
            </h3>
            <ul className="space-y-2">
              <li className="text-sm text-dark-400">support@gametopup.id</li>
              <li className="text-sm text-dark-400">+62 812-3456-7890</li>
              <li className="text-sm text-dark-400">Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-dark-800 pt-8 text-center">
          <p className="text-sm text-dark-500">
            &copy; {new Date().getFullYear()} GameTopup. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
