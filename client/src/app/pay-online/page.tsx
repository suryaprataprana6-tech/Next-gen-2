"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Lock,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Building2,
  Mail,
  Phone,
  User,
  FileText,
  Sparkles,
  Server,
  Search,
  Target,
  TrendingUp,
  Share2,
  Code,
  Palette,
  BadgeCheck,
  Zap,
  HelpCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ServiceCategory } from "@/lib/paymentsDb";

// Icon mapping helper
const SERVICE_ICONS: Record<string, React.ReactNode> = {
  BadgeCheck: <BadgeCheck className="w-5 h-5 text-cyan-400" />,
  Server: <Server className="w-5 h-5 text-indigo-400" />,
  Search: <Search className="w-5 h-5 text-emerald-400" />,
  Target: <Target className="w-5 h-5 text-rose-400" />,
  TrendingUp: <TrendingUp className="w-5 h-5 text-amber-400" />,
  Share2: <Share2 className="w-5 h-5 text-purple-400" />,
  Code: <Code className="w-5 h-5 text-cyan-400" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5 text-blue-400" />,
  Palette: <Palette className="w-5 h-5 text-pink-400" />,
  CreditCard: <CreditCard className="w-5 h-5 text-teal-400" />,
};

export default function PayOnlinePage() {
  const router = useRouter();

  // Catalog and selection states
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Customer form inputs
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [customAmount, setCustomAmount] = useState<string>("");

  // Checkout submission states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeStep, setActiveStep] = useState<1 | 2>(1); // 1 = Select Service, 2 = Enter Details & Pay

  // Fetch service catalog on mount
  useEffect(() => {
    async function loadCatalog() {
      setIsLoadingCatalog(true);
      try {
        const res = await fetch("/api/payments/catalog");
        const data = await res.json();
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setLoadError(data.error || "Unable to load service catalog.");
        }
      } catch (err: any) {
        setLoadError(err.message || "Failed to connect to service catalog server.");
      } finally {
        setIsLoadingCatalog(false);
      }
    }
    loadCatalog();
  }, []);

  // Dynamically load Razorpay checkout script
  const loadRazorpayScript = () => {
    return new Promise<boolean>((resolve) => {
      if (typeof window === "undefined") return resolve(false);
      if ((window as any).Razorpay) return resolve(true);

      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Helper to select service & progress to step 2
  const handleSelectService = (service: ServiceCategory) => {
    setSelectedService(service);
    setFormError("");
    if (service.pricingType === "custom" && !customAmount) {
      setCustomAmount(service.minAmount ? String(service.minAmount) : "500");
    }
    setActiveStep(2);
    // Smooth scroll to form
    window.scrollTo({ top: 350, behavior: "smooth" });
  };

  // Calculate final amount display
  const getPayableAmount = () => {
    if (!selectedService) return 0;
    if (selectedService.pricingType === "fixed") {
      return selectedService.amount;
    }
    const parsed = parseFloat(customAmount);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Form submission & Razorpay Checkout Trigger
  const handleProceedToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!selectedService) {
      setFormError("Please select a service category to proceed.");
      return;
    }

    if (!fullName.trim() || !mobileNumber.trim() || !emailAddress.trim() || !projectDescription.trim()) {
      setFormError("Please complete all required fields (Name, Mobile, Email, and Project Description).");
      return;
    }

    // Mobile validation: 10 digits
    const cleanedPhone = mobileNumber.replace(/\D/g, "");
    if (cleanedPhone.length < 10) {
      setFormError("Please provide a valid 10-digit mobile number.");
      return;
    }

    const payableAmount = getPayableAmount();
    if (selectedService.pricingType === "custom") {
      const min = selectedService.minAmount || 500;
      if (payableAmount < min) {
        setFormError(`Custom payment amount must be at least ₹${min.toLocaleString("en-IN")}.`);
        return;
      }
    }

    setIsSubmitting(true);

    try {
      // 1. Ensure Razorpay Checkout script is loaded
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        throw new Error("Razorpay payment gateway SDK failed to load. Please verify your connection.");
      }

      // 2. Request Server to create a verified Order
      const createOrderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedService.id,
          customerName: fullName,
          customerEmail: emailAddress,
          customerMobile: mobileNumber,
          businessName: companyName,
          projectDescription: projectDescription,
          customAmount: selectedService.pricingType === "custom" ? payableAmount : undefined,
        }),
      });

      const orderData = await createOrderRes.json();
      if (!createOrderRes.ok || !orderData.success) {
        throw new Error(orderData.error || "Failed to create payment order on server.");
      }

      const { orderId, amountInPaise, keyId, receiptNumber, paymentRecordId } = orderData;

      // 3. Configure and Open Razorpay Checkout Modal
      const options = {
        key: keyId,
        amount: amountInPaise,
        currency: "INR",
        name: "NextGen Digital Solutions",
        description: `${selectedService.name} - ${receiptNumber}`,
        image: "/logo.png",
        order_id: orderId,
        prefill: {
          name: fullName,
          email: emailAddress,
          contact: mobileNumber,
        },
        notes: {
          service_id: selectedService.id,
          service_name: selectedService.name,
          receipt_number: receiptNumber,
        },
        theme: {
          color: "#06b6d4", // Cyan 500 matching brand
        },
        modal: {
          ondismiss: async function () {
            console.log("Customer closed the checkout modal.");
            // Send cancellation audit record to server
            try {
              await fetch("/api/payments/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: orderId,
                  isCancelled: true,
                  cancelReason: "Customer dismissed payment modal before completing transaction.",
                }),
              });
            } catch (e) {}

            setIsSubmitting(false);
            setFormError("Payment was not completed. You can re-open checkout whenever you are ready.");
          },
        },
        handler: async function (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) {
          console.log("Razorpay payment response received. Verifying on server...");
          try {
            // 4. Verify payment on server with HMAC signature
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                paymentRecordId: paymentRecordId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Redirect to success receipt page
              router.push(
                `/payment-success?receiptNumber=${encodeURIComponent(receiptNumber)}&orderId=${encodeURIComponent(
                  response.razorpay_order_id
                )}&paymentId=${encodeURIComponent(response.razorpay_payment_id)}`
              );
            } else {
              // Verification failed
              router.push(
                `/payment-failed?orderId=${encodeURIComponent(
                  response.razorpay_order_id
                )}&reason=${encodeURIComponent(verifyData.error || "Cryptographic signature verification failed")}`
              );
            }
          } catch (verifyErr: any) {
            router.push(
              `/payment-failed?orderId=${encodeURIComponent(response.razorpay_order_id)}&reason=${encodeURIComponent(
                verifyErr.message || "Network error verifying payment status"
              )}`
            );
          }
        },
      };

      const razorpayInstance = new (window as any).Razorpay(options);

      // Handle checkout failure event
      razorpayInstance.on("payment.failed", function (response: any) {
        console.error("Payment failed at gateway:", response.error);
        const reason = response.error?.description || response.error?.reason || "Card or payment method declined";
        router.push(
          `/payment-failed?orderId=${encodeURIComponent(orderId)}&reason=${encodeURIComponent(reason)}`
        );
      });

      razorpayInstance.open();
    } catch (err: any) {
      console.error("Checkout initiation error:", err);
      setFormError(err.message || "An unexpected error occurred while launching payment gateway.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        {/* Futuristic Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-cyan-500/10 via-indigo-500/5 to-transparent blur-[120px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00f0ff04_1px,transparent_1px),linear-gradient(to_bottom,#00f0ff04_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Title & Trust Badges */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-mono font-semibold bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 mb-4 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>OFFICIAL NEXTGEN SECURE PAYMENT PORTAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight leading-tight">
              Pay Online & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400">Lock Your Project</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 mt-3 font-sans leading-relaxed">
              Book kickoff tokens, recurring service retainers, hosting setups, or milestone disbursements with instant Razorpay bank-grade checkout.
            </p>

            {/* Micro Trust Strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-800/60 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> 256-Bit SSL Encrypted
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <Zap className="w-3.5 h-3.5 text-cyan-400" /> Instant GST Receipt
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> UPI • Cards • NetBanking • EMI
              </span>
            </div>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-center mb-10">
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActiveStep(1)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeStep === 1
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[11px]">1</span>
                <span>Select Service</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (selectedService) setActiveStep(2);
                }}
                disabled={!selectedService}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeStep === 2
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    : selectedService
                    ? "text-slate-400 hover:text-white"
                    : "text-slate-600 cursor-not-allowed"
                }`}
              >
                <span className="w-5 h-5 rounded-full bg-slate-950/20 flex items-center justify-center text-[11px]">2</span>
                <span>Payment Details</span>
              </button>
            </div>
          </div>

          {/* STEP 1: SERVICE CATEGORIES GRID */}
          {activeStep === 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-heading font-bold text-white">
                    Step 1: Choose Your Service or Payment Type
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Select a standardized service package below, or choose Custom Payment for agreed milestones.
                  </p>
                </div>
                {selectedService && (
                  <button
                    onClick={() => setActiveStep(2)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 font-mono"
                  >
                    <span>Proceed with {selectedService.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {isLoadingCatalog ? (
                <div className="py-20 flex flex-col items-center justify-center gap-3">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-mono text-cyan-400 tracking-wider">LOADING SERVICE CATALOG...</span>
                </div>
              ) : loadError ? (
                <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-sm max-w-lg mx-auto text-center">
                  <AlertCircle className="w-6 h-6 mx-auto mb-2 text-red-400" />
                  <p>{loadError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {services.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const icon = SERVICE_ICONS[service.iconName || ""] || <CreditCard className="w-5 h-5 text-cyan-400" />;

                    return (
                      <div
                        key={service.id}
                        className={`group relative rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between ${
                          isSelected
                            ? "bg-slate-900/95 border-2 border-cyan-400 shadow-[0_0_35px_rgba(0,240,255,0.25)] -translate-y-1"
                            : "bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 hover:border-slate-700 hover:-translate-y-0.5"
                        }`}
                      >
                        {/* Top Badge */}
                        {service.badge && (
                          <div className="absolute top-4 right-4">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/40">
                              {service.badge}
                            </span>
                          </div>
                        )}

                        <div>
                          {/* Icon & Name */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60 group-hover:scale-105 transition-transform">
                              {icon}
                            </div>
                            <h3 className="font-heading text-base font-bold text-white group-hover:text-cyan-300 transition-colors pr-12">
                              {service.name}
                            </h3>
                          </div>

                          {/* Short Description */}
                          <p className="text-xs text-slate-400 leading-relaxed mb-4 min-h-[36px]">
                            {service.shortDescription}
                          </p>

                          {/* Breakdown if configured */}
                          {service.breakdown && service.breakdown.length > 0 && (
                            <div className="mb-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                                Package Breakdown:
                              </span>
                              {service.breakdown.map((item, i) => (
                                <div key={i} className="flex justify-between text-slate-300">
                                  <span>• {item.label}</span>
                                  <span className="text-cyan-300 font-bold">₹{item.amount.toLocaleString("en-IN")}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Price & CTA */}
                        <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">
                              {service.pricingType === "custom" ? "Custom Amount" : service.billingCycle === "monthly" ? "Monthly Retainer" : "Fixed Total"}
                            </span>
                            <span className="text-xl font-heading font-extrabold text-white">
                              {service.pricingType === "custom" ? (
                                <span className="text-cyan-400 text-sm font-mono">Min ₹{service.minAmount || 500}</span>
                              ) : (
                                `₹${service.amount.toLocaleString("en-IN")}`
                              )}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSelectService(service)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isSelected
                                ? "bg-cyan-400 text-slate-950 font-extrabold shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                                : "bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200"
                            }`}
                          >
                            <span>{isSelected ? "Selected" : "Select Service"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* STEP 2: CHECKOUT FORM & SUMMARY */}
          {activeStep === 2 && selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-5xl mx-auto"
            >
              <div className="mb-6 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="inline-flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Service Selection</span>
                </button>
                <div className="text-xs font-mono text-cyan-400 font-semibold">
                  Step 2 of 2 • Client Verification
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Form Column (7 cols) */}
                <div className="lg:col-span-7">
                  <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
                    <h2 className="text-xl font-heading font-bold text-white mb-1">
                      Billing & Project Information
                    </h2>
                    <p className="text-xs text-slate-400 mb-6">
                      Provide your official details for receipt generation and project account association.
                    </p>

                    {formError && (
                      <div className="mb-6 p-4 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5">
                        <AlertCircle className="w-4 h-4 shrink-0 text-red-400 mt-0.5" />
                        <span>{formError}</span>
                      </div>
                    )}

                    <form onSubmit={handleProceedToPayment} className="space-y-4">
                      {/* Full Name */}
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                          Full Name <span className="text-cyan-400">*</span>
                        </label>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Rahul Verma"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                          />
                        </div>
                      </div>

                      {/* Contact Row (Mobile & Email) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                            Mobile Number <span className="text-cyan-400">*</span>
                          </label>
                          <div className="relative">
                            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                              type="tel"
                              required
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value)}
                              placeholder="+91 98765 43210"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                            Email Address <span className="text-cyan-400">*</span>
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                            <input
                              type="email"
                              required
                              value={emailAddress}
                              onChange={(e) => setEmailAddress(e.target.value)}
                              placeholder="client@company.com"
                              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Company Name */}
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                          Company / Business Name <span className="text-slate-500 text-[10px]">(Optional)</span>
                        </label>
                        <div className="relative">
                          <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                          <input
                            type="text"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. Verma Luxury Safaris Pvt Ltd"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                          />
                        </div>
                      </div>

                      {/* Custom Payment Amount Input if applicable */}
                      {selectedService.pricingType === "custom" && (
                        <div>
                          <label className="block text-xs font-mono font-semibold text-cyan-300 mb-1.5">
                            Agreed Payment Amount (₹ INR) <span className="text-cyan-400">*</span>
                          </label>
                          <div className="relative">
                            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono font-bold text-sm">
                              ₹
                            </span>
                            <input
                              type="number"
                              required
                              min={selectedService.minAmount || 500}
                              max={10000000}
                              value={customAmount}
                              onChange={(e) => setCustomAmount(e.target.value)}
                              placeholder={`Min ${selectedService.minAmount || 500}`}
                              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-mono font-bold transition-all"
                            />
                          </div>
                          <span className="text-[11px] font-mono text-slate-500 mt-1 block">
                            Enter the specific milestone amount agreed with your NextGen project manager.
                          </span>
                        </div>
                      )}

                      {/* Project / Payment Description */}
                      <div>
                        <label className="block text-xs font-mono font-semibold text-slate-300 mb-1.5">
                          Project / Payment Scope & Notes <span className="text-cyan-400">*</span>
                        </label>
                        <div className="relative">
                          <FileText className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-500" />
                          <textarea
                            required
                            rows={3}
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Briefly describe what this payment covers (e.g. Kickoff deposit for travel booking site revamping, Q4 Meta Ads management retainer, etc.)"
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/90 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans transition-all"
                          />
                        </div>
                      </div>

                      {/* Pay Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting || getPayableAmount() <= 0}
                        className="w-full mt-4 py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-heading font-extrabold text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(0,240,255,0.35)] flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Connecting Secure Razorpay Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4" />
                            <span>Pay ₹{getPayableAmount().toLocaleString("en-IN")} Securely</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>

                {/* Order Summary Column (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Summary Card */}
                  <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl backdrop-blur-xl">
                    <h3 className="text-base font-heading font-bold text-white mb-4 pb-3 border-b border-slate-800 flex items-center justify-between">
                      <span>Order Summary</span>
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-500/30">
                        {selectedService.pricingType === "fixed" ? "Fixed Pricing" : "Custom Scope"}
                      </span>
                    </h3>

                    {/* Selected Service Pill */}
                    <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-mono text-slate-500 block uppercase">Selected Service</span>
                        <h4 className="text-sm font-heading font-bold text-white">{selectedService.name}</h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="text-[11px] font-mono text-cyan-400 hover:underline"
                      >
                        Change
                      </button>
                    </div>

                    {/* Itemized Breakdown (especially Token Money + Domain & Hosting) */}
                    {selectedService.breakdown && selectedService.breakdown.length > 0 ? (
                      <div className="space-y-2 mb-4 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Itemized Cost Breakdown:
                        </span>
                        {selectedService.breakdown.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-slate-300">
                            <span>{item.label}</span>
                            <span className="text-white font-bold">₹{item.amount.toLocaleString("en-IN")}</span>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {/* Fee Summary */}
                    <div className="space-y-2 text-xs font-mono py-3 border-t border-b border-slate-800">
                      <div className="flex justify-between text-slate-400">
                        <span>Base Subtotal</span>
                        <span className="text-white">₹{getPayableAmount().toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Gateway Processing Fee</span>
                        <span className="text-emerald-400 font-semibold">₹0 (Waived)</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>Applicable Taxes / GST</span>
                        <span className="text-slate-300">Included in Quote</span>
                      </div>
                    </div>

                    {/* Total Amount Due */}
                    <div className="pt-4 flex items-center justify-between">
                      <span className="font-heading font-bold text-slate-200 text-sm">Total Due Now</span>
                      <span className="text-2xl font-heading font-extrabold text-cyan-400">
                        ₹{getPayableAmount().toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Razorpay Trust Box */}
                  <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 space-y-3">
                    <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
                      <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Razorpay Verified Merchant</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      NextGen Digital Solutions operates authorized Razorpay merchant rails. Payments are processed in real-time with zero card details stored on our servers.
                    </p>
                    <div className="pt-2 flex items-center gap-4 text-[10px] font-mono text-slate-400">
                      <span>• RBI Compliant</span>
                      <span>• PCI-DSS Level 1</span>
                      <span>• UPI 2.0</span>
                    </div>
                  </div>

                  {/* Need Help Box */}
                  <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/60 text-xs flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-300">
                      <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span>Need help with custom amount?</span>
                    </div>
                    <a
                      href="https://wa.me/918340424989?text=Hello%20NextGen%2C%20I%20have%20a%20question%20about%20online%20payment"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 font-bold hover:underline font-mono"
                    >
                      WhatsApp Us
                    </a>
                  </div>

                </div>

              </div>
            </motion.div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  );
}
