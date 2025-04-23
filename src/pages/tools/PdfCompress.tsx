
import React from 'react';
import { PDFDocument } from 'pdf-lib';
import ToolLayout from '../../components/Layout/ToolLayout';
import PdfToolBase from '../../components/PDF/PdfToolBase';

const PdfCompress = () => {
  const handleCompressPDF = async (files: File[]): Promise<Blob> => {
    if (files.length !== 1) {
      throw new Error('Please select exactly one PDF file to compress.');
    }
    
    const fileBuffer = await files[0].arrayBuffer();
    const pdfDoc = await PDFDocument.load(fileBuffer);
    
    // Basic implementation - in a real application, you would
    // implement actual PDF compression techniques
    const compressedPdfBytes = await pdfDoc.save({
      useObjectStreams: true, // This helps make the file smaller
    });
    
    return new Blob([compressedPdfBytes], { type: 'application/pdf' });
  };

  return (
    <ToolLayout
      title="Compress PDF"
      description="Reduce PDF file size while maintaining quality."
      backLink="/pdf-tools"
    >
      <PdfToolBase
        title="Compress PDF"
        description="Upload a PDF file to reduce its file size while preserving quality. Optimal for sharing via email or storing in the cloud."
        acceptedFileTypes=".pdf"
        onProcess={handleCompressPDF}
        maxFiles={1}
      />
    </ToolLayout>
  );
};

export default PdfCompress;
