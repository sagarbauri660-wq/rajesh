/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  CalendarDays, 
  CalendarRange, 
  Settings2, 
  Printer, 
  LogOut, 
  Menu, 
  X,
  UserCheck,
  Calendar,
  Store
} from "lucide-react";

import { AppSettings, Receipt } from "./types";
import { DEFAULT_SETTINGS } from "./utils/defaults";

// Import subcomponents
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import BillingForm from "./components/BillingForm";
import ReceiptHistory from "./components/ReceiptHistory";
import Reports from "./components/Reports";
import Settings from "./components/Settings";
import PrintPreview from "./components/PrintPreview";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  
  const [activeTab, setActiveTab] = useState("dashboardPage");
  const [editingReceipt, setEditingReceipt] = useState<Receipt | null>(null);
  const [currentPreviewReceipt, setCurrentPreviewReceipt] = useState<Receipt | null>(null);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Load Settings and Receipts on boot
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("rajesh_v42_settings");
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      
      const savedReceipts = localStorage.getItem("rajesh_v42_receipts");
      if (savedReceipts) {
        setReceipts(JSON.parse(savedReceipts));
      }
    } catch (e) {
      console.error("Failed to load records from storage:", e);
    }
  }, []);

  // Save utility triggers
  const saveSettingsToStorage = (updatedSettings: AppSettings) => {
    setSettings(updatedSettings);
    localStorage.setItem("rajesh_v42_settings", JSON.stringify(updatedSettings));
  };

  const saveReceiptsToStorage = (updatedReceipts: Receipt[]) => {
    setReceipts(updatedReceipts);
    localStorage.setItem("rajesh_v42_receipts", JSON.stringify(updatedReceipts));
  };

  // Login handler
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  // Logout handler
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  // Nav actions
  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  // Billing Actions
  const handleSaveBill = (receipt: Receipt) => {
    const existingIndex = receipts.findIndex(r => r.receiptNo === receipt.receiptNo);
    let updated: Receipt[];
    if (existingIndex >= 0) {
      updated = [...receipts];
      updated[existingIndex] = receipt;
    } else {
      updated = [receipt, ...receipts];
    }
    
    saveReceiptsToStorage(updated);
    setEditingReceipt(null);
    setCurrentPreviewReceipt(receipt);
    navigateToTab("printPage");
  };

  const handleGeneratePreview = (receipt: Receipt) => {
    setCurrentPreviewReceipt(receipt);
    navigateToTab("printPage");
  };

  const handleEditBillTrigger = (receipt: Receipt) => {
    setEditingReceipt(receipt);
    navigateToTab("billingPage");
  };

  const handleOpenReceiptTrigger = (receipt: Receipt) => {
    setCurrentPreviewReceipt(receipt);
    navigateToTab("printPage");
  };

  const handleDeleteReceiptTrigger = (receiptNo: string) => {
    const updated = receipts.filter(r => r.receiptNo !== receiptNo);
    saveReceiptsToStorage(updated);
    if (editingReceipt?.receiptNo === receiptNo) {
      setEditingReceipt(null);
    }
    if (currentPreviewReceipt?.receiptNo === receiptNo) {
      setCurrentPreviewReceipt(null);
    }
  };

  const handleCancelEditing = () => {
    setEditingReceipt(null);
    navigateToTab("dashboardPage");
  };

  // Show login screen if not authenticated
  if (!isLoggedIn) {
    return <Login settings={settings} onLogin={handleLoginSuccess} />;
  }

  // Sidebar navigation menu options
  const navItems = [
    { id: "dashboardPage", label: "🏠 Dashboard", icon: LayoutDashboard },
    { id: "billingPage", label: "🧾 New Bill / Receipt", icon: PlusCircle },
    { id: "historyPage", label: "📚 Receipt History", icon: History },
    { id: "dailyPage", label: "📊 Daily Report", icon: CalendarDays },
    { id: "monthlyPage", label: "🗓 Monthly Report", icon: CalendarRange },
    { id: "settingsPage", label: "⚙ Settings", icon: Settings2 },
    { id: "printPage", label: "🖨 Print Preview", icon: Printer, disabled: !currentPreviewReceipt },
  ];

  const todayStr = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });

  return (
    <div id="main-layout" className="min-h-screen bg-[#0A0A0B] flex flex-col lg:flex-row relative">
      
      {/* SIDEBAR NAVIGATION (Hidden on mobile unless opened, hidden entirely during print) */}
      <aside 
        id="app-sidebar"
        className={`w-72 bg-[#0E0E11] text-white flex flex-col border-r border-white/5 z-40 fixed lg:sticky top-0 h-screen transition-transform duration-300 no-print ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand Card header */}
        <div className="p-6 border-b border-white/5 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-blue-400" />
              <h2 className="text-sm font-black tracking-widest text-white uppercase font-display">
                {settings.softwareName}
              </h2>
            </div>
            {/* Close button for mobile menu drawer */}
            <button 
              onClick={() => setMobileMenuOpen(false)} 
              className="lg:hidden p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg cursor-pointer border border-white/5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-4 p-3 bg-white/5 border border-white/5 rounded-xl text-[10px] text-slate-400 font-mono space-y-1">
            <div>Owner: <span className="font-semibold text-slate-200">{settings.ownerName}</span></div>
            <div className="truncate" title={settings.mobile}>Mobiles: <span className="font-semibold text-slate-200">{settings.mobile}</span></div>
          </div>
        </div>

        {/* Sidebar Navigation buttons */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                disabled={item.disabled}
                onClick={() => navigateToTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs transition text-left cursor-pointer tracking-wider uppercase font-mono ${
                  isActive 
                    ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/15" 
                    : item.disabled 
                      ? "text-slate-700 cursor-not-allowed opacity-30" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer operator controls */}
        <div className="p-4 border-t border-white/5 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-rose-500/10 hover:text-rose-400 text-slate-400 border border-white/5 hover:border-rose-500/20 rounded-xl font-bold text-xs transition cursor-pointer font-mono uppercase tracking-wider"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Operator</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER BAR (visible only on mobile, hidden on print) */}
      <header className="lg:hidden bg-[#0E0E11] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-30 border-b border-white/5 no-print">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setMobileMenuOpen(true)} 
            className="p-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg cursor-pointer border border-white/5"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-xs font-black uppercase tracking-wider font-display">{settings.shopName}</span>
        </div>
        <span className="text-[10px] bg-blue-500/10 border border-blue-500/20 px-2.5 py-1 rounded-full font-bold text-blue-400 font-mono">
          V4.2 Enterprise
        </span>
      </header>

      {/* MAIN VIEW CONTENT CONTAINER */}
      <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 max-w-full overflow-hidden print:p-0">
        
        {/* TOP STATUS BAR OVERVIEW (Hidden on print) */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111114] border border-white/5 p-4 rounded-2xl shadow-2xl no-print relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <div>
            <h2 className="text-base font-black text-white tracking-widest uppercase font-display">{settings.shopName}</h2>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1.5 mt-1">
              <span>CSC Terminal Active</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {/* Active editing/selected reference indicators */}
            {editingReceipt && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-[9px] font-bold text-blue-400 font-mono tracking-wider uppercase">
                <span>Modifying: {editingReceipt.receiptNo}</span>
              </span>
            )}
            
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 font-mono tracking-wider uppercase">
              <UserCheck className="w-3.5 h-3.5 text-slate-500" />
              <span>Operator: {settings.ownerName}</span>
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[9px] font-bold text-slate-400 font-mono tracking-wider uppercase">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Today: {todayStr}</span>
            </span>
          </div>
        </div>

        {/* CENTRAL VIEW INJECTION PORT */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === "dashboardPage" && (
                <Dashboard 
                  receipts={receipts} 
                  settings={settings} 
                  onNavigate={navigateToTab} 
                />
              )}

              {activeTab === "billingPage" && (
                <BillingForm 
                  settings={settings}
                  receipts={receipts}
                  editingReceipt={editingReceipt}
                  onSave={handleSaveBill}
                  onGeneratePreview={handleGeneratePreview}
                  onCancelEdit={handleCancelEditing}
                />
              )}

              {activeTab === "historyPage" && (
                <ReceiptHistory 
                  receipts={receipts}
                  onEdit={handleEditBillTrigger}
                  onOpen={handleOpenReceiptTrigger}
                  onDelete={handleDeleteReceiptTrigger}
                />
              )}

              {activeTab === "dailyPage" && (
                <Reports receipts={receipts} type="daily" />
              )}

              {activeTab === "monthlyPage" && (
                <Reports receipts={receipts} type="monthly" />
              )}

              {activeTab === "settingsPage" && (
                <Settings 
                  settings={settings} 
                  onSave={saveSettingsToStorage} 
                />
              )}

              {activeTab === "printPage" && currentPreviewReceipt && (
                <PrintPreview 
                  receipt={currentPreviewReceipt} 
                  settings={settings} 
                  onBackToBilling={() => navigateToTab("billingPage")} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
