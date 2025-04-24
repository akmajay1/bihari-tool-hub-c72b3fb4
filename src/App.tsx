
import React, { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import ImageTools from "./pages/ImageTools";
import PdfTools from "./pages/PdfTools";
import NotFound from "./pages/NotFound";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import PageTransition from "./components/Layout/PageTransition";
import BubbleAnimation from "./components/UI/BubbleAnimation";

import ImageCompress from "./pages/tools/ImageCompress";
import ImageResize from "./pages/tools/ImageResize";
import ImageChangeBackground from "./pages/tools/ImageChangeBackground";
import ImageRemoveBackground from "./pages/tools/ImageRemoveBackground";
import ImageAddNameDate from "./pages/tools/ImageAddNameDate";
import ImageToPdf from "./pages/tools/ImageToPdf";
import ImageConvert from "./pages/tools/ImageConvert";
import QrGenerator from "./pages/tools/QrGenerator";
import FaceBlur from "./pages/tools/FaceBlur";
import ImageEnhance from "./pages/tools/ImageEnhance";
import PhotoSignJoiner from "./pages/tools/PhotoSignJoiner";

import PdfMerge from "./pages/tools/PdfMerge";
import PdfSplit from "./pages/tools/PdfSplit";
import PdfCompress from "./pages/tools/PdfCompress";
import PdfToImage from "./pages/tools/PdfToImage";
import WordToPdf from "./pages/tools/WordToPdf";
import ExcelToPdf from "./pages/tools/ExcelToPdf";
import PowerPointToPdf from "./pages/tools/PowerPointToPdf";
import RemoveWatermark from "./pages/tools/RemoveWatermark";

import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient();
const helmetContext = {}; // Create a context for the HelmetProvider

// ScrollToTop component to ensure pages start at the top
const ScrollToTop = () => {
  const { pathname } = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return null;
};

const App = () => {
  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <LanguageProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Helmet>
                <meta name="description" content="BihariTool - Free online tools for image editing and PDF manipulation" />
                <meta name="keywords" content="image tools, pdf tools, compress image, remove background, merge pdf, image to pdf" />
                <meta name="author" content="Akhilesh Kumar Singh, Akma" />
                <meta property="og:title" content="BihariTool - Free Online Image and PDF Tools" />
                <meta property="og:description" content="Professional-grade tools to edit, convert, and enhance your files. No signup required." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="BihariTool - Free Online Image and PDF Tools" />
                <meta name="twitter:description" content="Professional-grade tools to edit, convert, and enhance your files. No signup required." />
              </Helmet>
              <BubbleAnimation />
              <Header />
              <PageTransition>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/image-tools" element={<ImageTools />} />
                  <Route path="/pdf-tools" element={<PdfTools />} />
                  
                  {/* Image Tools Routes */}
                  <Route path="/image-tools/compress" element={<ImageCompress />} />
                  <Route path="/image-tools/resize" element={<ImageResize />} />
                  <Route path="/image-tools/change-background" element={<ImageChangeBackground />} />
                  <Route path="/image-tools/remove-background" element={<ImageRemoveBackground />} />
                  <Route path="/image-tools/add-name-date" element={<ImageAddNameDate />} />
                  <Route path="/image-tools/to-pdf" element={<ImageToPdf />} />
                  <Route path="/image-tools/convert" element={<ImageConvert />} />
                  <Route path="/image-tools/qr-generator" element={<QrGenerator />} />
                  <Route path="/image-tools/face-blur" element={<FaceBlur />} />
                  <Route path="/image-tools/enhance" element={<ImageEnhance />} />
                  <Route path="/image-tools/photo-sign-joiner" element={<PhotoSignJoiner />} />
                  
                  {/* PDF Tools Routes */}
                  <Route path="/pdf-tools/merge-pdf" element={<PdfMerge />} />
                  <Route path="/pdf-tools/split-pdf" element={<PdfSplit />} />
                  <Route path="/pdf-tools/compress-pdf" element={<PdfCompress />} />
                  <Route path="/pdf-tools/pdf-to-image" element={<PdfToImage />} />
                  <Route path="/pdf-tools/image-to-pdf" element={<ImageToPdf />} /> {/* Reusing ImageToPdf component */}
                  <Route path="/pdf-tools/word-to-pdf" element={<WordToPdf />} />
                  <Route path="/pdf-tools/excel-to-pdf" element={<ExcelToPdf />} />
                  <Route path="/pdf-tools/powerpoint-to-pdf" element={<PowerPointToPdf />} />
                  <Route path="/pdf-tools/remove-watermark" element={<RemoveWatermark />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </PageTransition>
              <Footer />
            </BrowserRouter>
          </LanguageProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
