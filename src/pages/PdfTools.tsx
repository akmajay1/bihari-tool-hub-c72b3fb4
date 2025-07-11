
import React, { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import {
  FileText,
  FileImage,
  FilePlus,
  FileMinus,
  FileDown,
  FileType,
  FileSpreadsheet,
  Presentation,
  Stamp,
  ImageDown
} from "lucide-react";
import ToolCard from "../components/UI/ToolCard";

const PdfTools = () => {
  useEffect(() => {
    document.title = "PDF Tools - BihariTool";
  }, []);

  return (
    <>
      <Helmet>
        <meta name="description" content="Free online PDF tools - convert, merge, split, and compress PDF files" />
        <meta name="keywords" content="pdf tools, merge pdf, split pdf, compress pdf, convert pdf, pdf to image, image to pdf" />
      </Helmet>

      <div className="app-container py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">PDF Tools</h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Professional PDF manipulation tools to convert, merge, split, and compress your PDF files. No signup required.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ToolCard
            title="Image to PDF"
            icon={<FileImage size={24} />}
            description="Convert your images to PDF format easily"
            to="/pdf-tools/image-to-pdf"
            popular={true}
          />
          <ToolCard
            title="PDF to Image"
            icon={<ImageDown size={24} />}
            description="Extract images from your PDF documents"
            to="/pdf-tools/pdf-to-image"
          />
          <ToolCard
            title="Merge PDF"
            icon={<FilePlus size={24} />}
            description="Combine multiple PDFs into a single document"
            to="/pdf-tools/merge-pdf"
            popular={true}
          />
          <ToolCard
            title="Split PDF"
            icon={<FileMinus size={24} />}
            description="Separate PDF pages into multiple documents"
            to="/pdf-tools/split-pdf"
          />
          <ToolCard
            title="Compress PDF"
            icon={<FileDown size={24} />}
            description="Reduce PDF file size while maintaining quality"
            to="/pdf-tools/compress-pdf"
          />
          <ToolCard
            title="Word to PDF"
            icon={<FileText size={24} />}
            description="Convert Word documents to PDF format"
            to="/pdf-tools/word-to-pdf"
          />
          <ToolCard
            title="Excel to PDF"
            icon={<FileSpreadsheet size={24} />}
            description="Convert Excel spreadsheets to PDF format"
            to="/pdf-tools/excel-to-pdf"
          />
          <ToolCard
            title="PowerPoint to PDF"
            icon={<Presentation size={24} />}
            description="Convert PowerPoint presentations to PDF"
            to="/pdf-tools/powerpoint-to-pdf"
          />
          <ToolCard
            title="Remove PDF Watermark"
            icon={<Stamp size={24} />}
            description="Remove watermarks from PDF documents"
            to="/pdf-tools/remove-watermark"
          />
        </div>
      </div>
    </>
  );
};

export default PdfTools;
