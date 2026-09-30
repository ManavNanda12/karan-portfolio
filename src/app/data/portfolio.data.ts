/**
 * All site content lives here. Items marked TODO(content) still need
 * confirmation from Karandeep before publishing; set `showDraftMarkers`
 * to false to preview the site without the dashed "to confirm" markers.
 */

export const SITE = {
  name: 'Karandeep Sinh Jadeja',
  firstName: 'Karandeep',
  monogram: 'KJ',
  linkedin: 'https://www.linkedin.com/in/karandeep-sinh-jadeja-87ab55242/',
  linkedinHandle: 'in/karandeep-sinh-jadeja',
  location: 'Ahmedabad, Gujarat, India',
  coords: '23.02° N · 72.57° E',
  // TODO(content): set preferred email — never invent one
  contactEmail: '',
  // TODO(content): drop the résumé into /public (e.g. /resume.pdf) and set the path
  resumeUrl: '',
  // POST endpoint for the contact form (fields: name, email, subject, message).
  // Left empty, the submission is simulated.
  formEndpoint: '',
  showDraftMarkers: true,
  showBeyond: true,
  /** Portrait liquid-ripple strength (0 – 2). */
  rippleStrength: 1,
};

/**
 * Photos. Drop files into /public/images and set the path (e.g. 'images/portrait.jpg').
 * Empty paths render an elegant placeholder.
 */
export const PHOTOS = {
  portrait: 'images/KDMainPhoto.jpg',
  jamnagar: '',
  college: '',
  exeter: '',
  beyond: ['', '', ''],
};

export interface NavLink { id: string; label: string; }

export const NAV: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'journey', label: 'Journey' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'interests', label: 'Interests' },
];

export const HERO_ROLES = [
  'Risk Consulting',
  'Business Analytics',
  'Financial Analysis',
  'Risk Management',
  'Strategic Decision-Making',
];

export const HERO_STATS = [
  { value: 4, suffix: '', label: 'Chapters so far' },
  { value: 10, suffix: '', label: 'Certifications' },
  { value: 2, suffix: '', label: 'Countries studied' },
  { value: 6, suffix: '', label: 'Areas of focus' },
];

export const MARQUEE = [
  'Risk Consulting',
  'Business Analytics',
  'Corporate Finance',
  'Data Analytics',
  'Sustainability',
  'Business Strategy',
  'Governance & Compliance',
];

/** Career at EY — joined Sep 2025, promoted to Senior Analyst Sep 2026. */
export const CAREER = {
  company: 'EY',
  practice: 'Risk Consulting',
  title: 'Senior Analyst',
  location: 'India',
  period: 'Sep 2025 – Present',
  milestones: [
    { date: 'Sep 2025', label: 'Joined EY', detail: 'Risk Consulting' },
    { date: 'Sep 2026', label: 'Promoted to Senior Analyst', detail: 'Within the first year' },
  ],
};

export const ABOUT_FACTS = [
  { label: 'Based in', value: 'Ahmedabad, Gujarat, India' },
  { label: 'Role', value: 'Senior Analyst, Risk Consulting — EY' },
  { label: 'Studied', value: 'University of Exeter, United Kingdom' },
];

export const ABOUT_LEAD =
  'My journey has taken me from Jamnagar, Gujarat, to the University of Exeter in the United Kingdom and into the professional world of risk consulting at EY.';

export const ABOUT_BODY = [
  "With an academic foundation in commerce and an MBA from the University of Exeter, I've developed an interest in understanding how organizations make decisions, manage risks and create sustainable value.",
  'My time at Exeter expanded my exposure to business analytics, financial analysis, data-driven decision-making and sustainability.',
  'Today, as a Senior Analyst in risk consulting at EY, I work with a portfolio of international and national clients, bringing together analytical thinking, business knowledge and an international perspective.',
];

export const FOCUS_AREAS = [
  'Risk consulting and risk management',
  'Business analysis',
  'Analytical problem-solving',
  'Understanding business processes',
  'Corporate governance and compliance',
  'Data-informed business decisions',
];

/** EY role detail. Client names are confidential and intentionally omitted. */
export const EY_RESPONSIBILITIES = [
  'Handling risk consulting engagements for multiple international and national clients',
  'Reviewing business processes, controls and governance to identify and assess risk',
  'Turning analysis into clear, data-informed recommendations for client teams',
];

