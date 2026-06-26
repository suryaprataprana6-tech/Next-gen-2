import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bot, MessageSquare, Calendar, Clock, AlertCircle, Eye, ArrowRight } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function ChatLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Selected conversation transcript modal
  const [activeLog, setActiveLog] = useState(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await axios.get(`${API_BASE_URL}/chatlogs`);
      if (response.data?.success) {
        setLogs(response.data.chatLogs);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch conversation logs from database");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const formatDuration = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  const getQuestionsCount = (messages) => {
    if (!messages) return 0;
    return messages.filter(m => m.role === "user").length;
  };

  return (
    <div className="flex flex-col gap-6 font-sans">
      
      {/* Header */}
      <div className="flex items-center justify-between text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-headings font-extrabold text-slate-800 dark:text-white tracking-tight">
            AI Chat Conversations
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Review transcripts of conversations between website visitors and NextGen AI assistant
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="text-xs font-bold text-primary bg-primary/10 hover:bg-primary/20 px-4 py-2 rounded-xl transition-all"
        >
          Refresh Logs
        </button>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-xl p-3 text-xs text-red-600 dark:text-red-400 flex items-center gap-2 text-left">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── CHAT LOGS LIST ───────────────────────────────────────────── */}
      {loading ? (
        <div className="p-10 flex flex-col items-center justify-center gap-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs text-slate-400 font-medium">Loading session logs...</p>
        </div>
      ) : logs.length === 0 ? (
        <div className="p-12 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl">
          <Bot className="w-12 h-12 text-slate-350 dark:text-slate-700 mb-3 animate-pulse" />
          <p className="text-sm font-bold text-slate-650 dark:text-slate-300 mb-1">No Conversations Logged</p>
          <p className="text-xs text-slate-450 max-w-xs">Chat conversations will automatically log here when visitors interact with the AI assistant.</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden text-left">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-850/50 border-b border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-500 uppercase tracking-wider select-none">
                  <th className="py-4 px-6">Visitor ID</th>
                  <th className="py-4 px-6">Interaction Date</th>
                  <th className="py-4 px-6">Chat Duration</th>
                  <th className="py-4 px-6">Questions asked</th>
                  <th className="py-4 px-6">Redirected to WhatsApp?</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-150 dark:divide-slate-800 text-xs">
                {logs.map((log, idx) => (
                  <tr key={log._id || idx} className="hover:bg-slate-50/40 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-850 dark:text-slate-250 flex items-center gap-2">
                      <Bot className="w-4 h-4 text-primary" />
                      <span>{log.visitorName || `Visitor #${log._id.slice(-4).toUpperCase()}`}</span>
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(log.createdAt).toLocaleString(undefined, { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-650 dark:text-slate-350">
                      {formatDuration(log.duration)}
                    </td>
                    <td className="py-4 px-6 font-bold text-primary">
                      {getQuestionsCount(log.messages)} user questions
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        log.redirectedToWhatsApp 
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400" 
                          : "bg-slate-50 text-slate-400 dark:bg-slate-850 dark:text-slate-500"
                      }`}>
                        {log.redirectedToWhatsApp ? "Yes (Clicked)" : "No"}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => setActiveLog(log)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-500 hover:text-primary hover:border-primary transition-all font-bold text-[10px]"
                      >
                        <Eye className="w-4.5 h-4.5" />
                        <span>View Chat Transcript</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ─── CHAT TRANSCRIPT VISUAL DIALOG ─────────────────────────────── */}
      {activeLog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/60 backdrop-blur-sm"
          onClick={() => setActiveLog(null)}
        >
          <div
            className="w-full max-w-[500px] h-[80vh] max-h-[600px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col justify-between shadow-2xl relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/20 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-headings font-extrabold text-sm text-slate-850 dark:text-white leading-none mb-1">
                    Transcript: {activeLog.visitorName}
                  </h3>
                  <div className="flex items-center gap-2 text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
                    <span className="flex items-center gap-0.5"><Clock className="w-2.5 h-2.5" /> {formatDuration(activeLog.duration)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-0.5"><Calendar className="w-2.5 h-2.5" /> {new Date(activeLog.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActiveLog(null)}
                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-850 flex items-center justify-center text-slate-500 hover:text-dark dark:hover:text-white transition-all"
              >
                ✕
              </button>
            </div>

            {/* Bubble Transcript view */}
            <div className="flex-grow p-4 overflow-y-auto flex flex-col gap-3.5 bg-slate-50/30 dark:bg-slate-950/20">
              {activeLog.messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div key={index} className={`flex flex-col max-w-[80%] ${isUser ? "ml-auto items-end" : "mr-auto items-start"}`}>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      {isUser ? "Visitor" : "AI Assistant"}
                    </span>
                    <div className={`p-3 rounded-2xl text-xs leading-relaxed font-normal shadow-sm ${
                      isUser
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-750 text-slate-800 dark:text-slate-200 rounded-tl-none"
                    }`}>
                      {msg.content}
                    </div>
                    <span className="text-[8px] text-slate-400 mt-1 block">
                      {new Date(msg.timestamp || activeLog.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/20 rounded-b-2xl">
              <span className="text-[10px] text-slate-450 font-medium">
                Redirected on WhatsApp: <span className="font-bold text-dark dark:text-white">{activeLog.redirectedToWhatsApp ? "Yes" : "No"}</span>
              </span>
              <button
                onClick={() => setActiveLog(null)}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-650 dark:text-slate-350 font-bold text-[10px] py-2 px-4 rounded-xl transition-all"
              >
                Close Transcript
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default ChatLogs;
