/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from "motion/react";
import { Printer, Share2, ArrowLeft, MessageSquareCode } from "lucide-react";
import { Receipt, AppSettings } from "../types";
import { formatDate } from "../utils/defaults";

interface PrintPreviewProps {
  receipt: Receipt;
  settings: AppSettings;
  onBackToBilling: () => void;
}

export default function PrintPreview({
  receipt,
  settings,
  onBackToBilling
}: PrintPreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  const shareWhatsApp = () => {
    const serviceLines = (receipt.services || [])
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
    <div className="space-y-6 text-slate-300 font-sans">
      {/* Action buttons bar (hidden on printer output) */}
      <div className="bg-[#111114] rounded-2xl border border-white/5 p-4 shadow-2xl no-print flex flex-wrap gap-3 items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
        <button
          onClick={onBackToBilling}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-bold rounded-xl text-xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Billing</span>
        </button>

        <div className="flex gap-3">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-blue-500/15 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print Invoice (A4)</span>
          </button>

          <button
            onClick={shareWhatsApp}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs transition shadow-lg shadow-emerald-500/15 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>WhatsApp Share</span>
          </button>
        </div>
      </div>

      {/* Main Invoice Sheet (Perfect A4 proportions on print layout) */}
      <div id="print-sheet" className="relative mx-auto bg-white border border-slate-200 shadow-xl p-4 sm:p-6 rounded-3xl w-full max-w-[850px] font-sans text-slate-800 antialiased overflow-hidden print:shadow-none print:border-none print:p-0 print:m-0 print:w-full">
        
        {/* Outline border wrapper */}
        <div className="relative border-[4px] border-double border-slate-900 rounded-2xl p-6 sm:p-8 print:border-[4px] print:border-slate-950 print:p-6 print:rounded-2xl overflow-hidden min-h-[960px] flex flex-col justify-between">
          
          {/* Elegant Diagonal Shop Name Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none overflow-hidden z-0">
            <div className="text-slate-950/[0.035] print:text-slate-950/[0.05] text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-widest uppercase font-display rotate-[-25deg] text-center max-w-[90%] leading-relaxed select-none">
              {settings.shopName}
            </div>
          </div>

          {/* Dynamic High-Visibility Rubber Stamp */}
          <div className={`absolute top-44 right-12 select-none pointer-events-none border-4 border-double rounded-2xl py-2 px-6 font-black text-3xl tracking-widest uppercase rotate-[-14deg] z-15 shadow-sm transition ${
            receipt.status === "PAID" 
              ? "text-emerald-600 border-emerald-600 bg-white/95 print:bg-white print:opacity-100 opacity-90" 
              : "text-rose-600 border-rose-600 bg-white/95 print:bg-white print:opacity-100 opacity-90"
          }`}>
            <div className="text-[10px] font-bold tracking-widest text-center opacity-65 leading-none mb-1">OFFICIAL</div>
            <div>{receipt.status}</div>
            <div className="text-[9px] font-bold tracking-normal text-center opacity-65 leading-none mt-1">VERIFIED CSC</div>
          </div>

          {/* Wrapper for the actual printable contents to sit above background watermark */}
          <div className="relative z-10 flex-1 flex flex-col justify-between">
            {/* Invoice Top header */}
            <div className="flex flex-col sm:flex-row items-start justify-between gap-6 pb-6 border-b-2 border-slate-900/10">
          <div className="flex items-start gap-4">
            {/* Logo box */}
            <div className="w-20 h-20 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden shrink-0 flex items-center justify-center p-2.5 text-[9px] text-slate-400 font-bold text-center leading-tight">
              {settings.logo ? (
                <img referrerPolicy="no-referrer" src={settings.logo} alt="Logo" className="w-full h-full object-contain" />
              ) : (
                <span>SHOP<br />LOGO</span>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-xl font-black text-slate-900 tracking-tight leading-none">
                {settings.shopName}
              </h1>
              <p className="text-xs font-bold text-indigo-600">
                CSC & E-Governance Services Portal
              </p>
              <div className="text-[11px] text-slate-500 leading-normal font-medium">
                <div>Owner: <span className="font-semibold text-slate-700">{settings.ownerName}</span></div>
                <div>Address: <span className="text-slate-700">{settings.address}</span></div>
                <div>Mobile: <span className="font-semibold text-slate-700">{settings.mobile}</span></div>
              </div>
            </div>
          </div>

          <div className="text-left sm:text-right space-y-1 sm:self-stretch flex flex-col justify-between">
            <div className="bg-slate-50 border border-slate-100/80 rounded-xl px-4 py-2 font-mono text-[11px] text-slate-600 space-y-0.5">
              <div>Receipt No: <span className="font-bold text-slate-800 text-xs">{receipt.receiptNo}</span></div>
              <div>Date: <span className="font-semibold text-slate-800">{formatDate(receipt.date)}</span></div>
              <div>Type: <span className="font-semibold text-slate-800">{receipt.receiptType}</span></div>
            </div>
          </div>
        </div>

        {/* Bill Title Banner */}
        <div className="my-6 py-2.5 px-4 bg-slate-900 text-white print:bg-transparent print:text-slate-900 print:border-2 print:border-slate-900 rounded-xl font-black text-center uppercase tracking-wider text-xs sm:text-sm leading-none">
          {receipt.receiptType} / রশিদ পত্র
        </div>

        {/* Meta details boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
          {/* Customer box */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 border-b border-dashed border-slate-200 pb-1.5 uppercase tracking-wide">
              Customer Details / গ্রাহকের বিবরণ
            </h4>
            <div className="text-xs leading-relaxed space-y-0.5">
              <div>Name: <span className="font-bold text-slate-800">{receipt.customerName}</span></div>
              {receipt.mobile && <div>Mobile: <span className="font-semibold text-slate-700">{receipt.mobile}</span></div>}
              {receipt.address && <div>Address: <span className="text-slate-600">{receipt.address}</span></div>}
              {receipt.customerId && <div>Customer ID / Token: <span className="font-mono text-slate-600 font-semibold">{receipt.customerId}</span></div>}
            </div>
          </div>

          {/* Payment metadata */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-1.5">
            <h4 className="text-xs font-bold text-slate-900 border-b border-dashed border-slate-200 pb-1.5 uppercase tracking-wide">
              Transaction Metadata / পেমেন্ট বিবরণ
            </h4>
            <div className="text-xs leading-relaxed space-y-0.5">
              <div>Payment Method: <span className="font-semibold text-slate-700">{receipt.paymentMethod}</span></div>
              {receipt.txnId && <div>Txn ID: <span className="font-mono text-slate-600 font-bold">{receipt.txnId}</span></div>}
              <div>Operator Name: <span className="font-medium text-slate-700">{receipt.operator}</span></div>
              <div>Generated At: <span className="text-slate-500 font-mono text-[11px]">{formatDate(receipt.createdAt)}</span></div>
            </div>
          </div>
        </div>

        {/* Items list Table */}
        <table className="w-full border-collapse border border-slate-300 rounded-xl overflow-hidden mb-6 text-xs">
          <thead>
            <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
              <th className="py-2.5 px-3 border-r border-slate-300 text-center w-12">SL</th>
              <th className="py-2.5 px-4 border-r border-slate-300 text-left w-48">Service Category</th>
              <th className="py-2.5 px-4 border-r border-slate-300 text-left">Service Details / কাজের বিবরণ</th>
              <th className="py-2.5 px-4 text-right w-28">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {receipt.services.map((item, idx) => (
              <tr key={idx} className="hover:bg-slate-50/30">
                <td className="py-2.5 px-3 border-r border-slate-300 text-center font-mono font-medium text-slate-500">{idx + 1}</td>
                <td className="py-2.5 px-4 border-r border-slate-300 font-bold text-slate-800">{item.main || "-"}</td>
                <td className="py-2.5 px-4 border-r border-slate-300 text-slate-600 font-medium whitespace-pre-wrap">{item.details || "-"}</td>
                <td className="py-2.5 px-4 text-right font-mono font-black text-slate-800">₹{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom calculations split */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-6">
          {/* Terms / Remarks */}
          <div className="flex-1 w-full space-y-4">
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                Notes & Additional Remarks
              </span>
              <p className="text-xs text-slate-600 leading-normal whitespace-pre-wrap font-medium">
                {receipt.notes || "No additional comments or requirements listed."}
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/50 text-slate-600 space-y-1 text-[11px] leading-normal font-medium">
              <div className="font-bold text-slate-700">📌 Payment Support Portal:</div>
              <div>UPI Account: <span className="font-mono text-slate-800 font-bold">{settings.upi}</span></div>
              <div>Kindly complete any pending due amount listed in the billing details.</div>
            </div>
          </div>

          {/* Calculations totals table */}
          <table className="w-full sm:w-80 text-xs border border-slate-300 rounded-xl overflow-hidden self-stretch flex flex-col">
            <tbody className="flex-1 flex flex-col justify-center divide-y divide-slate-200">
              <tr className="flex items-center justify-between p-2.5">
                <td className="font-bold text-slate-500">Gross Subtotal / মোট ফি</td>
                <td className="font-mono font-black text-slate-800">₹{receipt.amount.toFixed(2)}</td>
              </tr>
              <tr className="flex items-center justify-between p-2.5">
                <td className="font-bold text-slate-500">Paid Amount / সংগৃহীত</td>
                <td className="font-mono font-black text-slate-800">₹{receipt.paidAmount.toFixed(2)}</td>
              </tr>
              <tr className="flex items-center justify-between p-2.5">
                <td className="font-bold text-slate-500">Outstanding Due / বকেয়া</td>
                <td className="font-mono font-black text-slate-800">₹{receipt.dueAmount.toFixed(2)}</td>
              </tr>
              <tr className={`flex items-center justify-between p-2.5 font-bold rounded-b-[10px] text-white transition ${
                receipt.status === "PAID" 
                  ? "bg-emerald-600 print:bg-transparent print:text-emerald-700 print:border-t print:border-slate-300" 
                  : "bg-rose-600 print:bg-transparent print:text-rose-700 print:border-t print:border-slate-300"
              }`}>
                <td className="uppercase tracking-wider">Settlement Status</td>
                <td className="font-mono font-black text-xs">{receipt.status}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scan-to-pay bar & Print service catalog list */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 mb-8 border-t border-slate-200 pt-6">
          <div className="sm:col-span-8 space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
              Our Core Services / আমাদের উপলব্ধ সার্ভিস সমূহ
            </h4>
            <div className="text-[10px] sm:text-[11px] leading-relaxed text-slate-700 bg-slate-50/50 border border-slate-200/60 p-3 rounded-xl h-auto overflow-visible whitespace-pre-wrap font-medium">
              {settings.serviceList}
            </div>
          </div>

          <div className="sm:col-span-4 border border-slate-200 rounded-2xl p-4 text-center bg-slate-50/20 flex flex-col items-center justify-center space-y-2.5">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Scan & Pay Securely
            </span>
            <div className="w-32 h-32 bg-white border border-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-2 text-[9px] text-slate-300 font-bold shadow-inner">
              {settings.qr ? (
                <img referrerPolicy="no-referrer" src={settings.qr} alt="UPI QR" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center font-mono text-slate-400 space-y-1">
                  <span className="block text-slate-500 font-black text-[10px]">UPI SCAN</span>
                  <span className="block text-[8px] truncate max-w-[100px]">{settings.upi}</span>
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono font-bold text-slate-400 truncate max-w-[150px]">
              {settings.upi}
            </span>
          </div>
        </div>

        {/* Signature lines */}
        <div className="grid grid-cols-2 gap-10 pt-10 pb-6 border-t border-dashed border-slate-200 text-center text-xs">
          <div className="space-y-12">
            <div className="h-0.5 bg-slate-300 mx-auto max-w-[180px]"></div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Customer Signature / গ্রাহকের স্বাক্ষর
            </span>
          </div>
          <div className="space-y-12">
            <div className="h-0.5 bg-slate-300 mx-auto max-w-[180px]"></div>
            <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Authorized Seal & Signature
            </span>
          </div>
        </div>

        {/* Bottom Greetings & Footer */}
        <div className="text-center pt-4 border-t-2 border-dashed border-slate-100 text-xs font-black text-slate-700 tracking-widest uppercase my-4">
          {settings.footerMsg}
        </div>

        <div className="text-center text-[10px] text-slate-400 font-medium leading-relaxed mt-2 pt-2 border-t border-slate-100">
          Disclaimer: This receipt is computer generated via Rajesh Online Services V4.2 and does not require an physical signature to be authenticated. In case of discrepancies please contact support instantly.
        </div>
          </div> {/* closing relative z-10 wrapper */}
        </div> {/* closing Outline border wrapper */}
      </div> {/* closing print-sheet */}
    </div>
  );
}
