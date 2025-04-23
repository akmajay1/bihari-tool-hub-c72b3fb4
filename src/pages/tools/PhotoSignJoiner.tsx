
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Download, MoveHorizontal, MoveVertical, Move, PenLine, Trash2 } from 'lucide-react';
import ToolLayout from '../../components/Layout/ToolLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import FileUploader from '@/components/UI/FileUploader';
import { formatFileSize } from '@/utils/imageUtils';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

const PhotoSignJoiner = () => {
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [signFile, setSignFile] = useState<File | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [signUrl, setSignUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [orientation, setOrientation] = useState<string>('horizontal');
  const [signPosition, setSignPosition] = useState<string>('bottom-right');
  const [signScale, setSignScale] = useState<number>(30);
  const [padding, setPadding] = useState<number>(10);
  const [transparency, setTransparency] = useState<number>(0);
  const [addBorder, setAddBorder] = useState<boolean>(false);
  const [whiteBg, setWhiteBg] = useState<boolean>(true);

  // Create preview URLs when files are selected
  useEffect(() => {
    if (photoFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setPhotoUrl(e.target.result as string);
          setResultUrl(null);
        }
      };
      reader.readAsDataURL(photoFile);
    } else {
      setPhotoUrl(null);
    }
  }, [photoFile]);
  
  useEffect(() => {
    if (signFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSignUrl(e.target.result as string);
          setResultUrl(null);
        }
      };
      reader.readAsDataURL(signFile);
    } else {
      setSignUrl(null);
    }
  }, [signFile]);

  const handlePhotoSelect = (file: File) => {
    setPhotoFile(file);
    setResultUrl(null);
  };
  
  const handleSignSelect = (file: File) => {
    setSignFile(file);
    setResultUrl(null);
  };
  
  const clearPhoto = () => {
    setPhotoFile(null);
    setPhotoUrl(null);
    setResultUrl(null);
  };
  
  const clearSign = () => {
    setSignFile(null);
    setSignUrl(null);
    setResultUrl(null);
  };
  
  const mergeImages = async () => {
    if (!photoFile || !photoUrl || !signFile || !signUrl) {
      toast.error('Please select both a photo and signature');
      return;
    }
    
    setLoading(true);
    try {
      // Load both images
      const photoImg = new Image();
      const signImg = new Image();
      
      // Wait for both images to load
      await Promise.all([
        new Promise<void>((resolve, reject) => {
          photoImg.onload = () => resolve();
          photoImg.onerror = () => reject(new Error('Failed to load photo'));
          photoImg.src = photoUrl;
        }),
        new Promise<void>((resolve, reject) => {
          signImg.onload = () => resolve();
          signImg.onerror = () => reject(new Error('Failed to load signature'));
          signImg.src = signUrl;
        })
      ]);
      
      // Create canvas
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }
      
      // Set canvas dimensions based on orientation
      let canvasWidth: number;
      let canvasHeight: number;
      
      if (orientation === 'horizontal') {
        canvasWidth = photoImg.width + signImg.width * signScale / 100 + padding * 2;
        canvasHeight = Math.max(photoImg.height, signImg.height * signScale / 100) + padding * 2;
      } else if (orientation === 'vertical') {
        canvasWidth = Math.max(photoImg.width, signImg.width * signScale / 100) + padding * 2;
        canvasHeight = photoImg.height + signImg.height * signScale / 100 + padding * 2;
      } else { // overlay
        canvasWidth = photoImg.width + padding * 2;
        canvasHeight = photoImg.height + padding * 2;
      }
      
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
      
      // Fill background if white background is enabled
      if (whiteBg) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
      
      // Draw photo
      ctx.drawImage(photoImg, padding, padding);
      
      // Calculate signature position and size
      const signWidth = signImg.width * (signScale / 100);
      const signHeight = signImg.height * (signScale / 100);
      let signX = padding;
      let signY = padding;
      
      // Position signature based on orientation and position settings
      if (orientation === 'horizontal') {
        signX = photoImg.width + padding * 2;
        
        if (signPosition === 'top') {
          signY = padding;
        } else if (signPosition === 'center') {
          signY = (canvasHeight - signHeight) / 2;
        } else { // bottom
          signY = canvasHeight - signHeight - padding;
        }
      } else if (orientation === 'vertical') {
        signY = photoImg.height + padding * 2;
        
        if (signPosition === 'left') {
          signX = padding;
        } else if (signPosition === 'center') {
          signX = (canvasWidth - signWidth) / 2;
        } else { // right
          signX = canvasWidth - signWidth - padding;
        }
      } else { // overlay
        // Position signature within the photo
        if (signPosition === 'top-left') {
          signX = padding + 10;
          signY = padding + 10;
        } else if (signPosition === 'top-right') {
          signX = padding + photoImg.width - signWidth - 10;
          signY = padding + 10;
        } else if (signPosition === 'bottom-left') {
          signX = padding + 10;
          signY = padding + photoImg.height - signHeight - 10;
        } else { // bottom-right
          signX = padding + photoImg.width - signWidth - 10;
          signY = padding + photoImg.height - signHeight - 10;
        }
      }
      
      // Set transparency if needed
      if (transparency > 0) {
        ctx.globalAlpha = 1 - transparency / 100;
      }
      
      // Draw signature
      ctx.drawImage(signImg, signX, signY, signWidth, signHeight);
      
      // Reset transparency
      ctx.globalAlpha = 1;
      
      // Add border if enabled
      if (addBorder) {
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, canvasWidth, canvasHeight);
      }
      
      // Convert to image URL
      const resultUrl = canvas.toDataURL('image/png');
      setResultUrl(resultUrl);
      
      toast.success('Photo and signature joined successfully!');
    } catch (error) {
      console.error('Error joining images:', error);
      toast.error('Failed to join images. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleDownload = () => {
    if (!resultUrl) return;
    
    const link = document.createElement('a');
    link.href = resultUrl;
    link.download = 'photo_with_signature.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Image downloaded successfully!');
  };
  
  const getPositionOptions = () => {
    if (orientation === 'horizontal') {
      return (
        <RadioGroup 
          value={signPosition} 
          onValueChange={setSignPosition}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="top" id="top" />
            <Label htmlFor="top">Top</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="center" id="center" />
            <Label htmlFor="center">Center</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottom" id="bottom" />
            <Label htmlFor="bottom">Bottom</Label>
          </div>
        </RadioGroup>
      );
    } else if (orientation === 'vertical') {
      return (
        <RadioGroup 
          value={signPosition} 
          onValueChange={setSignPosition}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="left" id="left" />
            <Label htmlFor="left">Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="center" id="center" />
            <Label htmlFor="center">Center</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="right" id="right" />
            <Label htmlFor="right">Right</Label>
          </div>
        </RadioGroup>
      );
    } else { // overlay
      return (
        <RadioGroup 
          value={signPosition} 
          onValueChange={setSignPosition}
          className="grid grid-cols-2 gap-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="top-left" id="top-left" />
            <Label htmlFor="top-left">Top Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="top-right" id="top-right" />
            <Label htmlFor="top-right">Top Right</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottom-left" id="bottom-left" />
            <Label htmlFor="bottom-left">Bottom Left</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="bottom-right" id="bottom-right" />
            <Label htmlFor="bottom-right">Bottom Right</Label>
          </div>
        </RadioGroup>
      );
    }
  };

  return (
    <ToolLayout
      title="Photo & Sign Joiner"
      description="Combine your photo and signature into a single image. Perfect for official documents, applications, and forms."
      backLink="/image-tools"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upload Section */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">1. Upload Photo</h2>
            <FileUploader
              onFileSelect={handlePhotoSelect}
              acceptedFileTypes="image/*"
              maxSizeMB={5}
              selectedFile={photoFile}
              onClearFile={clearPhoto}
            />
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">2. Upload Signature</h2>
            <FileUploader
              onFileSelect={handleSignSelect}
              acceptedFileTypes="image/*"
              maxSizeMB={2}
              selectedFile={signFile}
              onClearFile={clearSign}
            />
            <p className="text-sm text-apple-darkgray mt-3">
              For best results, use a signature with a transparent background (PNG format)
            </p>
          </Card>
        </div>

        {/* Settings Section */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">3. Configure Layout</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Layout Orientation</h3>
              <RadioGroup 
                value={orientation} 
                onValueChange={(val) => {
                  setOrientation(val);
                  // Reset position based on new orientation
                  if (val === 'horizontal') {
                    setSignPosition('center');
                  } else if (val === 'vertical') {
                    setSignPosition('center');
                  } else {
                    setSignPosition('bottom-right');
                  }
                }}
                className="flex items-center space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="horizontal" id="horizontal" />
                  <Label htmlFor="horizontal" className="flex items-center">
                    <MoveHorizontal size={16} className="mr-1" />
                    Side by Side
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="vertical" id="vertical" />
                  <Label htmlFor="vertical" className="flex items-center">
                    <MoveVertical size={16} className="mr-1" />
                    Stacked
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="overlay" id="overlay" />
                  <Label htmlFor="overlay" className="flex items-center">
                    <Move size={16} className="mr-1" />
                    Overlay
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Signature Position</h3>
              {getPositionOptions()}
            </div>
            
            <div>
              <div className="flex justify-between mb-1">
                <h3 className="text-sm font-medium">Signature Size</h3>
                <span className="text-xs text-apple-darkgray">{signScale}%</span>
              </div>
              <Slider 
                value={[signScale]} 
                min={10} 
                max={100} 
                step={1}
                onValueChange={(values) => setSignScale(values[0])} 
              />
            </div>
            
            {orientation === 'overlay' && (
              <div>
                <div className="flex justify-between mb-1">
                  <h3 className="text-sm font-medium">Transparency</h3>
                  <span className="text-xs text-apple-darkgray">{transparency}%</span>
                </div>
                <Slider 
                  value={[transparency]} 
                  min={0} 
                  max={80} 
                  step={1}
                  onValueChange={(values) => setTransparency(values[0])} 
                />
              </div>
            )}
            
            <div>
              <div className="flex justify-between mb-1">
                <h3 className="text-sm font-medium">Padding</h3>
                <span className="text-xs text-apple-darkgray">{padding}px</span>
              </div>
              <Slider 
                value={[padding]} 
                min={0} 
                max={50} 
                step={1}
                onValueChange={(values) => setPadding(values[0])} 
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="border">Add Border</Label>
              <Switch 
                id="border" 
                checked={addBorder} 
                onCheckedChange={setAddBorder}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="whitebg">White Background</Label>
              <Switch 
                id="whitebg" 
                checked={whiteBg} 
                onCheckedChange={setWhiteBg}
              />
            </div>
            
            <Button
              onClick={mergeImages}
              disabled={!photoFile || !signFile || loading}
              className="w-full"
            >
              {loading ? 'Processing...' : 'Join Images'}
            </Button>
          </div>
        </Card>
      </div>

      {/* Preview Section */}
      {resultUrl && (
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">4. Preview & Download</h2>
          <div className="flex flex-col items-center">
            <div className="flex justify-center bg-gray-50 border rounded-lg p-4 mb-4">
              <img 
                src={resultUrl} 
                alt="Photo with Signature" 
                className="max-h-96 object-contain"
              />
            </div>
            <Button onClick={handleDownload} className="flex items-center gap-2">
              <Download size={18} />
              Download
            </Button>
          </div>
        </Card>
      )}
    </ToolLayout>
  );
};

export default PhotoSignJoiner;
