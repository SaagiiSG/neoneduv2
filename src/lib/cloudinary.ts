import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryUploadResult } from './types';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

export default cloudinary;

// Helper function to upload image
export async function uploadImage(file: File, folder: string = 'neonedu'): Promise<string> {
  try {
    console.log(`Uploading image: ${file.name}, size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
    
    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const dataURI = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary with timeout and optimization
    const result = await Promise.race([
      cloudinary.uploader.upload(dataURI, {
        folder: folder,
        resource_type: 'auto',
        quality: 'auto:good', // Optimize for good quality/size balance
        fetch_format: 'auto',
        timeout: 60000, // 60 second timeout
        chunk_size: 6000000, // 6MB chunks
        eager: [
          { width: 800, height: 600, crop: 'limit' }, // Optimized version
          { width: 400, height: 300, crop: 'limit' }  // Thumbnail version
        ]
      }),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Upload timeout after 60 seconds')), 60000)
      )
    ]) as CloudinaryUploadResult;

    console.log('Image uploaded successfully:', result.secure_url);
    return result.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
}

// Helper function to delete image
export async function deleteImage(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

// Helper function to extract public ID from URL
export function extractPublicId(url: string): string {
  const parts = url.split('/');
  const filename = parts[parts.length - 1];
  return filename.split('.')[0];
}
