import React, { useState } from "react";
import { Award, BookOpen, Brain, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData } from "../types";

interface AboutProps {
  data: PortfolioData;
}

type TabType = "skills" | "experience" | "education";

export default function About({ data }: AboutProps) {
  const [activeTab, setActiveTab] = useState<TabType>("skills");

  const tabConfigs = [
    { id: "skills" as TabType, label: "Skills", icon: Brain },
    { id: "experience" as TabType, label: "Experience", icon: Briefcase },
    { id: "education" as TabType, label: "Education", icon: BookOpen },
  ];

  const getActiveTabContent = () => {
    switch (activeTab) {
      case "skills":
        return data.about.skills;
      case "experience":
        return data.about.experience;
      case "education":
        return data.about.education;
      default:
        return [];
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] overflow-hidden">
      {/* Background soft geometric highlights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 rounded-full bg-gray-100/40 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Column 1: Premium Styled Profile Cover (span 5) */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative group max-w-sm w-full"
            >
              {/* Back card offset shape */}
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-gray-200/50 rounded-full mix-blend-multiply opacity-40 blur-lg pointer-events-none" />
              
              <div className="relative bg-white p-2.5 border border-gray-100 shadow-xl rounded-2xl rotate-2">
                <div className="relative overflow-hidden rounded-xl aspect-[3/4] bg-gray-50">
                  <img
                    src={data.about.photoUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop"}
                    alt="Sanket Kandel Profile"
                    className="w-full h-full object-cover grayscale brightness-95 opacity-90 transition-all duration-700 hover:grayscale-0 hover:scale-103"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Minimalism Badge Overlay */}
                  <div className="absolute top-4 left-4 font-mono text-[9px] tracking-widest text-white bg-black px-2.5 py-1 uppercase rounded font-bold">
                    INFO_01
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Column 2: Content (span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            {/* Supertitle */}
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">
              Biography
            </p>
            
            {/* Main Section Header */}
            <h2 className="text-3xl sm:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-6">
              {data.about.title || "About Me"}
            </h2>

            {/* Core Description */}
            <p className="font-sans text-base text-gray-500 leading-relaxed font-light mb-8">
              {data.about.description || "Portfolio details loading..."}
            </p>

            {/* Custom Tab Switcher */}
            <div className="flex border-b border-gray-150 mb-6 gap-2 sm:gap-6 overflow-x-auto scroller-none">
              {tabConfigs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-3 px-1 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
                      isActive
                        ? "border-black text-black"
                        : "border-transparent text-gray-400 hover:text-black"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Sublist Items with slide transition */}
            <div className="min-h-[18rem]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {getActiveTabContent().length > 0 ? (
                    getActiveTabContent().map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-start space-x-4 p-5 rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300"
                      >
                        <div className="mt-1 flex items-center justify-center w-6 h-6 rounded-full bg-zinc-100 text-gray-800 border border-zinc-200 text-xs font-mono font-bold shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold font-mono tracking-wider text-gray-400 uppercase">
                            {item.label}
                          </h4>
                          <p className="text-gray-600 text-sm mt-1.5 leading-relaxed font-light">
                            {item.detail}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-400 font-mono italic">
                      No information provided.
                    </p>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
