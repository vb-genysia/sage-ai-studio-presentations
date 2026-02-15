const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const SLIDES_DIR = path.join(__dirname, 'SLIDES PPT');
const OUTPUT_PDF = path.join(SLIDES_DIR, 'Sage-Xperience-BPAC-2026.pdf');
const TOTAL_SLIDES = 28;

// 16:9 aspect ratio in points (1 point = 1/72 inch)
// Using 1920x1080 proportions scaled to fit standard PDF
const PAGE_WIDTH = 1920 * 0.5;  // 960 points
const PAGE_HEIGHT = 1080 * 0.5; // 540 points

async function createPDF() {
    console.log('Creating PDF...');

    const doc = new PDFDocument({
        size: [PAGE_WIDTH, PAGE_HEIGHT],
        margin: 0,
        autoFirstPage: false
    });

    const writeStream = fs.createWriteStream(OUTPUT_PDF);
    doc.pipe(writeStream);

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
        const filename = `slide-${String(i).padStart(2, '0')}.png`;
        const filepath = path.join(SLIDES_DIR, filename);

        if (fs.existsSync(filepath)) {
            doc.addPage();
            doc.image(filepath, 0, 0, {
                width: PAGE_WIDTH,
                height: PAGE_HEIGHT
            });
            console.log(`Added: ${filename}`);
        } else {
            console.log(`Missing: ${filename}`);
        }
    }

    doc.end();

    return new Promise((resolve, reject) => {
        writeStream.on('finish', () => {
            console.log(`\nPDF created: ${OUTPUT_PDF}`);
            resolve();
        });
        writeStream.on('error', reject);
    });
}

createPDF().catch(console.error);
