import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { PortfolioData } from "../types";

interface HomeProps {
  data: PortfolioData;
  onNavigate: (route: string) => void;
}

export default function Home({ data, onNavigate }: HomeProps) {
  // Grab the first work to display as the featured minimal preview card
  const featuredWork = data.portfolio.works[0] || {
    title: "EcoSphere API",
    description: "Enterprise-grade green telemetry and headless commerce engine.",
    image: "https://images.unsplash.com/photo-1541462608141-2f5297e10a27?q=80&w=600&auto=format&fit=crop"
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center overflow-hidden py-12 px-4 sm:px-6 lg:px-16 bg-[#FAFAFA]">
      {/* Absolute clean geometric highlights */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] rounded-full bg-gray-100/50 blur-[130px] pointer-events-none" />

      {/* Main Grid matches Clean Minimalism blueprint exactly */}
      <div className="relative max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-10">
        
        {/* Left column info */}
        <div className="lg:col-span-7 flex flex-col gap-6 text-left">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-[0.3em] text-gray-400"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{data.header.role || "Full-Stack Developer & UI Architect"}</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-light tracking-tighter text-[#1A1A1A] leading-[1] sm:leading-[0.9]"
            >
              Hi, I'm <span className="font-medium">{data.header.nameSpan || "Sanket"}</span>
              <br />
              <span className="font-medium italic text-gray-500">{data.header.nameRest || "Kandel"}</span>.
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg sm:text-xl text-gray-500 max-w-xl leading-relaxed font-light"
          >
            {data.about.description || "Building high-performance, responsive applications that prioritize user experience and technical excellence."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-col sm:flex-row gap-4 pt-4"
          >
            <button
              onClick={() => onNavigate("portfolio")}
              className="px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-95 transition-opacity inline-flex items-center justify-center space-x-2 cursor-pointer rounded"
            >
              <span>View Portfolio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate("contact")}
              className="px-8 py-4 border border-gray-200 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-gray-50 transition-colors cursor-pointer rounded"
            >
              Get in Touch
            </button>
          </motion.div>
        </div>

        {/* Right column: Featured project visual preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, rotate: 0 }}
          animate={{ opacity: 1, scale: 1, rotate: 2 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="lg:col-span-5 relative w-full max-w-sm mx-auto lg:mx-0"
        >
          {/* Decorative back circle shape matching Mockup */}
          <div className="absolute -top-10 -left-10 w-48 h-48 sm:w-64 sm:h-64 bg-gray-200/60 rounded-full mix-blend-multiply opacity-50 blur-xl pointer-events-none"></div>
          
          <div className="relative bg-white p-2.5 border border-gray-100 shadow-2xl rounded-2xl">
            <div className="aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden flex flex-col justify-between">
              {/* Cover visual representation gradient / image */}
              <div className="h-44 sm:h-52 overflow-hidden border-b border-gray-100">
                <img
                  src={featuredWork.image || "https://images.unsplash.com/photo-1541462608141-2f5297e10a27?q=80&w=600&auto=format&fit=crop"}
                  alt={featuredWork.title}
                  className="w-full h-full object-cover grayscale brightness-95"
                  referrerPolicy="no-referrer"
                />
              </div>

              {/* Bottom text info */}
              <div className="p-6 flex-1 flex flex-col justify-end gap-1 bg-white">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Featured System Hub</span>
                <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-[#1A1A1A]">{featuredWork.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed font-light">{featuredWork.description.slice(0, 100) + "..."}</p>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
