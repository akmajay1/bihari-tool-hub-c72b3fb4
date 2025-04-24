
import React, { useState, useEffect } from 'react';
import ToolLayout from '../../components/Layout/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUploader from '@/components/UI/FileUploader';
import { formatFileSize } from '@/utils/imageUtils';
import { toast } from 'sonner';
import { Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useLanguage } from '@/context/LanguageContext';

const ImageRemoveBackground = () => {
  const { t } = useLanguage();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [outputUrl, setOutputUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [tolerance, setTolerance] = useState(30);
  const [imageInfo, setImageInfo] = useState<{ size: string; width: number; height: number } | null>(null);
  const [activeTab, setActiveTab] = useState<string>("result"); // Default to result tab

  // Reset state when file changes
  useEffect(() => {
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPreviewUrl(e.target.result as string);
          setOutputUrl(null);
          setActiveTab("original"); // Show original when uploading new file
        }
      };
      reader.readAsDataURL(selectedFile);

      // Set image information
      setImageInfo({
        size: formatFileSize(selectedFile.size),
        width: 0,
        height: 0,
      });

      // Get image dimensions
      const img = new Image();
      img.onload = () => {
        setImageInfo(prev => ({
          size: prev?.size || '0 KB',
          width: img.width,
          height: img.height,
        }));
      };
      img.src = URL.createObjectURL(selectedFile);
    } else {
      setPreviewUrl(null);
      setOutputUrl(null);
      setImageInfo(null);
    }
  }, [selectedFile]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setOutputUrl(null);
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setOutputUrl(null);
    setImageInfo(null);
  };

  const removeBackground = async () => {
    if (!selectedFile || !previewUrl) {
      toast.error('Please select an image first');
      return;
    }

    setLoading(true);
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      const img = new Image();
      img.onload = () => {
        // Set canvas dimensions to match image
        canvas.width = img.width;
        canvas.height = img.height;
        
        // Draw image onto canvas
        ctx.drawImage(img, 0, 0);
        
        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample background color from corners (assuming background is in the corners)
        const cornerSamples = [
          getPixelColor(data, 0, 0, canvas.width),
          getPixelColor(data, canvas.width - 1, 0, canvas.width),
          getPixelColor(data, 0, canvas.height - 1, canvas.width),
          getPixelColor(data, canvas.width - 1, canvas.height - 1, canvas.width)
        ];
        
        // Find most common background color (simple approach)
        const bgColor = cornerSamples[0]; // Simplified; could use most frequent color
        
        // Process each pixel
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          
          // Check if pixel is similar to background color using tolerance
          if (
            Math.abs(r - bgColor.r) < tolerance &&
            Math.abs(g - bgColor.g) < tolerance &&
            Math.abs(b - bgColor.b) < tolerance
          ) {
            // Make it transparent
            data[i + 3] = 0;
          }
        }
        
        // Put the modified image data back on the canvas
        ctx.putImageData(imageData, 0, 0);
        
        // Create output URL
        const outputUrl = canvas.toDataURL('image/png');
        setOutputUrl(outputUrl);
        setLoading(false);
        setActiveTab("result"); // Automatically show result tab
        toast.success('Background removed successfully!');
      };
      
      img.onerror = () => {
        setLoading(false);
        toast.error('Failed to load image');
      };
      
      img.src = previewUrl;
    } catch (error) {
      console.error('Error removing background:', error);
      toast.error('Failed to remove background. Please try again.');
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!outputUrl) return;
    
    const link = document.createElement('a');
    link.href = outputUrl;
    link.download = `nobg_${selectedFile?.name || 'image'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Image downloaded successfully!');
  };

  // Helper function to get pixel color
  const getPixelColor = (data: Uint8ClampedArray, x: number, y: number, width: number) => {
    const index = (y * width + x) * 4;
    return {
      r: data[index],
      g: data[index + 1],
      b: data[index + 2]
    };
  };

  return (
    <ToolLayout
      title="Remove Background"
      description="Automatically remove background from any image. Perfect for professional photos, documents, and online profiles."
      backLink="/image-tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('uploadImage')}</h2>
          <FileUploader
            onFileSelect={handleFileSelect}
            acceptedFileTypes="image/*"
            maxSizeMB={10}
            selectedFile={selectedFile}
            onClearFile={handleClearFile}
          />
          {imageInfo && (
            <div className="mt-4 text-sm text-apple-darkgray">
              <p>{t('size')}: {imageInfo.size}</p>
              <p>{t('dimensions')}: {imageInfo.width} × {imageInfo.height} {t('pixels')}</p>
            </div>
          )}
        </Card>

        {/* Settings Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">{t('configureSettings')}</h2>
          
          <div className="mb-6">
            <h3 className="font-medium mb-2">{t('colorTolerance')}: {tolerance}</h3>
            <Slider 
              value={[tolerance]} 
              min={5} 
              max={100} 
              step={1}
              onValueChange={(values) => setTolerance(values[0])} 
            />
            <p className="text-sm text-apple-darkgray mt-2">
              {t('higherValues')}
            </p>
          </div>
          
          <Button
            onClick={removeBackground}
            disabled={!selectedFile || loading}
            className="w-full"
          >
            {loading ? t('processing') : t('removeBackground')}
          </Button>
        </Card>
      </div>

      {/* Preview Section */}
      {(previewUrl || outputUrl) && (
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">{t('previewDownload')}</h2>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="original">{t('original')}</TabsTrigger>
              <TabsTrigger value="result" disabled={!outputUrl}>
                {t('result')}
              </TabsTrigger>
              <TabsTrigger value="comparison" disabled={!outputUrl}>
                Before/After
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
            <TabsContent value="result">
              {outputUrl && (
                <div className="flex flex-col items-center">
                  <div className="flex justify-center bg-checkerboard border rounded-lg p-4 mb-4">
                    <img 
                      src={outputUrl} 
                      alt="Result" 
                      className="max-h-96 object-contain"
                    />
                  </div>
                  <div className="flex gap-4">
                    <Button onClick={handleDownload} className="flex items-center gap-2">
                      <Download size={18} />
                      {t('download')}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="comparison">
              {outputUrl && previewUrl && (
                <div className="flex flex-col md:flex-row gap-4 border rounded-lg overflow-hidden">
                  <div className="flex-1 bg-gray-50 p-4 border-r border-gray-200">
                    <div className="text-center font-medium mb-2">{t('original')}</div>
                    <div className="flex justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Original" 
                        className="max-h-80 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1 bg-checkerboard p-4">
                    <div className="text-center font-medium mb-2">{t('result')}</div>
                    <div className="flex justify-center">
                      <img 
                        src={outputUrl} 
                        alt="Result" 
                        className="max-h-80 object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
              {outputUrl && (
                <div className="mt-4 flex justify-center">
                  <Button onClick={handleDownload} className="flex items-center gap-2">
                    <Download size={18} />
                    {t('download')}
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </Card>
      )}
    </ToolLayout>
  );
};

export default ImageRemoveBackground;
