const https = require('https');
const fs = require('fs');
const path = require('path');

const images = [
    {
        url: 'https://raw.githubusercontent.com/Leaflet/Leaflet/main/dist/images/marker-icon.png',
        filename: 'marker-icon.png'
    },
    {
        url: 'https://raw.githubusercontent.com/Leaflet/Leaflet/main/dist/images/marker-icon-2x.png',
        filename: 'marker-icon-2x.png'
    },
    {
        url: 'https://raw.githubusercontent.com/Leaflet/Leaflet/main/dist/images/marker-shadow.png',
        filename: 'marker-shadow.png'
    }
];

const publicImagesDir = path.join(__dirname, '../public/images');

// Create the images directory if it doesn't exist
if (!fs.existsSync(publicImagesDir)) {
    fs.mkdirSync(publicImagesDir, { recursive: true });
}

// Download each image
images.forEach(image => {
    const file = fs.createWriteStream(path.join(publicImagesDir, image.filename));
    https.get(image.url, response => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${image.filename}`);
        });
    }).on('error', err => {
        fs.unlink(path.join(publicImagesDir, image.filename));
        console.error(`Error downloading ${image.filename}:`, err.message);
    });
}); 