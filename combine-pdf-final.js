const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const INPUT_DIR = path.join(__dirname, 'SLIDES FINALES');
const OUTPUT_FILE = path.join(INPUT_DIR, 'Sage-Xperience-Keynote-BPAC-2026.pdf');
const TOTAL_SLIDES = 27;

async function combineToPDF() {
    console.log('Creating PDF...');

    const doc = new PDFDocument({
        size: [1920, 1080],
        margin: 0,
        autoFirstPage: false
    });

    const writeStream = fs.createWriteStream(OUTPUT_FILE);
    doc.pipe(writeStream);

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
        const filename = `slide-${String(i).padStart(2, '0')}.png`;
        const filepath = path.join(INPUT_DIR, filename);

        if (fs.existsSync(filepath)) {
            doc.addPage({ size: [1920, 1080], margin: 0 });
            doc.image(filepath, 0, 0, { width: 1920, height: 1080 });
            console.log(`Added: ${filename}`);
        } else {
            console.log(`Missing: ${filename}`);
        }
    }

    doc.end();

    await new Promise((resolve, reject) => {
        writeStream.on('finish', resolve);
        writeStream.on('error', reject);
    });

    console.log(`\nPDF created: ${OUTPUT_FILE}`);
}

combineToPDF().catch(console.error);
