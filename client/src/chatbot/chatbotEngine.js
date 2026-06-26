// NextGen Digital - Chatbot Engine
// Gemini API integration with intelligent rule-based fallback

import { SYSTEM_PROMPT, SERVICES, PORTFOLIO, COMPANY_INFO } from './chatbotKnowledge';

// ─── Language Detection ────────────────────────────────────────────
function detectLanguage(text) {
  const hindiRegex = /[\u0900-\u097F]/;
  if (hindiRegex.test(text)) return 'hi';
  
  // Common Hinglish words/patterns
  const hinglishPatterns = [
    /\b(kya|hai|hota|kaise|kitne|kitna|kab|kahan|mein|mujhe|humko|aapka|aapke|aapki)\b/i,
    /\b(chahiye|chahte|sakta|sakti|hoon|hain|tha|thi|the|kar|karo|karna|karti|karta)\b/i,
    /\b(bhi|aur|ya|se|ko|ka|ki|ke|pe|par|nahi|nahin|nhi|haan|ji)\b/i,
    /\b(banwana|banegi|banao|batao|bataye|dikhao|dikhaye|bata|dikha)\b/i,
    /\b(accha|theek|sahi|zaroor|zaruri|bahut|bohot|thoda|jyada|zyada)\b/i,
    /\b(paisa|paise|rupees|rupaye|budget|kitne|cost|rate|daam)\b/i,
    /\b(website|seo|ads|marketing)\s+(ki|ka|ke|me|mein)\b/i,
    /\b(mera|meri|mere|hamara|hamari|hamare|tumhara|tumhari)\b/i,
    /\b(milega|milegi|milenge|dedo|dena|lena|lenge)\b/i
  ];
  
  const hinglishScore = hinglishPatterns.reduce((score, pattern) => {
    return score + (pattern.test(text) ? 1 : 0);
  }, 0);
  
  if (hinglishScore >= 2) return 'hinglish';
  
  // Check for single Hinglish word matches with context
  if (hinglishScore === 1 && text.split(' ').length <= 8) return 'hinglish';
  
  return 'en';
}

// ─── Gemini API Integration ────────────────────────────────────────
async function callGeminiAPI(messages, userMessage) {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    return null; // Will fallback to rule-based
  }

  try {
    // Build conversation history for context
    const conversationHistory = messages
      .slice(-10) // Last 10 messages for context
      .map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

    // Add current user message
    conversationHistory.push({
      role: 'user',
      parts: [{ text: userMessage }]
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }]
          },
          contents: conversationHistory,
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
          },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
          ]
        })
      }
    );

    if (!response.ok) {
      console.warn('Gemini API error:', response.status);
      return null;
    }

    const data = await response.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return reply || null;
  } catch (error) {
    console.warn('Gemini API call failed:', error);
    return null;
  }
}

// ─── Rule-Based Fallback Engine ────────────────────────────────────
function findMatchingService(text) {
  const lowerText = text.toLowerCase();
  
  return SERVICES.filter(service => {
    const allKeywords = [
      ...service.keywords,
      ...(service.keywordsHinglish || []),
    ];
    return allKeywords.some(kw => lowerText.includes(kw.toLowerCase()));
  });
}

