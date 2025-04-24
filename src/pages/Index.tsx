import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedText from '../components/UI/AnimatedText';
import ToolCard from '../components/UI/ToolCard';
import LoadingScreen from '../components/Layout/LoadingScreen';
import { useLanguage } from '../context/LanguageContext';

import { 
  Image, 
  FileImage, 
  Upload, 
  PaintBucket, 
  Eraser, 
  FileText,
  FilePlus,
  FileOutput,
  Combine,
  Scissors,
  ImageDown
} from 'lucide-react';

const Index = () => {
  const [showLoading, setShowLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const hasSeenLoading = sessionStorage.getItem('hasSeenLoading');
    if (hasSeenLoading) {
      setShowLoading(false);
    } else {
      sessionStorage.setItem('hasSeenLoading', 'true');
    }
    
    document.title = "BihariTool - Free Online Image and PDF Tools";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'BihariTool offers free online tools to edit, convert, and enhance images and PDF documents. Compress, resize, merge PDFs, remove backgrounds and more.');
    }
  }, []);

  const handleFinishLoading = () => {
    setShowLoading(false);
  };

  const imageTools = [
    {
      title: "Image Compress",
      description: "Reduce image size without losing quality",
      icon: <Image size={24} />,
      to: "/image-tools/compress",
      popular: true
    },
    {
      title: "Remove Background",
      description: "Instantly remove background from any image",
      icon: <Eraser size={24} />,
      to: "/image-tools/remove-background",
      popular: true
    },
    {
      title: "Change Background",
      description: "Replace image backgrounds with new ones",
      icon: <PaintBucket size={24} />,
      to: "/image-tools/change-background"
    }
  ];

  const pdfTools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one document",
      icon: <Combine size={24} />,
      to: "/pdf-tools/merge-pdf",
      popular: true
    },
    {
      title: "Image to PDF",
      description: "Convert images to PDF format easily",
      icon: <ImageDown size={24} />,
      to: "/pdf-tools/image-to-pdf",
      popular: true
    },
    {
      title: "Split PDF",
      description: "Divide your PDF into multiple files",
      icon: <Scissors size={24} />,
      to: "/pdf-tools/split-pdf",
      popular: true
    }
  ];

  return (
    <>
      {showLoading && <LoadingScreen onFinish={handleFinishLoading} />}
      
      <div className="fade-in">
        <section className="relative bg-gradient-to-b from-white to-apple-gray py-32 md:py-36">
          <div className="app-container text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-apple-black mb-6">
              {t('heroTitle')} <span className="text-apple-blue">{t('heroTitleHighlight')}</span>
            </h1>
            <p className="text-xl text-apple-darkgray max-w-2xl mx-auto mb-10">
              {t('heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/image-tools" className="apple-btn text-lg px-8 py-3">
                {t('imageTools')}
              </Link>
              <Link to="/pdf-tools" className="apple-btn-secondary text-lg px-8 py-3">
                {t('pdfTools')}
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
        </section>

        <section className="py-16">
          <div className="app-container">
            <h2 className="text-3xl font-bold text-center mb-12">{t('popularTools')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...imageTools, ...pdfTools]
                .filter(tool => tool.popular)
                .map((tool, index) => (
                  <ToolCard key={index} {...tool} />
                ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-apple-gray">
          <div className="app-container">
            <h2 className="text-3xl font-bold text-center mb-12">{t('whyChoose')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-apple-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">{t('secure')}</h3>
                <p className="text-apple-darkgray">{t('secureDesc')}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-apple-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <line x1="9" y1="9" x2="9.01" y2="9" />
                    <line x1="15" y1="9" x2="15.01" y2="9" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">{t('easyToUse')}</h3>
                <p className="text-apple-darkgray">{t('easyToUseDesc')}</p>
              </div>
              
              <div className="bg-white p-6 rounded-xl text-center">
                <div className="w-16 h-16 bg-apple-blue/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-apple-blue" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48 2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48 2.83-2.83" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium mb-2">{t('fast')}</h3>
                <p className="text-apple-darkgray">{t('fastDesc')}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="app-container text-center">
            <h2 className="text-3xl font-bold mb-6">{t('readyToTransform')}</h2>
            <p className="text-xl text-apple-darkgray max-w-2xl mx-auto mb-10">
              {t('startUsing')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/image-tools" className="apple-btn text-lg px-8 py-3">
                {t('getStarted')}
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
