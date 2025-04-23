
import React from 'react';
import ToolLayout from '../../components/Layout/ToolLayout';
import PdfToolBase from '../../components/PDF/PdfToolBase';
import { toast } from 'sonner';

const ExcelToPdf = () => {
  const handleExcelToPDF = async (files: File[]): Promise<Blob> => {
    if (files.length !== 1) {
      throw new Error('Please select exactly one Excel file.');
    }
    
    // This is a placeholder implementation
    // In a real application, you would use a server-side API or a library
    // that can convert Excel to PDF, as this can't be done in the browser
    
    toast.info("Converting Excel to PDF...", {
      description: "This is a demo. In a production environment, this would connect to a server API."
    });
    
    // For demo purposes, create a sample PDF
    const response = await fetch('/placeholder.svg');
    const placeholderData = await response.blob();
    
    // In real implementation, return the converted PDF
    return placeholderData;
  };

  return (
    <ToolLayout
      title="Excel to PDF"
      description="Convert Excel spreadsheets to PDF format."
      backLink="/pdf-tools"
    >
      <PdfToolBase
        title="Excel to PDF"
        description="Upload an Excel file (.xls or .xlsx) to convert it to PDF format. This demonstration shows the interface - full conversion requires server-side processing."
        acceptedFileTypes=".xls,.xlsx"
        onProcess={handleExcelToPDF}
        maxFiles={1}
      />
    </ToolLayout>
  );
};

export default ExcelToPdf;
