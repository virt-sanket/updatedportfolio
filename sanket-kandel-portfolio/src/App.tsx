import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Contact from "./components/Contact";
import Admin from "./components/Admin";
import { defaultPortfolio } from "./data/defaultPortfolio";
import { PortfolioData } from "./types";

export default function App() {
  // Simple Pathname Router state
  const [currentRoute, setCurrentRoute] = useState<string>("home");
  
  // Data State
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(defaultPortfolio);
  const [loading, setLoading] = useState<boolean>(true);

  // Authentication State
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(false);

  // Initialize data and synchronize routing pathnames
  useEffect(() => {
    // 1. Fetch current portfolio configurations from public db API
    fetchPortfolio();

    // 2. Check local secure session storage for logged-in admin token
    const token = localStorage.getItem("admin_auth_token");
    if (token) {
      setAdminToken(token);
      setIsAdminLoggedIn(true);
    }

    // 3. Simple modern router path syncing
    const handleUrlRoute = () => {
      const path = window.location.pathname.replace(/^\/|\/$/g, "");
      if (path === "admin" || path.includes("admin")) {
        setCurrentRoute("admin");
      } else if (path && ["home", "about", "services", "portfolio", "contact"].includes(path)) {
        setCurrentRoute(path);
      } else {
        setCurrentRoute("home");
      }
    };

    handleUrlRoute();
    
    // Register back/forward handler
    window.addEventListener("popstate", handleUrlRoute);
    return () => window.removeEventListener("popstate", handleUrlRoute);
  }, []);

  const fetchPortfolio = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolio");
      if (res.ok) {
        const payload = await res.json();
        if (payload && payload.header) {
          setPortfolioData(payload);
        }
      }
    } catch (e) {
      console.error("Unable to load latest portfolio config, using default templates", e);
    } finally {
      setLoading(false);
    }
  };

  // Nav actions with pushState syncing
  const handleNavigate = (route: string) => {
    setCurrentRoute(route);
    const newPath = route === "home" ? "/" : `/${route}`;
    window.history.pushState(null, "", newPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Admin login action
  const handleAdminLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.token) {
          localStorage.setItem("admin_auth_token", result.token);
          setAdminToken(result.token);
          setIsAdminLoggedIn(true);
          return true;
        }
      }
    } catch (e) {
      console.error("Authentication server alert:", e);
    }
    return false;
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("admin_auth_token");
    setAdminToken(null);
    setIsAdminLoggedIn(false);
    handleNavigate("home");
  };

  // Portfolio update publisher
  const handleUpdatePortfolio = async (updatedData: PortfolioData): Promise<boolean> => {
    if (!adminToken) return false;
    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success) {
          setPortfolioData(result.data);
          return true;
        }
      }
    } catch (e) {
      console.error("Payload update transmission disrupted:", e);
    }
    return false;
  };

  // Render Page Content depending on active route state
  const renderRouteView = () => {
    switch (currentRoute) {
      case "home":
        return <Home data={portfolioData} onNavigate={handleNavigate} />;
      case "about":
        return <About data={portfolioData} />;
      case "services":
        return <Services data={portfolioData} />;
      case "portfolio":
        return <Portfolio data={portfolioData} />;
      case "contact":
        return <Contact data={portfolioData} />;
      case "admin":
        return (
          <Admin
            portfolioData={portfolioData}
            onUpdatePortfolio={handleUpdatePortfolio}
            isAdminLoggedIn={isAdminLoggedIn}
            onAdminLogin={handleAdminLogin}
            onAdminLogout={handleAdminLogout}
            adminToken={adminToken}
          />
        );
      default:
        return <Home data={portfolioData} onNavigate={handleNavigate} />;
    }
  };

  // Global loading overlay
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center space-y-4">
        {/* Sleek rotating ring loader */}
        <div className="w-10 h-10 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
        <span className="font-mono text-xs text-gray-400 tracking-widest uppercase">
          Verifying System Credentials...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-[#1A1A1A] selection:bg-black/10 selection:text-black">
      {/* Dynamic Header Navbar layer */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        data={portfolioData}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Core Content Container with Animated Frame Switch */}
      <main className="relative min-h-[calc(100vh-4.5rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="w-full"
          >
            {renderRouteView()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Persistent Brand Footer */}
      <footer className="w-full border-t border-gray-100 bg-white py-10 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-gray-400 uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} || {portfolioData.header.nameSpan} {portfolioData.header.nameRest} || Portfolio</p>
          <button
            onClick={() => handleNavigate("admin")}
            className="hover:text-black transition cursor-pointer hover:underline"
          >
            Admin Panel
          </button>
        </div>
      </footer>
    </div>
  );
}
