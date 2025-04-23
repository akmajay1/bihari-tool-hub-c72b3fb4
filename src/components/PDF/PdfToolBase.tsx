
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import FileUploader from '@/components/UI/FileUploader';
import { formatFileSize } from '@/utils/imageUtils';
import { toast } from 'sonner';
import { Download, Trash2 } from 'lucide-react';

interface PdfToolBaseProps {
  title: string;
  description: string;
  acceptedFileTypes: string;
  onProcess: (files: File[]) => Promise<Blob>;
  maxFiles?: number;
}

const PdfToolBase: React.FC<PdfToolBaseProps> = ({
  title,
  description,
  acceptedFileTypes,
  onProcess,
  maxFiles = 1,
}) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelect = (file: File) => {
    if (selectedFiles.length < maxFiles) {
      setSelectedFiles(prev => [...prev, file]);
    } else {
      toast.error(`Maximum ${maxFiles} files allowed`);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one file');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await onProcess(selectedFiles);
      const url = URL.createObjectURL(result);
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success('Processing completed successfully!');
    } catch (error) {
      console.error('Processing error:', error);
      toast.error('Failed to process. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">1. Upload Files</h2>
        <FileUploader
          onFileSelect={handleFileSelect}
          acceptedFileTypes={acceptedFileTypes}
          maxSizeMB={50}
          multiple={maxFiles > 1}
        />
        
        {selectedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="font-medium mb-3">Selected Files ({selectedFiles.length})</h3>
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
        <h2 className="text-xl font-semibold mb-4">2. Process Files</h2>
        <p className="text-apple-darkgray mb-6">{description}</p>
        
        <Button
          onClick={handleProcess}
          disabled={selectedFiles.length === 0 || isProcessing}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          {isProcessing ? 'Processing...' : 'Process Files'}
        </Button>
      </Card>
    </div>
  );
};

export default PdfToolBase;
