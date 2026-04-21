import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="mx-auto max-w-7xl px-6 py-12 sm:py-16 lg:py-20">
        <div className="grid gap-8 md:grid-cols-4 sm:grid-cols-2">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 text-white">
              <div className="text-2xl font-extrabold text-blue-400">SCO</div>
              <span>Smart Campus</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed">
              Streamline your university's facility management, bookings, and maintenance with our comprehensive platform.
            </p>
            <div className="mt-6 flex gap-4">
              <a href="#" className="hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20v-7.21H5.5V9.25h2.79V7.25c0-2.89 1.93-4.44 4.57-4.44 1.29 0 2.4.1 2.73.14v3.05h-1.87c-1.46 0-1.74.7-1.74 1.73v2.27h3.5l-.44 3.54h-3.06V20" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
                </svg>
              </a>
              <a href="#" className="hover:text-white transition">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-white">Product</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#benefits" className="hover:text-white transition">
                  Benefits
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Security
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase text-white">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a href="#" className="hover:text-white transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Cookie Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  GDPR
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-slate-800 pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm">
              &copy; {currentYear} Smart Campus Operations Hub. All rights reserved.
            </p>
            <div className="flex gap-6">
              <a href="#" className="text-sm hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="text-sm hover:text-white transition">
                Terms
              </a>
              <a href="#" className="text-sm hover:text-white transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
