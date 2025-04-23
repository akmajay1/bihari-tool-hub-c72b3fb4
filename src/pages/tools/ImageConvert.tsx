
import React, { useState } from 'react';
import { toast } from 'sonner';
import { Download, FileType } from 'lucide-react';
import ToolLayout from '../../components/Layout/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import FileUploader from '@/components/UI/FileUploader';
import { formatFileSize } from '@/utils/imageUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formatOptions = [
  { id: 'jpeg', name: 'JPEG', mime: 'image/jpeg' },
  { id: 'png', name: 'PNG', mime: 'image/png' },
  { id: 'webp', name: 'WebP', mime: 'image/webp' },
  { id: 'gif', name: 'GIF', mime: 'image/gif' },
];

const ImageConvert = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [convertedUrl, setConvertedUrl] = useState<string | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('jpeg');
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageInfo, setImageInfo] = useState<{ size: string; width: number; height: number } | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setConvertedUrl(null);
    
    // Create preview URL
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setPreviewUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    // Get image dimensions
    const img = new Image();
    img.onload = () => {
      setImageInfo({
        size: formatFileSize(file.size),
        width: img.width,
        height: img.height,
      });
    };
    img.src = URL.createObjectURL(file);
  };
  
  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setConvertedUrl(null);
    setImageInfo(null);
  };
  
  const convertImage = async () => {
    if (!selectedFile || !previewUrl) {
      toast.error('Please select an image first');
      return;
    }
    
    setIsProcessing(true);
    try {
      // Create a canvas to draw and convert the image
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }
        
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image onto canvas
        ctx.drawImage(img, 0, 0);
        
        // Get the converted image as data URL
        const selectedFormat = formatOptions.find(f => f.id === outputFormat);
        if (!selectedFormat) {
          throw new Error('Invalid output format');
        }
        
        // Convert to selected format
        const convertedDataUrl = canvas.toDataURL(selectedFormat.mime, 0.9);
        setConvertedUrl(convertedDataUrl);
        
        setIsProcessing(false);
        toast.success(`Image converted to ${selectedFormat.name} format`);
      };
      
      img.onerror = () => {
        setIsProcessing(false);
        toast.error('Failed to load image');
      };
      
      img.src = previewUrl;
    } catch (error) {
      console.error('Error converting image:', error);
      toast.error('Failed to convert image. Please try again.');
      setIsProcessing(false);
    }
  };
  
  const handleDownload = () => {
    if (!convertedUrl) return;
    
    // Get file extension based on selected format
    const fileExt = `.${outputFormat}`;
    
    // Create a download link
    const link = document.createElement('a');
    link.href = convertedUrl;
    link.download = `converted${fileExt}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  };

  return (
    <ToolLayout
      title="Format Conversion"
      description="Convert images between different file formats while maintaining quality. Perfect for compatibility and optimization."
      backLink="/image-tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">1. Upload Image</h2>
          <FileUploader
            onFileSelect={handleFileSelect}
            acceptedFileTypes="image/*"
            maxSizeMB={10}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
          />
          {imageInfo && (
            <div className="mt-4 text-sm text-apple-darkgray">
              <p>Size: {imageInfo.size}</p>
              <p>Dimensions: {imageInfo.width} × {imageInfo.height} pixels</p>
            </div>
          )}
        </Card>

        {/* Conversion Settings */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">2. Choose Output Format</h2>
          <div className="space-y-4">
            <RadioGroup 
              value={outputFormat} 
              onValueChange={setOutputFormat}
              className="flex flex-col space-y-2"
            >
              {formatOptions.map(format => (
                <div key={format.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                  <RadioGroupItem value={format.id} id={format.id} />
                  <Label htmlFor={format.id} className="cursor-pointer flex-1">
                    {format.name}
                  </Label>
                  <div className="text-sm text-apple-darkgray">.{format.id}</div>
                </div>
              ))}
            </RadioGroup>
            
            <div className="pt-4">
              <Button
                onClick={convertImage}
                disabled={!selectedFile || isProcessing}
                className="w-full"
              >
                {isProcessing ? 'Converting...' : 'Convert Image'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Preview Section */}
      {(previewUrl || convertedUrl) && (
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">3. Preview & Download</h2>
          <Tabs defaultValue="original" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="original">Original</TabsTrigger>
              <TabsTrigger value="converted" disabled={!convertedUrl}>
                Converted
              </TabsTrigger>
            </TabsList>
            <TabsContent value="original">
              {previewUrl && (
                <div className="flex justify-center bg-gray-50 border rounded-lg p-4">
                  <img 
                    src={previewUrl} 
                    alt="Original" 
                    className="max-h-96 object-contain"
                  />
                </div>
              )}
            </TabsContent>
            <TabsContent value="converted">
              {convertedUrl && (
                <div className="flex flex-col items-center">
                  <div className="flex justify-center bg-gray-50 border rounded-lg p-4 mb-4">
                    <img 
                      src={convertedUrl} 
                      alt="Converted" 
                      className="max-h-96 object-contain"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleDownload} className="flex items-center gap-2">
                      <Download size={18} />
                      Download {outputFormat.toUpperCase()}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </ToolLayout>
  );
};

export default ImageConvert;
