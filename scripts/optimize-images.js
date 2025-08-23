import sharp from 'sharp';
import fs from 'fs';

async function optimizeImage(inputPath, outputPath) {
  try {
    const stats = fs.statSync(inputPath);
    console.log(`Original size: ${Math.round(stats.size / 1024)}KB`);

    // Convert to WebP with optimization
    await sharp(inputPath)
      .webp({ 
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);

    const newStats = fs.statSync(outputPath);
    console.log(`Optimized size: ${Math.round(newStats.size / 1024)}KB`);
    console.log(`Saved: ${Math.round((stats.size - newStats.size) / 1024)}KB`);
  } catch (error) {
    console.error('Error optimizing image:', error);
  }
}

// Optimize pirologo.png
const inputPath = 'src/assets/pirologo.png';
const outputPath = 'src/assets/pirologo.webp';

console.log('Optimizing pirologo.png...');
await optimizeImage(inputPath, outputPath);