export type Programme = {
  title: string;
  copy: string;
  meta: string;
  href: string;
};

export type Testimonial = {
  name: string;
  role: string;
  quote: string;
};

export const programmes: Programme[] = [
  { title: "Life Coaching Certification", copy: "The foundation of all our training — a professionally accredited certification programme with international recognition.", meta: "20+ designations", href: "/contact?programme=Life%20Coaching%20Certification" },
  { title: "NLP Training Program", copy: "Neuro-Linguistic Programming certification designed to teach advanced communication and influence techniques.", meta: "Professional", href: "/contact?programme=NLP%20Training%20Program" },
  { title: "Corporate Coaching Program", copy: "Specialised training for coaching larger corporates, their teams, and organisational development.", meta: "Enterprise", href: "/contact?programme=Corporate%20Coaching%20Program" },
  { title: "Transitional Youth Coaching Program", copy: "Specialised coaching for young professionals and students finding their next direction.", meta: "Youth focused", href: "/contact?programme=Transitional%20Youth%20Coaching%20Program" },
];

export const testimonials: Testimonial[] = [
  { name: "Adunni Okonkwo", role: "Life Coach & Entrepreneur", quote: "Training with Kingshill School of Discovery was the springboard to transforming my career. The practical approach and expert guidance helped me build a successful coaching practice that has impacted over 200 clients." },
  { name: "Emeka Chibueze", role: "Corporate Trainer", quote: "The NLP training program at Kingshill exceeded my expectations. The skills I learned have enhanced my professional capabilities, personal relationships and leadership style." },
  { name: "Fatima Ibrahim", role: "Youth Development Specialist", quote: "The Youth Coaching Program gave me the tools and confidence to make a real impact in young people's lives. I've since launched a youth empowerment organization that has reached over 500 young Nigerians." },
];

export const focusAreas = [
  ["Peak Performance", "Unlock human potential"],
  ["Productivity", "Achieve organisational goals"],
  ["Excellence", "Maintain the highest standards"],
];
