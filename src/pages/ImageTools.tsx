import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ToolCard from '../components/UI/ToolCard';
import LoadingSkeleton from '../components/UI/LoadingSkeleton';
import { Helmet } from 'react-helmet-async';

import {
  Image,
  ImageDown,
  FileType,
  QrCode,
  UserRoundX,
  Wand2,
  Eraser,
  PaintBucket,
  Stamp,
  PenLine,
  Crop
} from 'lucide-react';

const ImageTools = () => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    document.title = "Image Tools - BihariTool";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Free online image editing tools - compress, resize, convert, remove background, and more. Process your images quickly without losing quality.');
    }

    return () => clearTimeout(timer);
  }, [location]);

  const tools = [
    {
      title: "Image Compress",
      description: "Reduce file size while maintaining quality. Shows file format and size in KB.",
      icon: <Image size={24} />,
      to: "/image-tools/compress",
      popular: true
    },
    {
      title: "Change Background",
      description: "Replace image backgrounds with new ones. Perfect for exam forms and documents.",
      icon: <PaintBucket size={24} />,
      to: "/image-tools/change-background",
      popular: false
    },
    {
      title: "Remove Background",
      description: "Automatically remove background from any image with AI technology.",
      icon: <Eraser size={24} />,
      to: "/image-tools/remove-background",
      popular: true
    },
    {
      title: "Add Name & Date",
      description: "Stamp your name and date onto photos or documents.",
      icon: <Stamp size={24} />,
      to: "/image-tools/add-name-date",
      popular: false
    },
    {
      title: "Photo & Sign Joiner",
      description: "Easily merge signature images onto photos for official documents.",
      icon: <PenLine size={24} />,
      to: "/image-tools/photo-sign-joiner",
      popular: false
    },
    {
      title: "Image to PDF",
      description: "Convert single or multiple images into PDF documents.",
      icon: <ImageDown size={24} />,
      to: "/image-tools/to-pdf",
      popular: true
    },
    {
      title: "Image Resize",
      description: "Precisely resize images by specifying width and height in pixels.",
      icon: <Crop size={24} />,
      to: "/image-tools/resize",
      popular: false
    },
    {
      title: "Format Conversion",
      description: "Convert images between JPG, PNG, WebP and other formats.",
      icon: <FileType size={24} />,
      to: "/image-tools/convert",
      popular: false
    },
    {
      title: "QR Code Generator",
      description: "Create QR codes for websites, text, contact info, and more.",
      icon: <QrCode size={24} />,
      to: "/image-tools/qr-generator",
      popular: false
    },
    {
      title: "Face Blurring",
      description: "Automatically detect and blur faces in images to protect privacy.",
      icon: <UserRoundX size={24} />,
      to: "/image-tools/face-blur",
      popular: false
    },
    {
      title: "Image Quality Enhancer",
      description: "Enhance and improve low-quality images using AI.",
      icon: <Wand2 size={24} />,
      to: "/image-tools/enhance",
      popular: false
    }
  ];

  return (
    <>
      <Helmet>
        <meta name="description" content="Free online image editing tools - compress, resize, convert, remove background, and more." />
        <meta name="keywords" content="image tools, image editing, compress image, remove background, resize image" />
      </Helmet>

      <div className="app-container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">Image Tools</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Professional image editing tools to enhance, convert, and modify your images. No signup required.
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array(8).fill(0).map((_, index) => (
              <LoadingSkeleton key={index} className="h-36" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool, index) => (
              <ToolCard key={index} {...tool} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ImageTools;
