
import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import ToolLayout from '../../components/Layout/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/UI/FileUploader';
import { formatFileSize } from '@/utils/imageUtils';
import { toast } from 'sonner';
import { Download, Trash2 } from 'lucide-react';

const ImageToPdf = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFiles(prev => [...prev, file]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertToPdf = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image');
      return;
    }

    setIsProcessing(true);
    try {
      const pdf = new jsPDF();
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const imgData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });

        // Add new page for each image except the first one
        if (i > 0) {
          pdf.addPage();
        }

        // Calculate dimensions to fit the page while maintaining aspect ratio
        const img = new Image();
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = imgData;
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        let imgWidth = img.width;
        let imgHeight = img.height;
        
        if (imgWidth > pageWidth) {
          const ratio = pageWidth / imgWidth;
          imgWidth = pageWidth;
          imgHeight = imgHeight * ratio;
        }
        
        if (imgHeight > pageHeight) {
          const ratio = pageHeight / imgHeight;
          imgHeight = pageHeight;
          imgWidth = imgWidth * ratio;
        }

        // Center image on page
        const x = (pageWidth - imgWidth) / 2;
        const y = (pageHeight - imgHeight) / 2;

        pdf.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
      }

      // Save PDF
      pdf.save('converted-images.pdf');
      toast.success('PDF created successfully!');
    } catch (error) {
      console.error('Error creating PDF:', error);
      toast.error('Failed to create PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert your images into a PDF document. Perfect for creating documents from photos or scanned images."
      backLink="/image-tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">1. Upload Images</h2>
          <FileUploader
            onFileSelect={handleFileSelect}
            acceptedFileTypes="image/*"
            maxSizeMB={10}
            multiple={true}
          />
          
          {selectedFiles.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Selected Images ({selectedFiles.length})</h3>
              <div className="space-y-3">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">{file.name}</span>
                      <span className="text-sm text-apple-darkgray">({formatFileSize(file.size)})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">2. Create PDF</h2>
          <p className="text-apple-darkgray mb-6">
            Click the button below to convert your selected images into a single PDF document. 
            The images will be arranged in the order they were uploaded.
          </p>
          
          <Button
            onClick={convertToPdf}
            disabled={selectedFiles.length === 0 || isProcessing}
            className="w-full"
          >
            <Download className="mr-2 h-4 w-4" />
            {isProcessing ? 'Creating PDF...' : 'Convert to PDF'}
          </Button>
        </Card>
      </div>
    </ToolLayout>
  );
};

export default ImageToPdf;
