import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AnimatedText from '../components/UI/AnimatedText';
import ToolCard from '../components/UI/ToolCard';
import LoadingScreen from '../components/Layout/LoadingScreen';
import { useLanguage } from '../context/LanguageContext';
import { Button } from '@/components/ui/button';
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

  const popularImageTools = [
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
      title: "Image to PDF",
      description: "Convert images to PDF format easily",
      icon: <ImageDown size={24} />,
      to: "/image-tools/to-pdf",
      popular: true
    }
  ];

  const popularPdfTools = [
    {
      title: "Merge PDF",
      description: "Combine multiple PDFs into one document",
      icon: <Combine size={24} />,
      to: "/pdf-tools/merge-pdf",
      popular: true
    },
    {
      title: "Split PDF",
      description: "Divide your PDF into multiple files",
      icon: <Scissors size={24} />,
      to: "/pdf-tools/split-pdf",
      popular: true
    },
    {
      title: "PDF to Image",
      description: "Convert PDF pages to image format",
      icon: <ImageDown size={24} />,
      to: "/pdf-tools/pdf-to-image",
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

        {/* Popular Image Tools Section */}
        <section className="py-16 bg-white">
          <div className="app-container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Popular Image Tools</h2>
              <Link to="/image-tools">
                <Button variant="outline" className="group">
                  View All Image Tools
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularImageTools.map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>
        </section>

        {/* Popular PDF Tools Section */}
        <section className="py-16 bg-apple-gray">
          <div className="app-container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Popular PDF Tools</h2>
              <Link to="/pdf-tools">
                <Button variant="outline" className="group">
                  View All PDF Tools
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularPdfTools.map((tool, index) => (
                <ToolCard key={index} {...tool} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Index;
