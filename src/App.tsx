
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

import Index from "./pages/Index";
import ImageTools from "./pages/ImageTools";
import PdfTools from "./pages/PdfTools";
import NotFound from "./pages/NotFound";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import PageTransition from "./components/Layout/PageTransition";

// Tool Pages
import ImageCompress from "./pages/tools/ImageCompress";
import ImageResize from "./pages/tools/ImageResize";

// Create a client
const queryClient = new QueryClient();
const helmetContext = {}; // Create a context for the HelmetProvider

const App = () => {
  return (
    <HelmetProvider context={helmetContext}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Helmet>
              <meta name="description" content="BihariTool - Free online tools for image editing and PDF manipulation" />
              <meta name="keywords" content="image tools, pdf tools, compress image, remove background, merge pdf, image to pdf" />
              <meta name="author" content="BihariTool" />
              <meta property="og:title" content="BihariTool - Free Online Image and PDF Tools" />
              <meta property="og:description" content="Professional-grade tools to edit, convert, and enhance your files. No signup required." />
              <meta property="og:type" content="website" />
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="BihariTool - Free Online Image and PDF Tools" />
              <meta name="twitter:description" content="Professional-grade tools to edit, convert, and enhance your files. No signup required." />
            </Helmet>
            <Header />
            <PageTransition>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/image-tools" element={<ImageTools />} />
                <Route path="/pdf-tools" element={<PdfTools />} />
                
                {/* Image Tool Routes */}
                <Route path="/image-tools/compress" element={<ImageCompress />} />
                <Route path="/image-tools/resize" element={<ImageResize />} />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </PageTransition>
            <Footer />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
};

export default App;
