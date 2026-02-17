import sharp from 'sharp';

async function generatePWAIcons() {
  try {
    const sourcePath = './public/icon-1024.png';
    const outputDir = './public';

    // Generate 192x192 icon
    await sharp(sourcePath)
      .resize(192, 192, {
        fit: 'cover',
        position: 'center',
      })
      .png({ quality: 90 })
      .toFile(`${outputDir}/icon-192.png`);

    console.log('✅ Generated icon-192.png');

    // Generate 512x512 icon
    await sharp(sourcePath)
      .resize(512, 512, {
        fit: 'cover',
        position: 'center',
      })
      .png({ quality: 90 })
      .toFile(`${outputDir}/icon-512.png`);

    console.log('✅ Generated icon-512.png');

    console.log('\n🎉 All PWA icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating PWA icons:', error);
    process.exit(1);
  }
}

generatePWAIcons();
