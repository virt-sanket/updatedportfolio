import React from "react";
import { ExternalLink, Layers } from "lucide-react";
import { motion } from "motion/react";
import { PortfolioData } from "../types";

interface PortfolioProps {
  data: PortfolioData;
}

export default function Portfolio({ data }: PortfolioProps) {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] overflow-hidden">
      {/* Background soft geometric highlights */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[30rem] h-[30rem] rounded-full bg-gray-100/30 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 text-left">
          {/* Section Supertitle */}
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">
            Showcase
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4">
            {data.portfolio.title || "My Works"}
          </h2>
          <p className="text-gray-500 font-sans font-light">
            An elegant collection of products, design blueprints, and production-ready applications developed with perfection and modularity.
          </p>
        </div>

        {/* Display Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {data.portfolio.works.map((work, index) => {
            return (
              <motion.div
                key={work.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white overflow-hidden transition-all duration-300 hover:border-gray-200 shadow-sm hover:shadow-xl hover:-translate-y-1"
              >
                {/* Showcase Cover and Hover Lens overlay */}
                <div className="relative aspect-video overflow-hidden border-b border-gray-100">
                  <img
                    src={work.image || "https://images.unsplash.com/photo-1541462608141-2f5297e10a27?q=80&w=600&auto=format&fit=crop"}
                    alt={work.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103 grayscale brightness-95"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Subtle white/95 screen overlay on hover */}
                  <div className="absolute inset-0 bg-white/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <a
                      href={work.projectUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-mono font-bold bg-black text-white px-5 py-2.5 hover:opacity-90 transition-opacity uppercase tracking-widest rounded"
                    >
                      <span>Launch Project</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Info Block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="inline-flex items-center justify-center px-2.5 py-1 rounded bg-zinc-100 text-gray-500 text-[10px] font-mono mb-4 border border-zinc-200 uppercase tracking-wider">
                      PROJECT {index + 1}
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-[#1A1A1A] mb-2">
                      {work.title}
                    </h3>
                    <p className="font-sans text-sm text-gray-500 font-light leading-relaxed">
                      {work.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <a
                      href={work.projectUrl || "#"}
                      className="inline-flex items-center space-x-1 text-xs font-mono text-black font-semibold hover:underline"
                    >
                      <span>Launch app</span>
                      <span className="transform duration-300 group-hover:translate-x-0.5">→</span>
                    </a>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
