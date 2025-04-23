
import React, { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  acceptedFileTypes?: string;
  maxSizeMB?: number;
  className?: string;
  allowMultiple?: boolean;
  selectedFile?: File | null;
  onClearFile?: () => void;
  uploadProgress?: number;
  multiple?: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({
  onFileSelect,
  acceptedFileTypes = 'image/*',
  maxSizeMB = 50,
  className = '',
  allowMultiple = false,
  selectedFile = null,
  onClearFile,
  uploadProgress,
  multiple = false
}) => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  
  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  
  const validateFile = useCallback((file: File): boolean => {
    // Check file type
    if (acceptedFileTypes && !file.type.match(acceptedFileTypes.replace(/,/g, '|'))) {
      toast({
        title: "Unsupported file format",
        description: `Please upload a ${acceptedFileTypes.replace('*', '')} file.`,
        variant: "destructive"
      });
      return false;
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size should be less than ${maxSizeMB} MB.`,
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  }, [acceptedFileTypes, maxSizeMB, toast]);
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, validateFile]);
  
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        onFileSelect(file);
      }
    }
  }, [onFileSelect, validateFile]);

  return (
    <div className={`w-full ${className}`}>
      {!selectedFile ? (
        <div
          className={`border-2 border-dashed rounded-xl px-6 py-10 text-center transition-colors ${
            isDragging ? 'border-apple-blue bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center">
            <Upload size={40} className="text-apple-darkgray mb-4" />
            <p className="text-lg font-medium">Drag and drop your file here</p>
            <p className="text-apple-darkgray mb-4">or</p>
            <label htmlFor="fileInput" className="cursor-pointer">
              <span className="apple-btn py-3">Browse files</span>
              <input
                id="fileInput"
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept={acceptedFileTypes}
                multiple={multiple}
              />
            </label>
            <p className="text-apple-darkgray text-sm mt-4">
              Max file size: {maxSizeMB} MB
            </p>
          </div>
        </div>
      ) : (
        <div className="border rounded-xl p-6 bg-gray-50">
          <div className="flex justify-between items-center mb-3">
            <div className="font-medium">{selectedFile.name}</div>
            {onClearFile && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFile}
                aria-label="Remove file"
              >
                <X size={18} />
              </Button>
            )}
          </div>
          
          {typeof uploadProgress === 'number' && (
            <Progress value={uploadProgress} className="h-2 mt-2" />
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
