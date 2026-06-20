import React, { useState, useEffect } from "react";
import {
  Lock, Eye, EyeOff, Layout, LogOut, CheckCircle2, AlertCircle, Trash2, Plus, 
  Settings, Mail, User, Info, Smartphone, FileText, Globe, Send, MessageSquare, ListCollapse
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { PortfolioData, ContactMessage, ServiceItem, WorkItem, ListItem } from "../types";

interface AdminProps {
  portfolioData: PortfolioData;
  onUpdatePortfolio: (updatedData: PortfolioData) => Promise<boolean>;
  isAdminLoggedIn: boolean;
  onAdminLogin: (password: string) => Promise<boolean>;
  onAdminLogout: () => void;
  adminToken: string | null;
}

type AdminTab = "header" | "about" | "services" | "works" | "contact" | "inbox";

export default function Admin({
  portfolioData,
  onUpdatePortfolio,
  isAdminLoggedIn,
  onAdminLogin,
  onAdminLogout,
  adminToken,
}: AdminProps) {
  // Login Form
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState<AdminTab>("header");
  const [editableData, setEditableData] = useState<PortfolioData | null>(null);
  
  // Messages Inbox
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [actionMessage, setActionMessage] = useState({ type: "idle", text: "" });

  // Sync state with portfolio data once loaded
  useEffect(() => {
    if (portfolioData) {
      setEditableData(JSON.parse(JSON.stringify(portfolioData)));
    }
  }, [portfolioData]);

  // Load contact messages if logged in
  useEffect(() => {
    if (isAdminLoggedIn && adminToken) {
      loadMessages();
    }
  }, [isAdminLoggedIn, adminToken]);

  const loadMessages = async () => {
    if (!adminToken) return;
    setLoadingMessages(true);
    try {
      const response = await fetch("/api/admin/messages", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (response.ok) {
        const result = await response.json();
        setMessages(result);
      }
    } catch (e) {
      console.error("Failed to load messages inbox", e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    setIsLoggingIn(true);
    setLoginError("");

    const success = await onAdminLogin(password);
    if (!success) {
      setLoginError("Access Denied: Incorrect administrator password.");
    }
    setIsLoggingIn(false);
  };

  const showActionStatus = (type: "success" | "error", text: string) => {
    setActionMessage({ type, text });
    setTimeout(() => {
      setActionMessage({ type: "idle", text: "" });
    }, 5000);
  };

  // Save changes
  const handleSaveChanges = async () => {
    if (!editableData) return;
    const success = await onUpdatePortfolio(editableData);
    if (success) {
      showActionStatus("success", "Portfolio elements successfully updated and published!");
    } else {
      showActionStatus("error", "Failed to save updates. Please confirm credential sessions.");
    }
  };

  // Delete message
  const handleDeleteMessage = async (id: string) => {
    if (!adminToken) return;
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (response.ok) {
        setMessages(messages.filter((m) => m.id !== id));
        showActionStatus("success", "Message deleted successfully!");
      } else {
        showActionStatus("error", "Failed to delete message.");
      }
    } catch (e) {
      showActionStatus("error", "Error contacting backend to delete message.");
    }
  };

  // Mini Helpers to modify nested states safely
  const updateHeaderField = (field: string, val: string) => {
    if (!editableData) return;
    setEditableData({
      ...editableData,
      header: { ...editableData.header, [field]: val },
    });
  };

  const updateAboutField = (field: string, val: string) => {
    if (!editableData) return;
    setEditableData({
      ...editableData,
      about: { ...editableData.about, [field]: val },
    });
  };

  const updateContactField = (field: string, val: string) => {
    if (!editableData) return;
    setEditableData({
      ...editableData,
      contact: { ...editableData.contact, [field]: val },
    });
  };

  // Skills, Experience, Education item controls
  const addAboutListItem = (type: "skills" | "experience" | "education") => {
    if (!editableData) return;
    const items = [...editableData.about[type]];
    items.push({ label: "New item date/category", detail: "New detail description" });
    setEditableData({
      ...editableData,
      about: { ...editableData.about, [type]: items },
    });
  };

  const deleteAboutListItem = (type: "skills" | "experience" | "education", index: number) => {
    if (!editableData) return;
    const items = [...editableData.about[type]].filter((_, i) => i !== index);
    setEditableData({
      ...editableData,
      about: { ...editableData.about, [type]: items },
    });
  };

  const editAboutListItem = (type: "skills" | "experience" | "education", index: number, field: "label" | "detail", val: string) => {
    if (!editableData) return;
    const items = [...editableData.about[type]];
    items[index][field] = val;
    setEditableData({
      ...editableData,
      about: { ...editableData.about, [type]: items },
    });
  };

  // Services controls
  const editServiceItem = (index: number, field: keyof ServiceItem, val: string) => {
    if (!editableData) return;
    const items = [...editableData.services.list];
    items[index] = { ...items[index], [field]: val };
    setEditableData({
      ...editableData,
      services: { ...editableData.services, list: items },
    });
  };

  // Portfolio Works controls
  const editWorkItem = (index: number, field: keyof WorkItem, val: string) => {
    if (!editableData) return;
    const items = [...editableData.portfolio.works];
    items[index] = { ...items[index], [field]: val };
    setEditableData({
      ...editableData,
      portfolio: { ...editableData.portfolio, works: items },
    });
  };

  const addWorkItem = () => {
    if (!editableData) return;
    const items = [...editableData.portfolio.works];
    items.push({
      id: `work-${Date.now()}`,
      title: "New Architectural Work",
      description: "Explain the project details and stack used.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=600&auto=format&fit=crop",
      projectUrl: "#",
    });
    setEditableData({
      ...editableData,
      portfolio: { ...editableData.portfolio, works: items },
    });
  };

  const deleteWorkItem = (index: number) => {
    if (!editableData) return;
    const items = [...editableData.portfolio.works].filter((_, i) => i !== index);
    setEditableData({
      ...editableData,
      portfolio: { ...editableData.portfolio, works: items },
    });
  };

  // Render Login Lock Screen
  if (!isAdminLoggedIn) {
    return (
      <div className="relative min-h-[calc(100vh-4.5rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA]">
        {/* Soft elegant geometric background blur */}
        <div className="absolute top-1/3 left-1/3 w-[25rem] h-[25rem] rounded-full bg-gray-100/60 blur-[100px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full p-8 rounded-2xl border border-gray-100 bg-white shadow-xl space-y-6"
        >
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 text-black border border-gray-150 mb-4">
              <Lock className="w-5 h-5 text-black" />
            </div>
            <h2 className="text-2xl font-light tracking-tight text-[#1A1A1A]">
              Administrator Access
            </h2>
            <p className="mt-1.5 font-sans text-xs text-gray-500 font-light leading-relaxed">
              Authenticate via security secret key to access Sanket's administrative panel tools.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <AnimatePresence mode="wait">
              {loginError && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start space-x-2.5 p-3.5 rounded-xl border border-rose-100 bg-rose-50 text-rose-800 text-xs"
                >
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-600" />
                  <span>{loginError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-2">
              <label htmlFor="pass" className="block text-[10px] font-mono uppercase text-gray-400 tracking-[0.2em]">
                Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="pass"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="•••••••••••••••"
                  className="w-full pl-4 pr-10 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full inline-flex items-center justify-center px-4 py-3 bg-black hover:opacity-90 text-white font-semibold rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>{isLoggingIn ? "Authorizing Security..." : "Authorize Access"}</span>
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  // Loaded Editable Data guard
  if (!editableData) {
    return (
      <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center bg-[#FAFAFA]">
        <span className="font-mono text-sm text-gray-400">Retrieving secure portfolio payload...</span>
      </div>
    );
  }

  const sidebarTabs = [
    { id: "header" as AdminTab, label: "Hero Block", icon: Layout },
    { id: "about" as AdminTab, label: "Biography", icon: Info },
    { id: "services" as AdminTab, label: "Services", icon: Smartphone },
    { id: "works" as AdminTab, label: "Works", icon: Globe },
    { id: "contact" as AdminTab, label: "Networks", icon: Send },
    { id: "inbox" as AdminTab, label: "Message Inbox", icon: MessageSquare, badge: messages.length },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4.5rem)] py-8 px-4 sm:px-6 lg:px-8 bg-[#FAFAFA] font-sans text-left">
      <div className="max-w-7xl mx-auto flex flex-col space-y-6">
        
        {/* Admin Header with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 border border-gray-100 bg-white shadow-sm rounded-2xl gap-4">
          <div>
            <div className="flex items-center space-x-2 text-[10px] font-mono font-bold tracking-wider text-gray-400 uppercase">
              <Settings className="w-3.5 h-3.5" />
              <span>Sanket. Control panel</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-light tracking-tight text-[#1A1A1A] mt-1">
              Portfolio Configuration
            </h2>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={handleSaveChanges}
              className="px-5 py-2.5 bg-black hover:opacity-90 text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer"
            >
              Save & Publish Changes
            </button>
            <button
              onClick={onAdminLogout}
              className="flex items-center space-x-1 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-black rounded text-xs tracking-wider transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>

        {/* Global Save action banner */}
        <AnimatePresence mode="wait">
          {actionMessage.type !== "idle" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`flex items-start space-x-3 p-4 rounded-xl border ${
                actionMessage.type === "success"
                  ? "bg-emerald-50 border-emerald-100 text-emerald-800"
                  : "bg-rose-50 border-rose-100 text-rose-800"
              }`}
            >
              {actionMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-600" />
              )}
              <span className="text-sm font-medium">{actionMessage.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar Panel (span 3) */}
          <div className="lg:col-span-3 space-y-2">
            <div className="p-4 border border-gray-100 bg-white shadow-sm rounded-2xl text-left">
              <p className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.2em] mb-3 px-3">
                Directories
              </p>
              <nav className="space-y-1">
                {sidebarTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        isActive
                          ? "bg-gray-50 text-black border-l-2 border-black"
                          : "text-gray-400 hover:bg-gray-50 hover:text-black"
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <Icon className="w-4 h-4" />
                        <span>{tab.label}</span>
                      </div>
                      {tab.badge !== undefined && tab.badge > 0 && (
                        <span className="bg-black text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-full">
                          {tab.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Active Configuration Workspace Panel (span 9) */}
          <div className="lg:col-span-9 p-8 border border-gray-105 bg-white shadow-sm rounded-2xl space-y-6 text-left">
            
            {/* 1. Header Tab */}
            {activeTab === "header" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Hero Block Config</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Edit home screen display labels and logo texts.</p>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Logo Brand Text</label>
                    <input
                      type="text"
                      value={editableData.header.logoText}
                      onChange={(e) => updateHeaderField("logoText", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Professional Role Subtitle</label>
                    <input
                      type="text"
                      value={editableData.header.role}
                      onChange={(e) => updateHeaderField("role", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Name Accent (Span)</label>
                    <input
                      type="text"
                      value={editableData.header.nameSpan}
                      onChange={(e) => updateHeaderField("nameSpan", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Name Suffix rest</label>
                    <input
                      type="text"
                      value={editableData.header.nameRest}
                      onChange={(e) => updateHeaderField("nameRest", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 2. About Tab */}
            {activeTab === "about" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white">About Biography & Tabs</h3>
                  <p className="text-xs text-zinc-500 font-light mt-0.5">Control details for Sanket's biography, Profile Photo card, and sliding timeline links.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wide">Main Title</label>
                  <input
                    type="text"
                    value={editableData.about.title}
                    onChange={(e) => updateAboutField("title", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-850 bg-zinc-900 text-zinc-100 rounded-xl text-sm focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wide">Cover Profile Photo URL</label>
                  <input
                    type="text"
                    value={editableData.about.photoUrl}
                    onChange={(e) => updateAboutField("photoUrl", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-850 bg-zinc-900 text-zinc-100 rounded-xl text-sm focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-zinc-400 uppercase tracking-wide">Biography Description</label>
                  <textarea
                    rows={4}
                    value={editableData.about.description}
                    onChange={(e) => updateAboutField("description", e.target.value)}
                    className="w-full px-4 py-3 border border-zinc-850 bg-zinc-900 text-zinc-100 rounded-xl text-sm focus:outline-none resize-none"
                  />
                </div>

                {/* Sublist managers: Skills, Experience, Education */}
                {(["skills", "experience", "education"] as const).map((type) => {
                  return (
                    <div key={type} className="pt-4 border-t border-gray-100 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-[#1A1A1A] capitalize">{type} Sublist</h4>
                        <button
                          onClick={() => addAboutListItem(type)}
                          className="flex items-center space-x-2 px-3 py-1.5 bg-black hover:opacity-90 text-white rounded text-xs font-bold tracking-wider uppercase cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add Row</span>
                        </button>
                      </div>

                      <div className="space-y-3">
                        {editableData.about[type].map((item, index) => {
                          return (
                            <div key={index} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 bg-gray-50/50">
                              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <input
                                  type="text"
                                  value={item.label}
                                  placeholder="Category/Date label"
                                  onChange={(e) => editAboutListItem(type, index, "label", e.target.value)}
                                  className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 font-mono rounded-lg text-xs focus:outline-none"
                                />
                                <input
                                  type="text"
                                  value={item.detail}
                                  placeholder="Sub-detail content"
                                  onChange={(e) => editAboutListItem(type, index, "detail", e.target.value)}
                                  className="w-full sm:col-span-2 px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none"
                                />
                              </div>
                              <button
                                onClick={() => deleteAboutListItem(type, index)}
                                className="p-2 text-gray-400 hover:text-red-500 border border-transparent hover:border-gray-200 hover:bg-red-50 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 3. Services Tab */}
            {activeTab === "services" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Services Rendered</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Fine-tune the list of specific service details, titles, and Lucide vector icon names.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Section title</label>
                  <input
                    type="text"
                    value={editableData.services.title}
                    onChange={(e) => {
                      if (editableData) {
                        setEditableData({
                          ...editableData,
                          services: { ...editableData.services, title: e.target.value },
                        });
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-4">
                  {editableData.services.list.map((srv, index) => {
                    return (
                      <div key={srv.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/40 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-xs font-mono font-bold text-black">SERVICE BLOCK {index + 1}</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Service Title</label>
                            <input
                              type="text"
                              value={srv.title}
                              onChange={(e) => editServiceItem(index, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Lucide Vector Icon Name</label>
                            <input
                              type="text"
                              value={srv.icon}
                              onChange={(e) => editServiceItem(index, "icon", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Description</label>
                          <textarea
                            rows={2}
                            value={srv.description}
                            onChange={(e) => editServiceItem(index, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. Works Tab */}
            {activeTab === "works" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">Works Portfolio</h3>
                    <p className="text-xs text-gray-400 font-light mt-0.5">Add, delete, or refine projects, images, and external urls.</p>
                  </div>
                  <button
                    onClick={addWorkItem}
                    className="flex items-center space-x-2 px-3 py-1.5 bg-black hover:opacity-90 text-white rounded text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create New Project</span>
                  </button>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Section title</label>
                  <input
                    type="text"
                    value={editableData.portfolio.title}
                    onChange={(e) => {
                      if (editableData) {
                        setEditableData({
                          ...editableData,
                          portfolio: { ...editableData.portfolio, title: e.target.value },
                        });
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-6">
                  {editableData.portfolio.works.map((wk, index) => {
                    return (
                      <div key={wk.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/40 space-y-4">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <span className="text-xs font-mono font-bold text-black animate-pulse">PROJECT CARD {index + 1}</span>
                          <button
                            onClick={() => deleteWorkItem(index)}
                            className="flex items-center space-x-1.5 px-3 py-1 text-red-500 border border-red-100 bg-red-50 rounded-lg text-xs hover:bg-red-100 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete Card</span>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Project Title</label>
                            <input
                              type="text"
                              value={wk.title}
                              onChange={(e) => editWorkItem(index, "title", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Project Link / URL</label>
                            <input
                              type="text"
                              value={wk.projectUrl || ""}
                              onChange={(e) => editWorkItem(index, "projectUrl", e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none font-mono"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Illustration Image URL</label>
                          <input
                            type="text"
                            value={wk.image}
                            onChange={(e) => editWorkItem(index, "image", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none font-mono"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] font-mono text-gray-400 uppercase tracking-wider">Brief Description</label>
                          <textarea
                            rows={2}
                            value={wk.description}
                            onChange={(e) => editWorkItem(index, "description", e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg text-xs focus:outline-none resize-none"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Contact Tab */}
            {activeTab === "contact" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#1A1A1A]">Networks & Contact</h3>
                  <p className="text-xs text-gray-400 font-light mt-0.5">Define portfolio phone, email, CV attachment link, and social profiles.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Public Email</label>
                    <input
                      type="email"
                      value={editableData.contact.email}
                      onChange={(e) => updateContactField("email", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Public Phone Number</label>
                    <input
                      type="text"
                      value={editableData.contact.phone}
                      onChange={(e) => updateContactField("phone", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">PDF CV Resume URL</label>
                  <input
                    type="text"
                    value={editableData.contact.cvUrl}
                    onChange={(e) => updateContactField("cvUrl", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none font-mono"
                  />
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <h4 className="text-xs font-mono text-gray-400 uppercase tracking-wider">Social Links</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Facebook</label>
                      <input
                        type="text"
                        value={editableData.contact.facebook}
                        onChange={(e) => updateContactField("facebook", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">Instagram</label>
                      <input
                        type="text"
                        value={editableData.contact.instagram}
                        onChange={(e) => updateContactField("instagram", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">YouTube</label>
                      <input
                        type="text"
                        value={editableData.contact.youtube}
                        onChange={(e) => updateContactField("youtube", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none font-mono"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-gray-400 uppercase tracking-wide">LinkedIn</label>
                      <input
                        type="text"
                        value={editableData.contact.linkedin}
                        onChange={(e) => updateContactField("linkedin", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 bg-[#FAFAFA] text-gray-900 rounded-xl text-sm focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. Inbox Tab */}
            {activeTab === "inbox" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">Contact Message Inbox</h3>
                    <p className="text-xs text-gray-400 font-light mt-0.5">Receive and review incoming inquiries submitted directly from the web client.</p>
                  </div>
                  <button
                    onClick={loadMessages}
                    disabled={loadingMessages}
                    className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-500 hover:text-black rounded text-xs transition cursor-pointer font-bold font-mono"
                  >
                    {loadingMessages ? "Syncing..." : "Sync Inbox"}
                  </button>
                </div>

                <div className="space-y-4">
                  {loadingMessages ? (
                    <p className="text-xs text-gray-400 font-mono italic animate-pulse">Syncing pipeline messages on secure port...</p>
                  ) : messages.length === 0 ? (
                    <div className="p-8 text-center border border-gray-100 bg-white rounded-2xl">
                      <MessageSquare className="w-8 h-8 text-gray-400/25 mx-auto mb-3" />
                      <p className="text-sm font-bold text-gray-400">Your Inbox is Empty</p>
                      <p className="text-xs text-gray-400 font-light mt-0.5">Submissions via the Contact page form will appear here dynamically.</p>
                    </div>
                  ) : (
                    messages.slice().reverse().map((msg) => {
                      return (
                        <div key={msg.id} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/20 space-y-4 hover:border-gray-205 transition">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 border-b border-gray-100 gap-1.5">
                            <div>
                              <h4 className="text-sm font-semibold text-[#1A1A1A]">{msg.name}</h4>
                              <p className="text-xs text-black font-semibold font-mono mt-0.5">{msg.email}</p>
                            </div>
                            <span className="text-[10px] font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                              {new Date(msg.createdAt).toLocaleString()}
                            </span>
                          </div>
                          
                          <p className="text-xs text-gray-600 leading-relaxed bg-white p-4 rounded-xl border border-gray-100 block font-light">
                            {msg.message}
                          </p>

                          <div className="flex justify-end pt-1">
                            <button
                              onClick={() => handleDeleteMessage(msg.id)}
                              className="flex items-center space-x-1.5 px-3 py-1.5 text-gray-500 hover:text-red-500 bg-white hover:bg-red-50 border border-gray-200 hover:border-red-150 rounded-lg text-xs transition cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Purge message</span>
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
