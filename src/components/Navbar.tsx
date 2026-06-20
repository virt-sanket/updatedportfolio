import React, { useState } from "react";
import { Menu, X, Code, ExternalLink, Settings } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData } from "../types";

interface NavbarProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  data: PortfolioData;
  isAdminLoggedIn: boolean;
}

export default function Navbar({ currentRoute, onNavigate, data, isAdminLoggedIn }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "portfolio", label: "Portfolio" },
    { id: "contact", label: "Contact" },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/85 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => handleNavClick("home")}
          className="flex items-center space-x-3 text-lg font-bold tracking-tight cursor-pointer text-black"
        >
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
            {(data.header.logoText?.[0] || data.header.nameSpan?.[0] || "S")}
          </div>
          <span className="font-semibold tracking-tight">
            {data.header.logoText || "Sanket."}
          </span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`relative py-2 text-xs font-semibold uppercase tracking-[0.2em] transition-colors cursor-pointer ${
                  isActive ? "text-black" : "text-gray-400 hover:text-black"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}

          {/* Admin shortcut indicator */}
          <button
            onClick={() => handleNavClick("admin")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
              currentRoute === "admin"
                ? "bg-black text-white border-black"
                : isAdminLoggedIn
                ? "bg-emerald-50 border-emerald-250 text-emerald-800 hover:bg-emerald-100/50"
                : "bg-white border-gray-200 text-gray-400 hover:text-black hover:border-gray-400"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{isAdminLoggedIn ? "Admin Panel" : "Admin"}</span>
          </button>
        </nav>

        {/* Mobile menu button */}
        <div className="flex items-center md:hidden space-x-4">
          <button
            onClick={() => handleNavClick("admin")}
            className={`p-2 rounded-lg border text-xs font-mono cursor-pointer ${
              currentRoute === "admin"
                ? "bg-black text-white border-black"
                : isAdminLoggedIn
                ? "bg-emerald-50 border-emerald-250 text-emerald-800"
                : "bg-white border-gray-200 text-gray-400"
            }`}
            aria-label="Admin settings"
          >
            <Settings className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-gray-400 hover:text-black focus:outline-none cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 pt-4 pb-6 space-y-2">
              {navItems.map((item) => {
                const isActive = currentRoute === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`block w-full text-left px-4 py-3 rounded-xl text-xs font-semibold uppercase tracking-[0.2em] transition-all ${
                      isActive
                        ? "bg-gray-50 text-black border-l-2 border-black"
                        : "text-gray-400 hover:bg-gray-50 hover:text-black"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
