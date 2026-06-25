/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  Printer, 
  Calendar, 
  DollarSign, 
  CheckCircle, 
  AlertCircle,
  FileText
} from "lucide-react";
import { Receipt } from "../types";
import { formatDate, formatMonth } from "../utils/defaults";

interface ReportsProps {
  receipts: Receipt[];
  type: "daily" | "monthly";
}

export default function Reports({ receipts, type }: ReportsProps) {
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [selectedMonth, setSelectedMonth] = useState(() => new Date().toISOString().slice(0, 7));

  const [filteredList, setFilteredList] = useState<Receipt[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [totalDue, setTotalDue] = useState(0);

  useEffect(() => {
    let list: Receipt[] = [];
    if (type === "daily") {
      list = receipts.filter(r => r.date === selectedDate);
    } else {
      list = receipts.filter(r => r.date.startsWith(selectedMonth));
    }
    
    let paid = 0;
    let due = 0;
    list.forEach(r => {
      paid += Number(r.paidAmount || 0);
      due += Number(r.dueAmount || 0);
    });

    setFilteredList(list);
    setTotalCount(list.length);
    setTotalPaid(paid);
    setTotalDue(due);
  }, [receipts, type, selectedDate, selectedMonth]);

  const handlePrint = () => {
    window.print();
  };

  const titleText = type === "daily" 
    ? `Daily Report / দৈনিক রিপোর্ট (${formatDate(selectedDate)})`
    : `Monthly Report / মাসিক রিপোর্ট (${formatMonth(selectedMonth)})`;

  return (
    <div className="space-y-6 text-slate-300 font-sans">
      {/* Selection Control Panel */}
      <div className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden no-print">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-blue-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
              {type === "daily" ? "Daily Financial Reports" : "Monthly Financial Reports"}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {type === "daily" ? (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="report-date-picker"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition [color-scheme:dark]"
                />
              </div>
            ) : (
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  id="report-month-picker"
                  type="month"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition [color-scheme:dark]"
                />
              </div>
            )}

            <button
              id="print-report-btn"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {/* Count Card */}
        <div className="bg-[#111114] rounded-2xl border border-white/5 p-5 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">
              Receipt Count
            </span>
            <span className="text-2xl font-black text-white font-display">{totalCount}</span>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-xl">
            <FileText className="w-4 h-4" />
          </div>
        </div>

        {/* Paid Card */}
        <div className="bg-[#111114] rounded-2xl border border-white/5 p-5 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">
              Collected Earnings / সংগৃহীত
            </span>
            <span className="text-2xl font-black text-white font-mono">₹{totalPaid.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl">
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        {/* Due Card */}
        <div className="bg-[#111114] rounded-2xl border border-white/5 p-5 shadow-2xl flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono block mb-1">
              Outstanding Dues / বকেয়া
            </span>
            <span className="text-2xl font-black text-amber-400 font-mono">₹{totalDue.toFixed(2)}</span>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl">
            <AlertCircle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Report Table Card */}
      <div className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display mb-5 pb-3 border-b border-white/5 flex items-center justify-between">
          <span>{titleText}</span>
          <span className="text-[10px] text-slate-500 no-print font-mono uppercase tracking-widest">A4 Page Grid</span>
        </h3>

        <div className="border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] border-collapse text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="py-4 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-36">Receipt No</th>
                  {type === "monthly" && (
                    <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-28">Date</th>
                  )}
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Customer</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Service Items</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-24">Total</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-24">Paid</th>
                  <th className="py-4 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-24">Due</th>
                  <th className="py-4 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-24 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredList.length > 0 ? (
                  filteredList.map((item) => (
                    <tr key={item.receiptNo} className="hover:bg-white/[0.02] transition">
                      <td className="py-3.5 px-5 font-mono text-xs font-bold text-blue-400">{item.receiptNo}</td>
                      {type === "monthly" && (
                        <td className="py-3.5 px-4 text-xs text-slate-400 whitespace-nowrap">{formatDate(item.date)}</td>
                      )}
                      <td className="py-3.5 px-4 font-semibold text-slate-200">{item.customerName}</td>
                      <td className="py-3.5 px-4 text-xs text-slate-400 max-w-xs truncate">
                        {item.services.map(s => s.details || s.main).join(", ")}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-medium text-slate-300">₹{item.amount.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-emerald-400 font-semibold">₹{item.paidAmount.toFixed(2)}</td>
                      <td className="py-3.5 px-4 font-mono text-amber-400">₹{item.dueAmount.toFixed(2)}</td>
                      <td className="py-3.5 px-5 text-right">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                          item.status === "PAID" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={type === "monthly" ? 8 : 7} className="py-10 text-center text-slate-500 text-xs font-medium">
                      No records matched for the selected duration.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
