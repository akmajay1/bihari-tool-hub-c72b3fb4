
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Download, FileText, Image, Trash2 } from 'lucide-react';
import ToolLayout from '../../components/Layout/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/UI/FileUploader';
import { formatFileSize } from '@/utils/imageUtils';
import * as pdfjs from 'pdfjs-dist';

// Initialize PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PdfToImage = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImages, setResultImages] = useState<string[]>([]);

  const handleFileSelect = (file: File) => {
    setPdfFile(file);
    setResultImages([]);
  };

  const clearFile = () => {
    setPdfFile(null);
    setResultImages([]);
  };

  const convertToImages = async () => {
    if (!pdfFile) {
      toast.error('Please select a PDF file first');
      return;
    }

    setIsProcessing(true);
    setResultImages([]);
    
    try {
      // Read the file as ArrayBuffer
      const arrayBuffer = await pdfFile.arrayBuffer();
      
      // Load the PDF document
      const loadingTask = pdfjs.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      
      const totalPages = pdf.numPages;
      const imagePromises = [];
      
      // Process each page
      for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {
        const page = await pdf.getPage(pageNumber);
        const viewport = page.getViewport({ scale: 1.5 });
        
        // Create canvas for rendering
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;
        
        // Render PDF page to canvas
        const renderContext = {
          canvasContext: context!,
          viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Convert canvas to image data URL
        const imageDataUrl = canvas.toDataURL('image/png');
        imagePromises.push(imageDataUrl);
      }
      
      // Set the result images
      setResultImages(imagePromises);
      toast.success(`Successfully converted ${totalPages} page${totalPages > 1 ? 's' : ''} to images!`);
    } catch (error) {
      console.error('Error converting PDF to images:', error);
      toast.error('Failed to convert PDF. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = (url: string, index: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${index + 1}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const downloadAllImages = () => {
    resultImages.forEach((url, index) => {
      setTimeout(() => {
        downloadImage(url, index);
      }, index * 100); // Add a small delay between downloads
    });
    toast.success('Downloading all images...');
  };

  return (
    <ToolLayout
      title="PDF to Image"
      description="Convert PDF pages to high-quality images. Extract charts, graphics, or text as images from your PDF documents."
      backLink="/pdf-tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="p-6 glass-effect">
          <h2 className="text-xl font-semibold mb-4">1. Upload PDF</h2>
          {!pdfFile ? (
            <FileUploader
              onFileSelect={handleFileSelect}
              acceptedFileTypes=".pdf"
              maxSizeMB={10}
              multiple={false}
            />
          ) : (
            <div className="p-4 border rounded-lg bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-apple-blue" />
                  <div>
                    <p className="font-medium">{pdfFile.name}</p>
                    <p className="text-sm text-apple-darkgray">{formatFileSize(pdfFile.size)}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm" onClick={clearFile}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                className="w-full mt-4"
                disabled={isProcessing}
                onClick={convertToImages}
              >
                {isProcessing ? 'Converting...' : 'Convert to Images'}
              </Button>
            </div>
          )}
        </Card>

        <Card className="p-6 glass-effect">
          <h2 className="text-xl font-semibold mb-4">2. Extracted Images</h2>
          
          {resultImages.length > 0 ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium">{resultImages.length} page{resultImages.length > 1 ? 's' : ''} extracted</span>
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={downloadAllImages}
                >
                  <Download className="h-4 w-4 mr-1" /> Download All
                </Button>
              </div>
              
              {resultImages.map((img, index) => (
                <div key={index} className="border rounded-lg p-3 bg-white">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Page {index + 1}</span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => downloadImage(img, index)}
                    >
                      <Download className="h-4 w-4 mr-1" /> Download
                    </Button>
                  </div>
                  <div className="bg-checkerboard rounded-md overflow-hidden">
                    <img 
                      src={img} 
                      alt={`Page ${index + 1}`} 
                      className="w-full h-auto object-contain"
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-apple-darkgray">
              <Image className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p>Upload a PDF and convert it to see the results here.</p>
            </div>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
};

export default PdfToImage;
