/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion } from "motion/react";
import { 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  Eye, 
  Calendar,
  AlertTriangle,
  FileCheck
} from "lucide-react";
import { Receipt } from "../types";
import { formatDate } from "../utils/defaults";

interface ReceiptHistoryProps {
  receipts: Receipt[];
  onEdit: (receipt: Receipt) => void;
  onOpen: (receipt: Receipt) => void;
  onDelete: (receiptNo: string) => void;
}

export default function ReceiptHistory({
  receipts,
  onEdit,
  onOpen,
  onDelete
}: ReceiptHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState("");

  const filteredReceipts = receipts.filter((receipt) => {
    const servicesText = (receipt.services || [])
      .map((s) => `${s.main} ${s.details}`)
      .join(" ");
    const matchesSearch =
      [
        receipt.receiptNo,
        receipt.customerName,
        receipt.mobile,
        servicesText
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter || receipt.status === statusFilter;
    const matchesDate = !dateFilter || receipt.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleDelete = (receiptNo: string) => {
    if (confirm(`Are you sure you want to delete receipt ${receiptNo}? / আপনি কি নিশ্চিত যে আপনি এটি মুছে ফেলতে চান?`)) {
      onDelete(receiptNo);
    }
  };

  return (
    <div className="space-y-6 text-slate-300 font-sans">
      <div className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display mb-6 flex items-center gap-2">
          <FileCheck className="w-4 h-4 text-blue-400" />
          <span>Receipt History / রসিদ ইতিহাস</span>
        </h3>

        {/* Filters Panel */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          {/* Search bar */}
          <div className="md:col-span-6 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-500 pointer-events-none" />
            <input
              id="search-input"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by receipt no, customer name, mobile, or service..."
              className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
            />
          </div>

          {/* Filter Status */}
          <div className="md:col-span-3 relative">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              id="filter-status-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
            >
              <option value="" className="bg-[#111114] text-slate-400">All Status / সব পেমেন্ট</option>
              <option value="PAID" className="bg-[#111114] text-white">PAID / সম্পূর্ণ পরিশোধিত</option>
              <option value="DUE" className="bg-[#111114] text-white">DUE / বকেয়া আছে</option>
            </select>
          </div>

          {/* Filter Date */}
          <div className="md:col-span-3 relative">
            <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <input
              id="filter-date-input"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition [color-scheme:dark]"
            />
          </div>
        </div>

        {/* Table representation */}
        <div className="mt-6 border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5">
                  <th className="py-4.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-36">Receipt No</th>
                  <th className="py-4.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-28">Date</th>
                  <th className="py-4.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Customer</th>
                  <th className="py-4.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Services Done</th>
                  <th className="py-4.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-28">Total Amt</th>
                  <th className="py-4.5 px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-28">Status</th>
                  <th className="py-4.5 px-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono w-48 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredReceipts.length > 0 ? (
                  filteredReceipts.map((receipt) => (
                    <tr key={receipt.receiptNo} className="hover:bg-white/[0.02] transition duration-150">
                      <td className="py-4 px-5 font-mono text-xs font-bold text-blue-400">
                        {receipt.receiptNo}
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-xs whitespace-nowrap">
                        {formatDate(receipt.date)}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-200">{receipt.customerName}</div>
                        {receipt.mobile && (
                          <div className="text-xs text-slate-500 font-medium font-mono mt-0.5">{receipt.mobile}</div>
                        )}
                      </td>
                      <td className="py-4 px-4 text-xs text-slate-400 max-w-xs truncate" title={receipt.services.map(s => s.details || s.main).join(", ")}>
                        {receipt.services.map(s => s.details || s.main).join(", ")}
                      </td>
                      <td className="py-4 px-4 font-mono font-black text-slate-200">
                        ₹{receipt.amount.toFixed(2)}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                          receipt.status === "PAID" 
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                        }`}>
                          {receipt.status}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => onOpen(receipt)}
                          className="p-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg transition inline-flex items-center border border-white/5"
                          title="Open Receipt / প্রিন্ট করুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(receipt)}
                          className="p-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition inline-flex items-center border border-blue-500/20"
                          title="Edit Bill"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(receipt.receiptNo)}
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition inline-flex items-center border border-rose-500/20"
                          title="Delete Bill"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-500">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <AlertTriangle className="w-8 h-8 text-slate-600" />
                        <p className="font-semibold text-sm">No transaction receipts found.</p>
                        <p className="text-xs text-slate-500/80">Try modifying your filter dates or keyword filters.</p>
                      </div>
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
