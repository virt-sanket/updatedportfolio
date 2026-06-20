import React, { useState } from "react";
import { Mail, Phone, Download, Facebook, Instagram, Youtube, Linkedin, Send, CheckCircle2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData } from "../types";

interface ContactProps {
  data: PortfolioData;
}

export default function Contact({ data }: ContactProps) {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setSubmitStatus("success");
        setStatusMessage(result.message || "Message Sent Successfully");
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitStatus("error");
        setStatusMessage(result.error || "Failed to deliver message. Please try again.");
      }
    } catch (error) {
      setSubmitStatus("error");
      setStatusMessage("Unable to contact backend server. Please verify connections.");
    } finally {
      setIsSubmitting(false);

      // Dismiss status banner after 6 seconds
      setTimeout(() => {
        setSubmitStatus("idle");
      }, 6000);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-16 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] overflow-hidden">
      {/* Background soft lighting blobs */}
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gray-100/30 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="max-w-2xl mb-12 text-left">
          {/* Section Supertitle */}
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">
            Inquiry
          </p>
          <h2 className="text-3xl sm:text-5xl font-light tracking-tighter text-[#1A1A1A] mb-4">
            Contact Me
          </h2>
          <p className="text-gray-500 font-sans font-light">
            Have an exciting idea, micro-project, or engineering role you would like to collaborate on? Send me a message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          {/* Left Column: Contact Profile & Details (span 5) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="p-8 rounded-2xl border border-gray-105 bg-white shadow-sm space-y-6">
              <h3 className="text-xl font-medium tracking-tight text-[#1A1A1A]">
                Connect Directly
              </h3>
              
              {/* Contact Information */}
              <div className="space-y-4 font-sans text-sm">
                <a
                  href={`mailto:${data.contact.email}`}
                  className="flex items-center space-x-3 text-gray-500 hover:text-black transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded bg-gray-50 border border-gray-100 text-black">
                    <Mail className="w-4 h-4" />
                  </div>
                  <span className="font-light">{data.contact.email || "kandel.sanket321@gmail.com"}</span>
                </a>

                <a
                  href={`tel:${data.contact.phone}`}
                  className="flex items-center space-x-3 text-gray-500 hover:text-black transition-colors"
                >
                  <div className="flex items-center justify-center w-9 h-9 rounded bg-gray-50 border border-gray-100 text-black">
                    <Phone className="w-4 h-4" />
                  </div>
                  <span className="font-light">{data.contact.phone || "9844200458"}</span>
                </a>
              </div>

              {/* Socials Block */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[10px] font-mono uppercase text-gray-400 tracking-wider mb-4">
                  Follow My Networks
                </p>
                <div className="flex space-x-3">
                  {data.contact.facebook && (
                    <a
                      href={data.contact.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-white hover:bg-black hover:border-black transition-all cursor-pointer"
                      aria-label="Facebook Profile"
                    >
                      <Facebook className="w-4 h-4" />
                    </a>
                  )}

                  {data.contact.instagram && (
                    <a
                      href={data.contact.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-white hover:bg-black hover:border-black transition-all cursor-pointer"
                      aria-label="Instagram Profile"
                    >
                      <Instagram className="w-4 h-4" />
                    </a>
                  )}

                  {data.contact.youtube && (
                    <a
                      href={data.contact.youtube}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-white hover:bg-black hover:border-black transition-all cursor-pointer"
                      aria-label="YouTube Channel"
                    >
                      <Youtube className="w-4 h-4" />
                    </a>
                  )}

                  {data.contact.linkedin && (
                    <a
                      href={data.contact.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-white hover:bg-black hover:border-black transition-all cursor-pointer"
                      aria-label="LinkedIn Profile"
                    >
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Resume button */}
            {data.contact.cvUrl && data.contact.cvUrl !== "#" && (
              <a
                href={data.contact.cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-full inline-flex items-center justify-center space-x-2 px-6 py-4 bg-white hover:bg-gray-50 text-black font-semibold rounded-xl border border-gray-200 hover:border-black text-sm transition-all shadow-sm cursor-pointer"
              >
                <Download className="w-4 h-4 text-black" />
                <span>Download Resume / CV</span>
              </a>
            )}
          </div>

          {/* Right Column: Interactive Form Message Panel (span 7) */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="p-8 rounded-2xl border border-gray-100 bg-white shadow-xl space-y-6">
              
              {/* Form Validation Feedback Banner */}
              <AnimatePresence mode="wait">
                {submitStatus !== "idle" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex items-start space-x-3 p-4 rounded-xl border ${
                      submitStatus === "success"
                        ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                        : "bg-rose-50 border-rose-100 text-rose-800"
                    }`}
                  >
                    {submitStatus === "success" ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
                    )}
                    <div>
                      <h4 className="text-sm font-bold">
                        {submitStatus === "success" ? "Delivery Succeeded!" : "Service Alert"}
                      </h4>
                      <p className="text-xs font-light mt-0.5">{statusMessage}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-[10px] font-mono uppercase text-gray-400 tracking-[0.2em]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Sanket Kandel"
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-[10px] font-mono uppercase text-gray-400 tracking-[0.2em]">
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="sanket@example.com"
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="block text-[10px] font-mono uppercase text-gray-400 tracking-[0.2em]">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hi Sanket, let's build something beautiful together..."
                  className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-8 py-4 bg-black text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer rounded"
              >
                <Send className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${isSubmitting ? "animate-ping" : ""}`} />
                <span>{isSubmitting ? "Delivering..." : "Send Message"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
