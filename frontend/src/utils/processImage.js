/**
 * Process a File image to create a square image, convert it to WebP format,
 * and return the processed image as a File.
 *
 * @param {File} imageFile The image File to process.
 * @param {string} imageName The new name of the image File.
 * @param {number} size The desired resolution of the image (default: 256).
 * @return {Promise<File>} A promise that resolves with the processed image as a File.
 */
export const processImageFile = (imageFile, imageName, size = 256) => {
  // Checks if the imageFile is not empty
  if (!imageFile || !imageFile.name) return {};

  return new Promise((resolve, reject) => {
    const newImageName = imageName
      ? imageName + '.webp'
      : imageFile.name + '.webp';
    const img = new Image();
    const objectURL = URL.createObjectURL(imageFile);

    img.onload = () => {
      // Revoke the object URL after loading to release memory
      URL.revokeObjectURL(objectURL);

      // Create a canvas to draw the image
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      // Calculate the square crop dimensions
      const side = Math.min(img.width, img.height);
      ctx.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        size,
        size,
      );

      // Convert the canvas to a WebP Blob and then to a File
      canvas.toBlob(
        (blob) => {
          const processedFile = new File([blob], newImageName, {
            type: 'image/webp',
            lastModified: Date.now(),
          });
          resolve(processedFile);
        },
        'image/webp',
        0.8, // Quality setting for WebP
      );
    };

    img.onerror = (error) => {
      // Revoke the object URL in case of error as well
      URL.revokeObjectURL(objectURL);
      reject(error);
    };

    img.src = objectURL;
  });
};
