/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { AppSettings } from "../types";

export const DEFAULT_SETTINGS: AppSettings = {
  softwareName: "Rajesh Online Services",
  shopName: "RAJESH ONLINE SERVICES",
  ownerName: "Rajesh Bouri",
  mobile: "7047312829 / 7047486864",
  address: "Keshia, Khatra, Bankura (W.B.)",
  upi: "BHARATPE2R0A0N6I7G05611@unitype",
  footerMsg: "Thank You • Visit Again",
  username: "admin",
  password: "1234",
  logo: "",
  qr: "",
  serviceList: `আধার কার্ড: ঠিকানা পরিবর্তন, মোবাইল নম্বর লিঙ্ক ও সংশোধন।
ভোটার কার্ড: নতুন ভোটার কার্ড, সংশোধন ও ডাউনলোড।
প্যান কার্ড: নতুন প্যান কার্ড তৈরি ও সংশোধন সংক্রান্ত কাজ।
সার্টিফিকেট: পঞ্চায়েত ও ব্লক থেকে প্রদত্ত সমস্ত রকম সার্টিফিকেটের আবেদন।
রেশন কার্ড: নতুন আবেদন, সংশোধন ও অন্য পরিবারে স্থানান্তর।
ই-শ্রম (e-Shram) কার্ড: নতুন রেজিস্ট্রেশন ও কার্ড আপডেট।
পিএফ (PF): পিএফ উইথড্রয়াল (PF Withdrawal) ও কেওয়াইসি সংক্রান্ত কাজ।
ফটোগ্রাফি: পাসপোর্ট সাইজ এবং ফুল সাইজ ফটো প্রিন্ট।
শিক্ষা সংক্রান্ত: স্কুল ও কলেজের অনলাইন ফর্ম ফিলআপ ও স্কলারশিপ আবেদন।
বিদ্যুৎ বিল: বিদ্যুৎ বিল জমা ও নতুন সংযোগের জন্য আবেদন।
ড্রাইভিং লাইসেন্স: নতুন লাইসেন্সের জন্য আবেদন ও স্লট বুকিং।
কাস্ট সার্টিফিকেট: এসসি/এসটি/ওবিসি সার্টিফিকেটের আবেদন।
চাকরির ফর্ম: সকল প্রকার সরকারি ও বেসরকারি চাকরির ফর্ম ফিলআপ।
বিশেষ দ্রষ্টব্য: এখানে অভিজ্ঞতার সাথে সমস্ত কাজ অত্যন্ত যত্ন সহকারে করা হয়।`
};

export const SERVICE_MAIN_OPTIONS = [
  "আধার কার্ড / Aadhaar",
  "ভোটার কার্ড / Voter",
  "প্যান কার্ড / PAN",
  "সার্টিফিকেট / Certificate",
  "রেশন কার্ড / Ration",
  "ই-শ্রম / e-Shram",
  "PF Service",
  "Photography",
  "Education Form",
  "Electricity Bill",
  "Driving Licence",
  "Caste Certificate",
  "Job Form",
  "Other"
];

export const SERVICE_DETAILS_MAPPING: Record<string, string> = {
  "আধার কার্ড / Aadhaar": "Aadhaar Address Update / Mobile Link / Correction",
  "ভোটার কার্ড / Voter": "New Voter / Correction / EPIC related service",
  "প্যান কার্ড / PAN": "New PAN / PAN Correction / Reprint",
  "সার্টিফিকেট / Certificate": "Income / Residential / Character / Other Certificate",
  "রেশন কার্ড / Ration": "New Ration / Correction / Family member update",
  "ই-শ্রম / e-Shram": "New Registration / Card Update",
  "PF Service": "PF Withdrawal / KYC / Claim support",
  "Photography": "Passport photo / Full size photo print",
  "Education Form": "School / College / Scholarship / Admission form",
  "Electricity Bill": "Bill Payment / New Connection Application",
  "Driving Licence": "Learner / New DL / Renewal support",
  "Caste Certificate": "SC / ST / OBC certificate apply",
  "Job Form": "Govt / Private job form fill-up"
};

export const SERVICE_PRICE_MAPPING: Record<string, number> = {
  "আধার কার্ড / Aadhaar": 50,
  "ভোটার কার্ড / Voter": 40,
  "প্যান কার্ড / PAN": 120,
  "সার্টিফিকেট / Certificate": 50,
  "রেশন কার্ড / Ration": 40,
  "ই-শ্রম / e-Shram": 50,
  "PF Service": 150,
  "Photography": 50,
  "Education Form": 60,
  "Electricity Bill": 20,
  "Driving Licence": 200,
  "Caste Certificate": 80,
  "Job Form": 80,
  "Other": 0
};

export function formatDate(isoString: string): string {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

export function formatMonth(yearMonth: string): string {
  if (!yearMonth) return "";
  const [year, month] = yearMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function generateReceiptNumber(dateStr: string, existingCount: number): string {
  const date = new Date(dateStr);
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const suffix = String(existingCount + 1).padStart(3, "0");
  return `ROS-${yy}${mm}${dd}-${suffix}`;
}
