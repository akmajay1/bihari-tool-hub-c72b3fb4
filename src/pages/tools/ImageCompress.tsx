
import React, { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Download, Image, Settings } from 'lucide-react';
import ToolLayout from '@/components/Layout/ToolLayout';
import FileUploader from '@/components/UI/FileUploader';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { compressImage, formatFileSize, getImageDimensions } from '@/utils/imageUtils';
import { Card, CardContent } from '@/components/ui/card';

const ImageCompress = () => {
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [compressedUrl, setCompressedUrl] = useState<string | null>(null);
  const [quality, setQuality] = useState<number>(80);
  const [originalSize, setOriginalSize] = useState<number>(0);
  const [compressedSize, setCompressedSize] = useState<number>(0);
  const [dimensions, setDimensions] = useState<{ width: number, height: number } | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Clean up URLs on unmount
  useEffect(() => {
    return () => {
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }
    };
  }, [compressedUrl]);

  const handleFileSelect = useCallback(async (file: File) => {
    setSelectedFile(file);
    setOriginalSize(file.size);
    setCompressedBlob(null);
    setCompressedUrl(null);
    setCompressedSize(0);
    
    try {
      const dims = await getImageDimensions(file);
      setDimensions(dims);
    } catch (error) {
      console.error("Failed to get image dimensions:", error);
      toast({
        title: "Error",
        description: "Failed to process the image. Please try again.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleCompress = useCallback(async () => {
    if (!selectedFile) return;
    
    setIsProcessing(true);
    
    try {
      const blob = await compressImage(selectedFile, quality / 100);
      
      // Clean up old URL
      if (compressedUrl) {
        URL.revokeObjectURL(compressedUrl);
      }
      
      const url = URL.createObjectURL(blob);
      
      setCompressedBlob(blob);
      setCompressedUrl(url);
      setCompressedSize(blob.size);
      
      toast({
        title: "Compression complete",
        description: `Reduced from ${formatFileSize(originalSize)} to ${formatFileSize(blob.size)}`,
      });
    } catch (error) {
      console.error("Error compressing image:", error);
      toast({
        title: "Compression failed",
        description: "There was an error compressing your image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  }, [selectedFile, quality, compressedUrl, originalSize, toast]);

  const handleDownload = useCallback(() => {
    if (!compressedBlob || !selectedFile) return;
    
    const a = document.createElement('a');
    a.href = compressedUrl as string;
    
    // Get the file extension from the original filename
    const extensionMatch = selectedFile.name.match(/\.[0-9a-z]+$/i);
    const extension = extensionMatch ? extensionMatch[0] : '.jpg';
    
    // Create a new filename with "_compressed" suffix
    const filename = selectedFile.name.replace(/\.[0-9a-z]+$/i, '') + '_compressed' + extension;
    
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    toast({
      title: "Download started",
      description: "Your compressed image is being downloaded."
    });
  }, [compressedBlob, compressedUrl, selectedFile, toast]);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setCompressedBlob(null);
    if (compressedUrl) {
      URL.revokeObjectURL(compressedUrl);
      setCompressedUrl(null);
    }
    setOriginalSize(0);
    setCompressedSize(0);
    setDimensions(null);
  }, [compressedUrl]);

  return (
    <ToolLayout
      title="Image Compression"
      description="Reduce the file size of your images while maintaining quality. Perfect for websites, emails, and social media."
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

          {selectedFile && (
            <Card>
              <CardContent className="pt-6">
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="quality-slider" className="font-medium">
                      Quality: {quality}%
                    </label>
                    <div className="text-sm text-apple-darkgray">
                      Better compression
                    </div>
                  </div>
                  <Slider
                    id="quality-slider"
                    min={1}
                    max={100}
                    step={1}
                    value={[quality]}
                    onValueChange={(values) => setQuality(values[0])}
                    className="my-6"
                  />
                  <div className="flex justify-between text-sm text-apple-darkgray">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCompress} 
                  className="w-full apple-btn"
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Compress Image'}
                </Button>
              </CardContent>
            </Card>
          )}

          {compressedBlob && compressedUrl && (
            <div className="mt-8">
              <h2 className="text-xl font-medium mb-4">Preview</h2>
              <Card className="overflow-hidden">
                <div className="aspect-auto max-h-[500px] overflow-hidden bg-gray-50 border-b flex items-center justify-center">
                  <img 
                    src={compressedUrl} 
                    alt="Compressed preview" 
                    className="max-w-full max-h-[500px] object-contain"
                  />
                </div>
                <CardContent className="py-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-apple-darkgray">
                      {formatFileSize(compressedSize)} • {Math.round((1 - (compressedSize / originalSize)) * 100)}% smaller
                    </p>
                    {dimensions && (
                      <p className="text-sm text-apple-darkgray">
                        {dimensions.width} × {dimensions.height} px
                      </p>
                    )}
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
              <h2 className="text-xl font-medium mb-4">Image Specifications</h2>
              {selectedFile && (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-apple-darkgray">File name</p>
                    <p className="font-medium text-sm">{selectedFile.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-apple-darkgray">Original size</p>
                    <p className="font-medium text-sm">{formatFileSize(originalSize)}</p>
                  </div>
                  {dimensions && (
                    <div>
                      <p className="text-sm text-apple-darkgray">Dimensions</p>
                      <p className="font-medium text-sm">{dimensions.width} × {dimensions.height} px</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-apple-darkgray">Type</p>
                    <p className="font-medium text-sm">{selectedFile.type.split('/')[1].toUpperCase()}</p>
                  </div>
                  {compressedSize > 0 && (
                    <>
                      <div>
                        <p className="text-sm text-apple-darkgray">Compressed size</p>
                        <p className="font-medium text-sm">{formatFileSize(compressedSize)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-apple-darkgray">Saved</p>
                        <p className="font-medium text-sm">{formatFileSize(originalSize - compressedSize)} ({Math.round((1 - (compressedSize / originalSize)) * 100)}%)</p>
                      </div>
                    </>
                  )}
                </div>
              )}
              {!selectedFile && (
                <div className="flex flex-col items-center justify-center py-12 text-apple-darkgray">
                  <Image size={48} className="mb-4 opacity-50" />
                  <p className="text-center">Upload an image to see specifications</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h2 className="text-xl font-medium mb-4">Tips</h2>
              <ul className="space-y-3 text-sm text-apple-darkgray">
                <li>• For photos, a quality setting of 70-80% often provides the best balance between size and quality</li>
                <li>• For graphics and illustrations, you can often go as low as 60% without noticeable quality loss</li>
                <li>• PNG files work best for images with text, logos, or transparent backgrounds</li>
                <li>• JPG is ideal for photographs and complex images with many colors</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </ToolLayout>
  );
};

export default ImageCompress;