export const EY_HIGHLIGHTS = [
  'Promoted to Senior Analyst within a year of joining (Sep 2025 → Sep 2026)',
  'Trusted with a portfolio of international and national client engagements',
];

export const PREVIOUS_EXPERIENCE = [
  {
    company: 'ARK',
    role: 'Intern',
    // TODO(content): add internship dates
    period: '',
    points: [
      'Analysed business models, financials, scalability and market positioning to identify acquisition opportunities',
      'Contributed to valuation models and process improvements',
      'Sector exposure across SaaS, content and streaming platforms',
    ],
  },
];

export interface Fact { label: string; value?: string; drafts?: string[]; }

export interface Chapter {
  num: string;
  kicker: string;
  title: string;
  current?: boolean;
  facts: Fact[];
  body: string;
  coursework?: string[];
  activities?: string;
  aside:
    | { kind: 'photo'; src: string; ratio: string; placeholder: string; caption: string; coords?: string }
    | { kind: 'present'; caption: string };
}

export const CHAPTERS: Chapter[] = [
  {
    num: '01',
    kicker: 'The Foundation',
    title: 'Kendriya Vidyalaya No. 2, Jamnagar',
    facts: [
      { label: 'Location', value: 'Jamnagar, Gujarat, India' },
      { label: 'Qualification', value: 'Schooling up to Class 10' },
      { label: 'Period', value: '2008–2017' },
    ],
    body: 'Where the journey began. My early education in Jamnagar provided the foundation for my academic and professional development.',
    aside: { kind: 'photo', src: PHOTOS.jamnagar, ratio: '4/3', placeholder: 'Jamnagar — e.g. Lakhota Lake', caption: 'Jamnagar, Gujarat', coords: '22.47° N · 70.06° E' },
  },
  {
    num: '02',
    kicker: 'Building a Business Foundation',
    // TODO(content): confirm official college name
    title: 'Vidya Sagar',
    facts: [
      { label: 'Qualification', value: 'Bachelor of Commerce (B.Com)' },
      // TODO(content): university affiliation, location, graduation year
      { label: 'To confirm', drafts: ['Official college name', 'Affiliation & location', 'Graduation year'] },
    ],
    body: 'My undergraduate education in commerce introduced me to the foundations of accounting, finance, economics and business.',
    aside: { kind: 'photo', src: PHOTOS.college, ratio: '4/3', placeholder: 'College campus photograph (optional)', caption: 'Bachelor of Commerce' },
  },
  {
    num: '03',
    kicker: 'An International Perspective',
    title: 'University of Exeter',
    facts: [
      { label: 'Location', value: 'Exeter, England, United Kingdom' },
      // TODO(content): verify exact official degree title (client describes it as an MBA)
      { label: 'Qualification', value: 'MBA — The Exeter MBA' },
      { label: 'Period', value: '2023–2024' },
      { label: 'Classification', value: '2:1' },
    ],
    body: 'Studying at the University of Exeter gave me an international perspective on business, analytics and strategic decision-making. Through academic coursework and university activities, I explored the intersection of business, technology, finance and sustainability.',
    coursework: [
      'Topics in Business Analytics',
      'Programming for Business Analytics',
      'Database Technologies',
      'Statistics and Mathematics',
      'Analytics and Visualisation',
      'Marketing Analytics',
      'Strategic and HR Analytics',
      'Environmental Analytics',
      'Design Intelligence',
    ],
    activities: 'Business and Finance Society, Execonsulting, Green Consultant, Finance and Technology Society and Entrepreneur Society.',
    aside: { kind: 'photo', src: PHOTOS.exeter, ratio: '4/5', placeholder: 'Exeter — e.g. campus or Exeter Cathedral', caption: 'Exeter, England', coords: '50.72° N · 3.53° W' },
  },
  {
    num: '04',
    kicker: 'Professional Development',
    title: 'EY',
    current: true,
    facts: [
      { label: 'Role', value: 'Senior Analyst' },
      { label: 'Field', value: 'Risk Consulting' },
      { label: 'Since', value: 'September 2025' },
    ],
    body: 'Joined EY in September 2025 and promoted to Senior Analyst within a year — bringing together my academic background and analytical interests in a professional consulting environment.',
    aside: { kind: 'present', caption: 'Ahmedabad, Gujarat · 23.02° N · 72.57° E' },
  },
];

