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
  Calculator,
  Info,
  X,
  FileCode2,
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

// Indian Currency Number to Words Converter
function numberToIndianWords(num: number): string {
  if (!num || isNaN(num) || num <= 0) return "";
  const a = [
    "", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ",
    "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "
  ];
  const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  function inWords(n: number): string {
    let str = "";
    if (n > 19) {
      str += b[Math.floor(n / 10)] + " " + a[n % 10];
    } else {
      str += a[n];
    }
    return str.trim();
  }

  let words = "";
  const crore = Math.floor(num / 10000000);
  num %= 10000000;
  const lakh = Math.floor(num / 100000);
  num %= 100000;
  const thousand = Math.floor(num / 1000);
  num %= 1000;
  const hundred = Math.floor(num / 100);
  const remaining = num % 100;

  if (crore > 0) words += inWords(crore) + " Crore ";
  if (lakh > 0) words += inWords(lakh) + " Lakh ";
  if (thousand > 0) words += inWords(thousand) + " Thousand ";
  if (hundred > 0) words += inWords(hundred) + " Hundred ";
  if (remaining > 0) {
    if (words !== "") words += "and ";
    words += inWords(remaining);
  }

  return words.trim() + " Rupees Only";
}

export default function PayOnlinePage() {
  const router = useRouter();

  // Catalog and selection states
  const [services, setServices] = useState<ServiceCategory[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [settings, setSettings] = useState<any>(null);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [isLoadingCatalog, setIsLoadingCatalog] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Customer form inputs
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [customAmount, setCustomAmount] = useState<string>("");
  const [totalProjectValue, setTotalProjectValue] = useState<string>("");
  const [paymentPurpose, setPaymentPurpose] = useState<string>("");
  const [projectReference, setProjectReference] = useState<string>("");

  // Modals & Navigation
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [activeStep, setActiveStep] = useState<1 | 2>(1); // 1 = Select Service, 2 = Enter Details & Pay

  // Fetch service catalog & settings on mount
  useEffect(() => {
    async function loadCatalog() {
      setIsLoadingCatalog(true);
      try {
        const res = await fetch("/api/payments/catalog");
        const data = await res.json();
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
          if (data.settings) setSettings(data.settings);
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
      const defaultMin = service.minAmount || settings?.minCustomAmount || 500;
      setCustomAmount(String(defaultMin));
    }
    setActiveStep(2);
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

  // Calculate remaining balance preview
  const getRemainingBalancePreview = () => {
    const total = parseFloat(totalProjectValue);
    const payable = getPayableAmount();
    if (!isNaN(total) && total > payable) {
      return total - payable;
    }
    return 0;
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
      setFormError("Please complete all required fields (Name, Mobile, Email, and Project Overview).");
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
      const min = selectedService.minAmount || settings?.minCustomAmount || 500;
      const max = selectedService.maxAmount || settings?.maxCustomAmount || 500000;
      if (payableAmount < min) {
        setFormError(`Custom payment amount must be at least ₹${min.toLocaleString("en-IN")}.`);
        return;
      }
      if (payableAmount > max) {
        setFormError(`Custom payment amount cannot exceed ₹${max.toLocaleString("en-IN")}.`);
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

      const totalVal = parseFloat(totalProjectValue);

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
          totalProjectAmount: !isNaN(totalVal) && totalVal > payableAmount ? totalVal : undefined,
          purpose: paymentPurpose || (selectedService.pricingType === "custom" ? projectDescription : undefined),
          projectReference: projectReference || undefined,
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
          purpose: paymentPurpose || "General Booking",
        },
        theme: {
          color: "#06b6d4", // Cyan 500
        },
        modal: {
          ondismiss: async function () {
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
          try {
            // 4. Verify payment on server with cryptographic HMAC-SHA256 signature
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
              // 5. Redirect to Verified Success Page
              router.push(`/payment-success?receiptNumber=${encodeURIComponent(receiptNumber)}`);
            } else {
              router.push(
                `/payment-failed?orderId=${encodeURIComponent(orderId)}&reason=${encodeURIComponent(
                  verifyData.error || "Cryptographic signature validation rejected by server."
                )}`
              );
            }
          } catch (verifyErr: any) {
            router.push(
              `/payment-failed?orderId=${encodeURIComponent(orderId)}&reason=${encodeURIComponent(
                verifyErr.message || "Network exception during verification."
              )}`
            );
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on("payment.failed", function (failResp: any) {
        console.error("Payment failed callback:", failResp.error);
        router.push(
          `/payment-failed?orderId=${encodeURIComponent(orderId)}&reason=${encodeURIComponent(
            failResp.error?.description || "Transaction failed or was declined by issuing bank."
          )}`
        );
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment flow initialization error:", err);
      setFormError(err.message || "Payment initialization failed. Please try again.");
      setIsSubmitting(false);
    }
  };

  const categories = [
    { id: "all", label: "All Services" },
    { id: "kickoff", label: "Kickoff / Token" },
    { id: "development", label: "Web Development" },
    { id: "marketing", label: "Performance Marketing" },
    { id: "maintenance", label: "Maintenance" },
    { id: "creative", label: "Creative & Design" },
    { id: "custom", label: "Custom / Milestone" },
  ];

  const filteredServices = services.filter((s) => categoryFilter === "all" || s.category === categoryFilter);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-slate-950">
      
      {/* Top Navbar */}
      <Navbar />

      <main className="flex-1 pt-28 pb-20 relative overflow-hidden">
        
        {/* Ambient Radial Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-cyan-500/10 blur-[150px] pointer-events-none -z-10" />
        <div className="absolute top-2/3 right-10 w-[400px] h-[400px] bg-blue-600/10 blur-[140px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* Header & Trust Highlights */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-mono font-bold bg-cyan-950/70 border border-cyan-400/40 text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>OFFICIAL NEXTGEN SECURE PAYMENT PORTAL</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-heading font-extrabold text-white tracking-tight">
              Pay Online & <span className="text-gradient">Lock Your Project</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Book kickoff tokens, recurring service retainers, hosting setups, or milestone disbursements with instant Razorpay bank-grade checkout.
            </p>

            {/* Badges / Guarantees */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>256-Bit SSL Encrypted</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>Instant GST Receipt</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>UPI • Cards • NetBanking • EMI</span>
              </span>
            </div>
          </div>

          {/* Stepper Progress Indicator */}
          <div className="max-w-md mx-auto flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                activeStep === 1
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  : "bg-slate-900 border border-slate-800 text-slate-400"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">1</span>
              <span>Select Service</span>
            </button>

            <div className="w-8 h-px bg-slate-800" />

            <button
              type="button"
              onClick={() => {
                if (selectedService) setActiveStep(2);
              }}
              disabled={!selectedService}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-mono font-bold transition-all ${
                activeStep === 2
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)]"
                  : selectedService
                  ? "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
                  : "bg-slate-950 border border-slate-900 text-slate-600 cursor-not-allowed"
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-slate-950/30 flex items-center justify-center text-[10px]">2</span>
              <span>Payment Details</span>
            </button>
          </div>

          {/* ==================================================== */}
          {/* STEP 1: SERVICE CATEGORIES SELECTION                 */}
          {/* ==================================================== */}
          {activeStep === 1 && (
            <div className="space-y-6">
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-heading font-extrabold text-white">
                    Step 1: Choose Your Service or Payment Type
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                    Select a standardized service package below, or choose Custom Payment for agreed milestones.
                  </p>
                </div>

                {/* Category Filter Pills */}
                <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-900/80 border border-slate-800">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                        categoryFilter === cat.id
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {isLoadingCatalog ? (
                <div className="py-20 text-center space-y-3">
                  <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs font-mono text-slate-400">Loading verified service catalog...</p>
                </div>
              ) : loadError ? (
                <div className="p-6 rounded-2xl bg-red-950/30 border border-red-500/30 text-center space-y-2">
                  <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
                  <p className="text-sm text-red-300 font-sans">{loadError}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredServices.map((service) => {
                    const isSelected = selectedService?.id === service.id;
                    const isCustom = service.pricingType === "custom";
                    const isToken = service.id === "token_money";
                    const isTokenHosting = service.id === "token_domain_hosting";

                    return (
                      <motion.div
                        key={service.id}
                        whileHover={{ y: -4 }}
                        transition={{ duration: 0.2 }}
                        onClick={() => handleSelectService(service)}
                        className={`cursor-pointer rounded-2xl p-6 border transition-all flex flex-col justify-between relative group ${
                          isSelected
                            ? "bg-slate-900/90 border-cyan-400 shadow-[0_0_30px_rgba(0,240,255,0.25)]"
                            : "bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80"
                        }`}
                      >
                        {/* Glow Gradient Highlight */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-cyan-500/10 transition-colors" />

                        <div className="space-y-4">
                          
                          {/* Header: Icon & Badge */}
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center">
                              {SERVICE_ICONS[service.iconName || "Code"] || <Code className="w-5 h-5 text-cyan-400" />}
                            </div>

                            <div className="flex items-center gap-1.5">
                              {service.badge && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-400/30 uppercase tracking-wider">
                                  {service.badge}
                                </span>
                              )}
                              {isToken && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-mono bg-emerald-950 text-emerald-300 border border-emerald-500/30 uppercase">
                                  Fixed Deposit
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Service Title & Description */}
                          <div>
                            <h3 className="text-lg font-heading font-bold text-white group-hover:text-cyan-300 transition-colors">
                              {service.name}
                            </h3>
                            <p className="text-xs text-slate-400 font-sans leading-relaxed mt-1.5">
                              {service.shortDescription}
                            </p>
                          </div>

                          {/* Breakdown list if present */}
                          {service.breakdown && service.breakdown.length > 0 && (
                            <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 text-xs font-mono">
                              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                                Package Breakdown:
                              </span>
                              {service.breakdown.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-slate-300">
                                  <span className="truncate pr-2">• {item.label}</span>
                                  <strong className="text-slate-100">₹{item.amount.toLocaleString("en-IN")}</strong>
                                </div>
                              ))}
                            </div>
                          )}

                        </div>

                        {/* Price & Select CTA */}
                        <div className="pt-5 mt-6 border-t border-slate-800/80 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono uppercase text-slate-500">
                              {service.billingCycle === "monthly"
                                ? "Monthly Retainer"
                                : isCustom
                                ? "Flexible Amount"
                                : isToken
                                ? "Fixed Advance"
                                : "Fixed Total"}
                            </span>
                            <div className="text-xl font-heading font-extrabold text-white">
                              {isCustom ? (
                                <span className="text-base text-cyan-400 font-mono">
                                  Min ₹{(service.minAmount || 500).toLocaleString("en-IN")}
                                </span>
                              ) : (
                                <>
                                  ₹{service.amount.toLocaleString("en-IN")}
                                  {service.billingCycle === "monthly" && (
                                    <span className="text-xs text-slate-400 font-normal"> /mo</span>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectService(service);
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                              isSelected
                                ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]"
                                : "bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700"
                            }`}
                          >
                            <span>{isSelected ? "Selected" : "Select Service"}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* ==================================================== */}
          {/* STEP 2: CUSTOMER BILLING & CHECKOUT FORM             */}
          {/* ==================================================== */}
          {activeStep === 2 && selectedService && (
            <div className="max-w-4xl mx-auto space-y-8">
              
              {/* Back to Step 1 & Selected Summary Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Choose a different service</span>
                </button>

                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Selected Package:</span>
                  <strong className="text-white bg-slate-800 px-2.5 py-1 rounded-lg">
                    {selectedService.name}
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Left Column (7 cols): Customer Billing Form */}
                <div className="lg:col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 sm:p-8 space-y-6 shadow-xl">
                  
                  <div>
                    <h3 className="text-xl font-heading font-extrabold text-white">
                      Step 2: Client & Project Details
                    </h3>
                    <p className="text-xs text-slate-400 font-sans mt-0.5">
                      Your details are used to issue your verified digital invoice and initiate project onboarding.
                    </p>
                  </div>

                  {formError && (
                    <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs font-mono flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs font-sans">
                    
                    {/* Full Name */}
                    <div>
                      <label className="block text-slate-300 font-mono uppercase text-[11px] mb-1.5">
                        Client Full Name *
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. Vikram Singhania"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-sans"
                        />
                      </div>
                    </div>

                    {/* Email and Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-mono uppercase text-[11px] mb-1.5">
                          Email Address (for Receipt) *
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="email"
                            required
                            placeholder="vikram@enterprise.com"
                            value={emailAddress}
                            onChange={(e) => setEmailAddress(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-mono uppercase text-[11px] mb-1.5">
                          Mobile Number (10 Digits) *
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="tel"
                            required
                            maxLength={15}
                            placeholder="98765 43210"
                            value={mobileNumber}
                            onChange={(e) => setMobileNumber(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Company / Brand Name */}
                    <div>
                      <label className="block text-slate-300 font-mono uppercase text-[11px] mb-1.5">
                        Company / Business Name (Optional)
                      </label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          placeholder="e.g. Singhania Ventures Pvt Ltd"
                          value={companyName}
                          onChange={(e) => setCompanyName(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-sans"
                        />
                      </div>
                    </div>

                    {/* If Custom Payment: Custom Amount Input */}
                    {selectedService.pricingType === "custom" && (
                      <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-3">
                        <label className="block text-purple-300 font-mono uppercase text-[11px] font-bold">
                          Custom Payment Amount (INR) *
                        </label>
                        <div className="relative">
                          <span className="text-lg font-mono text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                            ₹
                          </span>
                          <input
                            type="number"
                            min={selectedService.minAmount || settings?.minCustomAmount || 500}
                            max={selectedService.maxAmount || settings?.maxCustomAmount || 500000}
                            required
                            placeholder="Enter payment amount"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            className="w-full pl-8 pr-4 py-3 rounded-xl bg-slate-950 border border-purple-500/40 text-lg font-mono font-extrabold text-white focus:outline-none focus:border-purple-400"
                          />
                        </div>

                        {/* Number to Indian Words Display */}
                        {parseFloat(customAmount) > 0 && (
                          <p className="text-[11px] font-mono text-purple-300 italic">
                            Amount in words: {numberToIndianWords(parseFloat(customAmount))}
                          </p>
                        )}

                        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                          <span>Minimum: ₹{(selectedService.minAmount || settings?.minCustomAmount || 500).toLocaleString("en-IN")}</span>
                          <span>Maximum: ₹{(selectedService.maxAmount || settings?.maxCustomAmount || 500000).toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}

                    {/* If Token Money: Optional Total Project Value for Balance Tracking */}
                    {selectedService.id.includes("token") && (
                      <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-cyan-300 font-mono uppercase text-[11px] font-bold flex items-center gap-1.5">
                            <Calculator className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Total Estimated Project Value (Optional)</span>
                          </label>
                          <span className="text-[10px] font-mono text-slate-400">Balance Tracker</span>
                        </div>
                        <div className="relative">
                          <span className="text-sm font-mono text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2">
                            ₹
                          </span>
                          <input
                            type="number"
                            placeholder="e.g. 50000 (total agreed contract value)"
                            value={totalProjectValue}
                            onChange={(e) => setTotalProjectValue(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        {getRemainingBalancePreview() > 0 && (
                          <div className="p-2.5 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                            <span className="text-slate-400">Remaining Balance upon Milestone Delivery:</span>
                            <strong className="text-amber-400">₹{getRemainingBalancePreview().toLocaleString("en-IN")}</strong>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Custom Purpose & Project Reference */}
                    {selectedService.pricingType === "custom" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-slate-300 font-mono uppercase text-[11px] mb-1.5">
                            Payment Purpose *
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Milestone 2 UI Delivery"
                            value={paymentPurpose}
                            onChange={(e) => setPaymentPurpose(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-sans text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-mono uppercase text-[11px] mb-1.5">
                            Quotation / Reference Code (Optional)
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. NGD-EST-2026-88"
                            value={projectReference}
                            onChange={(e) => setProjectReference(e.target.value)}
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400"
                          />
                        </div>
                      </div>
                    )}

                    {/* Project Description / Scope Summary */}
                    <div>
                      <label className="block text-slate-300 font-mono uppercase text-[11px] mb-1.5">
                        Project Scope / Requirements Summary *
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Briefly state your website goals, target audience, or specific deliverables for this kickoff..."
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 font-sans"
                      />
                    </div>

                    {/* Terms & Refund Policy Agreement Note */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                      <span>By proceeding, you agree to our booking terms.</span>
                      <button
                        type="button"
                        onClick={() => setIsTermsModalOpen(true)}
                        className="text-cyan-400 hover:text-cyan-300 underline"
                      >
                        Terms & Refund Policy
                      </button>
                    </div>

                    {/* Submit Pay Button */}
                    <div className="pt-3">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-heading font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,240,255,0.35)] transition-all active:scale-[0.99] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                            <span>Connecting with Razorpay Gateway...</span>
                          </>
                        ) : (
                          <>
                            <Lock className="w-4 h-4 text-slate-950" />
                            <span>
                              Pay ₹{getPayableAmount().toLocaleString("en-IN")} Securely Now
                            </span>
                            <ArrowRight className="w-4 h-4 text-slate-950" />
                          </>
                        )}
                      </button>
                    </div>

                  </form>

                </div>

                {/* Right Column (5 cols): Order Summary Card */}
                <div className="lg:col-span-5 space-y-6">
                  
                  <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-cyan-500/30 p-6 space-y-5 shadow-xl relative overflow-hidden">
                    
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 blur-2xl pointer-events-none" />

                    <div className="border-b border-slate-800 pb-4">
                      <span className="text-[10px] font-mono uppercase text-cyan-400 tracking-wider font-bold">
                        Transaction Order Summary
                      </span>
                      <h4 className="text-xl font-heading font-bold text-white mt-1">
                        {selectedService.name}
                      </h4>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">
                        {selectedService.shortDescription}
                      </p>
                    </div>

                    {/* Itemized Breakdown Table if present */}
                    {selectedService.breakdown && selectedService.breakdown.length > 0 && (
                      <div className="space-y-2 text-xs font-mono">
                        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                          Itemized Breakdown:
                        </span>
                        {selectedService.breakdown.map((item, i) => (
                          <div key={i} className="flex items-center justify-between text-slate-300 py-1 border-b border-slate-800/40">
                            <span>{item.label}</span>
                            <strong className="text-white">₹{item.amount.toLocaleString("en-IN")}</strong>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Total Project Amount & Remaining Balance Display */}
                    {getRemainingBalancePreview() > 0 && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs font-mono">
                        <div className="flex items-center justify-between text-slate-400">
                          <span>Total Project Value:</span>
                          <span className="text-white">₹{parseFloat(totalProjectValue).toLocaleString("en-IN")}</span>
                        </div>
                        <div className="flex items-center justify-between text-cyan-400">
                          <span>Kickoff Advance (Due Now):</span>
                          <span>- ₹{getPayableAmount().toLocaleString("en-IN")}</span>
                        </div>
                        <div className="pt-1.5 border-t border-slate-800 flex items-center justify-between text-amber-400 font-bold">
                          <span>Remaining Balance:</span>
                          <span>₹{getRemainingBalancePreview().toLocaleString("en-IN")}</span>
                        </div>
                      </div>
                    )}

                    {/* Grand Total Row */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-mono uppercase text-slate-400">Net Payable Amount</span>
                        <p className="text-[10px] text-slate-500 font-mono">Includes all applicable platform fees</p>
                      </div>
                      <div className="text-2xl font-mono font-extrabold text-cyan-400">
                        ₹{getPayableAmount().toLocaleString("en-IN")}
                      </div>
                    </div>

                    {/* Security Seals */}
                    <div className="pt-3 border-t border-slate-800/80 space-y-2 text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>Authenticated Razorpay REST Gateway</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-cyan-400 shrink-0" />
                        <span>Encrypted HMAC-SHA256 Server Verification</span>
                      </div>
                    </div>

                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

      </main>

      {/* ==================================================== */}
      {/* MODAL: TERMS & REFUND POLICY                         */}
      {/* ==================================================== */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-3xl bg-slate-900 border border-cyan-500/30 p-6 sm:p-8 space-y-4 max-h-[85vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Info className="w-4 h-4 text-cyan-400" />
                <span>NextGen Digital Solutions Terms & Refund Policy</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                <strong>1. Token Money & Project Kickoff:</strong> The Token Money deposit immediately reserves executive strategy calendar time, architecture scoping, and wireframe blueprint engineering.
              </p>
              <p>
                <strong>2. Refund Policy:</strong> Token deposits are 100% refundable if a cancellation request is submitted before technical scoping and kickoff blueprint commencement (within 48 hours of payment). Once active design or server provisioning has begun, work completed is pro-rated.
              </p>
              <p>
                <strong>3. Domain & Hosting:</strong> Commercial domains and dedicated cloud servers are registered and purchased instantly with domain registrars upon receipt. Third-party infrastructure costs are non-refundable once activated.
              </p>
              <p>
                <strong>4. Security & Cryptography:</strong> All payment details are processed through Razorpay's PCI-DSS Level 1 compliant secure infrastructure. NextGen Digital Solutions never stores credit card or CVV details.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(false)}
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold bg-cyan-500 text-slate-950 hover:bg-cyan-400"
              >
                I Understand & Agree
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer />

    </div>
  );
}
