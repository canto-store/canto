import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the script is run from the project root
const projectRoot = path.resolve(__dirname, "..");
const publicDir = path.join(projectRoot, "public");

// Check if Sharp is installed
let sharp;
try {
  sharp = await import("sharp");
  sharp = sharp.default;
} catch (e) {
  console.log("Sharp is not installed. Installing...", e);
  execSync("pnpm add -D sharp");
  const sharpModule = await import("sharp");
  sharp = sharpModule.default;
}

// Source image (use your existing PWA icon)
const sourceImage = path.join(publicDir, "web-app-manifest-512x512.png");

// iOS splash screen sizes
const splashScreens = [
  // iPad Pro
  { width: 2048, height: 2732, name: "apple-splash-2048-2732.png" }, // iPad Pro 12.9"
  { width: 1668, height: 2388, name: "apple-splash-1668-2388.png" }, // iPad Pro 11"
  { width: 1536, height: 2048, name: "apple-splash-1536-2048.png" }, // iPad Air
  
  // iPhone 16 Series
  { width: 1320, height: 2868, name: "apple-splash-1320-2868.png" }, // iPhone 16 Pro Max
  { width: 1206, height: 2622, name: "apple-splash-1206-2622.png" }, // iPhone 16 Pro
  { width: 1179, height: 2556, name: "apple-splash-1179-2556.png" }, // iPhone 16
  
  // iPhone 15 Series
  { width: 1290, height: 2796, name: "apple-splash-1290-2796.png" }, // iPhone 15 Pro Max
  { width: 1179, height: 2556, name: "apple-splash-1179-2556.png" }, // iPhone 15 Pro/15
  
  // iPhone 14 Series
  { width: 1284, height: 2778, name: "apple-splash-1284-2778.png" }, // iPhone 14 Plus/Pro Max
  { width: 1170, height: 2532, name: "apple-splash-1170-2532.png" }, // iPhone 14/Pro
  
  // iPhone X through 13 Series
  { width: 1125, height: 2436, name: "apple-splash-1125-2436.png" }, // iPhone X/XS/11 Pro/12 mini/13 mini
  { width: 1242, height: 2688, name: "apple-splash-1242-2688.png" }, // iPhone XS Max/11 Pro Max
  { width: 828, height: 1792, name: "apple-splash-828-1792.png" }, // iPhone XR/11
  
  // Older iPhones
  { width: 750, height: 1334, name: "apple-splash-750-1334.png" }, // iPhone 8/7/6s/6
  { width: 1242, height: 2208, name: "apple-splash-1242-2208.png" }, // iPhone 8/7/6s/6 Plus
];

// Apple touch icon sizes
const touchIcons = [
  { size: 180, name: "apple-touch-icon.png" },
  { size: 152, name: "apple-touch-icon-152x152.png" },
  { size: 167, name: "apple-touch-icon-167x167.png" },
  { size: 120, name: "apple-touch-icon-120x120.png" },
];

async function generateSplashScreens() {
  console.log("Generating iOS splash screens...");

  // Read the source image
  const sourceBuffer = fs.readFileSync(sourceImage);

  // Create a white background image
  const whiteBackground = Buffer.from(
    '<svg><rect width="100%" height="100%" fill="white"/></svg>',
  );

  // Process each splash screen size
  for (const screen of splashScreens) {
    try {
      // Create a white background of the target size
      const background = await sharp(whiteBackground)
        .resize(screen.width, screen.height)
        .toBuffer();

      // Resize the app icon to 25% of the smallest dimension
      const iconSize = Math.min(screen.width, screen.height) * 0.25;
      const icon = await sharp(sourceBuffer)
        .resize(Math.round(iconSize), Math.round(iconSize))
        .toBuffer();

      // Composite the icon onto the center of the white background
      await sharp(background)
        .composite([
          {
            input: icon,
            gravity: "center",
          },
        ])
        .toFile(path.join(publicDir, screen.name));

      console.log(`Created ${screen.name}`);
    } catch (error) {
      console.error(`Error creating ${screen.name}:`, error);
    }
  }
}

async function generateTouchIcons() {
  console.log("Generating Apple touch icons...");

  for (const icon of touchIcons) {
    try {
      await sharp(sourceImage)
        .resize(icon.size, icon.size)
        .toFile(path.join(publicDir, icon.name));

      console.log(`Created ${icon.name}`);
    } catch (error) {
      console.error(`Error creating ${icon.name}:`, error);
    }
  }
}

async function main() {
  try {
    await generateSplashScreens();
    await generateTouchIcons();
    console.log("All PWA assets generated successfully!");
  } catch (error) {
    console.error("Error generating PWA assets:", error);
    process.exit(1);
  }
}

main();
