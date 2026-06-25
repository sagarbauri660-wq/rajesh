/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, ShieldAlert, UserCheck } from "lucide-react";
import { AppSettings } from "../types";

interface LoginProps {
  settings: AppSettings;
  onLogin: () => void;
}

export default function Login({ settings, onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === settings.username && password === settings.password) {
      onLogin();
    } else {
      setError("Invalid username or password. / ইউজারনেম বা পাসওয়ার্ড ভুল।");
    }
  };

  return (
    <div id="login-container" className="min-h-screen flex items-center justify-center p-4 bg-[#0A0A0B] text-slate-300 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md bg-[#111114] rounded-3xl p-8 shadow-2xl border border-white/5 relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
        
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-bold text-blue-400 tracking-wide uppercase font-mono">
            CSC Billing • V4.2 Enterprise
          </span>
          <h1 className="mt-4 text-3xl font-black text-white tracking-tight font-display">
            {settings.softwareName}
          </h1>
          <p className="mt-2 text-sm text-slate-400 leading-relaxed">
            Secure billing, A4 receipts, monthly reporting, and instant WhatsApp integration.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-start gap-2 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium rounded-xl"
            >
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Username / ইউজারনেম
            </label>
            <div className="relative">
              <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="username-input"
                type="text"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError("");
                }}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                placeholder="Enter username"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
              Password / পাসওয়ার্ড
            </label>
            <div className="relative">
              <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                id="password-input"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-[#141417] transition"
                placeholder="••••"
                required
              />
            </div>
          </div>

          <motion.button
            id="login-submit"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-blue-600/15 hover:shadow-blue-600/25 transition cursor-pointer font-sans"
          >
            Sign In to Dashboard
          </motion.button>
        </form>


      </motion.div>
    </div>
  );
}
