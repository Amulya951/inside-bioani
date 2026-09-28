/* =====================================================================
   EDITION: September 2026
   ---------------------------------------------------------------------
   Everything month-specific lives here. Empty arrays render as tasteful
   "coming soon" states — never broken sections. Birthdays are NOT listed
   here: they are calculated automatically from data/employees.js.
   Photos are referenced by filename inside assets/photos/.
   ===================================================================== */
IB.editions['2026-09'] = {
  id: '2026-09',
  year: 2026,
  month: 9,                 // 1–12, drives birthdays & anniversaries
  label: 'September 2026',
  tagline: 'Celebrating the people, progress and moments behind the month.',

  /* ---- Founder's speech ----
     status: 'awaiting' | 'published'
     paragraphs: the founder's exact words, one string per paragraph.
     Do not paraphrase. pullQuote must be copied verbatim from paragraphs. */
  founderMessage: {
    status: 'published',
    title: 'A message from the Founder & Chairman',
    paragraphs: [
      'At BioAni, our people are at the heart of everything we do. As we continue to grow and build our businesses across Animal Nutrition, Agriculture, and Human Nutrition & Health, our strength comes from the passion, commitment, and collective efforts of our people.',
      'Every milestone we achieve is a reflection of the teamwork, innovation, and dedication demonstrated across the organization. As we move forward, our focus remains on creating an environment where people are encouraged to collaborate, learn, take ownership, and contribute meaningfully to our shared vision.',
      'This newsletter is a reflection of the people and moments that make BioAni what it is today our achievements, new beginnings, celebrations, innovations, and the initiatives that bring us together.',
      'As we continue this journey, I encourage each of you to embrace new opportunities, challenge the way we think, and work together to build a stronger and more impactful organization.',
      'Let us continue to grow, innovate, and succeed together. \u2728'
    ],
    pullQuote: 'At BioAni, our people are at the heart of everything we do.'
  },

  /* ---- Company highlights for "The month in BioAni" ----
     { title, text, section (optional anchor id to jump to) }            */
  highlights: [],

  /* ---- New joiners: employee ids from data/employees.js ---- */
  newJoiners: [
    'gurpal-singh', 'pankaj-chauhan', 'gaurav-yadav', 'munish-sharma',
    'bikramjit-singh', 'sukhchain-singh', 'amit-kumar', 'ravi-pratap-singh',
    'boby-kumar', 'abhishek-pandey', 'rakesh-kumar-singh', 'md-jishan',
    'piyush-mishra'
  ],

  /* ---- Promotions ----
     { employeeId, from: 'Previous designation', to: 'New designation', note } */
  promotions: [
    { employeeId: 'gaurav-divedi',     from: 'Business Development Executive', to: 'Area Business Executive' },
    { employeeId: 'madhav-maheshwari', from: 'MIS Executive', to: 'MIS and Data Analyst' },
    { employeeId: 'farman-ali-khan',   from: 'Head of National Sales and International Business', to: 'Director of National Sales and International Business' }
  ],

  /* ---- Achievements (non-promotion) ----
     { employeeId or team, title, text }                                   */
  achievements: [],

  /* ---- Extra approved milestones (anniversaries are also auto-calculated
     from joiningDate). { employeeId, label: 'e.g. 5 years' }              */
  milestones: [],

  /* ---- Product spotlight ----
     { brand, name, fullName, category, description,
       images: ['front.jpg', 'angle.jpg', ...]  — photos in turning order;
               2 or more become a drag-to-turn 360° view,
       details: ['fact', ...], detailsNote, whyFeatured, amazonUrl } — or null
     Only facts from the product's own listing or approved by BioAni.     */
  productSpotlight: {
    brand: 'Zeniqua',
    name: 'Bright Bites',
    fullName: 'Zeniqua Bright Bites Premium Kids Multivitamin Gummies',
    category: 'Kids multivitamin gummies',
    description: 'Daily multivitamin gummies for children, from Zeniqua.',
    images: ['bright-bites-1.jpg'],   // add more angles (bright-bites-2.jpg, …) to make it turn 360°
    details: [
      'Essential vitamins, minerals and antioxidants',
      'Fruit flavour',
      'Daily nutrition, growth and wellness support',
      '30 gummies per pack'
    ],
    detailsNote: 'As described on the product\u2019s Amazon listing.',
    whyFeatured: null,
    amazonUrl: 'https://amzn.in/d/0b58RN71'
  },

  /* ---- Innovation stories ----  { title, text, image (optional) }       */
  innovationStories: [],

  /* ---- Events & celebrations ----
     { title, date: 'YYYY-MM-DD', text, photos: ['file.jpg', ...] }        */
  events: [],

  /* ---- Recognition ----
     { employeeId or team, award, text }                                   */
  recognitions: [],

  /* ---- Employee voice (real submissions only) ----
     { employeeId, prompt, text }                                          */
  employeeVoice: [],

  /* ---- Beyond BioAni ----
     { employeeId, title, text, photo (optional) }                         */
  beyond: [],

  /* ---- Opportunities ----
     { title, description, deadline: 'YYYY-MM-DD' (optional),
       ctaLabel, ctaUrl (or ctaEmail) }                                    */
  opportunities: []
};
