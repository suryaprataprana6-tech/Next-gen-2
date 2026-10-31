import { NextResponse } from 'next/server';
import { verifyAdminToken } from '@/lib/adminAuth';
import { getLeads, getLeadStats, getSystemHealth, updateLeadStatus, deleteLead } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface ChatRequestBody {
  message: string;
  history?: Array<{ role: 'user' | 'assistant'; content: string }>;
  confirmedAction?: boolean;
}

// Clean text for natural Text-To-Speech output (remove markdown, asterisks, brackets)
function sanitizeForSpeech(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/#{1,6}\s?/g, '')
    .replace(/`{1,3}[^`]*`{1,3}/g, 'code snippet')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[-*•]\s+/g, '. ')
    .replace(/\n+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

// Detect if query is in Hindi or Hinglish
function isHinglishQuery(text: string): boolean {
  const lower = text.toLowerCase();
  const hinglishMarkers = [
    'kya', 'hai', 'hain', 'kaise', 'kaisa', 'chal raha', 'scene',
    'aaj', 'batao', 'kisko', 'kaun', 'karna', 'karo', 'chahiye',
    'thoda', 'sab', 'badhiya', 'haal', 'dekho', 'dekhna', 'pehle',
    'theek', 'bolo', 'sunao', 'bhi', 'nahi', 'kuch', 'hoga'
  ];

  return hinglishMarkers.some((word) => {
    const regex = new RegExp(`\\b${word}\\b`, 'i');
    return regex.test(lower);
  });
}

// Get time-aware greeting based on Indian Standard Time (IST, UTC+5:30)
function getTimeContext() {
  const now = new Date();
  // Adjust for IST
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istDate = new Date(now.getTime() + (now.getTimezoneOffset() * 60000) + istOffset);
  const hour = istDate.getHours();

  if (hour >= 4 && hour < 12) {
    return { period: 'morning', greeting: 'Good morning' };
  } else if (hour >= 12 && hour < 17) {
    return { period: 'afternoon', greeting: 'Good afternoon' };
  } else {
    return { period: 'evening', greeting: 'Good evening' };
  }
}

export async function POST(request: Request) {
  // 1. Strict Admin Authentication Verification
  const admin = verifyAdminToken(request);
  if (!admin) {
    return NextResponse.json(
      { success: false, message: 'Access Denied: JARVIS is classified for Admin use only.' },
      { status: 401 }
    );
  }

  try {
    const body: ChatRequestBody = await request.json();
    const query = (body.message || '').trim();

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Command query cannot be empty.' },
        { status: 400 }
      );
    }

    const lowerQuery = query.toLowerCase().replace(/[,.?!]/g, ' ').replace(/\s+/g, ' ').trim();
    const isHinglish = isHinglishQuery(query);
    const timeCtx = getTimeContext();

    // 2. Fetch Live Database & Telemetry Context
    const leads = getLeads();
    const stats = getLeadStats();
    const health = getSystemHealth();
    const pendingLeads = leads.filter((l) => l.status === 'pending');

    let reply = '';
    let speechReply = '';
    let action = 'none';
    let payloadData: any = null;

    // ==================================================================
    // 1. HIGHEST PRIORITY: GREETINGS & NATURAL PLEASANTRIES
    // ==================================================================
    // Must be evaluated BEFORE CRM, technical, leads, or campaign intents!
    const isGreetingOnly =
      // Morning
      /^(good\s+)?morning(\s+jarvis)?$/i.test(lowerQuery) ||
      // Afternoon
      /^(good\s+)?afternoon(\s+jarvis)?$/i.test(lowerQuery) ||
      // Evening
      /^(good\s+)?evening(\s+jarvis)?$/i.test(lowerQuery) ||
      // Hello / Hi / Hey
      /^(hello|hi|hey|heya|hiya)(\s+jarvis)?$/i.test(lowerQuery) ||
      // How are you
      /^(how\s+are\s+you|how\s+are\s+you\s+doing|how's\s+it\s+going|hows\s+it\s+going)(\s+jarvis)?$/i.test(lowerQuery) ||
      // Hinglish Greetings
      /^(jarvis\s+)?(kya\s+chal\s+raha\s+hai|kya\s+haal\s+hai|kaise\s+ho|kaisa\s+chal\s+raha\s+hai)(\s+jarvis)?$/i.test(lowerQuery);

    if (isGreetingOnly) {
      action = 'greeting';

      // HINGLISH GREETING
      if (isHinglish) {
        const hinglishVariations = [
          `Sab badhiya hai, Surya! Aaj ka kya plan hai? Main aapke pending leads, WhatsApp follow-ups ya campaign planning mein se kisi se start kar sakti hoon.`,
          `Sab ekdum smooth chal raha hai, Surya. Aaj kis cheez pe focus karna chahenge — pending inquiries dekhna chahenge ya WhatsApp follow-ups?`,
          `Hello Surya! Sab ready hai. Bataiye aaj kya plan hai — leads review karein ya kuch specific kaam karein?`,
        ];
        const pick = hinglishVariations[Math.floor(Math.random() * hinglishVariations.length)];
        reply = `👋 **${pick}**\n\n- **1.** Review ${pendingLeads.length} pending inquiries\n- **2.** Draft WhatsApp client follow-ups\n- **3.** Plan Meta or Google ad campaigns\n- **4.** System health & website telemetry`;
        speechReply = pick;

        return NextResponse.json({
          success: true,
          reply,
          speechReply,
          action,
        });
      }

      // ENGLISH GREETING (Time-Aware & Human Conversational)
      // Check if user specified a time or generic hello
      let salutation = `${timeCtx.greeting}, Surya.`;
      if (lowerQuery.includes('morning')) salutation = 'Good morning, Surya.';
      else if (lowerQuery.includes('afternoon')) salutation = 'Good afternoon, Surya.';
      else if (lowerQuery.includes('evening')) salutation = 'Good evening, Surya.';
      else if (lowerQuery.includes('how are you')) salutation = "I'm doing wonderfully, Surya. Thank you for asking!";
      else if (lowerQuery.startsWith('hello') || lowerQuery.startsWith('hi') || lowerQuery.startsWith('hey')) {
        salutation = `Hello, Surya! Great to hear from you.`;
      }

      // Proactive assistant follow-up options
      const proactiveQuestions = [
        `What would you like to work on today? Shall we check today's leads, review WhatsApp follow-ups, or plan campaign work?`,
        `How are you doing today? What should we focus on — pending leads, WhatsApp follow-ups, campaign planning, or something else?`,
        `It's good to have you back. What are you thinking about today? Shall we check what's pending first, or is there something specific you'd like to work on?`,
        `Ready when you are. Would you like to start with your leads, WhatsApp follow-ups, or today's priorities?`,
      ];
      const proactiveQ = proactiveQuestions[Math.floor(Math.random() * proactiveQuestions.length)];

      reply = `✨ **${salutation}**\n\n${proactiveQ}\n\n*Quick options you can speak:* \n- "What's on the agenda today?"\n- "Summarize pending leads"\n- "Who should I follow up with on WhatsApp?"\n- "Draft a Meta ad campaign"`;
      speechReply = `${salutation} ${proactiveQ}`;

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
      });
    }

    // ==================================================================
    // 2. PROACTIVE DAILY GUIDANCE ("What should I focus on today?")
    // ==================================================================
    if (
      lowerQuery.includes('kya karna chahiye') ||
      lowerQuery.includes('kya plan hai') ||
      lowerQuery.includes('aaj ka kya scene') ||
      lowerQuery.includes('kya scene hai') ||
      lowerQuery.includes('aaj kya important') ||
      lowerQuery.includes('kya important hai') ||
      lowerQuery.includes('focus on today') ||
      lowerQuery.includes('what should i do') ||
      lowerQuery.includes('priorities today') ||
      lowerQuery.includes('today priorities') ||
      lowerQuery.includes('agenda today') ||
      lowerQuery.includes('start with today')
    ) {
      action = 'daily_focus';
      payloadData = { stats, pendingCount: pendingLeads.length };

      if (isHinglish) {
        if (pendingLeads.length > 0) {
          const firstLead = pendingLeads[0];
          reply = `### 🎯 Aaj Ka Priority Focus Plan, Surya\n\n1. **Pending Leads Follow-up:** Sabse pehle **${firstLead.name}** (${firstLead.service}) aur baaki ${pendingLeads.length} leads ko WhatsApp pe follow-up karna chahiye.\n2. **Active Pipeline:** Total **${stats.total}** inquiries hain, jisme se ${stats.contacted} leads ke saath negotiation chal rahi hai.\n3. **New Campaign Planning:** Real estate ya healthcare client ke liye ad blueprint prepare karna.\n\nPehle kis lead ka WhatsApp message draft karoon?`;
          speechReply = `Aaj sabse pehle pending leads pe follow-up karna best rahega, Surya. Hamare paas ${pendingLeads.length} inquiries pending hain, jaise ${firstLead.name}. Pehle unka WhatsApp message draft kar dein?`;
        } else {
          reply = `### 🎯 Aaj Ka Priority Focus Plan, Surya\n\nSabhi leads contacted hain! Aaj aap new marketing campaigns ya website performance optimization pe focus kar sakte hain.`;
          speechReply = `Sabhi inquiries up to date hain, Surya. Aaj aap new campaign planning ya client proposals pe focus kar sakte hain.`;
        }
      } else {
        if (pendingLeads.length > 0) {
          const firstLead = pendingLeads[0];
          reply = `### 🎯 Recommended Daily Priorities for You, Surya\n\n1. **High Priority — Client Follow-ups:** We have **${pendingLeads.length} pending inquiries** needing attention, especially **${firstLead.name}** for *${firstLead.service}*.\n2. **Pipeline Progress:** **${stats.contacted}** clients are currently in discussion.\n3. **Growth Initiatives:** Prepare fresh ad blueprints or review website performance.\n\nShall I draft a WhatsApp follow-up for ${firstLead.name} first?`;
          speechReply = `I'd recommend starting with our pending inquiries, Surya. We have ${pendingLeads.length} leads waiting for a response, including ${firstLead.name} for ${firstLead.service}. Shall I draft a WhatsApp follow-up for them right now?`;
        } else {
          reply = `### 🎯 Daily Priorities for You, Surya\n\nAll current inquiries are contacted or closed! You can focus on campaign creative drafts, pipeline outreach, or infrastructure audits.`;
          speechReply = `All current inquiries have been followed up, Surya. I suggest focusing on new campaign planning or client proposals today. What would you like to tackle?`;
        }
      }

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
        data: payloadData,
      });
    }

    // ==================================================================
    // 3. WHATSAPP FOLLOW-UP DIRECTIVE ("Aaj WhatsApp pe kisko follow up karna hai?")
    // ==================================================================
    const isDraftRequest = lowerQuery.includes('draft') || lowerQuery.includes('write') || lowerQuery.includes('compose');

    if (
      !isDraftRequest &&
      ((lowerQuery.includes('whatsapp') && (lowerQuery.includes('kisko') || lowerQuery.includes('who') || lowerQuery.includes('list') || lowerQuery.includes('candidates'))) ||
        lowerQuery.includes('kisko follow up karna hai') ||
        lowerQuery.includes('who to follow up') ||
        lowerQuery.includes('who should i follow up with') ||
        lowerQuery.includes('pending follow up') ||
        lowerQuery.includes('pending follow-up'))
    ) {
      action = 'whatsapp_followup_list';
      payloadData = { pendingLeads };

      if (pendingLeads.length > 0) {
        const top2 = pendingLeads.slice(0, 2);
        const names = top2.map((l) => l.name).join(' aur ');
        const namesEn = top2.map((l) => l.name).join(' and ');

        if (isHinglish) {
          reply = `### 💬 Aaj Ke WhatsApp Follow-up Candidates\n\n` +
            pendingLeads.map((l, i) =>
              `**${i + 1}. ${l.name}** (${l.service}) — \`${l.phone}\`\n*Inquiry:* "${l.message}"`
            ).join('\n\n') +
            `\n\nMain abhi **${top2[0].name}** ke liye personalized WhatsApp draft bana sakti hoon.`;
          speechReply = `Aaj sabse pehle ${names} ko WhatsApp pe follow-up karna chahiye, Surya. Main abhi ek quick draft bana deti hoon.`;
        } else {
          reply = `### 💬 Priority WhatsApp Follow-up Contacts\n\n` +
            pendingLeads.map((l, i) =>
              `**${i + 1}. ${l.name}** (${l.service}) — \`${l.phone}\`\n*Inquiry:* "${l.message}"`
            ).join('\n\n') +
            `\n\nWould you like me to prepare a personalized message for **${top2[0].name}**?`;
          speechReply = `You should follow up with ${namesEn} today, Surya. I can draft a personalized WhatsApp message for ${top2[0].name} right now if you'd like.`;
        }
      } else {
        if (isHinglish) {
          reply = `Koi pending WhatsApp follow-ups nahi hain, Surya. Sabhi leads update ho chuke hain.`;
          speechReply = `Filhaal koi pending follow-up nahi hai, Surya. Sabhi inquiries ko contact kiya ja chuka hai.`;
        } else {
          reply = `All client inquiries have been contacted, Surya. There are no pending follow-ups right now.`;
          speechReply = `There are no pending WhatsApp follow-ups right now, Surya. Everyone has been contacted.`;
        }
      }

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
        data: payloadData,
      });
    }

    // ==================================================================
    // 4. STANDBY / SLEEP COMMAND
    // ==================================================================
    if (
      lowerQuery.includes('go to sleep') ||
      lowerQuery.includes('sleep') ||
      lowerQuery.includes('stand by') ||
      lowerQuery.includes('standby') ||
      lowerQuery.includes('so jao') ||
      lowerQuery.includes('power down') ||
      lowerQuery.includes('shut down')
    ) {
      action = 'sleep';
      if (isHinglish) {
        reply = `**JARVIS Standby Mode Activated.** Standby mode par ja rahi hoon, Surya. Jab bhi zaroorat ho, double-clap karein ya orb par tap karein.`;
        speechReply = `Theek hai, Surya. Main standby par ja rahi hoon. Jab bhi bulana ho, double-clap kar dijiyega.`;
      } else {
        reply = `**JARVIS Standby Initiated.** Entering acoustic standby, Surya. I'll be listening for your double-clap whenever you need me.`;
        speechReply = `Entering standby, Surya. I'll be listening for your double-clap whenever you need me. Have a wonderful session.`;
      }

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
      });
    }

    // ==================================================================
    // 5. DESTRUCTIVE ACTION (DELETE LEAD GUARD)
    // ==================================================================
    if (lowerQuery.includes('delete lead') || lowerQuery.includes('remove lead') || lowerQuery.includes('lead delete')) {
      const match = lowerQuery.match(/(?:lead-)?(\d+)/i) || lowerQuery.match(/lead\s+([a-z0-9-]+)/i);
      const leadId = match ? (match[1].startsWith('lead-') ? match[1] : `lead-${match[1]}`) : null;

      if (!leadId) {
        reply = `**Action Required:** Please specify the ID of the lead you wish to delete (e.g. "Delete lead 101").`;
        speechReply = isHinglish
          ? `Kripya batayein kis lead ID ko delete karna hai, Surya.`
          : `Please specify the lead ID you'd like me to remove, Surya.`;
      } else {
        const lead = leads.find((l) => l.id.toLowerCase() === leadId.toLowerCase());
        if (!lead) {
          reply = `**Record Not Found:** No lead found matching identifier \`${leadId}\`.`;
          speechReply = isHinglish
            ? `ID ${leadId} ka koi record nahi mila, Surya.`
            : `I couldn't locate any lead matching ID ${leadId}, Surya.`;
        } else if (!body.confirmedAction && !lowerQuery.includes('confirm')) {
          action = 'confirm_required';
          payloadData = { targetLeadId: lead.id, targetName: lead.name };
          reply = `⚠️ **CRITICAL CONFIRMATION REQUIRED**\n\nYou have requested to permanently delete **${lead.name}** (\`${lead.id}\`, Service: *${lead.service}*).\n\nTo confirm, say: *"Confirm delete lead ${lead.id.replace('lead-', '')}"* or click Confirm below.`;
          speechReply = isHinglish
            ? `Surya, ${lead.name} ka record delete karne se pehle mujhe aapka confirmation chahiye hoga. Delete confirm karne ke liye confirm delete bole.`
            : `I need your confirmation before I proceed with that action, Surya. Deleting the record for ${lead.name} is permanent. Please say confirm delete to proceed.`;
        } else {
          // Execution confirmed
          const success = deleteLead(lead.id);
          if (success) {
            action = 'lead_deleted';
            reply = `✅ **Action Executed:** Lead \`${lead.id}\` (**${lead.name}**) has been permanently removed from the CRM.`;
            speechReply = isHinglish
              ? `Done, Surya. ${lead.name} ka record CRM se delete kar diya gaya hai.`
              : `Of course. I've permanently removed the lead for ${lead.name} from the CRM.`;
          } else {
            reply = `❌ **Error:** Failed to delete lead \`${lead.id}\`.`;
            speechReply = `I encountered an issue while trying to delete that record, Surya.`;
          }
        }
      }

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
        data: payloadData,
      });
    }

    // ==================================================================
    // 6. WHATSAPP & EMAIL DRAFTS FOR CLIENTS
    // ==================================================================
    if (
      (lowerQuery.includes('whatsapp') && (lowerQuery.includes('draft') || lowerQuery.includes('message') || lowerQuery.includes('write') || lowerQuery.includes('follow'))) ||
      (lowerQuery.includes('draft') && (lowerQuery.includes('follow-up') || lowerQuery.includes('follow up') || lowerQuery.includes('proposal'))) ||
      lowerQuery.includes('draft email') ||
      lowerQuery.includes('email proposal') ||
      lowerQuery.includes('outreach draft')
    ) {
      action = 'draft_communication';
      const recent = leads[0] || { name: 'Client', service: 'Digital Solutions' };

      reply = `### 💬 Executive Follow-up Draft for ${recent.name}

**Option A: Direct WhatsApp Message**
\`\`\`text
Hello ${recent.name}, this is Surya from NextGen Digital Solutions. 

I reviewed your inquiry regarding ${recent.service}. We specialize in building high-performance systems specifically tailored for this exact scope. 

I've put together a brief technical outline and would love to share a 10-minute walkthrough on how we can structure this for maximum ROI. 

Are you free for a quick call this afternoon?
\`\`\`

**Option B: Formal Email Proposal**
**Subject:** NextGen Digital Solutions — Strategic Architecture for ${recent.name}
\`\`\`text
Dear ${recent.name},

Thank you for reaching out to NextGen Digital Solutions regarding your ${recent.service} requirements.

We have reviewed your project scope. Our team engineers custom web applications and growth funnels with zero bloat and complete conversion tracking.

Attached is an overview of our delivery process and initial timeline milestones. Let me know when you would like to schedule our strategic kickoff session.

Warm regards,
Surya Pratap Rana
Founder & Lead Architect, NextGen Digital Solutions
\`\`\``;

      speechReply = isHinglish
        ? `Bilkul, Surya. Maine ${recent.name} ke liye WhatsApp message aur formal proposal dono ready kar diye hain. Aap review kar sakte hain.`
        : `Certainly, Surya. I've drafted both a personalized WhatsApp follow-up and a formal email proposal for ${recent.name}. Both are ready for you to send.`;

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
      });
    }

    // ==================================================================
    // 7. META ADS DRAFTING
    // ==================================================================
    if (
      lowerQuery.includes('meta ad') ||
      lowerQuery.includes('facebook ad') ||
      lowerQuery.includes('instagram ad')
    ) {
      action = 'draft_meta_ad';
      let niche = 'High-Ticket Services & Digital Brands';
      if (lowerQuery.includes('dental') || lowerQuery.includes('clinic') || lowerQuery.includes('doctor')) {
        niche = 'Aesthetic Dental & Medical Clinics';
      } else if (lowerQuery.includes('realty') || lowerQuery.includes('real estate') || lowerQuery.includes('property')) {
        niche = 'Luxury Real Estate Projects';
      } else if (lowerQuery.includes('travel') || lowerQuery.includes('safari') || lowerQuery.includes('hotel')) {
        niche = 'Boutique & Luxury Travel Brands';
      } else if (lowerQuery.includes('web') || lowerQuery.includes('saas') || lowerQuery.includes('software')) {
        niche = 'High-Performance Next.js Engineering';
      }

      reply = `### 🎯 Meta Ad Campaign Blueprint: ${niche}

**1. Primary Hook (First 3 Seconds):**
> "Most websites don't lack visitors. They leak conversions. Here is the exact architectural shift scaling top modern brands."

**2. Primary Copy:**
"Tired of paying for clicks that never turn into closed deals?
At NextGen Digital Solutions, we engineer ultra-fast web applications and high-intent lead generation funnels specifically engineered to convert qualified decision-makers.

Zero bloated templates. Zero generic ad agency jargon. Just precision tracking, rapid page loads, and direct customer acquisition.

Ready to upgrade your digital infrastructure?"

**3. Visual Directive:**
- Dark graphite background with dynamic cyan/blue UI metrics dashboard.
- High-contrast text overlay: *'Engineered For Conversions, Not Vanity.'*
- 4:5 vertical format for Instagram Feed & Reels.

**4. Headline & CTA:**
- **Headline:** Scale Your Inquiries with NextGen Architecture
- **Description:** Book a 1-on-1 Strategic Audit Today
- **CTA Button:** Learn More / Get Quote`;

      speechReply = isHinglish
        ? `Of course, Surya. Maine ${niche} ke liye high-converting Meta ad ready kar di hai, with attention-hook and call to action.`
        : `Of course, Surya. I've prepared a high-converting Meta ad campaign for ${niche}. It includes an attention-grabbing problem hook, benefit-focused primary copy, and a direct consultation call to action.`;

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
      });
    }

    // ==================================================================
    // 8. GOOGLE ADS DRAFTING
    // ==================================================================
    if (
      lowerQuery.includes('google ad') ||
      lowerQuery.includes('search ad') ||
      lowerQuery.includes('ppc')
    ) {
      action = 'draft_google_ad';
      let keyword = 'Next.js Web Development Agency';
      if (lowerQuery.includes('lead')) keyword = 'B2B Lead Generation Agency';
      if (lowerQuery.includes('clinic')) keyword = 'Medical Lead Generation Ads';
      if (lowerQuery.includes('realty')) keyword = 'Real Estate Performance Marketing';

      reply = `### 🔍 Google Ads Responsive Search Campaign: [${keyword}]

**Target Headlines (High CTR Variations):**
1. NextGen Digital Solutions
2. High-Converting Web Apps
3. Precision Lead Gen Systems
4. Engineered with Next.js 15
5. Stop Leaking Paid Ad Clicks

**Description Assets (Under 90 Chars):**
- **Description 1:** Build lightning-fast websites and high-intent customer acquisition funnels that scale.
- **Description 2:** Consult directly with technical specialists. Zero templates, measurable growth.

**Recommended Match Types:**
- \`[nextjs development agency]\` (Exact Match)
- \`"custom web application development"\` (Phrase Match)
- \`"high converting lead generation agency"\` (Phrase Match)

**Negative Keywords to Prevent Ad Waste:**
- *free, templates, jobs, salary, internships, course, cracked*`;

      speechReply = isHinglish
        ? `Certainly, Surya. Maine ${keyword} ke liye Google Search ad campaign generate kar di hai, with headlines, descriptions aur negative keywords.`
        : `Certainly, Surya. I've generated a responsive Google Search ad set for ${keyword}, complete with 5 high-CTR headlines, two 90-character descriptions, targeted phrase and exact keywords, and a negative keyword exclusion list.`;

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
      });
    }

    // ==================================================================
    // 9. SYSTEM TELEMETRY / HEALTH / UPTIME
    // ==================================================================
    if (
      lowerQuery.includes('system health') ||
      lowerQuery.includes('uptime') ||
      lowerQuery.includes('server') ||
      lowerQuery.includes('diagnostics') ||
      lowerQuery.includes('telemetry')
    ) {
      action = 'telemetry_report';
      payloadData = health;
      reply = `### 🛰️ NextGen Core Telemetry Report
- **System Status:** \`${health.status}\` (100% Nominal)
- **Active Uptime:** ${health.uptimeFormatted}
- **Server Environment:** Node ${health.nodeVersion} on Next.js ${health.nextVersion} (${health.environment})
- **Active Memory Footprint:** ${health.memoryUsageMB} MB RSS
- **Core Micro-Engines:** ${health.activeServices.join(', ')}
- **API Response Latency:** < 15ms`;

      speechReply = isHinglish
        ? `Website par sab badhiya chal raha hai, Surya. Server uptime ${health.uptimeFormatted} hai aur sabhi systems 100 percent active hain.`
        : `Everything looks good on the website, Surya. System status is nominal, active uptime is ${health.uptimeFormatted}, memory footprint is ${health.memoryUsageMB} megabytes, and all NextGen services are running smoothly.`;

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
        data: payloadData,
      });
    }

    // ==================================================================
    // 10. LEADS SUMMARY & INQUIRIES ("Leads ka kya scene hai?")
    // ==================================================================
    if (
      lowerQuery.includes('lead') ||
      lowerQuery.includes('inquir') ||
      lowerQuery.includes('client') ||
      lowerQuery.includes('prospect') ||
      lowerQuery.includes('pipeline') ||
      lowerQuery.includes('crm')
    ) {
      action = 'leads_summary';
      payloadData = { stats, leads };

      if (lowerQuery.includes('pending') || lowerQuery.includes('latest') || lowerQuery.includes('recent') || lowerQuery.includes('kya scene')) {
        reply = `### 📋 Pending Inquiries (${pendingLeads.length} Awaiting Action)\n\n` +
          pendingLeads.map((l, i) => 
            `**${i + 1}. ${l.name}** ${l.business ? `(${l.business})` : ''}\n` +
            `- **Service:** ${l.service} | **Budget:** ${l.budget || 'Not specified'}\n` +
            `- **Contact:** \`${l.phone}\` | \`${l.email}\`\n` +
            `- **Inquiry:** "${l.message}"\n`
          ).join('\n');

        if (isHinglish) {
          speechReply = pendingLeads.length > 0
            ? `Surya, hamare paas ${pendingLeads.length} pending leads hain. Sabse latest inquiry ${pendingLeads[0].name} ki aayi hai for ${pendingLeads[0].service}. Kya main inka WhatsApp draft banaoon?`
            : `Leads ka scene ekdum clean hai, Surya! Saari inquiries contact ho chuki hain, zero pending hain.`;
        } else {
          speechReply = pendingLeads.length > 0
            ? `I've found ${pendingLeads.length} pending leads that need your attention, Surya. The most recent inquiry is from ${pendingLeads[0].name} for ${pendingLeads[0].service}. Would you like me to draft a follow-up?`
            : `Everything is up to date, Surya. There are no pending leads in the queue right now.`;
        }
      } else {
        reply = `### 📊 NextGen Growth Pipeline Overview
- **Total Leads:** ${stats.total}
- **Pending Follow-up:** ${stats.pending}
- **In Negotiation / Contacted:** ${stats.contacted}
- **Closed / Converted:** ${stats.closed}

**Recent Submissions:**
${leads.slice(0, 3).map((l) => `• **${l.name}** — ${l.service} [Status: \`${l.status.toUpperCase()}\`]`).join('\n')}`;

        if (isHinglish) {
          speechReply = `Bilkul, Surya. Total ${stats.total} inquiries hain, jisme se ${stats.pending} leads pending review hain. Most inquiries ${Object.keys(stats.byService).slice(0, 2).join(' aur ')} ke liye aayi hain.`;
        } else {
          speechReply = `Certainly, Surya. I've checked the CRM pipeline. We have ${stats.total} total inquiries logged, with ${stats.pending} awaiting your review. Top inquiries are in ${Object.keys(stats.byService).slice(0, 2).join(' and ')}.`;
        }
      }

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action,
        data: payloadData,
      });
    }

    // ==================================================================
    // 11. WHO ARE YOU / CAPABILITIES
    // ==================================================================
    if (
      lowerQuery.includes('who are you') ||
      lowerQuery.includes('what can you do') ||
      lowerQuery.includes('services') ||
      lowerQuery.includes('help') ||
      lowerQuery.includes('commands') ||
      lowerQuery.includes('kaun ho')
    ) {
      reply = `### ⚡ JARVIS Executive Assistant Matrix

I am **JARVIS**, the personal executive AI assistant engineered specifically for **Surya Pratap Rana** at **NextGen Digital Solutions**.

**What I Can Do For You Today:**
1. **Manage Leads & Pipeline:** Track new incoming client inquiries, review details, and manage status.
2. **Draft Client Communications:** Compose instant personalized WhatsApp follow-ups and professional proposal emails.
3. **Draft Ad Campaigns:** Generate high-converting Meta Ads and Google Search PPC campaigns for any sector.
4. **Monitor System Telemetry:** Check website health, server uptime, and microservice status.
5. **Continuous Natural Conversation:** Speak with me in English, Hindi, or Hinglish with double-clap wake detection.`;

      speechReply = isHinglish
        ? `Main JARVIS hoon, aapki executive AI assistant, Surya. Main aapke CRM leads ko track karti hoon, WhatsApp follow-ups draft karti hoon, Meta aur Google ads generate karti hoon, aur website health monitor karti hoon. Aaj kisse start karein?`
        : `I'm JARVIS, your executive AI assistant at NextGen Digital Solutions, Surya. I manage your incoming leads, draft Meta and Google Ad campaigns, prepare client follow-ups, and monitor website health. How can I help you today?`;

      return NextResponse.json({
        success: true,
        reply,
        speechReply,
        action: 'help',
      });
    }

    // ==================================================================
    // 12. OPTIONAL GEMINI INTELLIGENCE (If API Key is Present)
    // ==================================================================
    if (process.env.GEMINI_API_KEY) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const systemInstruction = `You are JARVIS, a warm, highly intelligent, calm, confident, and polite female executive AI assistant for Surya Pratap Rana, Founder and Lead Architect of NextGen Digital Solutions.
You speak naturally like a real human personal executive assistant.
You understand English, Hindi, and Hinglish. If the user writes in Hinglish, reply in natural, polite Hinglish.
Never recite robotic marketing disclaimers or say 'processing inquiry'.
Always address the user as Surya. Keep responses conversational, concise, and helpful.`;

        const geminiRes = await fetch(geminiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${systemInstruction}\n\nUser Query: ${query}` }]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            }
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const candidateText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidateText) {
            reply = candidateText;
            speechReply = sanitizeForSpeech(candidateText);
            return NextResponse.json({
              success: true,
              reply,
              speechReply,
              action: 'gemini_response',
            });
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API call failed, falling back to conversational assistant:', geminiErr);
      }
    }

    // ==================================================================
    // 13. CONVERSATIONAL HUMAN FALLBACK (Never Technical Robot Speech!)
    // ==================================================================
    if (isHinglish) {
      reply = `**Bilkul, Surya.** Main aapke saath hoon. Bataiye aaj kya karna chahenge:\n\n- **1.** Pending leads aur inquiries check karein\n- **2.** WhatsApp follow-up messages draft karein\n- **3.** Naye Meta ya Google Ads plan karein\n- **4.** Website health aur uptime check karein`;
      speechReply = `Bilkul, Surya. Main aapke saath hoon. Bataiye kis cheez pe focus karna chahenge — leads, WhatsApp follow-ups, ya campaign planning?`;
    } else {
      reply = `**Certainly, Surya.** I'm right here with you.\n\nHere are a few things we can tackle together right now:\n- Check today's **${pendingLeads.length} pending leads**\n- Prepare personalized **WhatsApp follow-ups**\n- Draft a **Meta or Google Ads blueprint**\n- Run an **infrastructure health check**\n\nWhat would you like to focus on first?`;
      speechReply = `Certainly, Surya. I'm right here. Would you like to check our pending leads, draft an ad campaign, or plan client follow-ups? Just let me know what you'd like to work on.`;
    }

    return NextResponse.json({
      success: true,
      reply,
      speechReply,
      action: 'general_conversational',
    });
  } catch (error) {
    console.error('JARVIS Chat API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Apologies, Surya. I ran into a brief internal issue.',
      },
      { status: 500 }
    );
  }
}
