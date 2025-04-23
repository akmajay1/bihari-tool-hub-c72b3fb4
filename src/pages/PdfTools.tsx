
import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import {
  FileText,
  FileImage,
  FilePlus,
  FileMinus,
  FileDown,
  FileType,
  FileSpreadsheet,
  Presentation,
  Stamp
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
            link="/pdf-tools/image-to-pdf"
            isPopular
          />
          <ToolCard
            title="PDF to Image"
            icon={<FileText size={24} />}
            description="Extract images from your PDF documents"
            link="/pdf-tools/pdf-to-image"
          />
          <ToolCard
            title="Merge PDF"
            icon={<FilePlus size={24} />}
            description="Combine multiple PDFs into a single document"
            link="/pdf-tools/merge-pdf"
            isPopular
          />
          <ToolCard
            title="Split PDF"
            icon={<FileMinus size={24} />}
            description="Separate PDF pages into multiple documents"
            link="/pdf-tools/split-pdf"
          />
          <ToolCard
            title="Compress PDF"
            icon={<FileDown size={24} />}
            description="Reduce PDF file size while maintaining quality"
            link="/pdf-tools/compress-pdf"
          />
          <ToolCard
            title="Word to PDF"
            icon={<FileText size={24} />}
            description="Convert Word documents to PDF format"
            link="/pdf-tools/word-to-pdf"
          />
          <ToolCard
            title="Excel to PDF"
            icon={<FileSpreadsheet size={24} />}
            description="Convert Excel spreadsheets to PDF format"
            link="/pdf-tools/excel-to-pdf"
          />
          <ToolCard
            title="PowerPoint to PDF"
            icon={<Presentation size={24} />}
            description="Convert PowerPoint presentations to PDF"
            link="/pdf-tools/powerpoint-to-pdf"
          />
          <ToolCard
            title="Remove PDF Watermark"
            icon={<Stamp size={24} />}
            description="Remove watermarks from PDF documents"
            link="/pdf-tools/remove-watermark"
          />
        </div>
      </div>
    </>
  );
};

export default PdfTools;
