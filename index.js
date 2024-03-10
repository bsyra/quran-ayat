const fs = require('fs');
const { Canvas, loadImage, GlobalFonts } = require('@napi-rs/canvas');
const { join } = require('path');
const surahData = require('./mushaf.json');

const outputFolder = './ayat/';

GlobalFonts.registerFromPath(join(__dirname, 'fonts', 'uthmanic.otf'), 'Uthmanic')
GlobalFonts.registerFromPath(join(__dirname, 'fonts', 'noto.ttf'), 'Noto')

if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
}

function padNumber(num) {
    return String(num).padStart(3, '0');
}

async function drawVerseImage(verse, surahNumber, verseNumber, surahName) {
    const canvas = new Canvas(800, 400);
    const { width, height } = canvas
    const ctx = canvas.getContext('2d');

    // Drawing background
    ctx.fillStyle = '#f9f2e2';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const image = await loadImage('assets/header.png');
    ctx.drawImage(image, width / 6, 30, 527, 77);

    const basmmalaImage = await loadImage('assets/besm-allah.png');
    const basmallaScale = 1.4;
    ctx.drawImage(basmmalaImage, width / 3, 100, 406 / basmallaScale, 75 / basmallaScale);

    // Soura Name
    ctx.font = 'bold 24px "Noto", serif'
    ctx.fillStyle = '#000000ce'
    ctx.textAlign = 'center';
    ctx.fillText(surahName, width / 2, 75)

    // Drawing text
    ctx.font = 'bold 24px "Uthmanic", serif';
    const lines = verse.ar.split('\n');
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], canvas.width / 2, 200);
    }

    // Save to file
    const filename = `${padNumber(surahNumber)}${padNumber(verseNumber)}.png`;
    const outputFilePath = outputFolder + filename;

    const pngData = await canvas.encode('png')
    await fs.promises.writeFile(join(__dirname, outputFilePath), pngData)
    console.log(`Verse ${filename} saved successfully.`);
}

async function generateImages() {
    for (const surah of surahData) {
        for (const verse of surah.array) {
            await drawVerseImage(verse, surah.id, verse.id, surah.name);
            // break;
        }
        // break
    }
}

generateImages().catch(console.error);