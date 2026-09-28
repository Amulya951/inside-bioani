/* =====================================================================
   COMPANY DATA — changes rarely (not per edition).
   ===================================================================== */

/* ---------- Founder ----------
   Photo: assets/photos/founder-photo.jpg */
IB.founder = {
  name: 'Debabrata Sarkar',
  designation: 'Founder & Chairman',
  photo: 'founder-photo.jpg',     // letter portrait (4:5)
  avatar: 'founder-avatar.jpg'    // small round portrait in Leadership (square, optional)
};

/* ---------- Leadership ----------
   Add one object per leader. Only use supplied information.
   { name, designation, area (department / business area),
     photo (optional filename, e.g. "Firstname_Lastname.jpg") }       */
IB.leadership = [
  // Source: "Core Leadership Team" slide (New Hire Orientation), in slide order.
  { name: 'Kapil Kumar',         designation: 'Director', area: 'India Business Nutra Agri & Animal',      photo: 'leader-kapil-kumar.jpg' },
  { name: 'Dr. Ronak S. Chhaya', designation: 'Director', area: 'R&D and Sourcing',                        photo: 'leader-ronak-chhaya.jpg' },
  { name: 'Dr. Kuldeep Sharma',  designation: 'Vice President', area: 'Registration and Agronomy Agriculture',   photo: 'leader-kuldeep-sharma.jpg' },
  { name: 'Kishore Mitra',       designation: 'Director', area: 'Strategy and New Business',               photo: 'leader-kishore-mitra.jpg' },
  { name: 'Pranav Goswami',      designation: 'Director', area: 'Media Relations',                         photo: 'leader-pranav-goswami.jpg' },
  { name: 'Shivani Pawar',       designation: 'Group CHRO', area: 'Human Resources',                       photo: 'leader-shivani-pawar.jpg' },
  { name: 'Rajeev Chakraborty',  designation: 'Director', area: 'Creative & Marketing (Midaas)',           photo: 'leader-rajeev-chakraborty.jpg' },
  { name: 'Rinila Sarkar',       designation: 'Director', area: 'Organization Relationship',               photo: 'leader-rinila-sarkar.jpg' }
];

/* ---------- Business areas ----------
   SOURCE: paraphrased from public text on bioani.in (May–June 2026).
   The public site does not label the animal-nutrition text as "Zenivet";
   it has been placed under Zenivet by assumption. Please verify all four
   descriptions with the business teams before the edition goes out.      */
IB.businesses = [
  {
    id: 'zeniqua',
    name: 'Zeniqua',
    kind: 'Nutraceuticals',
    line: 'Everyday wellness, formulated with purpose.',
    text: 'BioAni\u2019s premium nutraceutical brand. Zeniqua brings together Ayurvedic wisdom, modern nutrients and research-driven actives in formulations built around specific health goals.',
    motif: 'leaf',
    verified: false
  },
  {
    id: 'zq-pharmaceutical',
    name: 'ZQ Pharmaceutical',
    kind: 'Pharmaceutical formulations',
    line: 'Science and safety, batch after batch.',
    text: 'Pharmaceutical formulations developed with a strong focus on science, safety and strict quality control, designed to support healthcare professionals and their patients.',
    motif: 'capsule',
    verified: false
  },
  {
    id: 'zenivet',
    name: 'Zenivet',
    kind: 'Animal nutrition',
    line: 'Healthy from the inside out, on four legs too.',
    text: 'Nutrition for animals, from companion pets to responsibly raised livestock, with a focus on digestion, immunity, joints, skin and overall vitality.',
    motif: 'paw',
    verified: false
  },
  {
    id: 'agritech',
    name: 'Sustainable AgriTech',
    kind: 'Microalgae, soil & climate',
    line: 'Turning carbon into healthier soil.',
    text: 'Microalgae-led work that captures CO\u2082 through photosynthesis, converts it into stable biomass and helps restore soil health for future generations.',
    motif: 'cell',
    verified: false
  }
];

/* ---------- How BioAni grows microalgae (Innovation explainer) ----------
   SOURCE: bioani.in home page, microalgae section. A genuine sequence.  */
IB.microalgaeSteps = [
  { title: 'Choose the strain', text: 'Advanced strain selection, picking microalgae for the nutrition and function a product needs.' },
  { title: 'Grow the culture', text: 'Cultivation that combines open ponds, closed photobioreactors and fermentation systems.' },
  { title: 'Harvest and stabilise', text: 'Technology-driven harvesting, stabilisation and formulation turn biomass into usable ingredients.' },
  { title: 'Keep improving', text: 'Continuous R&D on products, processes and new applications.' }
];

/* ---------- Quick Game Corner: "Grow the culture" ----------
   Every BioAni fact below is drawn from bioani.in. The rest is standard
   science. Add or swap questions freely; 5–7 keeps it a coffee-break game. */
IB.quiz = {
  title: 'Grow the culture',
  intro: 'Six quick questions. Every right answer feeds the flask. Fill it to the top.',
  questions: [
    {
      q: 'What does BioAni call its core biological engine for sustainable development?',
      options: ['Mushrooms', 'Microalgae', 'Seaweed farms', 'Brewer\u2019s yeast'],
      answer: 1,
      why: 'Microalgae links nutrition, agriculture, energy and climate work across BioAni.'
    },
    {
      q: 'Zeniqua is BioAni\u2019s\u2026',
      options: ['Soil conditioner', 'Research laboratory', 'Premium nutraceutical brand', 'Animal feed range'],
      answer: 2,
      why: 'Zeniqua is BioAni\u2019s premium nutraceutical brand for everyday wellness.'
    },
    {
      q: 'How do microalgae capture carbon dioxide?',
      options: ['Photosynthesis', 'Fermentation', 'Evaporation', 'Filtration'],
      answer: 0,
      why: 'Like plants, microalgae use sunlight to turn CO\u2082 into biomass.'
    },
    {
      q: 'BioAni\u2019s microalgae work supports \u201cOne Health\u201d. Which of these is not part of it?',
      options: ['Human health', 'Animal health', 'Soil health', 'Machine health'],
      answer: 3,
      why: 'One Health covers human, animal, soil and planetary health. Machines can look after themselves.'
    },
    {
      q: 'Which of these is a closed, controlled system for growing microalgae?',
      options: ['Open pond', 'Photobioreactor', 'Compost pit', 'Greenhouse bench'],
      answer: 1,
      why: 'A photobioreactor keeps light, temperature and nutrients under control. BioAni uses both ponds and photobioreactors.'
    },
    {
      q: 'True or false: a single microalgae biomass can support human nutrition, animal feed and soil health.',
      options: ['True', 'False'],
      answer: 0,
      why: 'That regenerative, one-biomass-many-uses model is central to how BioAni describes its work.'
    }
  ]
};