export interface Cert {
  title: string;
  issuer: string;
  date: string;
  year: string;
  category: string;
  // TODO(content): add verified credential URLs where available
  url: string;
  expired?: string;
}

export const CERTS: Cert[] = [
  { title: 'SAP S/4HANA Essential Training', issuer: 'LinkedIn', date: 'May 2025', year: '2025', category: 'Technology', url: '' },
  { title: 'CSCMP Supply Chain Foundations: The Essentials Professional Certificate', issuer: 'CSCMP', date: 'March 2024', year: '2024', category: 'Project Management', url: '' },
  { title: 'Career Essentials in Business Analysis', issuer: 'Microsoft and LinkedIn', date: 'February 2024', year: '2024', category: 'Business Analysis', url: '' },
  { title: 'Career Essentials in Data Analysis', issuer: 'Microsoft and LinkedIn', date: 'February 2024', year: '2024', category: 'Business Analysis', url: '' },
  { title: 'Career Essentials in Project Management', issuer: 'Microsoft and LinkedIn', date: 'February 2024', year: '2024', category: 'Project Management', url: '' },
  { title: 'Corporate Finance Foundations Professional Certificate', issuer: 'CFI', date: 'February 2024', year: '2024', category: 'Finance', url: '' },
  { title: 'Programming with Python Professional Certificate', issuer: 'OpenEDG Python Institute', date: 'February 2024', year: '2024', category: 'Technology', url: '' },
  { title: 'EXcode Python Course', issuer: 'Exeter Entrepreneurs Society', date: 'January 2024', year: '2024', category: 'Technology', url: '' },
  { title: 'Google Analytics Certification', issuer: 'Google Digital Academy', date: 'Issued February 2024', year: '2024', category: 'Technology', url: '', expired: 'Expired February 2025' },
  { title: 'Introduction to Business Analytics', issuer: 'Udemy', date: 'February 2023', year: '2023', category: 'Business Analysis', url: '' },
];

export const CERT_CATEGORIES = ['All', 'Business Analysis', 'Finance', 'Technology', 'Project Management'];

export const INTERESTS = [
  { title: 'Risk Consulting', body: 'Understanding business risks, governance and organizational processes.' },
  { title: 'Business Analytics', body: 'Using analytical methods to understand complex business questions.' },
  { title: 'Corporate Finance', body: 'Exploring financial performance, financial analysis and business value.' },
  { title: 'Data Analytics', body: 'Applying quantitative thinking and technical tools to business problems.' },
  { title: 'Sustainability', body: 'Understanding the relationship between responsible business practices and long-term value.' },
  { title: 'Business Strategy', body: 'Exploring how organizations make decisions and respond to changing markets.' },
];

export const BEYOND = {
  body: 'At the University of Exeter, activities outside the classroom included football, hockey and powerlifting.',
  photos: [
    { caption: 'Football', src: PHOTOS.beyond[0] },
    { caption: 'Hockey', src: PHOTOS.beyond[1] },
    { caption: 'Powerlifting', src: PHOTOS.beyond[2] },
  ],
};

/**
 * Social profiles shown in the footer. Entries with an empty `href` are hidden,
 * so add a URL to switch one on. Email uses SITE.contactEmail.
 */
export const SOCIALS: { id: 'linkedin' | 'email' | 'instagram' | 'x'; label: string; href: string }[] = [
  { id: 'linkedin', label: 'LinkedIn', href: SITE.linkedin },
  { id: 'email', label: 'Email', href: SITE.contactEmail ? `mailto:${SITE.contactEmail}` : '' },
  // TODO(content): add profile URLs to show these
  { id: 'instagram', label: 'Instagram', href: '' },
  { id: 'x', label: 'X', href: '' },
];

export const FOOTER_LINKS: NavLink[] = [
  { id: 'about', label: 'About' },
  { id: 'certifications', label: 'Certifications' },
  { id: 'experience', label: 'Experience' },
  { id: 'interests', label: 'Interests' },
  { id: 'journey', label: 'Journey' },
  { id: 'contact', label: 'Contact' },
];
