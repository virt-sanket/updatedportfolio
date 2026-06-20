import React from "react";
import * as LucideIcons from "lucide-react";
import { motion } from "motion/react";
import { PortfolioData } from "../types";

interface ServicesProps {
  data: PortfolioData;
}

// Map icon string names dynamically to Lucide components
const IconResolver = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name];
  if (!IconComponent) {
    // fallback to generic tool icon if name doesn't match
    const DefaultIcon = LucideIcons.Cpu;
    return <DefaultIcon className={className} />;
  }
  return <IconComponent className={className} />;
};

export default function Services({ data }: ServicesProps) {
  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] overflow-hidden">
      {/* Background soft lighting blobs */}
      <div className="absolute top-1/4 right-0 w-80 h-80 rounded-full bg-gray-100/30 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 text-left">
          {/* Section Supertitle */}
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">
            Expertise
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4">
            {data.services.title || "My Services"}
          </h2>
          <p className="text-gray-500 font-sans font-light">
            Providing high-end technical design and frontend engineering services optimized for speed, reliability, and conversions.
          </p>
        </div>

        {/* Dynamic Service Bento-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {data.services.list.map((service, index) => {
            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative rounded-2xl border border-gray-100 bg-white p-8 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Subtle light background dot frame on hover */}
                <div className="absolute inset-x-0 bottom-0 h-1 bg-black transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

                {/* Card Icon */}
                <div className="mb-6 inline-flex items-center justify-center p-3.5 rounded-xl border border-gray-100 bg-gray-50 text-black group-hover:bg-black group-hover:text-white transition-all duration-300">
                  <IconResolver name={service.icon} className="w-5 h-5" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold tracking-tight text-[#1A1A1A] mb-3">
                  {service.title}
                </h3>

                {/* Description */}
                <p className="font-sans text-sm text-gray-500 leading-relaxed font-light mb-6">
                  {service.description}
                </p>

                {/* Call to action arrow */}
                <a
                  href={service.learnMoreUrl || "#"}
                  className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold uppercase tracking-wider text-black group-hover:underline transition"
                >
                  <span>Learn More</span>
                  <span className="transform duration-300 group-hover:translate-x-1">→</span>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
