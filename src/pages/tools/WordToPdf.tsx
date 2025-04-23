
import React from 'react';
import ToolLayout from '../../components/Layout/ToolLayout';
import PdfToolBase from '../../components/PDF/PdfToolBase';
import { toast } from 'sonner';

const WordToPdf = () => {
  const handleWordToPDF = async (files: File[]): Promise<Blob> => {
    if (files.length !== 1) {
      throw new Error('Please select exactly one Word document.');
    }
    
    // This is a placeholder implementation 
    // In a real application, you would use a server-side API or a library
    // that can convert Word to PDF, as this can't be done in the browser
    
    toast.info("Converting Word to PDF...", {
      description: "This is a demo. In a production environment, this would connect to a server API."
    });
    
    // For demo purposes, create a sample PDF with text
    const response = await fetch('/placeholder.svg');
    const placeholderData = await response.blob();
    
    // In real implementation, return the converted PDF
    return placeholderData;
  };

  return (
    <ToolLayout
      title="Word to PDF"
      description="Convert Word documents to PDF format."
      backLink="/pdf-tools"
    >
      <PdfToolBase
        title="Word to PDF"
        description="Upload a Word document (.doc or .docx) to convert it to PDF format. This demonstration shows the interface - full conversion requires server-side processing."
        acceptedFileTypes=".doc,.docx"
        onProcess={handleWordToPDF}
        maxFiles={1}
      />
    </ToolLayout>
  );
};

export default WordToPdf;
