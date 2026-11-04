"use client";

import React, { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  XCircle,
  AlertTriangle,
  RotateCcw,
  MessageSquare,
  Phone,
  Mail,
  Home,
  ShieldAlert,
  Clock,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function PaymentFailedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId") || "";
  const reasonParam = searchParams.get("reason") || "";
  const statusParam = searchParams.get("status") || "";

  const [currentStatus, setCurrentStatus] = useState<string>(statusParam || "failed");
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusNote, setStatusNote] = useState("");

  const isPending =
    currentStatus.toLowerCase() === "pending" ||
    reasonParam.toLowerCase().includes("pending") ||
    reasonParam.toLowerCase().includes("awaiting");

  const isCancelled =
    reasonParam.toLowerCase().includes("cancel") ||
    reasonParam.toLowerCase().includes("dismiss") ||
    reasonParam.toLowerCase().includes("closed");

  // Re-check payment status if user suspects funds were debited
  const checkLiveStatus = async () => {
    if (!orderId) return;
    setIsCheckingStatus(true);
    setStatusNote("");
    try {
      const res = await fetch(`/api/payments/receipt/${encodeURIComponent(orderId)}`);
      const data = await res.json();
      if (res.ok && data.success && data.receipt) {
        if (data.receipt.status === "successful") {
          window.location.href = `/payment-success?receiptNumber=${encodeURIComponent(
            data.receipt.receiptNumber
          )}&orderId=${encodeURIComponent(orderId)}&paymentId=${encodeURIComponent(
            data.receipt.gatewayPaymentId || ""
          )}`;
          return;
        } else {
          setCurrentStatus(data.receipt.status);
          setStatusNote(
            data.receipt.statusReason || `Current status from gateway is ${data.receipt.status}.`
          );
        }
      } else {
        setStatusNote("No captured payment found yet for this order. It remains unconfirmed.");
      }
    } catch (e: any) {
      setStatusNote("Unable to reach verification server. Please contact support.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const whatsappSupportMsg = encodeURIComponent(
    `Hello NextGen Support, I encountered an issue while paying online.\n\n` +
      `• Order Reference: ${orderId || "N/A"}\n` +
      `• Reported Reason: ${reasonParam || "Payment declined or cancelled"}\n\n` +
      `Could you please help me complete this payment?`
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6">
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl relative overflow-hidden text-center">
        
        {/* Glow Header */}
        <div
          className={`absolute top-0 left-0 right-0 h-1.5 ${
            isPending ? "bg-amber-400" : isCancelled ? "bg-slate-600" : "bg-red-500"
          }`}
        />

        {/* Status Icon */}
        <div className="mb-4 flex justify-center">
          {isPending ? (
            <div className="w-16 h-16 rounded-full bg-amber-500/15 border-2 border-amber-400 text-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.25)] animate-pulse">
              <Clock className="w-8 h-8" />
            </div>
          ) : isCancelled ? (
            <div className="w-16 h-16 rounded-full bg-slate-800 border-2 border-slate-600 text-slate-400 flex items-center justify-center shadow-lg">
              <AlertTriangle className="w-8 h-8" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-red-500/15 border-2 border-red-500 text-red-400 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.25)]">
              <XCircle className="w-8 h-8" />
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="mb-3">
          <span
            className={`px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider ${
              isPending
                ? "bg-amber-950/80 text-amber-300 border border-amber-500/40"
                : isCancelled
                ? "bg-slate-800 text-slate-300 border border-slate-700"
                : "bg-red-950/80 text-red-300 border border-red-500/40"
            }`}
          >
            {isPending ? "Payment Pending Verification" : isCancelled ? "Checkout Cancelled" : "Payment Not Completed"}
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-white mb-2">
          {isPending
            ? "Awaiting Gateway Confirmation"
            : isCancelled
            ? "Checkout Closed Before Completion"
            : "Payment Could Not Be Processed"}
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6 leading-relaxed">
          {isPending
            ? "Your bank may take a few moments to communicate confirmation. The payment remains marked as pending until verified."
            : isCancelled
            ? "You closed the payment window before authorization was finalized. No funds have been charged to your account."
            : "The payment gateway was unable to authorize the charge. This may be due to bank security limits, an OTP timeout, or card decline."}
        </p>

        {/* Reason Details Box */}
        {(reasonParam || orderId) && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-left font-mono text-xs space-y-1.5">
            {orderId && (
              <div className="flex justify-between text-slate-400">
                <span>Order Reference:</span>
                <span className="text-slate-200">{orderId}</span>
              </div>
            )}
            {reasonParam && (
              <div className="flex justify-between text-slate-400">
                <span>Gateway Notice:</span>
                <span className="text-rose-400 font-semibold">{reasonParam}</span>
              </div>
            )}
          </div>
        )}

        {statusNote && (
          <div className="mb-6 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            {statusNote}
          </div>
        )}

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
          {isPending && orderId && (
            <button
              type="button"
              onClick={checkLiveStatus}
              disabled={isCheckingStatus}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold font-mono text-xs transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              {isCheckingStatus ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Checking Status...</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Check Live Payment Status</span>
                </>
              )}
            </button>
          )}

          <Link
            href="/pay-online"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-extrabold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.3)]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Retry Payment Now</span>
          </Link>

          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Website</span>
          </Link>
        </div>

        {/* Support Grid */}
        <div className="pt-6 border-t border-slate-800/80">
          <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-3">
            Need Immediate Assistance or Facing Bank Issues?
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
            <a
              href={`https://wa.me/918340424989?text=${whatsappSupportMsg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-500/30 text-emerald-400 flex flex-col items-center gap-1 transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span className="font-bold">WhatsApp Team</span>
              <span className="text-[10px] text-slate-400">+91 83404 24989</span>
            </a>

            <a
              href="tel:+918340424989"
              className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-300 flex flex-col items-center gap-1 transition-all hover:border-slate-700"
            >
              <Phone className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">Call Support</span>
              <span className="text-[10px] text-slate-400">Direct Line</span>
            </a>

            <a
              href="mailto:support@nextgendigitalsolutions.com"
              className="p-3 rounded-xl bg-slate-950/70 hover:bg-slate-900 border border-slate-800 text-slate-300 flex flex-col items-center gap-1 transition-all hover:border-slate-700"
            >
              <Mail className="w-4 h-4 text-cyan-400" />
              <span className="font-bold">Email Desk</span>
              <span className="text-[10px] text-slate-400">Response &lt; 2 hrs</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[450px] bg-gradient-to-b from-red-500/10 via-rose-500/5 to-transparent blur-[120px] pointer-events-none" />

        <Suspense
          fallback={
            <div className="py-20 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-mono text-red-400 tracking-wider">LOADING PAYMENT STATUS...</span>
            </div>
          }
        >
          <PaymentFailedContent />
        </Suspense>
      </main>

      <Footer />
    </div>
  );
}
