const puppeteer = require('puppeteer');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'SLIDES PPT');
const URL = 'https://vercel-deploy-nine-woad.vercel.app/sage-experience-keynote';

async function exportSlide28() {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    await page.setViewport({
        width: 1920,
        height: 1080,
        deviceScaleFactor: 1
    });

    console.log(`Navigating to ${URL}...`);
    await page.goto(URL, { waitUntil: 'networkidle0' });
    await page.waitForSelector('.slide', { timeout: 10000 });

    // Navigate directly to slide 28 and force all content visible
    await page.evaluate(() => {
        // Hide navigation
        document.querySelector('.nav-controls').style.display = 'none';
        document.querySelector('.progress-bar').style.display = 'none';
        document.querySelector('.slide-counter').style.display = 'none';

        // Hide all slides except slide 28
        const slides = document.querySelectorAll('.slide');
        slides.forEach((slide, idx) => {
            if (idx === 27) { // Slide 28 (0-indexed)
                slide.style.display = 'flex';
                slide.style.opacity = '1';
                slide.style.transform = 'none';
                slide.style.position = 'relative';
                slide.classList.add('active');

                // Force ALL children to be visible
                const allElements = slide.querySelectorAll('*');
                allElements.forEach(el => {
                    el.style.opacity = '1';
                    el.style.transform = 'none';
                    el.style.animation = 'none';
                    el.style.visibility = 'visible';
                });
            } else {
                slide.style.display = 'none';
            }
        });
    });

    // Wait for changes to apply
    await new Promise(resolve => setTimeout(resolve, 500));

    // Take screenshot
    const filepath = path.join(OUTPUT_DIR, 'slide-28.png');
    await page.screenshot({
        path: filepath,
        type: 'png',
        fullPage: false
    });

    console.log('Exported: slide-28.png');
    await browser.close();
}

exportSlide28().catch(console.error);
