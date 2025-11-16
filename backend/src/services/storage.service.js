// ImageKit storage service (not yet implemented)
// To implement: install imagekit, add env vars (IMAGE_KIT_PUBLIC_KEY, IMAGE_KIT_PRIVATE_KEY, IMAGE_KIT_URL_ENDPOINT)

async function uploadFile (file, fileName) {
    // TODO: Implement ImageKit upload
    throw new Error('Image upload service not yet configured. Set up ImageKit credentials in .env to enable.');
}

module.exports = {
    uploadFile
}