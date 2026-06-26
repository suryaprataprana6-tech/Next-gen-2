import React, { useState, useRef, useEffect } from 'react';

// Icon mapping for suggestion chips
const chipIcons = {
  'Website Development': '🌐',
  'SEO Services': '📈',
  'Digital Marketing': '📢',
  'Pricing': '💰',
  'Portfolio': '💼',
  'Contact Us': '📞',
  'Google Ads': '📊',
  'Meta Ads': '📱',
  'Branding': '🎨',
  'AI Automation': '🤖',
};

function getChipIcon(text) {
  for (const [key, icon] of Object.entries(chipIcons)) {
    if (text.toLowerCase().includes(key.toLowerCase())) return icon;
  }
  return '💬';
}

export default function ChatInput({ onSend, disabled, suggestions, onSuggestionClick }) {
  const [input, setInput] = useState('');
  const inputRef = useRef(null);

  // Auto-focus input when enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput('');
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Suggestion Chips */}
      {suggestions && suggestions.length > 0 && (
        <div className="chatbot-suggestions">
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="chatbot-chip"
              onClick={() => onSuggestionClick(suggestion)}
              disabled={disabled}
            >
              <span className="chatbot-chip-icon">{getChipIcon(suggestion)}</span>
              {suggestion}
            </button>
          ))}
        </div>
      )}

      {/* Input Area */}
      <div className="chatbot-input-area">
        <input
          ref={inputRef}
          type="text"
          className="chatbot-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          autoComplete="off"
        />
        <button
          className="chatbot-send-btn"
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          aria-label="Send message"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>

      {/* Powered by */}
      <div className="chatbot-powered">
        Powered by <span>NextGen Digital AI</span>
      </div>
    </>
  );
}
