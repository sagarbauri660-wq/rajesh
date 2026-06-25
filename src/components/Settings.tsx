/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Settings2, 
  Save, 
  RotateCcw, 
  Lock, 
  Store, 
  CheckCircle,
  HelpCircle,
  FileText,
  Upload
} from "lucide-react";
import { AppSettings } from "../types";

interface SettingsProps {
  settings: AppSettings;
  onSave: (updated: AppSettings) => void;
}

export default function Settings({ settings, onSave }: SettingsProps) {
  // Shop details
  const [softwareName, setSoftwareName] = useState(settings.softwareName);
  const [shopName, setShopName] = useState(settings.shopName);
  const [ownerName, setOwnerName] = useState(settings.ownerName);
  const [mobile, setMobile] = useState(settings.mobile);
  const [address, setAddress] = useState(settings.address);
  const [upi, setUpi] = useState(settings.upi);
  const [footerMsg, setFooterMsg] = useState(settings.footerMsg);
  const [logo, setLogo] = useState(settings.logo);
  const [qr, setQr] = useState(settings.qr);

  // Authentication
  const [username, setUsername] = useState(settings.username);
  const [password, setPassword] = useState(settings.password);

  // Printed Service catalog list
  const [serviceList, setServiceList] = useState(settings.serviceList);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (value: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("Image size must be less than 2MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setter(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: AppSettings = {
      softwareName: softwareName.trim(),
      shopName: shopName.trim().toUpperCase(),
      ownerName: ownerName.trim(),
      mobile: mobile.trim(),
      address: address.trim(),
      upi: upi.trim(),
      footerMsg: footerMsg.trim(),
      logo: logo.trim(),
      qr: qr.trim(),
      username: username.trim(),
      password: password.trim(),
      serviceList: serviceList.trim()
    };
    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const resetToCurrent = () => {
    setSoftwareName(settings.softwareName);
    setShopName(settings.shopName);
    setOwnerName(settings.ownerName);
    setMobile(settings.mobile);
    setAddress(settings.address);
    setUpi(settings.upi);
    setFooterMsg(settings.footerMsg);
    setLogo(settings.logo);
    setQr(settings.qr);
    setUsername(settings.username);
    setPassword(settings.password);
    setServiceList(settings.serviceList);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-slate-300 font-sans">
      {savedSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-xs font-bold flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Settings saved successfully! / সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Shop Settings card */}
        <div className="lg:col-span-7 bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display pb-3 border-b border-white/5 flex items-center gap-2">
            <Store className="w-4 h-4 text-blue-400" />
            <span>Shop & CSC Parameters / দোকান সেটিংস</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Software Title
              </label>
              <input
                id="set-soft-name"
                type="text"
                value={softwareName}
                onChange={(e) => setSoftwareName(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Shop / CSC Business Name
              </label>
              <input
                id="set-shop-name"
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Owner / পরিচালক
              </label>
              <input
                id="set-owner-name"
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Mobiles (Comma Separated)
              </label>
              <input
                id="set-mobile"
                type="text"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Address / সম্পূর্ণ ঠিকানা
              </label>
              <input
                id="set-address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Active UPI ID (For Scan-to-pay QR generator)
              </label>
              <input
                id="set-upi"
                type="text"
                value={upi}
                onChange={(e) => setUpi(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Footer Greeting / রসিদ ফুটার মেসেজ
              </label>
              <input
                id="set-footer-msg"
                type="text"
                value={footerMsg}
                onChange={(e) => setFooterMsg(e.target.value)}
                className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  <span>Shop Logo Image / লোগো আপলোড</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" title="Upload an image (PNG/JPG) or enter a URL" />
                </span>
                {logo && (
                  <button
                    type="button"
                    onClick={() => setLogo("")}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition"
                  >
                    Remove Logo
                  </button>
                )}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                  {logo ? (
                    <img referrerPolicy="no-referrer" src={logo} alt="Logo Preview" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold font-mono">No Logo</span>
                  )}
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="relative flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/30 rounded-xl font-bold text-xs transition cursor-pointer text-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setLogo)}
                      className="hidden"
                    />
                  </label>
                  <input
                    id="set-logo"
                    type="text"
                    value={logo}
                    onChange={(e) => setLogo(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full py-1.5 px-3 bg-[#141417] border border-white/5 rounded-lg text-white font-mono text-[10px] focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2 flex items-center justify-between gap-1.5">
                <span className="flex items-center gap-1.5">
                  <span>Custom QR Code Image / কিউআর কোড</span>
                  <HelpCircle className="w-3.5 h-3.5 text-slate-500" title="Upload a QR code image (PNG/JPG) or enter a URL" />
                </span>
                {qr && (
                  <button
                    type="button"
                    onClick={() => setQr("")}
                    className="text-[10px] font-bold text-rose-400 hover:text-rose-300 transition"
                  >
                    Remove QR
                  </button>
                )}
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/5 border border-white/10 rounded-xl p-4">
                <div className="w-16 h-16 bg-white/5 rounded-lg overflow-hidden flex items-center justify-center shrink-0 border border-white/10">
                  {qr ? (
                    <img referrerPolicy="no-referrer" src={qr} alt="QR Preview" className="w-full h-full object-contain" />
                  ) : (
                    <span className="text-[10px] text-slate-500 font-bold font-mono">No QR</span>
                  )}
                </div>
                <div className="flex-1 w-full space-y-2">
                  <label className="relative flex items-center justify-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 hover:border-blue-500/30 rounded-xl font-bold text-xs transition cursor-pointer text-center">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload QR Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, setQr)}
                      className="hidden"
                    />
                  </label>
                  <input
                    id="set-qr"
                    type="text"
                    value={qr}
                    onChange={(e) => setQr(e.target.value)}
                    placeholder="Or paste direct image URL (https://...)"
                    className="w-full py-1.5 px-3 bg-[#141417] border border-white/5 rounded-lg text-white font-mono text-[10px] focus:outline-none focus:border-blue-500 transition"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6 flex flex-col">
          {/* Security details card */}
          <div className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display pb-3 border-b border-white/5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>Login Security Settings / আইডি পাসওয়ার্ড</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                  Staff Username
                </label>
                <input
                  id="set-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                  Staff Password
                </label>
                <input
                  id="set-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-2 px-3 bg-white/5 border border-white/10 rounded-xl text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                  required
                />
              </div>
            </div>
          </div>

          {/* Service items printable editor */}
          <div className="bg-[#111114] rounded-2xl border border-white/5 p-6 shadow-2xl flex-1 flex flex-col relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-display pb-3 border-b border-white/5 flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-blue-400" />
              <span>Printable Service Catalog / উপলব্ধ কাজের তালিকা</span>
            </h3>

            <div className="flex-1 flex flex-col">
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono mb-2">
                Available list (printed on the bottom of bills)
              </label>
              <textarea
                id="set-service-list"
                value={serviceList}
                onChange={(e) => setServiceList(e.target.value)}
                rows={10}
                className="w-full flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Settings Actions bar */}
      <div className="flex gap-3">
        <button
          type="submit"
          id="save-settings-btn"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-blue-500/15 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save All Settings</span>
        </button>

        <button
          type="button"
          id="reset-settings-btn"
          onClick={resetToCurrent}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-slate-300 border border-white/5 font-bold rounded-xl text-sm transition cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reload Active</span>
        </button>
      </div>
    </form>
  );
}
