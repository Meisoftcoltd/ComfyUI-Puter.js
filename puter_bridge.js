import { puter } from '@heyputer/puter.js';
import fs from 'fs';

// Capturar argumentos enviados desde Python
const prompt = process.argv[2];
const model = process.argv[3];
const quality = process.argv[4];
const outputPath = process.argv[5];
const inputImagePath = process.argv[6];

async function generateImage() {
    try {
        const options = {};
        if (model && model !== "default") options.model = model;
        if (quality && quality !== "default") options.quality = quality;

        // Si se envió una imagen de referencia, la cargamos en Base64 para img2img
        if (inputImagePath && inputImagePath !== "none" && fs.existsSync(inputImagePath)) {
            const imageBuffer = fs.readFileSync(inputImagePath);
            options.input_image = imageBuffer.toString('base64');
            options.input_image_mime_type = "image/png";
        }

        // Llamada a la API de Puter
        const result = await puter.ai.txt2img(prompt, options);

        // Procesar la respuesta para extraer el buffer de la imagen
        let imageBuffer;
        if (result instanceof Buffer) {
            imageBuffer = result;
        } else if (result.raw) {
            imageBuffer = Buffer.from(result.raw);
        } else if (typeof result === 'string' && result.startsWith('data:image')) {
            imageBuffer = Buffer.from(result.split(',')[1], 'base64');
        } else {
            throw new Error("Formato de imagen no reconocido devuelto por Puter.js");
        }

        // Guardar la imagen generada en el archivo temporal de salida
        fs.writeFileSync(outputPath, imageBuffer);
        process.exit(0);
    } catch (error) {
        console.error("Error en Puter.js:", error.message);
        process.exit(1);
    }
}

generateImage();
