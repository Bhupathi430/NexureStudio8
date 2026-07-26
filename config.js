/* ==========================================================================
   Nexure Studios - Data Configuration File (Firebase Ready)
   ========================================================================== 
   
   To connect this to Firebase later:
   1. Initialize Firebase in your app: import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
   2. Import Firestore: import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
   3. Fetch these objects dynamically inside app.js:
      const db = getFirestore(app);
      const configDoc = await getDoc(doc(db, "settings", "siteConfig"));
      const CONFIG = configDoc.data();
*/

export const CONFIG = {
    // Single pricing package details (starting from ₹6,999 as requested)
    package: {
        title: "All-in-One Custom Website",
        price: "₹6,999",
        subtitle: "Professional, High-Speed & Responsive Design",
        features: [
            "iOS-Style Glassmorphism UI",
            "Smooth Interactive Parallax & Animations",
            "100% Mobile Friendly & Responsive",
            "SEO Optimization & Speed (PageSpeed 95+)",
            "Custom Contact Forms & Lead Catchers",
            "Standard Social Media Integrations",
            "3 Months Free Maintenance & Support",
            "Firebase Database Ready Structure"
        ],
        ctaText: "Get Started Now",
        ctaLink: "#contact"
    },

    // Weekly Top List of Websites
    weeklyTopList: [
        {
            id: 1,
            title: "Aura Luxe Store",
            category: "E-Commerce / Fashion",
            rating: 5,
            views: "1.8K",
            url: "auraluxestore.com",
            colorTheme: "green"
        },
        {
            id: 2,
            title: "Nexure OS Portal",
            category: "Web Application / System",
            rating: 5,
            views: "3.2K",
            url: "nexureos.dev",
            colorTheme: "blue"
        },
        {
            id: 3,
            title: "BMW M340i 3D Config",
            category: "3D Configurator / WebGL",
            rating: 5,
            views: "4.5K",
            url: "bmwm340i-3d.com",
            colorTheme: "orange"
        }
    ]
};
