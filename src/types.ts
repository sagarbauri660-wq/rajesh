/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ServiceItem {
  main: string;
  details: string;
  amount: number;
}

export interface Receipt {
  receiptNo: string;
  receiptType: string;
  date: string;
  customerName: string;
  mobile: string;
  address: string;
  customerId?: string;
  services: ServiceItem[];
  amount: number;
  paidAmount: number;
  dueAmount: number;
  status: "PAID" | "DUE";
  paymentMethod: string;
  txnId?: string;
  operator: string;
  notes?: string;
  createdAt: string;
}

export interface AppSettings {
  softwareName: string;
  shopName: string;
  ownerName: string;
  mobile: string;
  address: string;
  upi: string;
  footerMsg: string;
  username: string;
  password: string;
  logo: string;
  qr: string;
  serviceList: string;
}
