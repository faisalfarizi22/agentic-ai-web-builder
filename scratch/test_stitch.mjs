import { stitch } from '@google/stitch-sdk';

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY; // Use environment variable instead of hardcoded key

async function main() {
  try {
    const proj = await stitch.createProject('Test WUUS AI');
    console.log('Project ID:', proj.id);
    
    // I don't know the exact method to generate a screen.
    console.log('Project Prototype:', Object.getOwnPropertyNames(Object.getPrototypeOf(proj)));
    
    // Attempt generation
    const screen = await proj.generate('A minimal login screen with email and password', { width: 1440, height: 900 });
    console.log('Screen ID:', screen.id);
    
    const html = await screen.getHtml();
    console.log('HTML retrieved:', html ? html.substring(0, 100) : null);
    
    const variants = await screen.variants();
    console.log('Variants count:', variants.length);
  } catch (error) {
    console.error(error);
  }
}

main();