function generateFallbackResponse(userMessage) {
  const lang = detectLanguage(userMessage);
  const lowerMsg = userMessage.toLowerCase();
  const matchedServices = findMatchingService(userMessage);

  // ── Greeting ──
  if (/^(hi|hello|hey|hola|namaste|namaskar|namasté|howdy)\b/i.test(lowerMsg) ||
      /^(नमस्ते|नमस्कार|हेलो|हाय)/i.test(userMessage)) {
    const responses = {
      en: "Hello! 👋 Welcome to **NextGen Digital**. I'm here to help you with our digital marketing services. What can I assist you with today?",
      hi: "नमस्ते! 👋 **NextGen Digital** में आपका स्वागत है। मैं आपकी डिजिटल मार्केटिंग सेवाओं में मदद करने के लिए यहाँ हूँ। आज मैं आपकी कैसे मदद कर सकती हूँ?",
      hinglish: "Hello! 👋 **NextGen Digital** mein aapka swagat hai. Main aapki digital marketing services mein madad karne ke liye yahan hoon. Aaj main aapki kaise help kar sakti hoon?"
    };
    return responses[lang];
  }

  // ── Services List ──
  if (/what.*(service|offer|provide|do you do)/i.test(lowerMsg) ||
      /services?\s*(kya|kaun|konsi|bata|list)/i.test(lowerMsg) ||
      /kya.*services/i.test(lowerMsg) ||
      /सेवाएं|सर्विसेज|क्या.*करते/i.test(userMessage)) {
    const serviceList = SERVICES.map(s => `• **${s.name}**`).join('\n');
    const responses = {
      en: `We offer a complete range of digital marketing services:\n\n${serviceList}\n\nWould you like to know more about any specific service?`,
      hi: `हम डिजिटल मार्केटिंग सेवाओं की पूरी श्रृंखला प्रदान करते हैं:\n\n${serviceList}\n\nक्या आप किसी विशेष सेवा के बारे में और जानना चाहेंगे?`,
      hinglish: `Hum complete range of digital marketing services offer karte hain:\n\n${serviceList}\n\nKya aap kisi specific service ke baare mein aur jaanna chahenge?`
    };
    return responses[lang];
  }

  // ── Portfolio ──
  if (/portfolio|work|project|client|case stud/i.test(lowerMsg) ||
      /dikhao|dikha|batao/i.test(lowerMsg) && /portfolio|kaam|work/i.test(lowerMsg) ||
      /पोर्टफोलियो|काम|प्रोजेक्ट/i.test(userMessage)) {
    const portfolioList = PORTFOLIO.map(p => `• **${p.name}** — ${p.type}`).join('\n');
    const responses = {
      en: `Here are some of our proud projects:\n\n${portfolioList}\n\nWe'd love to build something amazing for you too! What kind of project do you have in mind?`,
      hi: `यहाँ हमारे कुछ गर्व के प्रोजेक्ट्स हैं:\n\n${portfolioList}\n\nहम आपके लिए भी कुछ शानदार बनाना चाहेंगे! आपके मन में किस तरह का प्रोजेक्ट है?`,
      hinglish: `Yeh hain hamare kuch proud projects:\n\n${portfolioList}\n\nHum aapke liye bhi kuch amazing banana chahenge! Aapke mind mein kaisa project hai?`
    };
    return responses[lang];
  }

  // ── Contact ──
  if (/contact|reach|call|phone|whatsapp|email|number|connect/i.test(lowerMsg) ||
      /संपर्क|फोन|ईमेल|कॉल|नंबर/i.test(userMessage) ||
      /contact.*kar|baat.*kar|call.*kar|number.*de|email.*de/i.test(lowerMsg)) {
    const responses = {
      en: `You can reach us through:\n\n📞 **Phone:** ${COMPANY_INFO.phone}\n💬 **WhatsApp:** ${COMPANY_INFO.whatsapp}\n📧 **Email:** ${COMPANY_INFO.email}\n\nWould you like to connect with our expert right now?`,
      hi: `आप हमसे इन माध्यमों से संपर्क कर सकते हैं:\n\n📞 **फोन:** ${COMPANY_INFO.phone}\n💬 **WhatsApp:** ${COMPANY_INFO.whatsapp}\n📧 **ईमेल:** ${COMPANY_INFO.email}\n\nक्या आप अभी हमारे एक्सपर्ट से बात करना चाहेंगे?`,
      hinglish: `Aap humse in tareekon se contact kar sakte hain:\n\n📞 **Phone:** ${COMPANY_INFO.phone}\n💬 **WhatsApp:** ${COMPANY_INFO.whatsapp}\n📧 **Email:** ${COMPANY_INFO.email}\n\nKya aap abhi hamare expert se baat karna chahenge?`
    };
    return responses[lang];
  }

  // ── Pricing / Cost ──
  if (/price|cost|charge|rate|fee|how much|kitne|kitna|paisa|paise|budget|daam|kharcha/i.test(lowerMsg) ||
      /कीमत|कितने|कितना|पैसे|बजट|खर्च|दाम|रेट/i.test(userMessage)) {
    if (matchedServices.length > 0) {
      const service = matchedServices[0];
      const priceInfo = service.startingPrice;
      const responses = {
        en: `For **${service.name}**, ${priceInfo.includes('Custom') ? 'pricing depends on your specific requirements.' : `our pricing starts at **${priceInfo}**.`}\n\nThe exact cost depends on the scope, features, and complexity of your project. For a custom quotation tailored to your needs, please contact our team.\n\nMay I know more about your requirements?`,
        hi: `**${service.name}** के लिए, ${priceInfo.includes('Custom') ? 'कीमत आपकी विशेष आवश्यकताओं पर निर्भर करती है।' : `हमारी कीमत **${priceInfo}** से शुरू होती है।`}\n\nसही कीमत आपके प्रोजेक्ट के स्कोप, फीचर्स और जटिलता पर निर्भर करती है। कस्टम कोटेशन के लिए हमारी टीम से संपर्क करें।\n\nक्या मैं आपकी आवश्यकताओं के बारे में और जान सकती हूँ?`,
        hinglish: `**${service.name}** ke liye, ${priceInfo.includes('Custom') ? 'pricing aapki specific requirements par depend karti hai.' : `hamari pricing **${priceInfo}** se start hoti hai.`}\n\nExact cost aapke project ke scope, features aur complexity par depend karta hai. Custom quotation ke liye hamare team se contact karein.\n\nKya main aapki requirements ke baare mein aur jaan sakti hoon?`
      };
      return responses[lang];
    }
    const responses = {
      en: "Our pricing varies based on the service and your specific requirements. Could you tell me which service you're interested in? I can give you a better idea of the investment involved.",
      hi: "हमारी कीमत सेवा और आपकी विशेष आवश्यकताओं के आधार पर भिन्न होती है। क्या आप बता सकते हैं कि आप किस सेवा में रुचि रखते हैं? मैं आपको निवेश के बारे में बेहतर जानकारी दे सकती हूँ।",
      hinglish: "Hamari pricing service aur aapki specific requirements ke basis par vary karti hai. Kya aap bata sakte hain ki aap konsi service mein interested hain? Main aapko investment ke baare mein better idea de sakti hoon."
    };
    return responses[lang];
  }

  // ── Website specific ──
  if (/website|web\s*site|webpage|ecommerce|e-commerce|online store|redesign/i.test(lowerMsg) ||
      /वेबसाइट|ईकॉमर्स/i.test(userMessage)) {
    const isEcommerce = /ecommerce|e-commerce|online store|shop|dukaan|स्टोर|दुकान/i.test(lowerMsg + userMessage);
    const isRedesign = /redesign|revamp|redo|update|change|बदलना/i.test(lowerMsg + userMessage);
    
    if (isEcommerce) {
      const responses = {
        en: "Yes! We design and develop professional **ecommerce websites** with:\n\n• Payment gateway integration\n• Inventory management\n• Admin panel\n• Mobile responsive design\n• SEO optimized structure\n\nPricing starts at **₹15,000 onwards** depending on features. Would you like a custom quotation for your store?",
        hi: "जी हाँ! हम प्रोफेशनल **ईकॉमर्स वेबसाइट** बनाते हैं:\n\n• पेमेंट गेटवे इंटीग्रेशन\n• इन्वेंटरी मैनेजमेंट\n• एडमिन पैनल\n• मोबाइल रिस्पॉन्सिव डिज़ाइन\n• SEO ऑप्टिमाइज़्ड स्ट्रक्चर\n\nकीमत **₹15,000 से** शुरू होती है। क्या आप अपने स्टोर के लिए कस्टम कोटेशन चाहेंगे?",
        hinglish: "Haan! Hum professional **ecommerce websites** banate hain jisme:\n\n• Payment gateway integration\n• Inventory management\n• Admin panel\n• Mobile responsive design\n• SEO optimized structure\n\nPricing **₹15,000 onwards** se start hoti hai. Kya aap apne store ke liye custom quotation chahenge?"
      };
      return responses[lang];
    }
    
    if (isRedesign) {
      const responses = {
        en: "Absolutely! We can **redesign your existing website** with a modern, premium look. We'll improve the design, speed, mobile responsiveness, and SEO.\n\nCould you share your current website URL? That would help us give you a better idea of the scope and pricing.",
        hi: "बिल्कुल! हम आपकी **मौजूदा वेबसाइट को रीडिज़ाइन** कर सकते हैं, एक आधुनिक, प्रीमियम लुक के साथ। हम डिज़ाइन, स्पीड, मोबाइल रिस्पॉन्सिवनेस और SEO में सुधार करेंगे।\n\nक्या आप अपनी वर्तमान वेबसाइट का URL शेयर कर सकते हैं?",
        hinglish: "Bilkul! Hum aapki **existing website ko redesign** kar sakte hain with a modern, premium look. Hum design, speed, mobile responsiveness, aur SEO improve karenge.\n\nKya aap apni current website ka URL share kar sakte hain?"
      };
      return responses[lang];
    }
    
    const responses = {
      en: "We build **professional, custom websites** tailored to your business needs. Our websites are:\n\n• Mobile responsive\n• SEO optimized\n• Fast loading\n• Modern & premium design\n\nPricing starts at **₹15,000 onwards**. What kind of website do you need?",
      hi: "हम आपके बिजनेस की ज़रूरतों के अनुसार **प्रोफेशनल, कस्टम वेबसाइट** बनाते हैं:\n\n• मोबाइल रिस्पॉन्सिव\n• SEO ऑप्टिमाइज़्ड\n• फास्ट लोडिंग\n• मॉडर्न और प्रीमियम डिज़ाइन\n\nकीमत **₹15,000 से** शुरू होती है। आपको किस तरह की वेबसाइट चाहिए?",
      hinglish: "Hum aapke business ki needs ke according **professional, custom website** banate hain:\n\n• Mobile responsive\n• SEO optimized\n• Fast loading\n• Modern & premium design\n\nPricing **₹15,000 onwards** se start hoti hai. Aapko kaisi website chahiye?"
    };
    return responses[lang];
  }

  // ── SEO ──
  if (/\bseo\b|search engine|ranking|rank|google.*rank|organic/i.test(lowerMsg) ||
      /एसईओ|रैंकिंग|सर्च इंजन/i.test(userMessage)) {
    const responses = {
      en: "**SEO (Search Engine Optimization)** is the process of improving your website's visibility on Google search results.\n\nWe offer:\n• On-page SEO\n• Off-page SEO\n• Technical SEO\n• Local SEO\n• Keyword research & strategy\n\nSEO helps drive organic, long-term traffic to your website. Would you like to discuss an SEO strategy for your business?",
      hi: "**SEO (Search Engine Optimization)** एक प्रक्रिया है जिससे आपकी वेबसाइट Google सर्च रिजल्ट्स में ऊपर रैंक करती है।\n\nहम ऑफर करते हैं:\n• ऑन-पेज SEO\n• ऑफ-पेज SEO\n• टेक्निकल SEO\n• लोकल SEO\n• कीवर्ड रिसर्च और स्ट्रैटेजी\n\nSEO आपकी वेबसाइट पर ऑर्गेनिक, लंबे समय तक ट्रैफ़िक लाने में मदद करता है। क्या आप अपने बिजनेस के लिए SEO स्ट्रैटेजी पर चर्चा करना चाहेंगे?",
      hinglish: "**SEO (Search Engine Optimization)** ek process hai jisse aapki website Google search results mein upar rank karti hai.\n\nHum offer karte hain:\n• On-page SEO\n• Off-page SEO\n• Technical SEO\n• Local SEO\n• Keyword research & strategy\n\nSEO aapki website par organic, long-term traffic laane mein madad karta hai. Kya aap apne business ke liye SEO strategy discuss karna chahenge?"
    };
    return responses[lang];
  }

  // ── Google Ads ──
  if (/google\s*ads|ppc|adwords|google.*advertis|sem\b/i.test(lowerMsg) ||
      /गूगल एड्स/i.test(userMessage)) {
    const responses = {
      en: "Yes! We manage **Google Ads** campaigns for maximum ROI:\n\n• Google Search Ads\n• Display Ads\n• Shopping Ads\n• YouTube Ads\n• Remarketing campaigns\n\nWe handle everything from campaign setup to optimization. What's your advertising budget and business goal?",
      hi: "जी हाँ! हम अधिकतम ROI के लिए **Google Ads** कैम्पेन मैनेज करते हैं:\n\n• Google Search Ads\n• Display Ads\n• Shopping Ads\n• YouTube Ads\n• Remarketing campaigns\n\nहम कैम्पेन सेटअप से लेकर ऑप्टिमाइज़ेशन तक सब कुछ संभालते हैं। आपका विज्ञापन बजट और बिजनेस लक्ष्य क्या है?",
      hinglish: "Haan! Hum maximum ROI ke liye **Google Ads** campaigns manage karte hain:\n\n• Google Search Ads\n• Display Ads\n• Shopping Ads\n• YouTube Ads\n• Remarketing campaigns\n\nHum campaign setup se lekar optimization tak sab kuch handle karte hain. Aapka advertising budget aur business goal kya hai?"
    };
    return responses[lang];
  }

  // ── Matched a service but no specific category above ──
  if (matchedServices.length > 0) {
    const service = matchedServices[0];
    const responses = {
      en: `Great question! We offer professional **${service.name}** services.\n\n${service.description}\n\n${service.startingPrice.includes('Custom') ? 'Pricing depends on your specific requirements.' : `Pricing starts at **${service.startingPrice}**.`}\n\nWould you like to know more details or get a custom quotation?`,
      hi: `बढ़िया सवाल! हम प्रोफेशनल **${service.name}** सेवाएं प्रदान करते हैं।\n\n${service.description}\n\n${service.startingPrice.includes('Custom') ? 'कीमत आपकी विशेष आवश्यकताओं पर निर्भर करती है।' : `कीमत **${service.startingPrice}** से शुरू होती है।`}\n\nक्या आप और जानकारी चाहेंगे या कस्टम कोटेशन लेना चाहेंगे?`,
      hinglish: `Great question! Hum professional **${service.name}** services provide karte hain.\n\n${service.description}\n\n${service.startingPrice.includes('Custom') ? 'Pricing aapki specific requirements par depend karti hai.' : `Pricing **${service.startingPrice}** se start hoti hai.`}\n\nKya aap aur details jaanna chahenge ya custom quotation lena chahenge?`
    };
    return responses[lang];
  }

  // ── Thank you ──
  if (/thank|thanks|dhanyavad|shukriya|धन्यवाद|शुक्रिया/i.test(lowerMsg + userMessage)) {
    const responses = {
      en: "You're welcome! 😊 If you have any more questions about our services, feel free to ask. We're always here to help!\n\nWould you like to connect with our expert on WhatsApp?",
      hi: "आपका स्वागत है! 😊 अगर हमारी सेवाओं के बारे में कोई और सवाल हो, तो बेझिझक पूछें। हम हमेशा मदद के लिए यहाँ हैं!\n\nक्या आप WhatsApp पर हमारे एक्सपर्ट से बात करना चाहेंगे?",
      hinglish: "Aapka swagat hai! 😊 Agar hamari services ke baare mein koi aur sawaal ho, toh zaroor poochein. Hum hamesha help ke liye yahan hain!\n\nKya aap WhatsApp par hamare expert se baat karna chahenge?"
    };
    return responses[lang];
  }

  // ── Unrelated / Default ──
  const responses = {
    en: "I specialize in **NextGen Digital** services such as Website Development, SEO, Google Ads, Branding, AI Automation and Digital Marketing. If you have any questions related to these services, I'd be happy to help! 😊",
    hi: "मैं **NextGen Digital** की सेवाओं में विशेषज्ञ हूँ जैसे वेबसाइट डेवलपमेंट, SEO, Google Ads, ब्रांडिंग, AI ऑटोमेशन और डिजिटल मार्केटिंग। अगर इन सेवाओं से संबंधित कोई प्रश्न है, तो मुझे खुशी होगी मदद करने में! 😊",
    hinglish: "Main **NextGen Digital** ki services mein specialize karti hoon jaise Website Development, SEO, Google Ads, Branding, AI Automation aur Digital Marketing. Agar in services se related koi sawaal hai, toh main khushi se madad karungi! 😊"
  };
  return responses[lang];
}

// ─── Main Engine: Process Message ──────────────────────────────────
export async function processMessage(userMessage, conversationHistory = []) {
  // Try Gemini API first
  const geminiResponse = await callGeminiAPI(conversationHistory, userMessage);
  
  if (geminiResponse) {
    return {
      content: geminiResponse,
      source: 'gemini',
      language: detectLanguage(userMessage)
    };
  }
  
  // Fallback to rule-based system
  const fallbackResponse = generateFallbackResponse(userMessage);
  return {
    content: fallbackResponse,
    source: 'fallback',
    language: detectLanguage(userMessage)
  };
}

export { detectLanguage };
