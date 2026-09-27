// Ρυθμίσεις ιστοσελίδας — συμπληρώστε τις τιμές και οι λειτουργίες ενεργοποιούνται αυτόματα.
window.SITE_CONFIG = {
  // Google Analytics: κωδικός μέτρησης από analytics.google.com
  // (Διαχείριση → Ροές δεδομένων → Web), π.χ. 'G-AB12CD34EF'.
  // Κενό = δεν φορτώνεται Analytics και δεν εμφανίζεται μπάρα cookies.
  gaId: '',

  // Σύνδεσμος για νέα κριτική στο Google, από business.google.com →
  // «Ζητήστε κριτικές» (μορφή https://g.page/r/.../review).
  // Κενό = το κουμπί «Γράψτε κριτική» δεν εμφανίζεται.
  googleReviewUrl: '/kritiki'  // → netlify.toml: ανακατεύθυνση στο προφίλ Google
};
