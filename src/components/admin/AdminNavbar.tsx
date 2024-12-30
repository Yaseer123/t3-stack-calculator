"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false); // Collapse the menu when a link is clicked
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-800 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link
          href="/admin"
          className="whitespace-nowrap text-2xl font-bold hover:text-blue-400"
        >
          AdminDashboard
        </Link>

        {/* Search Bar for Larger Screens */}
        <div className="hidden flex-grow md:flex">
          <Input
            type="text"
            placeholder="Search calculators..."
            className="w-full"
          />
        </div>

        {/* Hamburger Menu Button */}
        <Button
          variant="ghost"
          className="text-xl md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle Menu"
        >
          ☰
        </Button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`${
          isMenuOpen ? "block" : "hidden"
        } bg-gray-800 transition-all duration-300 ease-in-out md:hidden`}
      >
        <div className="border-t border-gray-700 p-4">
          <Input
            type="text"
            placeholder="Search calculators..."
            className="mb-3 w-full"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/admin/all-calculators"
            className="block px-4 py-2 hover:bg-gray-700"
            onClick={handleLinkClick}
          >
            All Calculators
          </Link>
          <Link
            href="/admin/analytics"
            className="block px-4 py-2 hover:bg-gray-700"
            onClick={handleLinkClick}
          >
            Analytics
          </Link>
          <Link
            href="/admin/categories"
            className="block px-4 py-2 hover:bg-gray-700"
            onClick={handleLinkClick}
          >
            Categories
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex md:items-center md:justify-end md:gap-8">
        <Link
          href="/admin/all-calculators"
          className="px-4 py-2 hover:text-blue-400"
        >
          All Calculators
        </Link>
        <Link href="/admin/analytics" className="px-4 py-2 hover:text-blue-400">
          Analytics
        </Link>
        <Link
          href="/admin/categories"
          className="px-4 py-2 hover:text-blue-400"
        >
          Categories
        </Link>
      </div>
    </nav>
  );
}
