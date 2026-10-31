import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#06080d] text-slate-100 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full text-center p-8 rounded-2xl bg-slate-900/60 border border-slate-800">
        <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30">
          404 — Not Found
        </span>
        <h1 className="text-3xl font-heading font-extrabold text-white mt-4">
          Page Not Available
        </h1>
        <p className="text-sm text-slate-400 mt-2 font-mono">
          The requested system node does not exist or has been relocated.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-colors"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

