# ComfyUI-Puter.js

A custom node for ComfyUI that integrates [Puter.js](https://puter.js.org/) AI image generation directly into your workflows.

## Features
- **Text-to-Image**: Generate images from text prompts using various Puter.js models.
- **Image-to-Image**: Use an existing image as an input reference.
- **Auto-Installation**: Fully compatible with ComfyUI Manager for a plug-and-play setup.

## Prerequisites

**⚠️ IMPORTANT: Node.js is required ⚠️**

Because Puter.js is a JavaScript library, this node relies on Node.js to function.
You **must** have Node.js (version 18 or higher) installed on your system before using this node.

You can verify your installation by opening a terminal and running:
```bash
node -v
```
If you don't have it, download it from [nodejs.org](https://nodejs.org/).

## Installation

### Method 1: Using ComfyUI Manager (Recommended)
1. Install [ComfyUI Manager](https://github.com/ltdrdata/ComfyUI-Manager).
2. Look for `ComfyUI-Puter-Bridge` or add this repository URL directly.
3. The Manager will automatically download the node and install the required `@heyputer/puter.js` dependency using `install.py`.

### Method 2: Manual Installation
1. Navigate to your ComfyUI `custom_nodes` directory:
   ```bash
   cd ComfyUI/custom_nodes/
   ```
2. Clone this repository:
   ```bash
   git clone https://github.com/your-username/ComfyUI-Puter.js.git
   ```
3. Enter the newly created folder and install the dependencies:
   ```bash
   cd ComfyUI-Puter.js
   npm install
   ```
4. Restart ComfyUI.

## Usage
Once installed, you will find the `Puter.js Image Generator` node under the **PuterAI** category in ComfyUI. Connect its `IMAGE` output to a `Save Image` or `Preview Image` node.
