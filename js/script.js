function validateBadge(input) {
    const file = input.files[0];
    if (file) {
        if (file.type === 'image/png') {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = function () {
                if (img.width === 512 && img.height === 512) {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, img.width, img.height);
                    const imageData = ctx.getImageData(0, 0, img.width, img.height);
                    const pixels = imageData.data;
                    let transparentPixels = 0;
                    let nonTransparentPixels = 0;
                    for (let i = 0; i < pixels.length; i += 4) {
                        if (pixels[i + 3] === 0) {
                            transparentPixels++;
                        } else {
                            nonTransparentPixels++;
                        }
                    }
                    const ratio = nonTransparentPixels / (nonTransparentPixels + transparentPixels);
                    if (ratio === 1) {
                        document.getElementById('validationResult').textContent = 'Valid badge!';
                        const preview = document.createElement('img');
                        preview.src = canvas.toDataURL();
                        preview.alt = 'Preview';
                        document.getElementById('previewContainer').appendChild(preview);
                        document.getElementById('previewContainer').style.display = 'block';
                    } else {
                        document.getElementById('validationResult').textContent = 'The only non-transparent pixels must be within a circle.';
                    }
                } else {
                    document.getElementById('validationResult').textContent = 'Size must be 512x512 pixels.';
                }
            };
        } else {
            document.getElementById('validationResult').textContent = 'Please select a PNG file.';
        }
    } else {
        document.getElementById('validationResult').textContent = 'No file selected.';
    }
}
