import { stitch } from '@google/stitch-sdk';
console.log('Stitch SDK loaded');

process.env.STITCH_API_KEY = process.env.STITCH_API_KEY; // Use environment variable

async function main() {
  try {
    const proj = await stitch.createProject('Test WUUS AI ' + Date.now());
    const screen = await proj.generate('Modern SaaS Dashboard');
    
    console.log('--- Screen Keys ---');
    console.log(Object.keys(screen));
    console.log('--- Prototype Methods ---');
    console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(screen)));
    
    const html = await screen.getHtml();
    console.log('HTML retrieved:', html ? 'Yes' : 'No');
    
    // Check for guide methods
    if (screen.getGuide) {
      const guide = await screen.getGuide();
      console.log('Guide (getGuide) retrieved:', guide ? 'Yes' : 'No');
    }
    
    if (screen.getMarkdown) {
      const md = await screen.getMarkdown();
      console.log('Markdown (getMarkdown) retrieved:', md ? 'Yes' : 'No');
    }

    if (screen.getBundle) {
        const bundle = await screen.getBundle();
        console.log('Bundle keys:', Object.keys(bundle));
    }
    
  } catch (error) {
    console.error(error);
  }
}
