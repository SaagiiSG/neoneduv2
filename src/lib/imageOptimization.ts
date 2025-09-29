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
    gravity = 'auto'
  } = options;

  let transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);
  transformations.push(`c_${crop}`);
  if (gravity) transformations.push(`g_${gravity}`);

  const transformationString = transformations.join(',');
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformationString}/${publicId}`;
}

// Predefined optimized URLs for hero images
export const heroImageUrls = {
  neonEduV3: getOptimizedImageUrl('neonedu/hero/neon-edu-v3', {
    width: 1200,
    height: 800,
    quality: 'auto:good',
    format: 'webp'
  }),
  image4: getOptimizedImageUrl('neonedu/hero/image-4', {
    width: 1200,
    height: 800,
    quality: 'auto:good',
    format: 'webp'
  }),
  neonEduV3Alt: getOptimizedImageUrl('neonedu/hero/neon-edu-v3-alt', {
    width: 1200,
    height: 800,
    quality: 'auto:good',
    format: 'webp'
  }),
  neonEduImage: getOptimizedImageUrl('neonedu/hero/neon-edu-image', {
    width: 1200,
    height: 800,
    quality: 'auto:good',
    format: 'webp'
  }),
  australiaHero: getOptimizedImageUrl('neonedu/hero/australia-hero', {
    width: 700,
    height: 664,
    quality: 'auto:good',
    format: 'webp'
  })
};

// Fallback to original URLs if Cloudinary fails
export const fallbackImageUrls = {
  neonEduV3: "/Neon Edu v3.png",
  image4: "/4.jpg",
  neonEduV3Alt: "/Neon Edu v3 (1).png",
  neonEduImage: "/Neon Edu v3 Image.png",
  australiaHero: "/Australia Hero Neon Edu.png"
};
