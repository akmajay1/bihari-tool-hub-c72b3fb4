
import React from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../components/Layout/ToolLayout';
import PdfToolBase from '../../components/PDF/PdfToolBase';

const PdfSplit = () => {
  const handleSplitPDF = async (files: File[]): Promise<Blob> => {
    if (files.length !== 1) {
      throw new Error('Please select exactly one PDF file to split.');
    }
    
    const fileBuffer = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // For demonstration, creating a new PDF with first page only
    // In a real implementation, you'd allow users to select pages to extract
    const newPdf = await PDFDocument.create();
    const [firstPage] = await newPdf.copyPages(pdfDoc, [0]);
    newPdf.addPage(firstPage);
    
    const newPdfBytes = await newPdf.save();
    return new Blob([newPdfBytes], { type: 'application/pdf' });
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages from your PDF or split into multiple documents."
      backLink="/pdf-tools"
    >
      <PdfToolBase
        title="Split PDF"
        description="Upload a PDF file and split it into separate documents. Currently extracts the first page as a demonstration."
        acceptedFileTypes=".pdf"
        onProcess={handleSplitPDF}
        maxFiles={1}
      />
    </ToolLayout>
  );
};

export default PdfSplit;
