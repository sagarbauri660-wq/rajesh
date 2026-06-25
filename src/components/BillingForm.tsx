/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Trash2, 
  Save, 
  Printer, 
  Share2, 
  RotateCcw,
  User, 
  Phone, 
  MapPin, 
  Calendar,
  FileSpreadsheet,
  Tag
} from "lucide-react";
import { Receipt, ServiceItem, AppSettings } from "../types";
import { 
  SERVICE_MAIN_OPTIONS, 
  SERVICE_DETAILS_MAPPING, 
  SERVICE_PRICE_MAPPING,
  generateReceiptNumber, 
  formatDate 
} from "../utils/defaults";

interface BillingFormProps {
  settings: AppSettings;
  receipts: Receipt[];
  editingReceipt: Receipt | null;
  onSave: (receipt: Receipt) => void;
  onGeneratePreview: (receipt: Receipt) => void;
  onCancelEdit: () => void;
}

export default function BillingForm({
  settings,
  receipts,
  editingReceipt,
  onSave,
  onGeneratePreview,
  onCancelEdit
}: BillingFormProps) {
  const [receiptType, setReceiptType] = useState("General Bill");
  const [receiptNo, setReceiptNo] = useState("");
  const [billDate, setBillDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [custName, setCustName] = useState("");
  const [custMobile, setCustMobile] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [txnId, setTxnId] = useState("");
  const [operator, setOperator] = useState(settings.ownerName);
  const [notes, setNotes] = useState("");
  
  const [services, setServices] = useState<ServiceItem[]>([
    { main: "", details: "", amount: 0 }
  ]);

  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dueAmount, setDueAmount] = useState<number>(0);

  // Initialize or handle Edit Mode
  useEffect(() => {
    if (editingReceipt) {
      setReceiptType(editingReceipt.receiptType);
      setReceiptNo(editingReceipt.receiptNo);
      setBillDate(editingReceipt.date);
      setCustName(editingReceipt.customerName);
      setCustMobile(editingReceipt.mobile);
      setCustAddress(editingReceipt.address);
      setCustomerId(editingReceipt.customerId || "");
      setPaymentMethod(editingReceipt.paymentMethod);
      setTxnId(editingReceipt.txnId || "");
      setOperator(editingReceipt.operator);
      setNotes(editingReceipt.notes || "");
      setServices(editingReceipt.services.length > 0 ? editingReceipt.services : [{ main: "", details: "", amount: 0 }]);
      setPaidAmount(editingReceipt.paidAmount);
      setTotalAmount(editingReceipt.amount);
      setDueAmount(editingReceipt.dueAmount);
    } else {
      // New Bill Mode - Reset Form
      resetForm();
    }
  }, [editingReceipt, receipts.length]);

  // Recalculate totals whenever services or paidAmount changes
  useEffect(() => {
    const total = services.reduce((sum, item) => sum + Number(item.amount || 0), 0);
    setTotalAmount(total);
    const due = Math.max(0, total - paidAmount);
    setDueAmount(due);
  }, [services, paidAmount]);

  // Handle receipt number autogeneration for new bills
  useEffect(() => {
    if (!editingReceipt) {
      // Find today's bills count
      const todayCount = receipts.filter(r => r.date === billDate).length;
      const generated = generateReceiptNumber(billDate, todayCount);
      setReceiptNo(generated);
    }
  }, [billDate, receipts, editingReceipt]);

  const resetForm = () => {
    setReceiptType("General Bill");
    setBillDate(new Date().toISOString().slice(0, 10));
    setCustName("");
    setCustMobile("");
    setCustAddress("");
    setCustomerId("");
    setPaymentMethod("Cash");
    setTxnId("");
    setOperator(settings.ownerName);
    setNotes("");
    setServices([{ main: "", details: "", amount: 0 }]);
    setPaidAmount(0);
    setTotalAmount(0);
    setDueAmount(0);

    const todayCount = receipts.filter(r => r.date === new Date().toISOString().slice(0, 10)).length;
    setReceiptNo(generateReceiptNumber(new Date().toISOString().slice(0, 10), todayCount));
  };

  const addServiceRow = () => {
    setServices([...services, { main: "", details: "", amount: 0 }]);
  };

  const removeServiceRow = (index: number) => {
    if (services.length <= 1) {
      alert("At least one service row is required.");
      return;
    }
    const updated = services.filter((_, i) => i !== index);
    setServices(updated);
  };

  const handleServiceChange = (index: number, field: keyof ServiceItem, value: any) => {
    const updated = [...services];
    if (field === "main") {
      updated[index].main = value;
      // Auto-populate description mapping
      if (SERVICE_DETAILS_MAPPING[value]) {
        updated[index].details = SERVICE_DETAILS_MAPPING[value];
      }
      // Auto-populate price mapping
      if (SERVICE_PRICE_MAPPING[value] !== undefined) {
        updated[index].amount = SERVICE_PRICE_MAPPING[value];
      }
    } else if (field === "details") {
      updated[index].details = value;
    } else if (field === "amount") {
      updated[index].amount = Number(value || 0);
    }
    setServices(updated);
  };

  const handleQuickAdd = (serviceName: string) => {
    const defaultDetails = SERVICE_DETAILS_MAPPING[serviceName] || "";
    const defaultPrice = SERVICE_PRICE_MAPPING[serviceName] || 0;
    
    // If there's only one row and it is completely empty, replace it
    if (services.length === 1 && !services[0].main && !services[0].details && services[0].amount === 0) {
      setServices([{ main: serviceName, details: defaultDetails, amount: defaultPrice }]);
    } else {
      setServices([...services, { main: serviceName, details: defaultDetails, amount: defaultPrice }]);
    }
  };

  const handlePaidAmountChange = (val: string) => {
    const numeric = Number(val || 0);
    setPaidAmount(numeric);
  };

  const buildReceiptData = (): Receipt => {
    const validServices = services.filter(s => s.main || s.details || s.amount > 0);
    const finalServices = validServices.length > 0 ? validServices : services;

    return {
      receiptNo,
      receiptType,
      date: billDate,
      customerName: custName.trim(),
      mobile: custMobile.trim(),
      address: custAddress.trim(),
      customerId: customerId.trim() || undefined,
      services: finalServices,
      amount: totalAmount,
      paidAmount: paidAmount,
      dueAmount: dueAmount,
      status: dueAmount > 0 ? "DUE" : "PAID",
      paymentMethod,
      txnId: txnId.trim() || undefined,
      operator: operator.trim() || settings.ownerName,
      notes: notes.trim() || undefined,
      createdAt: editingReceipt ? editingReceipt.createdAt : new Date().toISOString()
    };
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName.trim()) {
      alert("Please enter customer name.");
      return;
    }
    const receipt = buildReceiptData();
    onSave(receipt);
  };

  const handlePreview = () => {
    if (!custName.trim()) {
      alert("Please enter customer name first.");
      return;
    }
    const receipt = buildReceiptData();
    onGeneratePreview(receipt);
  };

  const shareWhatsAppDirect = () => {
    if (!custName.trim()) {
      alert("Please fill in customer details first.");
      return;
    }
    const receipt = buildReceiptData();
    const serviceLines = receipt.services
      .map((s, idx) => `${idx + 1}. ${s.details || s.main} - ₹${s.amount.toFixed(2)}`)
      .join("\n");

    const text = `*${settings.shopName}*\n` +
      `Receipt No: ${receipt.receiptNo}\n` +
      `Date: ${formatDate(receipt.date)}\n` +
      `Customer: ${receipt.customerName}\n\n` +
      `*Services:*\n${serviceLines}\n\n` +
      `Total: ₹${receipt.amount.toFixed(2)}\n` +
      `Paid: ₹${receipt.paidAmount.toFixed(2)}\n` +
      `Due: ₹${receipt.dueAmount.toFixed(2)}\n` +
      `Status: *${receipt.status}*\n` +
      `UPI ID: ${settings.upi}\n\n` +
      `${settings.footerMsg}`;

    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-slate-300 font-sans">
      <div className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
            <span>
              {editingReceipt ? "Edit Saved Bill / বিল সংশোধন" : "Create New Bill / নতুন বিল"}
            </span>
          </h3>
          {editingReceipt && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-lg transition"
            >
              Cancel Edit Mode
            </button>
          )}
        </div>

        {/* Basic Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Receipt Type */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Receipt Type / বিলের ধরণ
            </label>
            <select
              id="bill-type-select"
              value={receiptType}
              onChange={(e) => setReceiptType(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
            >
              <option value="General Bill" className="bg-[#111114] text-white">General Bill / সাধারণ বিল</option>
              <option value="Aadhaar Receipt" className="bg-[#111114] text-white">Aadhaar Receipt</option>
              <option value="PAN Receipt" className="bg-[#111114] text-white">PAN Receipt</option>
              <option value="Voter Receipt" className="bg-[#111114] text-white">Voter Receipt</option>
              <option value="Certificate Receipt" className="bg-[#111114] text-white">Certificate Receipt</option>
            </select>
          </div>

          {/* Receipt Number */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Receipt Number / রশিদ নম্বর
            </label>
            <input
              id="bill-no-input"
              type="text"
              value={receiptNo}
              readOnly
              className="w-full py-2.5 px-3 bg-white/5 border border-white/5 rounded-xl text-slate-500 font-mono text-sm focus:outline-none cursor-not-allowed"
            />
          </div>

          {/* Bill Date */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Date / তারিখ
            </label>
            <div className="relative">
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="bill-date-input"
                type="date"
                value={billDate}
                onChange={(e) => setBillDate(e.target.value)}
                className="w-full py-2.5 px-3 pr-10 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition [color-scheme:dark]"
                required
              />
            </div>
          </div>

          {/* Customer Name */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Customer Name / গ্রাহকের নাম
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="cust-name-input"
                type="text"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="Enter customer name"
                className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                required
              />
            </div>
          </div>

          {/* Customer Mobile */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Mobile No / মোবাইল নম্বর
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="cust-mobile-input"
                type="text"
                value={custMobile}
                onChange={(e) => setCustMobile(e.target.value)}
                placeholder="Mobile number"
                className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
              />
            </div>
          </div>

          {/* Customer Address */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Address / ঠিকানা
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="cust-address-input"
                type="text"
                value={custAddress}
                onChange={(e) => setCustAddress(e.target.value)}
                placeholder="Customer address"
                className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
              />
            </div>
          </div>

          {/* Payment Method */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Payment Method / পেমেন্ট মাধ্যম
            </label>
            <select
              id="payment-method-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
            >
              <option className="bg-[#111114] text-white">Cash</option>
              <option className="bg-[#111114] text-white">UPI</option>
              <option className="bg-[#111114] text-white">Bank Transfer</option>
              <option className="bg-[#111114] text-white">Mixed</option>
            </select>
          </div>

          {/* Transaction ID */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Txn / Reference ID (Optional)
            </label>
            <input
              id="txn-id-input"
              type="text"
              value={txnId}
              onChange={(e) => setTxnId(e.target.value)}
              placeholder="e.g. UPI Ref / Txn No"
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
            />
          </div>

          {/* Customer ID */}
          <div className="md:col-span-4">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Customer ID / Token (Optional)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              <input
                id="cust-token-input"
                type="text"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                placeholder="e.g. Token or Application ID"
                className="w-full pl-9 pr-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
              />
            </div>
          </div>

          {/* Operator */}
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Operator / Staff Name
            </label>
            <input
              id="operator-input"
              type="text"
              value={operator}
              onChange={(e) => setOperator(e.target.value)}
              placeholder="Operator name"
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-12">
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Notes / Remarks / প্রয়োজনীয় তথ্য
            </label>
            <textarea
              id="notes-textarea"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Specify extra instructions or follow-up documents here..."
              className="w-full py-2.5 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Services Items Section */}
      <div className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display">
            Work Items & Charges / কাজের বিবরণী ও ফি
          </h3>
          <button
            type="button"
            id="add-row-btn"
            onClick={addServiceRow}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/15 font-bold rounded-xl text-xs transition cursor-pointer font-mono"
          >
            <Plus className="w-4 h-4" />
            <span>Add Row</span>
          </button>
        </div>

        {/* Quick Add Common Services */}
        <div className="mb-5 pb-4 border-b border-white/5">
          <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono mb-2">
            ⚡ Quick Add Common Services / দ্রুত যোগ করার তালিকা
          </span>
          <div className="flex flex-wrap gap-2">
            {Object.keys(SERVICE_PRICE_MAPPING).filter(k => k !== "Other").map((serviceName) => (
              <button
                key={serviceName}
                type="button"
                onClick={() => handleQuickAdd(serviceName)}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 rounded-xl text-[10px] font-semibold transition cursor-pointer"
              >
                <Plus className="w-3 h-3 text-blue-400" />
                <span>{serviceName.split("/")[0].trim()}</span>
                <span className="text-[9px] text-blue-400 font-mono font-bold">₹{SERVICE_PRICE_MAPPING[serviceName]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {services.map((item, index) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              key={index}
              className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex flex-col md:flex-row gap-4 items-end"
            >
              {/* Service Type Selection */}
              <div className="flex-1 w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                  Main Service / পরিষেবা
                </label>
                <select
                  value={item.main}
                  onChange={(e) => handleServiceChange(index, "main", e.target.value)}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-[#141417] transition"
                >
                  <option value="" className="bg-[#111114] text-slate-400">Select Service / পরিষেবা চয়ন করুন</option>
                  {SERVICE_MAIN_OPTIONS.map(opt => (
                    <option key={opt} value={opt} className="bg-[#111114] text-white">{opt}</option>
                  ))}
                </select>
              </div>

              {/* Service Details */}
              <div className="flex-[2] w-full">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                  Work Details / কাজের বিবরণ
                </label>
                <input
                  type="text"
                  value={item.details}
                  onChange={(e) => handleServiceChange(index, "details", e.target.value)}
                  placeholder="Enter details about this specific transaction"
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:border-blue-500 focus:bg-[#141417] transition"
                />
              </div>

              {/* Amount */}
              <div className="w-full md:w-36">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2 font-mono">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.amount || ""}
                  onChange={(e) => handleServiceChange(index, "amount", e.target.value)}
                  placeholder="0.00"
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-mono focus:outline-none focus:border-blue-500 focus:bg-[#141417] transition"
                />
              </div>

              {/* Remove Button */}
              {services.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeServiceRow(index)}
                  className="py-2 px-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/20 transition duration-150 cursor-pointer"
                  title="Delete row"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </motion.div>
          ))}
        </div>

        {/* Calculation Section */}
        <div className="mt-6 pt-5 border-t border-white/5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
              Total Fee / মোট ফি
            </span>
            <span className="text-xl font-black text-white font-mono">₹{totalAmount.toFixed(2)}</span>
          </div>

          <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
            <label className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5 font-mono">
              Paid Amount / সংগৃহীত টাকা (₹)
            </label>
            <input
              id="paid-amount-input"
              type="number"
              min="0"
              step="0.01"
              value={paidAmount || ""}
              onChange={(e) => handlePaidAmountChange(e.target.value)}
              placeholder="0.00"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-2.5 py-1 text-sm font-mono text-white focus:outline-none focus:border-blue-500 focus:bg-[#141417]"
            />
          </div>

          <div className={`p-4 rounded-xl border ${dueAmount > 0 ? 'bg-amber-500/5 border-amber-500/10' : 'bg-white/5 border-white/10'}`}>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 font-mono">
              Outstanding Due / বকেয়া
            </span>
            <span className={`text-xl font-black font-mono ${dueAmount > 0 ? "text-amber-400" : "text-slate-300"}`}>
              ₹{dueAmount.toFixed(2)}
            </span>
            <span className="block text-[10px] text-slate-500 mt-1 font-semibold italic">
              Status: {dueAmount > 0 ? "⚠️ DUE" : "✅ PAID"}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3.5 pt-2">
        <button
          type="submit"
          id="save-bill-submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-600/15 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Bill & Print</span>
        </button>

        <button
          type="button"
          id="preview-bill-btn"
          onClick={handlePreview}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl text-sm transition border border-white/10 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Generate A4 Preview</span>
        </button>

        <button
          type="button"
          id="share-whatsapp-btn"
          onClick={shareWhatsAppDirect}
          className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 font-bold rounded-xl text-sm transition cursor-pointer animate-pulse"
        >
          <Share2 className="w-4 h-4" />
          <span>WhatsApp Share</span>
        </button>

        <button
          type="button"
          id="reset-form-btn"
          onClick={resetForm}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-400 font-bold rounded-xl text-sm transition ml-auto cursor-pointer border border-white/5"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Clear Form</span>
        </button>
      </div>
    </form>
  );
}
