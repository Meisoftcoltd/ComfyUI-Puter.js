import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 1. Parche para CustomEvent en Node 18
if (typeof global.CustomEvent === 'undefined') {
    global.CustomEvent = class CustomEvent extends Event {
        constructor(event, params = {}) {
            super(event, params);
            this.detail = params.detail;
        }
    };
}

const { puter } = await import('@heyputer/puter.js');

// 2. Configurar rutas para encontrar el token
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const tokenPath = path.join(__dirname, 'puter_token.txt');

// 3. Capturar argumentos enviados desde Python
const prompt = process.argv[2];
const model = process.argv[3];
const quality = process.argv[4];
const outputPath = process.argv[5];
const inputImagePath = process.argv[6];

async function generateImage() {
    try {
        // Autenticación silenciosa
        if (fs.existsSync(tokenPath)) {
            const token = fs.readFileSync(tokenPath, 'utf8').trim();
            if (token) puter.setAuthToken(token);
        } else {
            throw new Error("No se encontró el archivo puter_token.txt.");
        }

        const options = {};
        if (model && model !== "default") options.model = model;

        // Evitar error con Gemini (no soporta parámetros de calidad)
        if (quality && quality !== "default") {
            if (!model.includes("gemini")) {
                options.quality = quality;
            }
        }

        // Soporte para imagen de referencia (img2img)
        if (inputImagePath && inputImagePath !== "none" && fs.existsSync(inputImagePath)) {
            const imageBuffer = fs.readFileSync(inputImagePath);
            options.input_image = imageBuffer.toString('base64');
            options.input_image_mime_type = "image/png";
        }

        // Llamada a la API de Puter
        const result = await puter.ai.txt2img(prompt, options);

        // Procesamiento robusto de todos los formatos posibles
        let imageBuffer;
        if (result instanceof Buffer) {
            imageBuffer = result;
        } else if (result.raw) {
            imageBuffer = Buffer.from(result.raw);
        } else if (typeof result === 'string' && result.startsWith('data:image')) {
            imageBuffer = Buffer.from(result.split(',')[1], 'base64');
        } else if (result.src && typeof result.src === 'string' && result.src.startsWith('data:image')) {
            // NUEVO: Atrapa el formato { src: "data:image/jpeg;base64,..." } de Gemini
            imageBuffer = Buffer.from(result.src.split(',')[1], 'base64');
        } else if (typeof Blob !== 'undefined' && result instanceof Blob) {
            const arrayBuffer = await result.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
        } else if (result.url) {
            const response = await fetch(result.url);
            const arrayBuffer = await response.arrayBuffer();
            imageBuffer = Buffer.from(arrayBuffer);
        } else if (result.b64_json) {
            imageBuffer = Buffer.from(result.b64_json, 'base64');
        } else {
            const errorData = typeof result === 'object' ? JSON.stringify(result) : String(result);
            throw new Error(`Formato desconocido devuelto por Puter: ${errorData.substring(0, 200)}`);
        }

        fs.writeFileSync(outputPath, imageBuffer);
        process.exit(0);
    } catch (error) {
        console.error("Error en Puter.js:", error.message);
        process.exit(1);
    }
}

generateImage();
