
/**
 * Compresses an image file and returns the compressed blob
 * @param file The image file to compress
 * @param quality A number between 0 and 1 indicating the image quality
 * @param maxWidth Maximum width of the compressed image (maintains aspect ratio)
 * @returns Promise that resolves to the compressed image blob
 */
export const compressImage = (file: File, quality: number = 0.7, maxWidth: number = 1920): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get the file type (jpg, png, etc)
        let type = file.type;
        // Default to jpeg if the type is not recognized
        if (!type || type === '') {
          type = 'image/jpeg';
        }
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

/**
 * Formats a file size in bytes to a human-readable string
 * @param bytes The size in bytes
 * @param decimals Number of decimal places
 * @returns Formatted string (e.g., '2.5 MB')
 */
export const formatFileSize = (bytes: number, decimals: number = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Gets the dimensions of an image file
 * @param file The image file
 * @returns Promise that resolves to an object containing width and height
 */
export const getImageDimensions = (file: File): Promise<{ width: number, height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);
    
    img.onload = () => {
      const dimensions = {
        width: img.width,
        height: img.height
      };
      URL.revokeObjectURL(img.src);
      resolve(dimensions);
    };
    
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Error loading image'));
    };
  });
};

/**
 * Resizes an image file to specific dimensions
 * @param file The image file to resize
 * @param width The target width
 * @param height The target height
 * @param quality Quality of the output image (0-1)
 * @returns Promise that resolves to the resized image blob
 */
export const resizeImage = (
  file: File,
  width: number,
  height: number,
  quality: number = 0.9
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Get the file type (jpg, png, etc)
        let type = file.type;
        // Default to jpeg if the type is not recognized
        if (!type || type === '') {
          type = 'image/jpeg';
        }
        
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          type,
          quality
        );
      };
      
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};
