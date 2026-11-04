"use client";

import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  Printer,
  Download,
  Share2,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  MessageSquare,
  Home,
  Clock,
  User,
  Building,
  Mail,
  Phone,
  FileCheck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface PaymentDetails {
  id: string;
  receiptNumber: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  businessName?: string;
  serviceId: string;
  serviceName: string;
  projectDescription: string;
  purpose?: string;
  projectReference?: string;
  totalProjectAmount?: number;
  remainingBalance?: number;
  amount: number;
  currency: string;
  breakdown?: { label: string; amount: number }[];
  gatewayPaymentId?: string;
  gatewayOrderId: string;
  status: string;
  paymentTimestamp?: string;
  createdAt: string;
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const receiptNumberParam = searchParams.get("receiptNumber") || "";
  const orderIdParam = searchParams.get("orderId") || "";
  const paymentIdParam = searchParams.get("paymentId") || "";

  const [payment, setPayment] = useState<PaymentDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Trigger celebration confetti
  useEffect(() => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00f0ff", "#06b6d4", "#10b981", "#ffffff"],
      });
    } catch (e) {}
  }, []);

  // Fetch verified receipt data from server
  useEffect(() => {
    async function fetchReceipt() {
      const lookupId = receiptNumberParam || orderIdParam || paymentIdParam;
      if (!lookupId) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await fetch(`/api/payments/receipt/${encodeURIComponent(lookupId)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.receipt) {
            setPayment(data.receipt);
          }
        }
      } catch (err) {
        console.warn("Could not fetch full receipt record:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchReceipt();
  }, [receiptNumberParam, orderIdParam, paymentIdParam]);

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const formattedDate = payment?.paymentTimestamp
    ? new Date(payment.paymentTimestamp).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const whatsappMessage = encodeURIComponent(
    `Hello NextGen Digital Solutions, I have successfully completed the online payment.\n\n` +
      `• Receipt: ${payment?.receiptNumber || receiptNumberParam || "N/A"}\n` +
      `• Payment ID: ${payment?.gatewayPaymentId || paymentIdParam || "N/A"}\n` +
      `• Service: ${payment?.serviceName || "Digital Solutions"}\n` +
      `• Amount: ₹${(payment?.amount || 0).toLocaleString("en-IN")}\n` +
      `• Client: ${payment?.customerName || "Client"}\n\n` +
      `Please confirm receipt and schedule our kickoff call.`
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6">
      
      {/* Printable Receipt Card */}
      <div
        id="receipt-print-area"
        className="p-6 sm:p-10 rounded-3xl bg-slate-900/95 border border-cyan-500/30 shadow-[0_0_50px_rgba(0,240,255,0.12)] backdrop-blur-xl relative overflow-hidden print:bg-white print:text-black print:border-none print:shadow-none print:p-0"
      >
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-500" />

        {/* Success Icon & Confirmation */}
        <div className="text-center pb-8 border-b border-slate-800 print:border-slate-300">
          <div className="w-16 h-16 rounded-full bg-emerald-500/15 border-2 border-emerald-400 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/70 border border-emerald-500/30 px-3 py-1 rounded-full">
            Payment Verified & Confirmed
          </span>

          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white print:text-black mt-3">
            Thank You for Your Payment!
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 print:text-slate-600 mt-1 max-w-md mx-auto">
            Your transaction has been securely processed and authenticated by Razorpay. An official digital receipt is generated below.
          </p>
        </div>

        {/* Brand & Receipt Meta Header */}
        <div className="py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800/80 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-36">
              <Image
                src="/logo.png"
                alt="NextGen Digital Solutions"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading font-extrabold text-sm text-white print:text-black">
                NextGen Digital Solutions
              </span>
              <span className="text-[10px] font-mono text-cyan-400 print:text-cyan-600">
                Authorized Growth Engineering
              </span>
            </div>
          </div>

          <div className="text-left sm:text-right font-mono text-xs">
            <span className="text-slate-500 block text-[10px] uppercase">Receipt Number</span>
            <span className="text-cyan-300 print:text-black font-bold text-sm">
              {payment?.receiptNumber || receiptNumberParam || "NGD-2026-REC"}
            </span>
            <span className="text-slate-400 print:text-slate-600 block text-[11px] mt-0.5">
              {formattedDate}
            </span>
          </div>
        </div>

        {/* Transaction Summary Grid */}
        <div className="py-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono border-b border-slate-800/80 print:border-slate-300">
          <div>
            <span className="text-slate-500 text-[10px] uppercase block mb-1">Billed To (Client):</span>
            <span className="text-white print:text-black font-bold text-sm block">
              {payment?.customerName || "Valued Client"}
            </span>
            {payment?.businessName && (
              <span className="text-slate-300 print:text-slate-700 block">{payment.businessName}</span>
            )}
            {payment?.customerEmail && (
              <span className="text-slate-400 print:text-slate-600 block">{payment.customerEmail}</span>
            )}
            {payment?.customerMobile && (
              <span className="text-slate-400 print:text-slate-600 block">{payment.customerMobile}</span>
            )}
          </div>

          <div className="sm:text-right">
            <span className="text-slate-500 text-[10px] uppercase block mb-1">Gateway Reference:</span>
            <span className="text-slate-300 print:text-slate-700 block">
              Payment ID: <span className="text-cyan-400 print:text-black font-bold">{payment?.gatewayPaymentId || paymentIdParam || "N/A"}</span>
            </span>
            <span className="text-slate-400 print:text-slate-600 block text-[11px] mt-0.5">
              Order ID: {payment?.gatewayOrderId || orderIdParam || "N/A"}
            </span>
            <span className="text-slate-400 print:text-slate-600 block text-[11px]">
              Channel: Razorpay India UPI/Cards
            </span>
          </div>
        </div>

        {/* Service Itemization Table */}
        <div className="py-6 border-b border-slate-800/80 print:border-slate-300">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-slate-500 border-b border-slate-800 text-left uppercase text-[10px]">
                <th className="pb-2">Description</th>
                <th className="pb-2 text-right">Amount (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 print:divide-slate-200">
              <tr>
                <td className="py-3 pr-4">
                  <span className="font-bold text-white print:text-black block text-sm">
                    {payment?.serviceName || "Digital Marketing / Web Development Service"}
                  </span>
                  <span className="text-slate-400 print:text-slate-600 text-[11px] block mt-0.5">
                    {payment?.projectDescription || "Project booking and strategy implementation scope"}
                  </span>
                </td>
                <td className="py-3 text-right font-bold text-white print:text-black text-sm align-top">
                  ₹{(payment?.amount || 0).toLocaleString("en-IN")}
                </td>
              </tr>

              {payment?.breakdown && payment.breakdown.length > 0 && (
                <>
                  {payment.breakdown.map((item, idx) => (
                    <tr key={idx} className="text-slate-400 text-[11px]">
                      <td className="py-1.5 pl-3">• {item.label}</td>
                      <td className="py-1.5 text-right">₹{item.amount.toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>

        {/* Total Box */}
        <div className="py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/80 print:border-slate-300">
          <div>
            <span className="text-xs font-mono text-slate-400 block">Payment Status</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs font-mono uppercase">
              <CheckCircle2 className="w-3.5 h-3.5" /> PAID & CONFIRMED
            </span>
            {payment?.purpose && (
              <p className="text-[11px] font-mono text-cyan-400 mt-1">
                Purpose: {payment.purpose}
              </p>
            )}
            {payment?.projectReference && (
              <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                Ref Code: {payment.projectReference}
              </p>
            )}
          </div>

          <div className="text-right">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Grand Total Paid</span>
            <span className="text-2xl sm:text-3xl font-heading font-extrabold text-cyan-400 print:text-black">
              ₹{(payment?.amount || 0).toLocaleString("en-IN")}
            </span>
            {typeof payment?.remainingBalance === "number" && payment.remainingBalance > 0 && (
              <div className="text-[11px] font-mono text-amber-400 mt-1">
                Remaining Project Balance: ₹{payment.remainingBalance.toLocaleString("en-IN")}
              </div>
            )}
          </div>
        </div>

        {/* Print Disclaimer */}
        <div className="pt-6 text-center text-[10px] font-mono text-slate-500 print:text-slate-600">
          NextGen Digital Solutions • Digital Growth Agency • support@nextgendigitalsolutions.com
          <br />
          Computer generated electronic tax receipt. No physical signature required.
        </div>
      </div>

      {/* Action Buttons (Hidden when printing) */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 print:hidden">
        {/* Print / Download Button */}
        <button
          type="button"
          onClick={handlePrint}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg hover:border-cyan-400"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Download / Print Receipt</span>
        </button>

        {/* WhatsApp PM Connect */}
        <a
          href={`https://wa.me/918340424989?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Connect with PM on WhatsApp</span>
        </a>

        {/* Return to Home */}
        <Link
          href="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Home className="w-4 h-4" />
          <span>Return to Website</span>
        </Link>
      </div>

    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-emerald-500/10 via-cyan-500/5 to-transparent blur-[120px] pointer-events-none" />

        <Suspense
          fallback={
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-cyan-400 tracking-wider">RETRIEVING PAYMENT RECEIPT...</span>
            </div>
          }
        >
          <PaymentSuccessContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}

