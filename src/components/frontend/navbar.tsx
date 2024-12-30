"use client";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold">
          Calculator
        </a>

        {/* Search Bar */}
        <div className="mx-4 hidden flex-grow md:flex">
          <input
            type="text"
            placeholder="Search calculators..."
            className="w-full rounded-md bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="text-2xl md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </button>

        {/* Navigation Links */}
        <div
          className={`${
            isMenuOpen ? "block" : "hidden"
          } absolute left-0 top-16 w-full items-center bg-gray-800 md:static md:left-auto md:top-auto md:flex md:w-auto md:gap-8 md:bg-transparent`}
        >
          <a
            href="/financial"
            className="block px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent"
          >
            Financial
          </a>
          <a
            href="/fitness-and-health"
            className="block px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent"
          >
            Fitness and Health
          </a>
          <a
            href="/math"
            className="block px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent"
          >
            Math
          </a>
          <a
            href="/other"
            className="block px-4 py-2 hover:bg-gray-700 md:hover:bg-transparent"
          >
            Other
          </a>
          <a
            href="/all-calculators"
            className="block px-4 py-2 font-semibold text-blue-400 hover:text-blue-500 md:hover:text-blue-400"
          >
            All Calculators
          </a>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 py-2 md:hidden">
        <input
          type="text"
          placeholder="Search calculators..."
          className="mb-3 w-full rounded-md bg-gray-700 p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </nav>
  );
}
