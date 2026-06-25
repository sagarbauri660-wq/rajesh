/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { 
  DollarSign, 
  Receipt, 
  AlertCircle, 
  CheckCircle2, 
  Store, 
  User, 
  Phone, 
  QrCode, 
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import { AppSettings, Receipt as ReceiptType } from "../types";

interface DashboardProps {
  receipts: ReceiptType[];
  settings: AppSettings;
  onNavigate: (page: string) => void;
}

export default function Dashboard({ receipts, settings, onNavigate }: DashboardProps) {
  const todayStr = new Date().toISOString().slice(0, 10);

  // Stats calculation
  const totalReceipts = receipts.length;
  
  const todayReceipts = receipts.filter(r => r.date === todayStr);
  const todayIncome = todayReceipts.reduce((sum, r) => sum + r.paidAmount, 0);
  const todayDue = todayReceipts.reduce((sum, r) => sum + r.dueAmount, 0);
  const todayPaidCount = todayReceipts.filter(r => r.status === "PAID").length;

  const statCards = [
    {
      title: "Total Receipts Saved",
      value: totalReceipts,
      subtitle: "Lifetime transaction history",
      icon: Receipt,
      color: "bg-blue-600/10 text-blue-400 border-blue-500/20",
    },
    {
      title: "Today's Income",
      value: `₹${todayIncome.toFixed(2)}`,
      subtitle: `${todayReceipts.length} transactions today`,
      icon: DollarSign,
      color: "bg-emerald-600/10 text-emerald-400 border-emerald-500/20",
    },
    {
      title: "Today's Outstanding Due",
      value: `₹${todayDue.toFixed(2)}`,
      subtitle: `${todayReceipts.filter(r => r.status === "DUE").length} pending balances`,
      icon: AlertCircle,
      color: "bg-amber-600/10 text-amber-400 border-amber-500/20",
    },
    {
      title: "Fully Paid Today",
      value: todayPaidCount,
      subtitle: "Successful settlements",
      icon: CheckCircle2,
      color: "bg-purple-600/10 text-purple-400 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-6 text-slate-300">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08, duration: 0.4 }}
              className="relative overflow-hidden rounded-2xl bg-[#111114] border border-white/5 p-5 shadow-2xl hover:border-white/10 transition duration-300 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
                  {card.title}
                </span>
                <div className={`p-2.5 rounded-xl border ${card.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-2xl font-black text-white tracking-tight font-display">
                  {card.value}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  {card.subtitle}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Shop Info Card */}
        <div className="lg:col-span-7 space-y-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl"
          >
            <div className="flex items-center gap-2 pb-4 mb-5 border-b border-white/5">
              <Store className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-bold text-white tracking-wider uppercase font-display">
                CSC Station Overview / দোকান পরিচিতি
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                  Shop / CSC Name
                </span>
                <div className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">{settings.shopName}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                  Owner / পরিচালক
                </span>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">{settings.ownerName}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                  Contact Mobile
                </span>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200">{settings.mobile}</span>
                </div>
              </div>

              <div className="p-3.5 bg-white/5 border border-white/10 rounded-xl">
                <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
                  Active UPI ID
                </span>
                <div className="flex items-center gap-2">
                  <QrCode className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-200 truncate font-mono" title={settings.upi}>
                    {settings.upi}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                id="create-bill-btn"
                onClick={() => onNavigate("billingPage")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-600/10 cursor-pointer font-sans"
              >
                <span>Create New Bill</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                id="view-history-btn"
                onClick={() => onNavigate("historyPage")}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 font-bold rounded-xl text-sm transition cursor-pointer"
              >
                <span>View Receipt History</span>
              </button>
            </div>
          </motion.div>

          <div className="bg-gradient-to-br from-indigo-600/20 to-blue-600/20 p-5 rounded-2xl border border-blue-500/20 flex items-start gap-4">
            <div className="p-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Expert Multi-Service Operations</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Add multiple custom items to a single bill. Automatic generation of professional thermal/A4 invoices featuring dynamic Scan-to-Pay QR codes, transaction mapping, and ready-to-share WhatsApp layout blocks!
              </p>
            </div>
          </div>
        </div>

        {/* Printed Service List Preview */}
        <div className="lg:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.25 }}
            className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl h-full flex flex-col"
          >
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
              <h3 className="text-sm font-bold text-white tracking-wider uppercase font-display">
                Service Catalog / উপলব্ধ পরিষেবা
              </h3>
              <span className="text-[9px] bg-white/5 border border-white/10 text-slate-400 font-bold px-2 py-0.5 rounded-full font-mono">
                Printed on receipts
              </span>
            </div>

            <div className="flex-1 overflow-y-auto max-h-[290px] pr-1 space-y-2 text-xs leading-relaxed text-slate-400">
              {settings.serviceList.split("\n").map((line, index) => {
                const parts = line.split(":");
                if (parts.length > 1) {
                  return (
                    <div key={index} className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/15 transition">
                      <strong className="text-slate-200 text-xs font-semibold block mb-0.5">{parts[0]}</strong>
                      <span className="text-slate-400 text-[11px]">{parts[1]}</span>
                    </div>
                  );
                }
                return (
                  <div key={index} className="p-2 bg-white/5 border border-dashed border-white/5 rounded-lg text-slate-500 italic">
                    {line}
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
