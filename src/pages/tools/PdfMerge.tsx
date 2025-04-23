
import React from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../components/Layout/ToolLayout';
import PdfToolBase from '../../components/PDF/PdfToolBase';

const PdfMerge = () => {
  const handleMergePDF = async (files: File[]): Promise<Blob> => {
    const mergedPdf = await PDFDocument.create();
    
    for (const file of files) {
      const fileBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(fileBuffer);
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }
    
    const mergedPdfBytes = await mergedPdf.save();
    return new Blob([mergedPdfBytes], { type: 'application/pdf' });
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document."
      backLink="/pdf-tools"
    >
      <PdfToolBase
        title="Merge PDF"
        description="Upload multiple PDF files and combine them into a single document. The files will be merged in the order they were uploaded."
        acceptedFileTypes=".pdf"
        onProcess={handleMergePDF}
        maxFiles={10}
      />
    </ToolLayout>
  );
};

export default PdfMerge;
