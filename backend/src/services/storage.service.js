require('dotenv').config();
const ImageKit = require('imagekit');

const imageKit = new ImageKit({
    publicKey: process.env.IMAGE_KIT_PUBLIC_KEY,
    privateKey: process.env.IMAGE_KIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT
});

async function uploadFile (file, fileName) {
    const result = await imageKit.upload({
        file: file,
        fileName: fileName,
    });
    return result;
}

module.exports = {
    uploadFile
}