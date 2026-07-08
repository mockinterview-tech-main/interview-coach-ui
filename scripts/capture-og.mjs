// Regenerate the Open Graph share image from the hidden /og route.
// Captures at 2x device density → crisp 2400x1260 PNG saved to static/og-image.png.
//
// Usage: npm run dev (in another terminal), then: node scripts/capture-og.mjs
import puppeteer from 'puppeteer-core';

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const URL = process.env.OG_URL || 'http://localhost:5173/og';
const OUT = 'static/og-image.png';

const browser = await puppeteer.launch({
	executablePath: CHROME,
	headless: 'new',
	args: ['--no-sandbox', '--force-color-profile=srgb']
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 630, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: 'networkidle0' });
// Give web fonts + the profile image a beat to settle
await new Promise((r) => setTimeout(r, 800));
await page.screenshot({ path: OUT, clip: { x: 0, y: 0, width: 1200, height: 630 } });
await browser.close();
console.log(`Wrote ${OUT} at 2400x1260 (2x of 1200x630)`);
