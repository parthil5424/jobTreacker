"use client";
import { Briefcase, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingNavbar() {
  const [showFeature, setShowFeature] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    let url = window.location.pathname;
    if (url.includes("Login") || url.includes("SignUp")) {
      setShowFeature(false);
    }
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? "bg-white/80 backdrop-blur-lg shadow-lg" : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              JobTracker
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {showFeature && (
              <a
                href="#features"
                className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
              >
                Features
              </a>
            )}

            {/* <a
                  href="#how-it-works"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
                >
                  Pricing
                </a> */}
            <Link
              href="/Login"
              className="px-6 py-2.5 text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link
              href="/SignUp"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 font-medium"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3">
            {showFeature && (
              <a
                href="#features"
                className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
              >
                Features
              </a>
            )}

            {/* <a
                  href="#how-it-works"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  How It Works
                </a>
                <a
                  href="#pricing"
                  className="block py-2 text-gray-700 hover:text-blue-600 transition-colors"
                >
                  Pricing
                </a> */}
            <Link
              href="/Login"
              className="w-full px-6 py-2.5 text-gray-700 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300"
            >
              Sign In
            </Link>
            <Link
              href="/SignUp"
              className="w-full px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg transition-all duration-300"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
