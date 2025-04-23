
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ToolCard from '../components/UI/ToolCard';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';

import {
  FileText,
  ImageDown,
  FileOutput,
  Combine,
  Scissors,
  FileImage,
  BookText,
  FileSpreadsheet,
  FilePresentation,
  FileX
} from 'lucide-react';

const PdfTools = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Simulate loading delay for skeleton effect
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Update meta tags for SEO
    document.title = "PDF Tools - BihariTool";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free online PDF tools - merge, split, convert, compress PDFs and more. Process your PDFs quickly with our easy-to-use tools.');
    }

    return () => clearTimeout(timer);
  }, [location]);

  const tools = [
    {
      title: "Image to PDF",
      description: "Convert single or multiple images into a PDF document.",
      icon: <ImageDown size={24} />,
      to: "/pdf-tools/image-to-pdf",
      popular: true
    },
    {
      title: "PDF to Image",
      description: "Extract images from PDFs or convert PDF pages to image formats.",
      icon: <FileImage size={24} />,
      to: "/pdf-tools/pdf-to-image",
      popular: false
    },
    {
      title: "Merge PDF",
      description: "Combine multiple PDF files into a single document.",
      icon: <Combine size={24} />,
      to: "/pdf-tools/merge",
      popular: true
    },
    {
      title: "Split PDF",
      description: "Divide your PDF into multiple files or extract specific pages.",
      icon: <Scissors size={24} />,
      to: "/pdf-tools/split",
      popular: false
    },
    {
      title: "Compress PDF",
      description: "Reduce the file size of your PDF documents without losing quality.",
      icon: <FileOutput size={24} />,
      to: "/pdf-tools/compress",
      popular: true
    },
    {
      title: "Word to PDF",
      description: "Convert Microsoft Word documents (DOC/DOCX) to PDF format.",
      icon: <BookText size={24} />,
      to: "/pdf-tools/word-to-pdf",
      popular: false
    },
    {
      title: "Excel to PDF",
      description: "Convert Microsoft Excel spreadsheets (XLS/XLSX) to PDF format.",
      icon: <FileSpreadsheet size={24} />,
      to: "/pdf-tools/excel-to-pdf",
      popular: false
    },
    {
      title: "PowerPoint to PDF",
      description: "Convert PowerPoint presentations (PPT/PPTX) to PDF format.",
      icon: <FilePresentation size={24} />,
      to: "/pdf-tools/ppt-to-pdf",
      popular: false
    },
    {
      title: "Remove PDF Watermark",
      description: "Remove watermarks, stamps, or logos from PDF documents.",
      icon: <FileX size={24} />,
      to: "/pdf-tools/remove-watermark",
      popular: false
    }
  ];

  return (
    <div className="pt-24 pb-16 fade-in">
      <div className="app-container">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">PDF Tools</h1>
          <p className="text-apple-darkgray max-w-2xl mx-auto">
            Free online tools to edit, convert, and manage PDF files.
            No registration required, process files instantly.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, index) => (
              <LoadingSkeleton key={index} className="h-36" />
            ))}
          </div>
        ) : (
          <>
            {/* Popular tools section */}
            <div className="mb-12">
              <h2 className="text-xl font-medium mb-6 text-apple-darkgray">Popular Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools
                  .filter(tool => tool.popular)
                  .map((tool, index) => (
                    <ToolCard key={index} {...tool} />
                  ))}
              </div>
            </div>

            {/* All tools section */}
            <div>
              <h2 className="text-xl font-medium mb-6 text-apple-darkgray">All PDF Tools</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool, index) => (
                  <ToolCard key={index} {...tool} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PdfTools;
