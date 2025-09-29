import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'neonedu';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Validate file size (2MB max to prevent timeouts)
    if (file.size > 2 * 1024 * 1024) {
      return NextResponse.json({ 
        error: 'File size must be less than 2MB for faster uploads' 
      }, { status: 400 });
    }

    console.log(`Starting upload for ${file.name} (${(file.size / 1024).toFixed(1)}KB) to folder: ${folder}`);

    // Upload to Cloudinary with timeout
    const uploadPromise = uploadImage(file, folder);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Upload timeout after 90 seconds')), 90000)
    );

    const imageUrl = await Promise.race([uploadPromise, timeoutPromise]) as string;
    
    console.log('Upload completed successfully');
    return NextResponse.json({ url: imageUrl });
  } catch (error) {
    console.error('Upload error:', error);
    
    let errorMessage = 'Failed to upload image';
    if (error instanceof Error) {
      if (error.message.includes('timeout')) {
        errorMessage = 'Upload timed out. Please try a smaller image.';
      } else if (error.message.includes('Request Timeout')) {
        errorMessage = 'Cloudinary timeout. Please try again with a smaller image.';
      }
    }
    
    return NextResponse.json(
      { error: errorMessage }, 
      { status: 500 }
    );
  }
}
