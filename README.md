# Κέντρο Ειδικών Θεραπειών Κανδρή Χρ. Κωνσταντίνα

Στατική ιστοσελίδα (HTML/CSS/JS, χωρίς build) του Κέντρου Ειδικών Θεραπειών στον Πύργο Ηλείας.

## Αρχεία

- `index.html`: όλο το περιεχόμενο (σχετικά, υπηρεσίες, χώρος, ομάδα, επικοινωνία)
- `css/style.css`: εμφάνιση · `css/accessibility.css`: εργαλειοθήκη προσβασιμότητας
- `js/main.js`: μενού κινητού, gallery, φόρμα επικοινωνίας · `js/accessibility.js`: εργαλειοθήκη ♿
- `assets/gallery/NN.webp`: φωτογραφίες χώρου (`NN-thumb.webp` = μικρογραφίες)

## Συχνές αλλαγές

- **Google Analytics & κριτικές Google:** συμπληρώστε το `js/config.js`:
  - `gaId`: κωδικός μέτρησης (G-...). Τότε εμφανίζεται μπάρα συγκατάθεσης και το Analytics
    φορτώνεται μόνο αν ο επισκέπτης πατήσει «Αποδοχή».
  - `googleReviewUrl`: σύνδεσμος κριτικής από το Google Business Profile. Τότε εμφανίζεται
    το κουμπί «Γράψτε κριτική».
- **Πολιτική απορρήτου:** `privacy.html`. Αν προστεθεί νέα υπηρεσία (π.χ. φόρμα μέσω Netlify), ενημερώστε την.
- **Φωτογραφίες ομάδας:** βάλτε την εικόνα στο `assets/team/` και αντικαταστήστε το
  `<div class="member-avatar">ΚΚ</div>` με `<img src="assets/team/kandri.webp" alt="Κανδρή Κωνσταντίνα">`.
- **Φόρμα επικοινωνίας:** στέλνεται μέσω Netlify Forms (φόρμα `contact`). Τα μηνύματα φαίνονται στο
  Netlify → Project → Forms. Για ειδοποίηση με email: Project configuration → Notifications →
  Emails and webhooks → Form submission notifications → Add notification → Email notification.

## SEO

- Κύρια διεύθυνση: https://logotherapeia-pyrgos.gr/ (canonical σε κάθε σελίδα).
- `sitemap.xml` και `robots.txt`. Αν προστεθεί νέα σελίδα, προσθέστε τη στο `sitemap.xml`.
- `assets/og-image.jpg` (1200×630): η εικόνα που εμφανίζεται όταν μοιράζεται ο σύνδεσμος.
- `netlify.toml`: headers ασφάλειας και cache εικόνων.

## Τοπική προβολή

```bash
python3 -m http.server 8000   # http://localhost:8000
```
