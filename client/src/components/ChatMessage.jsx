import React from 'react';

// ─── Simple Markdown Parser ─────────────────────────────────────────
function parseMarkdown(text) {
  if (!text) return '';
  
  const lines = text.split('\n');
  const elements = [];
  let listItems = [];
  let listType = null;

  const flushList = () => {
    if (listItems.length > 0) {
      const Tag = listType === 'ol' ? 'ol' : 'ul';
      elements.push(
        <Tag key={`list-${elements.length}`}>
          {listItems.map((item, idx) => (
            <li key={idx}>{processInline(item)}</li>
          ))}
        </Tag>
      );
      listItems = [];
      listType = null;
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Unordered list items (•, -, *)
    const ulMatch = line.match(/^\s*[•\-\*]\s+(.+)/);
    if (ulMatch) {
      if (listType && listType !== 'ul') flushList();
      listType = 'ul';
      listItems.push(ulMatch[1]);
      continue;
    }

    // Ordered list items
    const olMatch = line.match(/^\s*\d+\.\s+(.+)/);
    if (olMatch) {
      if (listType && listType !== 'ol') flushList();
      listType = 'ol';
      listItems.push(olMatch[1]);
      continue;
    }

    flushList();
    if (line.trim() === '') continue;

    elements.push(
      <p key={`p-${elements.length}`}>{processInline(line)}</p>
    );
  }

  flushList();
  return elements;
}

// Process inline formatting (bold, italic, links, code)
function processInline(text) {
  if (!text) return '';
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const codeMatch = remaining.match(/`([^`]+)`/);

    let earliest = null;
    let earliestIdx = Infinity;

    if (boldMatch && remaining.indexOf(boldMatch[0]) < earliestIdx) {
      earliest = { type: 'bold', match: boldMatch };
      earliestIdx = remaining.indexOf(boldMatch[0]);
    }
    if (linkMatch && remaining.indexOf(linkMatch[0]) < earliestIdx) {
      earliest = { type: 'link', match: linkMatch };
      earliestIdx = remaining.indexOf(linkMatch[0]);
    }
    if (codeMatch && remaining.indexOf(codeMatch[0]) < earliestIdx) {
      earliest = { type: 'code', match: codeMatch };
      earliestIdx = remaining.indexOf(codeMatch[0]);
    }

    if (!earliest) { parts.push(remaining); break; }

    if (earliestIdx > 0) parts.push(remaining.substring(0, earliestIdx));

    if (earliest.type === 'bold') {
      parts.push(<strong key={keyIdx++}>{earliest.match[1]}</strong>);
    } else if (earliest.type === 'link') {
      parts.push(
        <a key={keyIdx++} href={earliest.match[2]} target="_blank" rel="noopener noreferrer">
          {earliest.match[1]}
        </a>
      );
    } else if (earliest.type === 'code') {
      parts.push(<code key={keyIdx++}>{earliest.match[1]}</code>);
    }

    remaining = remaining.substring(earliestIdx + earliest.match[0].length);
  }

  return parts;
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ─── ChatMessage Component ──────────────────────────────────────────
export default function ChatMessage({ message, showActions }) {
  const { role, content, timestamp } = message;
  const isUser = role === 'user';

  const shouldShowCTA = showActions && !isUser && (
    /connect with our expert|whatsapp.*call|expert se baat|एक्सपर्ट से बात/i.test(content)
  );

  return (
    <div className={`chat-message ${isUser ? 'user' : 'ai'}`}>
      {/* AI avatar beside message */}
      {!isUser && (
        <img 
          src="/support-avatar.png" 
          alt="AI Assistant" 
          className="chat-msg-avatar"
        />
      )}
      
      <div className="chat-msg-content">
        <div className="chat-bubble">
          {isUser ? content : parseMarkdown(content)}
        </div>
        
        {shouldShowCTA && (
          <div className="chat-action-buttons">
            <a
              href="https://wa.me/916209424989?text=Hi%2C%20I%27m%20interested%20in%20NextGen%20Digital%20services"
              target="_blank"
              rel="noopener noreferrer"
              className="chat-action-btn whatsapp"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              💬 WhatsApp
            </a>
            <a
              href="tel:+916209424989"
              className="chat-action-btn call"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
              📞 Call Now
            </a>
          </div>
        )}

        <span className="chat-timestamp">{formatTime(timestamp)}</span>
      </div>
    </div>
  );
}

// ─── Typing Indicator ───────────────────────────────────────────────
export function TypingIndicator() {
  return (
    <div className="typing-indicator-wrap">
      <img 
        src="/support-avatar.png" 
        alt="AI typing" 
        className="chat-msg-avatar"
      />
      <div className="typing-indicator">
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
        <div className="typing-dot"></div>
      </div>
    </div>
  );
}
