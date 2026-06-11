import os
import subprocess
import tempfile
import torch
import numpy as np
from PIL import Image

class PuterImageGenerator:
    @classmethod
    def INPUT_TYPES(s):
        return {
            "required": {
                "prompt": ("STRING", {"multiline": True, "default": "A peaceful mountain landscape at sunset"}),
                "model": ([
                    "default",
                    "gemini-3.1-flash-image-preview",
                    "gemini-3-pro-image-preview",
                    "gemini-2.5-flash-image-preview",
                    "gpt-image-2",
                    "dall-e-3",
                    "black-forest-labs/flux-schnell",
                    "black-forest-labs/flux-1.1-pro",
                    "google/imagen-4.0-ultra",
                    "stabilityai/stable-diffusion-xl-base-1.0"
                ], {"default": "default"}),
                "quality": (["default", "low", "medium", "high", "standard", "hd"], {"default": "default"}),
            },
            "optional": {
                "image": ("IMAGE", ), # Entrada opcional para img2img
            }
        }

    RETURN_TYPES = ("IMAGE",)
    FUNCTION = "generate_image"
    CATEGORY = "PuterAI"

    def generate_image(self, prompt, model, quality, image=None):
        current_dir = os.path.dirname(os.path.abspath(__file__))
        bridge_script = os.path.join(current_dir, "puter_bridge.js")

        # Archivo temporal para la imagen que generará Puter
        with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_out:
            output_path = temp_out.name

        # Preparar la imagen de entrada si el usuario conectó una
        input_path = "none"
        if image is not None:
            with tempfile.NamedTemporaryFile(suffix=".png", delete=False) as temp_in:
                input_path = temp_in.name

            img_tensor = image[0]
            img_np = (img_tensor.cpu().numpy() * 255.0).clip(0, 255).astype(np.uint8)
            pil_img = Image.fromarray(img_np)
            pil_img.save(input_path)

        try:
            # Llamada al script puente de Node.js
            cmd = ["node", bridge_script, prompt, model, quality, output_path, input_path]
            result = subprocess.run(cmd, capture_output=True, text=True, check=True)

            # Cargar la imagen generada en ComfyUI
            if os.path.exists(output_path) and os.path.getsize(output_path) > 0:
                img = Image.open(output_path).convert("RGB")
                image_np = np.array(img).astype(np.float32) / 255.0
                image_tensor = torch.from_numpy(image_np)[None, ...]
                return (image_tensor,)
            else:
                raise RuntimeError(f"El puente de Node.js falló. Error: {result.stderr}")

        except subprocess.CalledProcessError as e:
            raise RuntimeError(f"Error al ejecutar Puter.js: {e.stderr}")
        finally:
            # Limpiar todos los archivos temporales
            if os.path.exists(output_path):
                os.remove(output_path)
            if input_path != "none" and os.path.exists(input_path):
                os.remove(input_path)

NODE_CLASS_MAPPINGS = {
    "PuterImageGenerator": PuterImageGenerator
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "PuterImageGenerator": "Puter.js Image Generator"
}
