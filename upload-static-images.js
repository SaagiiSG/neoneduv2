const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || 'demo',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'demo',
});

console.log('Cloudinary config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? '***' + process.env.CLOUDINARY_API_KEY.slice(-4) : 'not set',
  api_secret: process.env.CLOUDINARY_API_SECRET ? '***' + process.env.CLOUDINARY_API_SECRET.slice(-4) : 'not set'
});

// Images to upload with their folder structure
const imagesToUpload = [
  // Hero carousel images
  { 
    path: 'public/Neon Edu v3.png', 
    folder: 'neonedu/hero', 
    publicId: 'neon-edu-v3',
    description: 'Main hero image'
  },
  { 
    path: 'public/4.jpg', 
    folder: 'neonedu/hero', 
    publicId: 'image-4',
    description: 'Hero image 4'
  },
  { 
    path: 'public/Neon Edu v3 (1).png', 
    folder: 'neonedu/hero', 
    publicId: 'neon-edu-v3-alt',
    description: 'Alternative hero image'
  },
  { 
    path: 'public/Neon Edu v3 Image.png', 
    folder: 'neonedu/hero', 
    publicId: 'neon-edu-image',
    description: 'Neon Edu hero image'
  },
  
  // Background images
  { 
    path: 'public/Australia Hero Neon Edu.png', 
    folder: 'neonedu/hero', 
    publicId: 'australia-hero',
    description: 'Australia hero background'
  },
  { 
    path: 'public/ourServiceBgDots.svg', 
    folder: 'neonedu/backgrounds', 
    publicId: 'our-service-bg-dots',
    description: 'Our service background dots'
  },
  { 
    path: 'public/Australia Dots Neon Edu.svg', 
    folder: 'neonedu/backgrounds', 
    publicId: 'australia-dots',
    description: 'Australia dots background'
  },
  { 
    path: 'public/our focus bg.svg', 
    folder: 'neonedu/backgrounds', 
    publicId: 'our-focus-bg',
    description: 'Our focus background'
  },
  
  // Logo
  { 
    path: 'public/Neon Edu Logo.png', 
    folder: 'neonedu/assets', 
    publicId: 'logo',
    description: 'Neon Edu logo'
  },
  
  // Team member photos
  { 
    path: 'public/Anar.png', 
    folder: 'neonedu/team', 
    publicId: 'anar',
    description: 'Anar team member photo'
  },
  { 
    path: 'public/Dalantai.png', 
    folder: 'neonedu/team', 
    publicId: 'dalantai',
    description: 'Dalantai team member photo'
  },
  { 
    path: 'public/Enkhjin.png', 
    folder: 'neonedu/team', 
    publicId: 'enkhjin',
    description: 'Enkhjin team member photo'
  },
  { 
    path: 'public/Enkhuush.png', 
    folder: 'neonedu/team', 
    publicId: 'enkhuush',
    description: 'Enkhuush team member photo'
  },
  { 
    path: 'public/Kherlen.png', 
    folder: 'neonedu/team', 
    publicId: 'kherlen',
    description: 'Kherlen team member photo'
  },
  { 
    path: 'public/Mandakhjargal.png', 
    folder: 'neonedu/team', 
    publicId: 'mandakhjargal',
    description: 'Mandakhjargal team member photo'
  },
  { 
    path: 'public/Yumjir (1).png', 
    folder: 'neonedu/team', 
    publicId: 'yumjir',
    description: 'Yumjir team member photo'
  },
  
  // Classroom images
  { 
    path: 'public/classroom1.png', 
    folder: 'neonedu/assets', 
    publicId: 'classroom1',
    description: 'Classroom image 1'
  },
  { 
    path: 'public/classroom2.svg', 
    folder: 'neonedu/assets', 
    publicId: 'classroom2',
    description: 'Classroom image 2'
  },
  
  // Country images
  { 
    path: 'public/Neon Edu v3 (2)/china.svg', 
    folder: 'neonedu/countries', 
    publicId: 'china',
    description: 'China country image'
  },
  { 
    path: 'public/Neon Edu v3 (2)/hungray.svg', 
    folder: 'neonedu/countries', 
    publicId: 'hungary',
    description: 'Hungary country image'
  },
  { 
    path: 'public/Neon Edu v3 (2)/korea.svg', 
    folder: 'neonedu/countries', 
    publicId: 'korea',
    description: 'Korea country image'
  },
  { 
    path: 'public/Neon Edu v3 (2)/malas.svg', 
    folder: 'neonedu/countries', 
    publicId: 'malaysia',
    description: 'Malaysia country image'
  },
  { 
    path: 'public/Neon Edu v3 (2)/singapiore.svg', 
    folder: 'neonedu/countries', 
    publicId: 'singapore',
    description: 'Singapore country image'
  },
  
  // Country dots
  { 
    path: 'public/china dots.svg', 
    folder: 'neonedu/countries', 
    publicId: 'china-dots',
    description: 'China dots background'
  },
  { 
    path: 'public/hungary dots.svg', 
    folder: 'neonedu/countries', 
    publicId: 'hungary-dots',
    description: 'Hungary dots background'
  },
  { 
    path: 'public/korea dots.svg', 
    folder: 'neonedu/countries', 
    publicId: 'korea-dots',
    description: 'Korea dots background'
  },
  { 
    path: 'public/malas dots.svg', 
    folder: 'neonedu/countries', 
    publicId: 'malaysia-dots',
    description: 'Malaysia dots background'
  },
  { 
    path: 'public/singapore dots.svg', 
    folder: 'neonedu/countries', 
    publicId: 'singapore-dots',
    description: 'Singapore dots background'
  },
  { 
    path: 'public/australiaDots.svg', 
    folder: 'neonedu/countries', 
    publicId: 'australia-dots',
    description: 'Australia dots background'
  }
];

async function uploadImages() {
  console.log('🚀 Starting upload of static images to Cloudinary...\n');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const image of imagesToUpload) {
    try {
      // Check if file exists
      if (!fs.existsSync(image.path)) {
        console.log(`❌ File not found: ${image.path}`);
        errorCount++;
        continue;
      }
      
      console.log(`📤 Uploading: ${image.description} (${image.path})`);
      
      const result = await cloudinary.uploader.upload(image.path, {
        folder: image.folder,
        public_id: image.publicId,
        resource_type: 'auto',
        quality: 'auto:good',
        fetch_format: 'auto',
        overwrite: true, // Overwrite if exists
        eager: [
          { width: 1200, height: 800, crop: 'fill', quality: 'auto:good', format: 'webp' },
          { width: 800, height: 600, crop: 'limit', quality: 'auto:good', format: 'webp' },
          { width: 400, height: 300, crop: 'limit', quality: 'auto:good', format: 'webp' }
        ]
      });
      
      console.log(`✅ Uploaded: ${result.secure_url}`);
      console.log(`   Public ID: ${result.public_id}`);
      console.log(`   Size: ${(result.bytes / 1024).toFixed(2)} KB\n`);
      
      successCount++;
      
    } catch (error) {
      console.log(`❌ Error uploading ${image.path}:`, error.message);
      errorCount++;
    }
  }
  
  console.log(`\n📊 Upload Summary:`);
  console.log(`✅ Successfully uploaded: ${successCount} images`);
  console.log(`❌ Failed uploads: ${errorCount} images`);
  console.log(`📁 Total images processed: ${imagesToUpload.length}`);
  
  if (successCount > 0) {
    console.log(`\n🎉 Images are now available in Cloudinary!`);
    console.log(`🔗 Check your Cloudinary dashboard to see the uploaded images.`);
  }
}

// Run the upload
uploadImages().catch(console.error);

