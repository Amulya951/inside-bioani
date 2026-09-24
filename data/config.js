/* =====================================================================
   INSIDE BIOANI — publication config & edition registry
   ---------------------------------------------------------------------
   To publish a new month:
     1. Copy data/editions/2026-09.js → data/editions/YYYY-MM.js and edit.
     2. Add a <script> line for it in index.html (below the other editions).
     3. Add an entry to IB.editionIndex below (newest first).
     4. Set IB.config.currentEdition to the new id.
   ===================================================================== */
window.IB = window.IB || {};

IB.config = {
  publication: 'Inside BioAni',
  company: 'BioAni India Pvt. Ltd.',
  officialSite: 'https://bioani.in/',
  hrEmail: 'hr@bioani.in',

  // Where photo submissions / stories are sent from the "share yours" buttons.
  // Currently HR — change here if a dedicated newsletter inbox is set up.
  submissionsEmail: 'hr@bioani.in',

  // The edition shown when no ?edition= parameter is in the URL.
  currentEdition: '2026-09',

  // Photographs. 'files' = load from photoBase (the folder version).
  // The single-file build embeds photos and switches this automatically.
  photoMode: 'files',
  photoBase: 'assets/photos/',
  photoExt: '.jpg'
};

// Newest first. Only list editions that actually exist in data/editions/.
IB.editionIndex = [
  { id: '2026-09', label: 'September 2026' }
];

IB.editions = {};
