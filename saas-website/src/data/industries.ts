export interface Industry {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  heroDescription: string;
  challenges: string[];
  solutions: Array<{
    title: string;
    description: string;
    icon: string;
  }>;
  benefits: Array<{
    metric: string;
    label: string;
  }>;
  useCases: string[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
    company: string;
  };
}

export const industries: Industry[] = [
  {
    slug: 'real-estate',
    name: 'Real Estate',
    tagline: 'Close more deals with AI-powered calling',
    description:
      'Automate lead qualification, property tour scheduling, and follow-ups so agents can focus on closing.',
    heroDescription:
      'Real estate agents waste 60% of their time on repetitive calls. Voxeia AI agents handle lead qualification, schedule property viewings, send follow-ups after tours, and manage rent collection reminders — all while you focus on closing deals.',
    challenges: [
      'Manually qualifying hundreds of leads wastes agent time',
      'Missed follow-ups after property viewings cost deals',
      'Scheduling conflicts and no-shows reduce productivity',
      'Rent collection calls are time-consuming and awkward',
    ],
    solutions: [
      {
        title: 'AI Lead Qualification',
        description:
          'Automatically call and qualify new leads based on budget, timeline, and preferences before routing to agents.',
        icon: 'users',
      },
      {
        title: 'Smart Scheduling',
        description:
          'AI agents coordinate property viewings, handle rescheduling, and send confirmations — zero manual effort.',
        icon: 'calendar',
      },
      {
        title: 'Post-Tour Follow-ups',
        description:
          'Automated follow-up calls after viewings to gauge interest, answer questions, and push toward closing.',
        icon: 'phone',
      },
      {
        title: 'Rent Collection',
        description:
          'Tactful, professional AI calls for rent reminders and payment follow-ups that maintain tenant relationships.',
        icon: 'dollar',
      },
    ],
    benefits: [
      { metric: '60%', label: 'Time saved per agent' },
      { metric: '3x', label: 'More leads qualified daily' },
      { metric: '40%', label: 'Increase in viewing bookings' },
      { metric: '25%', label: 'Faster deal closure' },
    ],
    useCases: [
      'Lead Qualification',
      'Scheduling property viewings',
      'Post-tour follow-ups',
      'Rent collection reminders',
      'Open house invitations',
    ],
    testimonial: {
      quote:
        'Voxeia handles our lead qualification calls perfectly. Our agents now only speak with pre-qualified prospects, and our closing rate has doubled.',
      author: 'Rohan Malhotra',
      role: 'Brokerage Director',
      company: 'UrbanNest Properties',
    },
  },
  {
    slug: 'healthcare',
    name: 'Healthcare',
    tagline: 'Reduce no-shows and improve patient outcomes',
    description: 'AI agents handle appointment reminders, prescription refills, and patient follow-ups at scale.',
    heroDescription:
      'Healthcare providers lose billions annually to no-shows and missed follow-ups. Voxeia AI agents automate appointment reminders, handle prescription refill calls, conduct post-visit surveys, and manage insurance verification — improving patient outcomes while reducing staff workload.',
    challenges: [
      'High no-show rates cost practices thousands monthly',
      'Staff overwhelmed with routine reminder calls',
      'Post-visit follow-ups often fall through the cracks',
      'Insurance verification calls are tedious and time-consuming',
    ],
    solutions: [
      {
        title: 'Appointment Reminders',
        description: 'Multi-channel AI reminders via calls that reduce no-show rates by up to 40%.',
        icon: 'calendar',
      },
      {
        title: 'Prescription Refill Alerts',
        description: 'Proactive calls to patients when prescriptions need refilling, improving medication adherence.',
        icon: 'pill',
      },
      {
        title: 'Post-Visit Surveys',
        description: 'Automated patient satisfaction calls that collect actionable feedback and flag concerns.',
        icon: 'clipboard',
      },
      {
        title: 'Insurance Verification',
        description: 'AI handles tedious insurance verification calls, freeing staff for patient-facing tasks.',
        icon: 'shield',
      },
    ],
    benefits: [
      { metric: '40%', label: 'Reduction in no-shows' },
      { metric: '85%', label: 'Patient satisfaction score' },
      { metric: '50%', label: 'Less staff time on calls' },
      { metric: '30%', label: 'Improvement in follow-up rates' },
    ],
    useCases: [
      'Appointment reminders',
      'Prescription refill alerts',
      'Post-visit follow-ups',
      'Insurance verification',
      'Health screening invitations',
    ],
    testimonial: {
      quote:
        'Our no-show rate dropped from 22% to 13% within the first month. The AI calls sound natural, and patients actually respond well to them.',
      author: 'Dr. Ananya Verma',
      role: 'Practice Manager',
      company: 'LifeCare Clinics',
    },
  },
  {
    slug: 'financial-services',
    name: 'Financial Services',
    tagline: 'Automate collections and boost conversion',
    description: 'Compliant AI agents for payment reminders, loan follow-ups, and KYC verification calls.',
    heroDescription:
      'Financial institutions make millions of calls monthly for payments, collections, and verifications. Voxeia AI agents handle payment reminders, loan offer follow-ups, debt collection, and KYC verification with full compliance and empathetic conversations.',
    challenges: [
      'High volume of repetitive payment reminder calls',
      'Compliance requirements make manual calling risky',
      'Low conversion rates on loan product follow-ups',
      'KYC verification calls are time-intensive',
    ],
    solutions: [
      {
        title: 'Payment Reminders',
        description:
          'Automated, compliant payment due date reminders that reduce delinquency rates and improve cash flow.',
        icon: 'dollar',
      },
      {
        title: 'Loan Follow-ups',
        description:
          'AI agents follow up on pre-approved loan offers with personalized conversations that drive conversion.',
        icon: 'trending',
      },
      {
        title: 'Collections',
        description:
          'Empathetic, regulation-compliant collection calls that maintain customer relationships while recovering payments.',
        icon: 'phone',
      },
      {
        title: 'KYC Verification',
        description:
          'Streamlined identity verification calls that reduce processing time and improve onboarding speed.',
        icon: 'shield',
      },
    ],
    benefits: [
      { metric: '25%', label: 'Better collection rates' },
      { metric: '35%', label: 'Increase in loan conversions' },
      { metric: '60%', label: 'Reduction in call costs' },
      { metric: '99.9%', label: 'Compliance rate' },
    ],
    useCases: [
      'Payment reminders',
      'Loan offer follow-ups',
      'Debt collection',
      'KYC verification',
      'Account activation',
    ],
    testimonial: {
      quote:
        'Voxeia transformed our collections process. We recover 25% more while maintaining positive customer relationships. The compliance features give us peace of mind.',
      author: 'Vikram Singh',
      role: 'VP Collections',
      company: 'Apex Financial Services',
    },
  },
  {
    slug: 'insurance',
    name: 'Insurance',
    tagline: 'Accelerate policy sales and renewals',
    description: 'AI-powered calling for lead generation, policy renewals, and claims follow-ups.',
    heroDescription:
      'Insurance companies rely heavily on outbound calls for lead generation, policy renewals, and claims processing. Voxeia AI agents automate these conversations with human-like interactions, ensuring no renewal is missed and every lead is contacted promptly.',
    challenges: [
      'Policy renewals require timely, personalized outreach',
      'Lead follow-up delays result in lost opportunities',
      'Claims status update calls burden support staff',
      'Cross-selling and upselling require trained agents',
    ],
    solutions: [
      {
        title: 'Policy Renewal Calls',
        description:
          'Proactive AI calls before policy expiration with personalized renewal offers and easy confirmation.',
        icon: 'refresh',
      },
      {
        title: 'Lead Generation',
        description:
          'AI agents contact and qualify insurance leads, gathering requirements and scheduling agent callbacks.',
        icon: 'users',
      },
      {
        title: 'Claims Follow-ups',
        description: 'Automated claims status update calls that keep policyholders informed throughout the process.',
        icon: 'clipboard',
      },
      {
        title: 'Cross-sell Campaigns',
        description: 'Intelligent AI calls that identify cross-sell opportunities based on existing policy portfolios.',
        icon: 'trending',
      },
    ],
    benefits: [
      { metric: '45%', label: 'Higher renewal rates' },
      { metric: '3x', label: 'Faster lead response time' },
      { metric: '50%', label: 'Reduction in support calls' },
      { metric: '30%', label: 'Cross-sell conversion rate' },
    ],
    useCases: [
      'Policy renewal reminders',
      'Lead qualification',
      'Claims status updates',
      'Cross-selling campaigns',
      'Customer onboarding',
    ],
    testimonial: {
      quote:
        'Our renewal rate jumped from 72% to 88% after implementing Voxeia. The AI remembers policy details and has natural conversations that customers appreciate.',
      author: 'Priya Nair',
      role: 'Head of Operations',
      company: 'SecureLife Insurance',
    },
  },
  {
    slug: 'logistics-transportation',
    name: 'Logistics & Transportation',
    tagline: 'Streamline dispatch and delivery operations',
    description: 'AI agents for delivery confirmations, dispatch coordination, and fleet management calls.',
    heroDescription:
      'Logistics companies handle thousands of time-sensitive calls daily for dispatch, delivery confirmations, and driver coordination. Voxeia AI agents automate these communications, ensuring timely updates and reducing missed deliveries.',
    challenges: [
      'Coordinating deliveries requires constant phone communication',
      'Missed delivery attempts waste fuel and time',
      'Driver dispatch needs real-time coordination',
      'Customer delivery updates are often delayed',
    ],
    solutions: [
      {
        title: 'Delivery Confirmations',
        description: 'AI calls customers to confirm delivery windows, reducing failed attempts and return logistics.',
        icon: 'truck',
      },
      {
        title: 'Dispatch Coordination',
        description:
          'Automated dispatch calls to drivers with route information, pickup details, and schedule changes.',
        icon: 'map',
      },
      {
        title: 'Status Updates',
        description: 'Proactive delivery status calls to customers keeping them informed of ETAs and any delays.',
        icon: 'clock',
      },
      {
        title: 'Fleet Communication',
        description:
          'Broadcast important updates to fleet drivers instantly for weather alerts, route changes, or emergencies.',
        icon: 'radio',
      },
    ],
    benefits: [
      { metric: '35%', label: 'Fewer missed deliveries' },
      { metric: '50%', label: 'Reduction in dispatch calls' },
      { metric: '90%', label: 'Customer satisfaction rate' },
      { metric: '20%', label: 'Fuel cost savings' },
    ],
    useCases: [
      'Delivery confirmations',
      'Dispatch coordination',
      'Status updates',
      'Driver communication',
      'Schedule changes',
    ],
    testimonial: {
      quote:
        'Voxeia cut our missed deliveries by a third. Customers love the proactive updates, and our dispatchers can focus on exceptions rather than routine calls.',
      author: 'Rajesh Kumar',
      role: 'Operations Manager',
      company: 'SwiftLogix',
    },
  },
  {
    slug: 'home-services',
    name: 'Home Services',
    tagline: 'Never miss a service call again',
    description: 'AI receptionist and scheduling for plumbers, electricians, HVAC, and home service businesses.',
    heroDescription:
      'Home service businesses lose up to 40% of calls when technicians are in the field. Voxeia AI agents act as your 24/7 receptionist — answering calls, booking appointments, sending reminders, and following up on quotes so no job is ever lost.',
    challenges: [
      'Missed calls during field work mean lost customers',
      'Scheduling and rescheduling consumes office staff time',
      'Quote follow-ups often get forgotten',
      'Seasonal demand spikes overwhelm phone systems',
    ],
    solutions: [
      {
        title: 'AI Receptionist',
        description:
          '24/7 AI answers every call, captures job details, and books appointments even when you are in the field.',
        icon: 'phone',
      },
      {
        title: 'Appointment Scheduling',
        description:
          'Smart scheduling that considers technician availability, location, and job type for optimal routing.',
        icon: 'calendar',
      },
      {
        title: 'Quote Follow-ups',
        description: 'Automated follow-up calls on pending quotes that convert more estimates into booked jobs.',
        icon: 'dollar',
      },
      {
        title: 'Review Requests',
        description:
          'Post-service calls requesting reviews on Google and other platforms to build your online reputation.',
        icon: 'star',
      },
    ],
    benefits: [
      { metric: '95%', label: 'Calls answered' },
      { metric: '40%', label: 'More jobs booked' },
      { metric: '3x', label: 'Quote conversion rate' },
      { metric: '4.8★', label: 'Average review rating' },
    ],
    useCases: [
      '24/7 call answering',
      'Appointment scheduling',
      'Quote follow-ups',
      'Service reminders',
      'Review collection',
    ],
    testimonial: {
      quote:
        'Before Voxeia, we missed 4 out of 10 calls. Now every single call is answered, and our booking rate has skyrocketed. It is like having a full-time receptionist for a fraction of the cost.',
      author: 'Mike Thompson',
      role: 'Owner',
      company: 'ProFix Plumbing',
    },
  },
  {
    slug: 'retail-consumer',
    name: 'Retail & Consumer',
    tagline: 'Recover carts and drive repeat purchases',
    description: 'AI agents for abandoned cart recovery, order updates, and personalized outreach.',
    heroDescription:
      'Online retailers lose 70% of shopping carts to abandonment. Voxeia AI agents make personalized recovery calls, handle order status inquiries, drive repeat purchases with product announcements, and manage returns — turning lost sales into revenue.',
    challenges: [
      'High cart abandonment rates drain potential revenue',
      'Order status inquiries flood support teams',
      'Personalized outreach at scale is nearly impossible manually',
      'Return and refund calls are time-consuming',
    ],
    solutions: [
      {
        title: 'Cart Recovery',
        description:
          'AI calls customers within hours of abandonment with personalized offers that recover 35% of lost carts.',
        icon: 'cart',
      },
      {
        title: 'Order Updates',
        description: 'Proactive order status, shipping, and delivery calls that reduce inbound support volume by 60%.',
        icon: 'package',
      },
      {
        title: 'Product Launches',
        description:
          'Targeted AI calls to VIP customers for new product announcements, early access offers, and flash sales.',
        icon: 'megaphone',
      },
      {
        title: 'Return Management',
        description: 'Streamlined return processing calls that handle logistics and offer exchanges to retain revenue.',
        icon: 'refresh',
      },
    ],
    benefits: [
      { metric: '35%', label: 'Cart recovery rate' },
      { metric: '60%', label: 'Fewer support inquiries' },
      { metric: '25%', label: 'Higher repeat purchase rate' },
      { metric: '15%', label: 'Revenue increase' },
    ],
    useCases: [
      'Abandoned cart recovery',
      'Order status updates',
      'Product launch announcements',
      'Return processing',
      'Loyalty program outreach',
    ],
    testimonial: {
      quote:
        'We recovered over ₹50 lakhs in abandoned carts in our first quarter with Voxeia. The AI calls feel personal and customers convert at a surprisingly high rate.',
      author: 'Sneha Kapoor',
      role: 'E-Commerce Director',
      company: 'TrendCart',
    },
  },
  {
    slug: 'travel-hospitality',
    name: 'Travel & Hospitality',
    tagline: 'Delight guests with seamless AI communication',
    description: 'AI agents for booking confirmations, itinerary changes, and guest experience management.',
    heroDescription:
      'Travel and hospitality businesses operate across time zones and handle constant booking changes. Voxeia AI agents manage booking confirmations, itinerary modifications, check-in calls, loyalty outreach, and guest follow-ups — 24/7, in multiple languages.',
    challenges: [
      'Booking confirmations and changes require 24/7 availability',
      'Multi-timezone operations complicate call scheduling',
      'Guest feedback collection is often neglected',
      'Seasonal demand spikes overwhelm reservation teams',
    ],
    solutions: [
      {
        title: 'Booking Management',
        description: 'AI handles booking confirmations, modifications, and cancellations across all time zones, 24/7.',
        icon: 'calendar',
      },
      {
        title: 'Guest Communication',
        description:
          'Pre-arrival calls with check-in details, local tips, and special offer upsells that enhance the experience.',
        icon: 'hotel',
      },
      {
        title: 'Loyalty Outreach',
        description:
          'Personalized calls to loyalty members with exclusive offers, birthday celebrations, and VIP upgrades.',
        icon: 'star',
      },
      {
        title: 'Post-Stay Surveys',
        description:
          'Automated guest satisfaction calls that collect reviews and flag issues for immediate resolution.',
        icon: 'clipboard',
      },
    ],
    benefits: [
      { metric: '3x', label: 'Faster booking confirmations' },
      { metric: '28%', label: 'Higher guest satisfaction' },
      { metric: '35%', label: 'Increase in upsell revenue' },
      { metric: '24/7', label: 'Availability across time zones' },
    ],
    useCases: [
      'Booking confirmations',
      'Itinerary changes',
      'Check-in reminders',
      'Guest feedback',
      'Loyalty campaigns',
    ],
    testimonial: {
      quote:
        'Voxeia handles our booking confirmations across 3 time zones flawlessly. Guest satisfaction scores are up 28% and our team can focus on creating memorable experiences.',
      author: 'David Chen',
      role: 'GM',
      company: 'Horizon Hotels Group',
    },
  },
  {
    slug: 'debt-collection',
    name: 'Debt Collection',
    tagline: 'Recover more with empathetic AI agents',
    description: 'Compliant, empathetic AI calling for debt recovery that maintains customer relationships.',
    heroDescription:
      'Debt collection is one of the most call-intensive industries. Voxeia AI agents make empathetic, fully compliant collection calls at scale — recovering more debt while preserving customer relationships and meeting all regulatory requirements.',
    challenges: [
      'High call volumes require large, expensive agent teams',
      'Compliance regulations are complex and constantly changing',
      'Aggressive tactics damage brand reputation',
      'Manual processes limit scale and recovery rates',
    ],
    solutions: [
      {
        title: 'Empathetic Collections',
        description:
          'AI agents trained in empathetic communication that negotiate payment plans while maintaining dignity.',
        icon: 'heart',
      },
      {
        title: 'Compliance Engine',
        description:
          'Built-in compliance with FDCPA, TCPA, and regional regulations — calls are automatically audited.',
        icon: 'shield',
      },
      {
        title: 'Payment Arrangements',
        description:
          'AI negotiates and confirms payment plans, processes promises to pay, and sets up installment schedules.',
        icon: 'dollar',
      },
      {
        title: 'Skip Tracing Calls',
        description:
          'Automated calls to verify contact information and locate debtors through intelligent questioning.',
        icon: 'search',
      },
    ],
    benefits: [
      { metric: '30%', label: 'Higher recovery rates' },
      { metric: '100%', label: 'Regulatory compliance' },
      { metric: '70%', label: 'Cost reduction' },
      { metric: '5x', label: 'More accounts contacted' },
    ],
    useCases: [
      'Payment reminder calls',
      'Payment plan negotiation',
      'Promise to pay confirmations',
      'Skip tracing',
      'Compliance monitoring',
    ],
    testimonial: {
      quote:
        'Voxeia recovers 30% more than our previous process while maintaining full compliance. The empathetic tone actually improves our customer relationships during a difficult process.',
      author: 'Amanda Richards',
      role: 'Collections Director',
      company: 'AccuRecover',
    },
  },
  {
    slug: 'recruitment',
    name: 'Recruitment',
    tagline: 'Screen candidates faster with AI calling',
    description: 'AI agents for candidate screening, interview scheduling, and recruitment outreach.',
    heroDescription:
      'Recruiters spend 80% of their time on phone screens and scheduling. Voxeia AI agents conduct initial phone screenings, schedule interviews, follow up with candidates, and manage the communication pipeline — so recruiters focus on finding the perfect match.',
    challenges: [
      'Initial phone screens consume most recruiter time',
      'Interview scheduling is a constant back-and-forth',
      'Candidate ghosting wastes time and resources',
      'High-volume recruiting requires large teams',
    ],
    solutions: [
      {
        title: 'AI Phone Screens',
        description:
          'AI conducts initial phone screens using customized questions, evaluates responses, and scores candidates.',
        icon: 'users',
      },
      {
        title: 'Interview Scheduling',
        description:
          'Automated scheduling between candidates and interviewers with calendar integration and reminders.',
        icon: 'calendar',
      },
      {
        title: 'Candidate Follow-ups',
        description: 'Persistent, professional follow-ups with candidates to reduce ghosting and maintain engagement.',
        icon: 'phone',
      },
      {
        title: 'Offer Communication',
        description:
          'AI handles offer details, answers common questions, and confirms acceptance — speeding up the hiring cycle.',
        icon: 'check',
      },
    ],
    benefits: [
      { metric: '70%', label: 'Faster screening time' },
      { metric: '50%', label: 'Reduction in no-shows' },
      { metric: '3x', label: 'More candidates processed' },
      { metric: '40%', label: 'Shorter time to hire' },
    ],
    useCases: [
      'Initial phone screening',
      'Interview scheduling',
      'Candidate follow-ups',
      'Offer communication',
      'Onboarding calls',
    ],
    testimonial: {
      quote:
        'We process 3x more candidates with Voxeia handling our initial screens. The AI asks the right questions and our recruiters only interview pre-qualified talent.',
      author: 'Lisa Park',
      role: 'Head of Talent',
      company: 'TalentBridge',
    },
  },
  {
    slug: 'voice-ai-for-crms',
    name: 'Voice AI for CRMs',
    tagline: 'Supercharge your CRM with AI calling',
    description: 'Deep CRM integration that triggers AI calls based on pipeline stages and customer data.',
    heroDescription:
      'Your CRM data is powerful — but only if you act on it. Voxeia integrates deeply with Salesforce, HubSpot, Zoho, and more to automatically trigger AI calls based on pipeline stages, deal status, customer behavior, and workflow rules.',
    challenges: [
      'CRM data goes stale without timely follow-up calls',
      'Manual dialing from CRM records is slow and error-prone',
      'Pipeline stages change but follow-ups lag behind',
      'No easy way to trigger calls based on CRM events',
    ],
    solutions: [
      {
        title: 'CRM-Triggered Calls',
        description:
          'Automatically trigger AI calls when deals change stages, leads come in, or tasks are created in your CRM.',
        icon: 'zap',
      },
      {
        title: 'Two-Way Sync',
        description:
          'Call outcomes, recordings, and transcripts are automatically logged back to the CRM contact record.',
        icon: 'refresh',
      },
      {
        title: 'Pipeline Automation',
        description:
          'AI calls at each pipeline stage — qualification, demo scheduling, proposal follow-up, and closing.',
        icon: 'funnel',
      },
      {
        title: 'Smart Workflows',
        description:
          'Build custom calling workflows based on any CRM field, tag, or event with our visual workflow builder.',
        icon: 'workflow',
      },
    ],
    benefits: [
      { metric: '45%', label: 'Faster pipeline velocity' },
      { metric: '100%', label: 'CRM data accuracy' },
      { metric: '60%', label: 'More contacts reached' },
      { metric: '35%', label: 'Higher conversion rate' },
    ],
    useCases: [
      'Pipeline-triggered calls',
      'Lead follow-up automation',
      'Deal stage progression',
      'Customer win-back',
      'Data enrichment calls',
    ],
    testimonial: {
      quote:
        'The Salesforce integration is seamless. Every call is logged automatically, and our pipeline velocity increased 45% because no lead falls through the cracks anymore.',
      author: 'James Wilson',
      role: 'Sales Operations Manager',
      company: 'CloudScale Tech',
    },
  },
  {
    slug: 'telecom',
    name: 'Telecom',
    tagline: 'Scale customer operations with AI voice',
    description: 'AI agents for plan renewals, service activations, customer retention, and support.',
    heroDescription:
      'Telecom companies handle the highest call volumes of any industry. Voxeia AI agents manage plan renewals, service activations, churn prevention calls, payment reminders, and tier-1 support — reducing costs while improving customer experience.',
    challenges: [
      'Massive call volumes require enormous contact centers',
      'Churn prevention requires timely, personalized outreach',
      'Plan upgrades and renewals need proactive calling',
      'Tier-1 support calls can be automated but often are not',
    ],
    solutions: [
      {
        title: 'Plan Renewals',
        description:
          'Proactive renewal calls with personalized upgrade offers based on usage patterns and account history.',
        icon: 'refresh',
      },
      {
        title: 'Churn Prevention',
        description: 'AI detects at-risk customers and makes retention calls with targeted offers before they switch.',
        icon: 'shield',
      },
      {
        title: 'Service Activation',
        description:
          'Guided activation calls that walk customers through new service setup and verify everything works.',
        icon: 'phone',
      },
      {
        title: 'Tier-1 Support',
        description: 'AI handles common support queries — billing questions, plan details, outage updates — 24/7.',
        icon: 'headset',
      },
    ],
    benefits: [
      { metric: '40%', label: 'Reduction in churn' },
      { metric: '65%', label: 'Support cost savings' },
      { metric: '50%', label: 'Higher renewal rates' },
      { metric: '24/7', label: 'Support availability' },
    ],
    useCases: [
      'Plan renewal outreach',
      'Churn prevention',
      'Service activation',
      'Billing support',
      'Outage notifications',
    ],
    testimonial: {
      quote:
        'Voxeia handles 2 million support calls per month for us. Customer satisfaction went up while our costs dropped by 65%. The ROI was visible within the first quarter.',
      author: 'Arjun Mehta',
      role: 'CTO',
      company: 'ConnectTel',
    },
  },
];
