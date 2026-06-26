import React, { useState, useEffect, useRef, useCallback } from 'react';
import './chatbot.css';
import ChatMessage, { TypingIndicator } from './ChatMessage';
import ChatInput from './ChatInput';
import { processMessage } from '../chatbot/chatbotEngine';
import { useWebsite } from '../context/WebsiteContext';

const QUICK_REPLIES = [
  'Website Development',
  'SEO Services',
  'Digital Marketing',
  'Pricing',
  'Portfolio',
  'Contact Us',
];

const POPUP_SERVICES = [
  { icon: '🌐', label: 'Website Development' },
  { icon: '📢', label: 'Digital Marketing' },
  { icon: '📈', label: 'SEO' },
  { icon: '📊', label: 'Google Ads' },
  { icon: '📱', label: 'Meta Ads' },
  { icon: '🎨', label: 'Branding' },
  { icon: '🤖', label: 'AI Automation' },
  { icon: '💰', label: 'Pricing' },
];

const FIRST_MESSAGE = `👋 Hello!

Welcome to **NextGen Digital**.

I'm your AI Assistant. I can help you with:

🌐 Website Development
📈 SEO
📢 Google Ads
📱 Social Media Marketing
🤖 AI Automation
💼 Business Websites

How can I help you today?`;

export default function ChatBot() {
  const { logChat, settings } = useWebsite();

  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(QUICK_REPLIES);
  const [initialized, setInitialized] = useState(false);

  // Welcome popup state
  const [showPopup, setShowPopup] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const popupTimerRef = useRef(null);
  const autoHideTimerRef = useRef(null);

  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Stats / duration logger refs
  const startTimeRef = useRef(null);
  const messagesRef = useRef([]);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const saveChatSession = useCallback(async (redirected = false) => {
    // Only save if visitor asked questions (more than just the initial AI greeting)
    if (messagesRef.current.length > 1 && startTimeRef.current) {
      const duration = Math.floor((new Date() - startTimeRef.current) / 1000);
      try {
        await logChat("Visitor Chat", messagesRef.current, duration, redirected);
      } catch (err) {
        // Silent error handling
      }
    }
  }, [logChat]);

  // Show welcome popup after 4 seconds on first visit
  useEffect(() => {
    const alreadyShown = sessionStorage.getItem('chatbot-popup-shown');
    if (alreadyShown || isOpen) return;

    popupTimerRef.current = setTimeout(() => {
      setShowPopup(true);
      sessionStorage.setItem('chatbot-popup-shown', 'true');

      // Auto-hide after 15 seconds
      autoHideTimerRef.current = setTimeout(() => {
        setShowPopup(false);
        setPopupDismissed(true);
      }, 15000);
    }, 4000);

    return () => {
      clearTimeout(popupTimerRef.current);
      clearTimeout(autoHideTimerRef.current);
    };
  }, [isOpen]);

  // Initialize welcome message on first open
  useEffect(() => {
    if (isOpen && !initialized) {
      setMessages([{
        role: 'ai',
        content: FIRST_MESSAGE,
        timestamp: new Date()
      }]);
      setInitialized(true);
      startTimeRef.current = new Date();
    }
  }, [isOpen, initialized]);

  // Auto-scroll
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Save chat log on closing
  useEffect(() => {
    if (!isOpen && initialized) {
      saveChatSession(false);
    }
  }, [isOpen, initialized, saveChatSession]);

  // Save chat log on unmount
  useEffect(() => {
    return () => {
      saveChatSession(false);
    };
  }, [saveChatSession]);

  // Theme detection
  useEffect(() => {
    const savedTheme = localStorage.getItem('chatbot-theme');
    if (savedTheme) {
      setIsDark(savedTheme === 'dark');
    } else {
      setIsDark(window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
  }, []);

  // Toggle chat
  const openChat = useCallback(() => {
    setIsOpen(true);
    setShowPopup(false);
    setPopupDismissed(true);
    clearTimeout(autoHideTimerRef.current);
    clearTimeout(popupTimerRef.current);
  }, []);

  const toggleChat = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      openChat();
    }
  }, [isOpen, openChat]);

  // Dismiss popup
  const dismissPopup = useCallback(() => {
    setShowPopup(false);
    setPopupDismissed(true);
    clearTimeout(autoHideTimerRef.current);
  }, []);

  // Toggle dark/light
  const toggleTheme = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      localStorage.setItem('chatbot-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  // Send message
  const handleSend = useCallback(async (text) => {
    if (!text.trim() || isTyping) return;

    const userMessage = {
      role: 'user',
      content: text.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setSuggestions([]);
    setIsTyping(true);

    try {
      const history = [...messages, userMessage].map(m => ({
        role: m.role === 'ai' ? 'assistant' : m.role,
        content: m.content
      }));

      const response = await processMessage(text.trim(), history);

      const delay = response.source === 'gemini' ? 400 : 600 + Math.random() * 800;
      await new Promise(resolve => setTimeout(resolve, delay));

      setMessages(prev => [...prev, {
        role: 'ai',
        content: response.content,
        timestamp: new Date()
      }]);

      updateSuggestions(response.content, text);

      // Check if user redirected to WhatsApp from the AI's reply
      if (response.content.toLowerCase().includes("whatsapp")) {
        // Save log with redirected WhatsApp true
        saveChatSession(true);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const phoneNum = settings?.contactDetails?.phone || "+91 6209424989";
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `I'm sorry, I encountered an error. Please try again or contact us directly at **${phoneNum}**.`,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  }, [messages, isTyping, settings, saveChatSession]);

  // Update suggestions based on context
  const updateSuggestions = useCallback((aiResponse, userMessage) => {
    const lower = aiResponse.toLowerCase();

    if (/price|cost|quotation|budget|₹/i.test(lower)) {
      setSuggestions(['Contact Us', 'Portfolio', 'Website Development']);
      return;
    }
    if (/services.*offer|range.*services/i.test(lower)) {
      setSuggestions(['Website Development', 'SEO Services', 'Google Ads', 'Pricing']);
      return;
    }
    if (/portfolio|project/i.test(userMessage.toLowerCase())) {
      setSuggestions(['Pricing', 'Contact Us', 'Website Development']);
      return;
    }
    if (/connect.*expert|whatsapp|contact/i.test(lower)) {
      setSuggestions(['Website Development', 'Digital Marketing', 'Portfolio']);
      return;
    }
    setSuggestions(QUICK_REPLIES.slice(0, 4));
  }, []);

  const handleSuggestionClick = useCallback((suggestion) => {
    handleSend(suggestion);
  }, [handleSend]);

  return (
    <div className={`chatbot-widget ${isDark ? 'dark-mode' : ''}`}>

      {/* WELCOME POPUP */}
      {!isOpen && !popupDismissed && (
        <div className={`chatbot-welcome-popup ${showPopup ? 'is-visible' : ''}`}>
          <button className="chatbot-welcome-close" onClick={dismissPopup} aria-label="Close popup">
            ✕
          </button>

          <span className="chatbot-welcome-wave">👋</span>
          <h4 className="chatbot-welcome-title">Hi! I am here to help you.</h4>
          <p className="chatbot-welcome-subtitle">Ask me anything about</p>

          <div className="chatbot-welcome-services">
            {POPUP_SERVICES.map((s, i) => (
              <span key={i} className="chatbot-welcome-tag">
                {s.icon} {s.label}
              </span>
            ))}
          </div>

          <div className="chatbot-welcome-actions">
            <button className="chatbot-welcome-btn primary" onClick={openChat}>
              💬 Start Chat
            </button>
            <button className="chatbot-welcome-btn secondary" onClick={dismissPopup}>
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* FLOATING AVATAR BUTTON */}
      <button
        className={`chatbot-avatar-btn ${isOpen ? 'is-open' : ''}`}
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        id="chatbot-toggle"
      >
        <img 
          src="/support-avatar.png" 
          alt="Chat with us" 
          className="chatbot-avatar-img"
        />
        <div className="chatbot-close-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </div>
        {!isOpen && <div className="chatbot-avatar-status" />}
      </button>

      {/* CHAT WINDOW */}
      <div className={`chatbot-window ${isOpen ? 'is-open' : ''}`} role="dialog" aria-label="Chat with NextGen Digital AI">

        {/* Header */}
        <div className="chatbot-header">
          <div className="chatbot-header-info">
            <img 
              src="/support-avatar.png" 
              alt="NextGen AI" 
              className="chatbot-header-avatar"
            />
            <div className="chatbot-header-text">
              <h3>NextGen AI Assistant</h3>
              <div className="chatbot-header-meta">
                <div className="chatbot-header-dot"></div>
                <span>Online</span>
              </div>
              <div className="chatbot-header-subtitle">Usually replies instantly</div>
            </div>
          </div>
          <div className="chatbot-header-actions">
            {/* Theme toggle */}
            <button
              className="chatbot-header-btn"
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Light mode' : 'Dark mode'}
            >
              {isDark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>
            {/* Minimize */}
            <button
              className="chatbot-header-btn"
              onClick={toggleChat}
              aria-label="Minimize chat"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages" ref={messagesContainerRef}>
          {messages.map((msg, idx) => (
            <ChatMessage
              key={idx}
              message={msg}
              showActions={idx === messages.length - 1}
            />
          ))}
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <ChatInput
          onSend={handleSend}
          disabled={isTyping}
          suggestions={suggestions}
          onSuggestionClick={handleSuggestionClick}
        />
      </div>
    </div>
  );
}
