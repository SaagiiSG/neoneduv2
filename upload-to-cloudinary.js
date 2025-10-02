const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary - You need to add your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'YOUR_CLOUD_NAME',
  api_key: process.env.CLOUDINARY_API_KEY || 'YOUR_API_KEY',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'YOUR_API_SECRET',
});

// Images to upload
const imagesToUpload = [
  // Hero carousel images
  { path: 'public/Neon Edu v3.png', folder: 'neonedu/hero', publicId: 'neon-edu-v3' },
  { path: 'public/4.jpg', folder: 'neonedu/hero', publicId: 'image-4' },
  { path: 'public/Neon Edu v3 (1).png', folder: 'neonedu/hero', publicId: 'neon-edu-v3-alt' },
  { path: 'public/Neon Edu v3 Image.png', folder: 'neonedu/hero', publicId: 'neon-edu-image' },
  
  // Background images
  { path: 'public/Australia Hero Neon Edu.png', folder: 'neonedu/hero', publicId: 'australia-hero' },
  { path: 'public/ourServiceBgDots.svg', folder: 'neonedu/backgrounds', publicId: 'our-service-bg-dots' },
  { path: 'public/Australia Dots Neon Edu.svg', folder: 'neonedu/backgrounds', publicId: 'australia-dots' },
  { path: 'public/our focus bg.svg', folder: 'neonedu/backgrounds', publicId: 'our-focus-bg' },
  
  // Logo
  { path: 'public/Neon Edu Logo.png', folder: 'neonedu/assets', publicId: 'logo' },
  
  // Team member photos
  { path: 'public/Anar.png', folder: 'neonedu/team', publicId: 'anar' },
  { path: 'public/Dalantai.png', folder: 'neonedu/team', publicId: 'dalantai' },
  { path: 'public/Enkhjin.png', folder: 'neonedu/team', publicId: 'enkhjin' },
  { path: 'public/Enkhuush.png', folder: 'neonedu/team', publicId: 'enkhuush' },
  { path: 'public/Kherlen.png', folder: 'neonedu/team', publicId: 'kherlen' },
  { path: 'public/Mandakhjargal.png', folder: 'neonedu/team', publicId: 'mandakhjargal' },
  { path: 'public/Yumjir (1).png', folder: 'neonedu/team', publicId: 'yumjir' },
  
  // Classroom images
  { path: 'public/classroom1.png', folder: 'neonedu/assets', publicId: 'classroom1' },
  { path: 'public/classroom2.svg', folder: 'neonedu/assets', publicId: 'classroom2' },
];

async function uploadImages() {
  console.log('Starting image upload to Cloudinary...\n');
  
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (const image of imagesToUpload) {
    try {
      console.log(`Uploading: ${image.path}...`);
      
      if (!fs.existsSync(image.path)) {
        console.log(`  ❌ File not found: ${image.path}\n`);
        failCount++;
        continue;
      }
      
      const result = await cloudinary.uploader.upload(image.path, {
        folder: image.folder,
        public_id: image.publicId,
        resource_type: 'auto',
        quality: 'auto:good',
        fetch_format: 'auto',
        overwrite: true,
      });
      
      console.log(`  ✅ Uploaded successfully!`);
      console.log(`     URL: ${result.secure_url}\n`);
      
      results.push({
        originalPath: image.path,
        publicId: `${image.folder}/${image.publicId}`,
        url: result.secure_url,
      });
      
      successCount++;
    } catch (error) {
      console.log(`  ❌ Error uploading ${image.path}:`, error.message, '\n');
      failCount++;
    }
  }
  
  console.log('\n======================================');
  console.log('Upload Summary:');
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📊 Total: ${imagesToUpload.length}`);
  console.log('======================================\n');
  
  // Save results to a file for reference
  fs.writeFileSync(
    'cloudinary-upload-results.json',
    JSON.stringify(results, null, 2)
  );
  console.log('Results saved to: cloudinary-upload-results.json\n');
  
  return results;
}

// Run the upload
uploadImages()
  .then(() => {
    console.log('✨ Upload complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });


