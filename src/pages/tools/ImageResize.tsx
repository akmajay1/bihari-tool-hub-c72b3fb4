
import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Download, Lock, Unlock } from 'lucide-react';
import ToolLayout from '@/components/Layout/ToolLayout';
import FileUploader from '@/components/UI/FileUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { resizeImage, formatFileSize, getImageDimensions } from '@/utils/imageUtils';
import { Checkbox } from '@/components/ui/checkbox';

const ImageResize = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalDimensions, setOriginalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true);
  const [resizeMethod, setResizeMethod] = useState<string>('dimensions');
  const [percentage, setPercentage] = useState<number>(100);
  const [resizedImage, setResizedImage] = useState<{ blob: Blob; url: string } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (resizedImage?.url) {
        URL.revokeObjectURL(resizedImage.url);
      }
    };
  }, [resizedImage]);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setSelectedFile(file);
      const dimensions = await getImageDimensions(file);
      setOriginalDimensions(dimensions);
      setWidth(dimensions.width);
      setHeight(dimensions.height);
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const calculateDimensions = useCallback(() => {
    if (!originalDimensions) return;

    if (resizeMethod === 'percentage') {
      setWidth(Math.round(originalDimensions.width * (percentage / 100)));
      setHeight(Math.round(originalDimensions.height * (percentage / 100)));
    }
  }, [originalDimensions, percentage, resizeMethod]);

  useEffect(() => {
    calculateDimensions();
  }, [calculateDimensions, resizeMethod, percentage]);

  const handleWidthChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newWidth = parseInt(e.target.value, 10) || 0;
    setWidth(newWidth);

    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newHeight = Math.round(newWidth / aspectRatio);
      setHeight(newHeight);
    }
  }, [maintainAspectRatio, originalDimensions]);

  const handleHeightChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newHeight = parseInt(e.target.value, 10) || 0;
    setHeight(newHeight);

    if (maintainAspectRatio && originalDimensions) {
      const aspectRatio = originalDimensions.width / originalDimensions.height;
      const newWidth = Math.round(newHeight * aspectRatio);
      setWidth(newWidth);
    }
  }, [maintainAspectRatio, originalDimensions]);

  const handlePercentageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercentage = parseInt(e.target.value, 10) || 0;
    setPercentage(newPercentage);
  }, []);

  const handleResize = useCallback(async () => {
    if (!selectedFile || !width || !height) return;

    setIsProcessing(true);
    try {
      const resizedBlob = await resizeImage(selectedFile, width, height);
      
      // Clean up old URL if it exists
      if (resizedImage?.url) {
        URL.revokeObjectURL(resizedImage.url);
      }
      
      const url = URL.createObjectURL(resizedBlob);
      setResizedImage({ blob: resizedBlob, url });
      
      toast({
        title: "Resize successful",
        description: `Image resized to ${width} × ${height} pixels`,
      });
    } catch (error) {
      console.error("Error resizing image:", error);
      toast({
        title: "Resize failed",
        description: "There was an error resizing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, width, height, resizedImage?.url, toast]);

  const handleDownload = useCallback(() => {
    if (!resizedImage?.blob || !selectedFile) return;
    
    const a = document.createElement('a');
    a.href = resizedImage.url;
    
    // Get file extension from original name
    const extensionMatch = selectedFile.name.match(/\.[0-9a-z]+$/i);
    const extension = extensionMatch ? extensionMatch[0] : '.jpg';
    
    // Create new filename
    const filename = selectedFile.name.replace(/\.[0-9a-z]+$/i, '') + `_${width}x${height}` + extension;
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your resized image is being downloaded."
    });
  }, [resizedImage, selectedFile, width, height, toast]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setOriginalDimensions(null);
    setWidth(0);
    setHeight(0);
    
    if (resizedImage?.url) {
      URL.revokeObjectURL(resizedImage.url);
      setResizedImage(null);
    }
  }, [resizedImage]);

  return (
    <ToolLayout
      title="Image Resize"
      description="Resize your images to exact dimensions while maintaining quality. Perfect for social media, websites, and print."
      backLink="/image-tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="pt-6">
              <FileUploader
                onFileSelect={handleFileSelect}
                acceptedFileTypes="image/jpeg,image/png,image/webp,image/gif"
                maxSizeMB={20}
                selectedFile={selectedFile}
                onClearFile={clearFile}
              />
            </CardContent>
          </Card>

          {selectedFile && originalDimensions && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Resize Options</h3>
                
                <div className="mb-6">
                  <RadioGroup defaultValue="dimensions" value={resizeMethod} onValueChange={setResizeMethod} className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="dimensions" id="r1" />
                      <label htmlFor="r1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Custom Dimensions
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="percentage" id="r2" />
                      <label htmlFor="r2" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        Scale by Percentage
                      </label>
                    </div>
                  </RadioGroup>
                </div>

                {resizeMethod === 'dimensions' ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Width (px)</label>
                        <Input 
                          type="number" 
                          value={width} 
                          onChange={handleWidthChange} 
                          className="text-center"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-sm font-medium mb-1 block">Height (px)</label>
                        <Input 
                          type="number" 
                          value={height} 
                          onChange={handleHeightChange}
                          className="text-center"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="aspect-ratio" 
                        checked={maintainAspectRatio} 
                        onCheckedChange={(checked) => setMaintainAspectRatio(checked === true)}
                      />
                      <label htmlFor="aspect-ratio" className="text-sm cursor-pointer flex items-center">
                        {maintainAspectRatio ? (
                          <Lock size={14} className="mr-1" />
                        ) : (
                          <Unlock size={14} className="mr-1" />
                        )}
                        Maintain aspect ratio
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Scale to {percentage}%</label>
                      <Input 
                        type="number" 
                        value={percentage} 
                        onChange={handlePercentageChange} 
                        className="text-center"
                        min={1}
                        max={200}
                      />
                    </div>
                    
                    <div className="text-sm text-apple-darkgray">
                      Result size will be {width} × {height} px
                    </div>
                  </div>
                )}

                <div className="mt-6">
                  <Button 
                    onClick={handleResize} 
                    className="w-full apple-btn" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Processing...' : 'Resize Image'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {resizedImage && (
            <div className="mt-8">
              <h2 className="text-xl font-medium mb-4">Preview</h2>
              <Card className="overflow-hidden">
                <div className="aspect-auto max-h-[500px] overflow-hidden bg-gray-50 border-b flex items-center justify-center">
                  <img 
                    src={resizedImage.url} 
                    alt="Resized preview" 
                    className="max-w-full max-h-[500px] object-contain"
                  />
                </div>
                <CardContent className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-apple-darkgray">
                      {width} × {height} px • {formatFileSize(resizedImage.blob.size)}
                    </p>
                  </div>
                  <Button onClick={handleDownload} className="apple-btn">
                    <Download size={18} className="mr-2" />
                    Download
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4">Image Details</h2>
              {selectedFile && originalDimensions && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-apple-darkgray">Original dimensions</p>
                    <p className="font-medium text-sm">{originalDimensions.width} × {originalDimensions.height} px</p>
                  </div>
                  <div>
                    <p className="text-sm text-apple-darkgray">New dimensions</p>
                    <p className="font-medium text-sm">{width} × {height} px</p>
                  </div>
                  <div>
                    <p className="text-sm text-apple-darkgray">File type</p>
                    <p className="font-medium text-sm">{selectedFile.type.split('/')[1].toUpperCase()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-apple-darkgray">File size</p>
                    <p className="font-medium text-sm">{formatFileSize(selectedFile.size)}</p>
                  </div>
                  {resizedImage && (
                    <div>
                      <p className="text-sm text-apple-darkgray">Resized file size</p>
                      <p className="font-medium text-sm">{formatFileSize(resizedImage.blob.size)}</p>
                    </div>
                  )}
                </div>
              )}
              {!selectedFile && (
                <div className="flex flex-col items-center justify-center py-12 text-apple-darkgray">
                  <p className="text-center">Upload an image to see details</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4">Common Sizes</h2>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { name: 'Instagram', size: '1080 × 1080 px' },
                  { name: 'Facebook Cover', size: '851 × 315 px' },
                  { name: 'Twitter Header', size: '1500 × 500 px' },
                  { name: 'LinkedIn Cover', size: '1584 × 396 px' },
                  { name: 'YouTube Thumbnail', size: '1280 × 720 px' },
                ].map((item) => (
                  <div key={item.name} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm text-apple-darkgray">{item.size}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ImageResize;
