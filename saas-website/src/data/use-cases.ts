export interface UseCase {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroDescription: string;
  howItWorks: Array<{
    step: number;
    title: string;
    description: string;
  }>;
  features: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  benefits: Array<{
    metric: string;
    label: string;
  }>;
  industries: string[];
}

export const useCases: UseCase[] = [
  {
    slug: 'lead-qualification',
    name: 'Lead Qualification',
    tagline: 'Qualify leads instantly with AI conversations',
    description:
      'AI agents call your leads, ask qualifying questions, score them, and route hot prospects to your sales team in real-time.',
    heroDescription:
      "Stop wasting your sales team's time on unqualified leads. Voxeia AI agents call every new lead within minutes, ask customized qualifying questions, score their intent and budget, and route only the hottest prospects to your closers — 24/7, at unlimited scale.",
    howItWorks: [
      {
        step: 1,
        title: 'Lead Arrives',
        description:
          'A new lead comes in from your CRM, website form, or ad campaign. Voxeia triggers a call within seconds.',
      },
      {
        step: 2,
        title: 'AI Qualifies',
        description:
          'Our AI agent has a natural conversation, asking your custom qualifying questions about budget, timeline, needs, and authority.',
      },
      {
        step: 3,
        title: 'Score & Route',
        description:
          'Based on responses, the lead is scored and either routed to a sales rep, scheduled for a callback, or nurtured with follow-ups.',
      },
    ],
    features: [
      {
        title: 'Custom Question Scripts',
        description: 'Define exactly what your AI asks — BANT, MEDDPICC, or any custom framework.',
        icon: 'edit',
      },
      {
        title: 'Real-time Lead Scoring',
        description: 'AI scores leads based on conversation signals, not just form data.',
        icon: 'chart',
      },
      {
        title: 'Instant Routing',
        description: 'Hot leads are immediately transferred to available reps via warm handoff.',
        icon: 'zap',
      },
      {
        title: 'CRM Auto-logging',
        description: 'All qualification data is automatically synced to your CRM record.',
        icon: 'database',
      },
    ],
    benefits: [
      { metric: '5min', label: 'Average lead response time' },
      { metric: '70%', label: 'Qualification accuracy' },
      { metric: '3x', label: 'More leads processed daily' },
      { metric: '40%', label: 'Higher conversion rate' },
    ],
    industries: ['Real Estate', 'Insurance', 'Financial Services', 'SaaS'],
  },
  {
    slug: 'lead-generation',
    name: 'Lead Generation',
    tagline: 'Generate warm leads at scale with AI outreach',
    description:
      'Proactive AI outbound calling that identifies interest, captures information, and builds your pipeline.',
    heroDescription:
      'Scale your outbound lead generation without scaling your team. Voxeia AI agents make thousands of proactive calls daily, identify interested prospects, capture their needs, and fill your pipeline with warm leads ready for human follow-up.',
    howItWorks: [
      {
        step: 1,
        title: 'Upload Contacts',
        description: 'Import your target list via CSV, CRM sync, or API. Set campaign parameters and calling windows.',
      },
      {
        step: 2,
        title: 'AI Reaches Out',
        description:
          'AI agents call each contact with a personalized pitch, adapting the conversation based on responses.',
      },
      {
        step: 3,
        title: 'Pipeline Fills',
        description:
          'Interested prospects are captured as warm leads with conversation notes and added to your pipeline.',
      },
    ],
    features: [
      {
        title: 'Personalized Pitches',
        description: 'AI adapts talking points based on company size, industry, and prospect data.',
        icon: 'users',
      },
      {
        title: 'Smart Call Timing',
        description: 'ML-optimized calling times based on pickup rates and conversion patterns.',
        icon: 'clock',
      },
      {
        title: 'Multi-touch Campaigns',
        description: 'Set up sequences with multiple call attempts, voicemails, and follow-ups.',
        icon: 'layers',
      },
      {
        title: 'DNC Compliance',
        description: 'Automatic DNC list checking and opt-out handling for full compliance.',
        icon: 'shield',
      },
    ],
    benefits: [
      { metric: '10x', label: 'More outreach capacity' },
      { metric: '15%', label: 'Contact-to-lead rate' },
      { metric: '80%', label: 'Cost reduction vs manual' },
      { metric: '1000+', label: 'Calls per day per agent' },
    ],
    industries: ['SaaS', 'Insurance', 'Real Estate', 'Retail'],
  },
  {
    slug: 'customer-support',
    name: 'Customer Support',
    tagline: 'Resolve customer issues 24/7 with AI voice',
    description: 'AI-powered tier-1 support that handles common queries, escalates complex issues, and never sleeps.',
    heroDescription:
      'Provide instant, 24/7 phone support without the cost of a round-the-clock team. Voxeia AI agents handle common support queries — billing, account status, troubleshooting — with natural conversations, and seamlessly escalate complex issues to human agents.',
    howItWorks: [
      {
        step: 1,
        title: 'Customer Calls',
        description: 'Customer calls your support line or AI proactively calls for follow-ups and check-ins.',
      },
      {
        step: 2,
        title: 'AI Resolves',
        description:
          'AI identifies the issue, accesses relevant knowledge base articles, and guides the customer to resolution.',
      },
      {
        step: 3,
        title: 'Escalate or Close',
        description:
          'Simple issues are resolved instantly. Complex ones are escalated to human agents with full context.',
      },
    ],
    features: [
      {
        title: 'Knowledge Base Integration',
        description: 'AI accesses your documentation and FAQs to provide accurate, consistent answers.',
        icon: 'book',
      },
      {
        title: 'Smart Escalation',
        description: 'Automatically detects when to escalate to a human agent, with full conversation context.',
        icon: 'arrow-up',
      },
      {
        title: 'Sentiment Analysis',
        description: 'Real-time sentiment detection adjusts tone and triggers escalation for frustrated customers.',
        icon: 'heart',
      },
      {
        title: 'Multi-language Support',
        description: 'Support customers in 20+ languages without hiring multilingual agents.',
        icon: 'globe',
      },
    ],
    benefits: [
      { metric: '24/7', label: 'Support availability' },
      { metric: '60%', label: 'Queries resolved by AI' },
      { metric: '45%', label: 'Cost reduction' },
      { metric: '<30s', label: 'Average response time' },
    ],
    industries: ['Telecom', 'SaaS', 'Retail', 'Financial Services'],
  },
  {
    slug: 'ai-receptionist',
    name: 'AI Receptionist',
    tagline: 'Never miss a call with your AI front desk',
    description: 'A 24/7 AI receptionist that answers calls, routes inquiries, books appointments, and captures leads.',
    heroDescription:
      'Your virtual front desk that never takes a break. Voxeia AI Receptionist answers every call professionally, understands caller intent, books appointments, captures lead information, routes calls to the right department, and handles basic inquiries — all in a natural, human-like voice.',
    howItWorks: [
      {
        step: 1,
        title: 'Call Comes In',
        description: 'Incoming call is answered instantly by your AI receptionist with a custom greeting.',
      },
      {
        step: 2,
        title: 'AI Handles It',
        description:
          "AI understands the caller's needs — books appointments, answers FAQs, captures details, or routes the call.",
      },
      {
        step: 3,
        title: 'You Get Notified',
        description: 'Receive instant summaries via email/SMS with call recordings, transcripts, and any action items.',
      },
    ],
    features: [
      {
        title: 'Custom Greeting & Voice',
        description: 'Personalize the AI voice, greeting, and conversation style to match your brand.',
        icon: 'mic',
      },
      {
        title: 'Appointment Booking',
        description: 'Integrates with Google Calendar, Calendly, and more to book appointments in real-time.',
        icon: 'calendar',
      },
      {
        title: 'Call Routing',
        description: 'Intelligently routes calls to the right department or team member based on intent.',
        icon: 'phone',
      },
      {
        title: 'Instant Summaries',
        description: 'Get email/SMS summaries after every call with key details and required actions.',
        icon: 'mail',
      },
    ],
    benefits: [
      { metric: '100%', label: 'Calls answered' },
      { metric: '< 1s', label: 'Answer time' },
      { metric: '24/7', label: 'Availability' },
      { metric: '90%', label: 'Caller satisfaction' },
    ],
    industries: ['Home Services', 'Healthcare', 'Legal', 'Small Business'],
  },
  {
    slug: 'call-follow-up-automation',
    name: 'Call Follow-Up Automation',
    tagline: 'Automate every follow-up, never drop the ball',
    description: 'AI automatically follows up after meetings, demos, quotes, and interactions — at the perfect time.',
    heroDescription:
      'The fortune is in the follow-up, but most businesses drop the ball. Voxeia AI agents automatically follow up after every interaction — demos, meetings, quotes, purchases — with perfectly timed, personalized calls that keep deals moving and customers engaged.',
    howItWorks: [
      {
        step: 1,
        title: 'Trigger Event',
        description:
          'A demo ends, a quote is sent, a meeting wraps up, or any CRM event triggers the follow-up sequence.',
      },
      {
        step: 2,
        title: 'AI Follows Up',
        description:
          'AI calls at the optimal time with context from the previous interaction to continue the conversation naturally.',
      },
      {
        step: 3,
        title: 'Outcome Captured',
        description:
          'Call outcome, next steps, and any changes are automatically logged and the next follow-up is scheduled.',
      },
    ],
    features: [
      {
        title: 'Event-Based Triggers',
        description: 'Set follow-ups based on CRM events, calendar events, email opens, or custom webhooks.',
        icon: 'zap',
      },
      {
        title: 'Contextual Conversations',
        description: 'AI references previous interactions for natural, relevant follow-up conversations.',
        icon: 'brain',
      },
      {
        title: 'Optimal Timing',
        description: 'ML determines the best time to call each contact based on historical pickup and conversion data.',
        icon: 'clock',
      },
      {
        title: 'Multi-Step Sequences',
        description: 'Build follow-up sequences with multiple touchpoints, escalations, and branching logic.',
        icon: 'workflow',
      },
    ],
    benefits: [
      { metric: '100%', label: 'Follow-up completion rate' },
      { metric: '2x', label: 'Deal closure improvement' },
      { metric: '0', label: 'Dropped follow-ups' },
      { metric: '35%', label: 'Pipeline acceleration' },
    ],
    industries: ['SaaS', 'Real Estate', 'Insurance', 'Financial Services'],
  },
  {
    slug: 'abandoned-cart-recovery',
    name: 'Abandoned Cart Recovery',
    tagline: 'Recover lost revenue with AI voice calls',
    description: 'AI calls customers who abandoned their carts with personalized offers and assistance.',
    heroDescription:
      '70% of online shopping carts are abandoned. While emails recover 5%, AI voice calls recover up to 35%. Voxeia calls customers within hours of abandonment, addresses their concerns, offers personalized incentives, and guides them back to purchase.',
    howItWorks: [
      {
        step: 1,
        title: 'Cart Abandoned',
        description:
          'Customer leaves items in cart. Your ecommerce platform triggers Voxeia via webhook or integration.',
      },
      {
        step: 2,
        title: 'AI Calls Customer',
        description:
          'Within 1-4 hours, AI calls with personalized message referencing their cart items and addressing common objections.',
      },
      {
        step: 3,
        title: 'Sale Recovered',
        description:
          'Customer completes purchase via SMS link, callback to agent, or during the AI conversation itself.',
      },
    ],
    features: [
      {
        title: 'Cart-Aware Conversations',
        description: 'AI knows exactly what was in the cart and tailors the conversation accordingly.',
        icon: 'cart',
      },
      {
        title: 'Dynamic Incentives',
        description: 'Offer discounts, free shipping, or bundles based on cart value and customer segment.',
        icon: 'gift',
      },
      {
        title: 'Objection Handling',
        description: 'AI addresses common concerns — shipping costs, return policy, product questions — naturally.',
        icon: 'message',
      },
      {
        title: 'Multi-Channel Recovery',
        description: 'Combines calls with SMS checkout links for maximum conversion.',
        icon: 'layers',
      },
    ],
    benefits: [
      { metric: '35%', label: 'Cart recovery rate' },
      { metric: '7x', label: 'ROI vs email alone' },
      { metric: '2hr', label: 'Average time to recover' },
      { metric: '25%', label: 'Revenue increase' },
    ],
    industries: ['Retail & Consumer', 'E-Commerce', 'D2C Brands'],
  },
  {
    slug: 'product-announcements',
    name: 'Product Announcements',
    tagline: 'Launch products with personalized AI calls',
    description: 'AI-powered outreach for product launches, feature announcements, and promotional campaigns.',
    heroDescription:
      'Emails get ignored, ads get blocked, but phone calls get answered. Launch your new products, features, and promotions with personalized AI calls that reach your customers directly, explain the value, and drive immediate action.',
    howItWorks: [
      {
        step: 1,
        title: 'Set Up Campaign',
        description:
          'Define your announcement, target audience segments, and call scripts with personalization variables.',
      },
      {
        step: 2,
        title: 'AI Calls Customers',
        description:
          'AI makes personalized calls to each segment with tailored messaging about the new product or feature.',
      },
      {
        step: 3,
        title: 'Drive Action',
        description:
          'Customers can sign up, schedule demos, place orders, or get transferred to sales — all on the call.',
      },
    ],
    features: [
      {
        title: 'Audience Segmentation',
        description: 'Target specific customer segments with tailored messaging for maximum relevance.',
        icon: 'users',
      },
      {
        title: 'Personalization Engine',
        description: 'AI uses customer data to personalize every call — name, past purchases, preferences.',
        icon: 'sparkle',
      },
      {
        title: 'Campaign Analytics',
        description: 'Real-time dashboard showing call completion, interest rates, and campaign ROI.',
        icon: 'chart',
      },
      {
        title: 'Action CTAs',
        description: 'Enable on-call actions — SMS links, demo scheduling, transfers to sales reps.',
        icon: 'click',
      },
    ],
    benefits: [
      { metric: '45%', label: 'Higher engagement vs email' },
      { metric: '20%', label: 'Conversion rate' },
      { metric: '10x', label: 'Faster than manual outreach' },
      { metric: '3x', label: 'Launch revenue uplift' },
    ],
    industries: ['SaaS', 'Retail', 'Telecom', 'Financial Services'],
  },
  {
    slug: 'survey-nps-calls',
    name: 'Survey and NPS Calls',
    tagline: 'Collect honest feedback through AI conversations',
    description: 'AI-conducted surveys and NPS calls that achieve higher response rates than any other channel.',
    heroDescription:
      'Surveys get 5% response rates via email. AI voice calls achieve 40%+. Voxeia conducts intelligent survey and NPS calls where AI adapts follow-up questions based on responses, captures nuanced feedback, and flags detractors for immediate attention.',
    howItWorks: [
      {
        step: 1,
        title: 'Design Survey',
        description:
          'Create your survey with NPS questions, satisfaction scales, and open-ended follow-ups in our builder.',
      },
      {
        step: 2,
        title: 'AI Conducts Calls',
        description: 'AI calls your sample with conversational survey delivery, adapting questions based on responses.',
      },
      {
        step: 3,
        title: 'Insights Generated',
        description: 'Results are aggregated into dashboards with sentiment analysis, trends, and actionable insights.',
      },
    ],
    features: [
      {
        title: 'Conversational Surveys',
        description: 'AI makes surveys feel like natural conversations, not robotic questionnaires.',
        icon: 'message',
      },
      {
        title: 'Adaptive Follow-ups',
        description: 'AI asks deeper follow-up questions based on initial responses for richer insights.',
        icon: 'branch',
      },
      {
        title: 'Detractor Alerts',
        description: 'Instantly flag unhappy customers (NPS 0-6) for human follow-up before they churn.',
        icon: 'alert',
      },
      {
        title: 'Sentiment Dashboard',
        description: 'Real-time analytics with sentiment analysis, word clouds, and trend tracking.',
        icon: 'chart',
      },
    ],
    benefits: [
      { metric: '40%+', label: 'Response rates' },
      { metric: '8x', label: 'Better than email surveys' },
      { metric: '90%', label: 'Completion rate' },
      { metric: 'Real-time', label: 'Detractor alerts' },
    ],
    industries: ['Healthcare', 'Hospitality', 'SaaS', 'Retail'],
  },
  {
    slug: 'payment-reminders',
    name: 'Payment Reminders',
    tagline: 'Get paid faster with AI payment calls',
    description: 'Friendly, persistent AI calls for overdue payments, upcoming dues, and payment confirmations.',
    heroDescription:
      'Late payments hurt cash flow and strain relationships. Voxeia AI agents send timely, professional payment reminders before and after due dates, offer payment plan options, confirm payments, and escalate only when necessary — maintaining positive customer relationships throughout.',
    howItWorks: [
      {
        step: 1,
        title: 'Payment Due',
        description: 'Upcoming or overdue payment triggers an AI reminder sequence from your billing system or CRM.',
      },
      {
        step: 2,
        title: 'AI Calls Customer',
        description: 'AI makes a friendly, professional call with payment details, amount, and easy payment options.',
      },
      {
        step: 3,
        title: 'Payment Resolved',
        description:
          'Customer pays via SMS link, confirms payment plan, or is connected to billing support for complex cases.',
      },
    ],
    features: [
      {
        title: 'Pre-Due Reminders',
        description: 'Proactive calls before payment is due to prevent overdue situations entirely.',
        icon: 'calendar',
      },
      {
        title: 'Escalation Sequences',
        description: 'Graduated reminder sequences from friendly to firm, with customizable timing and tone.',
        icon: 'layers',
      },
      {
        title: 'Payment Collection',
        description: 'AI sends SMS payment links during the call for instant resolution.',
        icon: 'dollar',
      },
      {
        title: 'Promise Tracking',
        description: 'Track promise-to-pay commitments and automatically follow up on broken promises.',
        icon: 'check',
      },
    ],
    benefits: [
      { metric: '50%', label: 'Faster payment collection' },
      { metric: '30%', label: 'Reduction in overdue accounts' },
      { metric: '85%', label: 'Promise-to-pay fulfillment' },
      { metric: '60%', label: 'Less manual follow-up' },
    ],
    industries: ['Financial Services', 'SaaS', 'Healthcare', 'Insurance'],
  },
];
