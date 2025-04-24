
import React, { createContext, useContext, useState, useEffect } from 'react';

// Define translation object types
type TranslationsType = {
  [key: string]: {
    en: string;
    hi: string;
  };
};

// Define translations
const translations: TranslationsType = {
  // Common UI elements
  home: {
    en: "Home",
    hi: "होम",
  },
  imageTools: {
    en: "Image Tools",
    hi: "इमेज टूल्स",
  },
  pdfTools: {
    en: "PDF Tools",
    hi: "पीडीएफ टूल्स",
  },
  getStarted: {
    en: "Get Started",
    hi: "शुरू करें",
  },
  // Hero section
  heroTitle: {
    en: "Free Online Tools for",
    hi: "इमेज और पीडीएफ के लिए",
  },
  heroTitleHighlight: {
    en: "Images & PDFs",
    hi: "मुफ्त ऑनलाइन टूल्स",
  },
  heroSubtitle: {
    en: "Professional-grade tools to edit, convert, and enhance your files. No signup required. 100% free.",
    hi: "अपनी फाइलों को एडिट, कन्वर्ट और एन्हांस करने के लिए प्रोफेशनल-ग्रेड टूल्स। साइनअप की आवश्यकता नहीं। 100% मुफ्त।",
  },
  // Features section
  whyChoose: {
    en: "Why Choose BihariTool",
    hi: "BihariTool क्यों चुनें",
  },
  secure: {
    en: "100% Secure",
    hi: "100% सुरक्षित",
  },
  secureDesc: {
    en: "Your files are processed locally. They never leave your device.",
    hi: "आपकी फाइलें लोकल रूप से प्रोसेस की जाती हैं। वे कभी भी आपके डिवाइस से बाहर नहीं जातीं।",
  },
  easyToUse: {
    en: "Easy to Use",
    hi: "उपयोग में आसान",
  },
  easyToUseDesc: {
    en: "Simple, intuitive interface built for everyone.",
    hi: "सभी के लिए बनाया गया सरल, सहज इंटरफेस।",
  },
  fast: {
    en: "Lightning Fast",
    hi: "बिजली जैसी तेज़",
  },
  fastDesc: {
    en: "Process your files in seconds with our optimized tools.",
    hi: "हमारे ऑप्टिमाइज्ड टूल्स से सेकंड में अपनी फाइलों को प्रोसेस करें।",
  },
  // Call to action
  readyToTransform: {
    en: "Ready to Transform Your Files?",
    hi: "अपनी फाइलों को ट्रांसफॉर्म करने के लिए तैयार हैं?",
  },
  startUsing: {
    en: "Start using our free tools now. No registration required.",
    hi: "अभी हमारे मुफ्त टूल्स का उपयोग शुरू करें। रजिस्ट्रेशन की आवश्यकता नहीं है।",
  },
  // Tool sections
  popularTools: {
    en: "Popular Tools",
    hi: "लोकप्रिय टूल्स",
  },
  viewAllImageTools: {
    en: "View all image tools →",
    hi: "सभी इमेज टूल्स देखें →",
  },
  viewAllPdfTools: {
    en: "View all PDF tools →",
    hi: "सभी पीडीएफ टूल्स देखें →",
  },
  // Tool layout translations
  uploadImage: {
    en: "Upload Image",
    hi: "इमेज अपलोड करें",
  },
  configureSettings: {
    en: "Configure Settings",
    hi: "सेटिंग्स कॉन्फ़िगर करें",
  },
  original: {
    en: "Original",
    hi: "मूल",
  },
  result: {
    en: "Result",
    hi: "परिणाम",
  },
  download: {
    en: "Download",
    hi: "डाउनलोड",
  },
  processing: {
    en: "Processing...",
    hi: "प्रोसेसिंग...",
  },
  colorTolerance: {
    en: "Color Tolerance",
    hi: "रंग सहनशीलता",
  },
  removeBackground: {
    en: "Remove Background",
    hi: "बैकग्राउंड हटाएं",
  },
  higherValues: {
    en: "Higher values will remove more colors that are similar to the background",
    hi: "अधिक मान बैकग्राउंड के समान रंगों को अधिक हटा देंगे",
  },
  previewDownload: {
    en: "Preview & Download",
    hi: "प्रीव्यू और डाउनलोड",
  },
  size: {
    en: "Size",
    hi: "आकार",
  },
  dimensions: {
    en: "Dimensions",
    hi: "आयाम",
  },
  pixels: {
    en: "pixels",
    hi: "पिक्सेल",
  }
};

type LanguageContextType = {
  language: 'en' | 'hi';
  toggleLanguage: () => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  // Scroll to top on page navigation
  useEffect(() => {
    const handleNavigate = () => {
      window.scrollTo(0, 0);
    };

    // Listen for navigation events
    window.addEventListener('popstate', handleNavigate);
    
    // Clean up
    return () => {
      window.removeEventListener('popstate', handleNavigate);
    };
  }, []);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'hi' : 'en');
  };

  // Translation function
  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found.`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
