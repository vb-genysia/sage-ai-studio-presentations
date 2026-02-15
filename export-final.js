const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const TOTAL_SLIDES = 27; // Ignore slide 28
const OUTPUT_DIR = path.join(__dirname, 'SLIDES FINALES');
const URL = 'https://sage-ai-studio-presentations.vercel.app/sage-experience-keynote';

async function exportSlides() {
    if (!fs.existsSync(OUTPUT_DIR)) {
        fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }

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
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Hide navigation and disable animations
    await page.evaluate(() => {
        const nav = document.querySelector('.nav-controls');
        const progress = document.querySelector('.progress-bar');
        const counter = document.querySelector('.slide-counter');
        if (nav) nav.style.display = 'none';
        if (progress) progress.style.display = 'none';
        if (counter) counter.style.display = 'none';

        const style = document.createElement('style');
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0s !important;
                animation-delay: 0s !important;
                transition-duration: 0s !important;
                transition-delay: 0s !important;
            }
            .animate-in, .animate-in-delay-1, .animate-in-delay-2, .animate-in-delay-3,
            [class*="animate-"] {
                opacity: 1 !important;
                transform: none !important;
                animation: none !important;
            }
        `;
        document.head.appendChild(style);
    });

    console.log(`Exporting ${TOTAL_SLIDES} slides...`);

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
        await page.evaluate((slideIndex) => {
            const slides = document.querySelectorAll('.slide');
            slides.forEach((slide, idx) => {
                if (idx === slideIndex - 1) {
                    slide.classList.add('active');
                    slide.querySelectorAll('[class*="animate"]').forEach(el => {
                        el.style.opacity = '1';
                        el.style.transform = 'none';
                    });
                }
            });
        }, i);

        await new Promise(resolve => setTimeout(resolve, 100));

        const filename = `slide-${String(i).padStart(2, '0')}.png`;
        const filepath = path.join(OUTPUT_DIR, filename);

        await page.screenshot({
            path: filepath,
            type: 'png',
            fullPage: false
        });

        console.log(`Exported: ${filename}`);

        if (i < TOTAL_SLIDES) {
            await page.keyboard.press('ArrowRight');
            await new Promise(resolve => setTimeout(resolve, 800));
        }
    }

    await browser.close();
    console.log(`\nDone! ${TOTAL_SLIDES} slides exported to: ${OUTPUT_DIR}`);
}

exportSlides().catch(console.error);
