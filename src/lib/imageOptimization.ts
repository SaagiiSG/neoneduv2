// Cloudinary URL optimization utilities
export function getOptimizedImageUrl(
  publicId: string, 
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'limit' | 'scale';
    gravity?: 'auto' | 'face' | 'center';
  } = {}
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'demo';
  
  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
    gravity
  } = options;

  let transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push(`c_${crop}`);
  if (gravity && gravity !== undefined) transformations.push(`g_${gravity}`);

  const transformationString = transformations.join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
}

// Extract public ID from Cloudinary URL
export function extractPublicIdFromUrl(url: string): string {
  if (!url || !url.includes('cloudinary.com')) {
    return url; // Return original URL if not a Cloudinary URL
  }
  
  const parts = url.split('/');
  const uploadIndex = parts.findIndex(part => part === 'upload');
  
  if (uploadIndex === -1 || uploadIndex + 1 >= parts.length) {
    return url;
  }
  
  // Get everything after 'upload' and before the file extension
  const publicIdWithExt = parts.slice(uploadIndex + 1).join('/');
  const publicId = publicIdWithExt.split('.')[0];
  
  return publicId;
}

// Optimize any image URL (Cloudinary or local)
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'auto:good' | 'auto:best' | number;
    format?: 'auto' | 'webp' | 'jpg' | 'png';
    crop?: 'fill' | 'fit' | 'limit' | 'scale';
    gravity?: 'auto' | 'face' | 'center';
  } = {}
): string {
  // If it's already a Cloudinary URL, optimize it
  if (url && url.includes('cloudinary.com')) {
    const publicId = extractPublicIdFromUrl(url);
    return getOptimizedImageUrl(publicId, options);
  }
  
  // For local images, return as-is (they're already optimized)
  return url;
}

// Optimized hero carousel images with Cloudinary transformations
export const heroImageUrls = {
  neonEduV3: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'demo' 
    ? getOptimizedImageUrl('neonedu/hero/neon-edu-v3', { 
        width: 1200, 
        height: 800, 
        quality: 'auto:good',
        format: 'webp',
        crop: 'fill'
      })
    : "/Neon Edu v3.png",
  image4: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'demo'
    ? getOptimizedImageUrl('neonedu/hero/image-4', { 
        width: 1200, 
        height: 800, 
        quality: 'auto:good',
        format: 'webp',
        crop: 'fill'
      })
    : "/4.jpg", 
  neonEduV3Alt: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'demo'
    ? getOptimizedImageUrl('neonedu/hero/neon-edu-v3-alt', { 
        width: 1200, 
        height: 800, 
        quality: 'auto:good',
        format: 'webp',
        crop: 'fill'
      })
    : "/Neon Edu v3 (1).png",
  neonEduImage: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'demo'
    ? getOptimizedImageUrl('neonedu/hero/neon-edu-image', { 
        width: 1200, 
        height: 800, 
        quality: 'auto:good',
        format: 'webp',
        crop: 'fill'
      })
    : "/Neon Edu v3 Image.png",
  australiaHero: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'demo'
    ? getOptimizedImageUrl('neonedu/hero/australia-hero', { 
        width: 800, 
        height: 600, 
        quality: 'auto:good',
        format: 'auto',
        crop: 'limit'
      })
    : "/Australia Hero Neon Edu.png"
};

// Fallback to original URLs if Cloudinary fails
export const fallbackImageUrls = {
  neonEduV3: "/Neon Edu v3.png",
  image4: "/4.jpg",
  neonEduV3Alt: "/Neon Edu v3 (1).png",
  neonEduImage: "/Neon Edu v3 Image.png",
  australiaHero: "/Australia Hero Neon Edu.png"
};

// Preload critical images for faster loading
export const preloadImageUrls = [
  heroImageUrls.neonEduV3,
  heroImageUrls.australiaHero,
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME !== 'demo'
    ? getOptimizedImageUrl('neonedu/assets/logo', { 
        width: 200, 
        height: 200, 
        quality: 'auto:good',
        format: 'webp'
      })
    : "/Neon Edu Logo.png"
];
