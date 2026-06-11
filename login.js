// Aplicamos el mismo parche de compatibilidad para Node 18
if (typeof global.CustomEvent === 'undefined') {
    global.CustomEvent = class CustomEvent extends Event {
        constructor(event, params = {}) {
            super(event, params);
            this.detail = params.detail;
        }
    };
}

// Importamos la librería de forma dinámica
const { puter } = await import('@heyputer/puter.js');

async function authorize() {
    console.log("⏳ Iniciando proceso de autorización con Puter...");
    try {
        // puter.login() fuerza el flujo de autenticación y abre el navegador
        await puter.login();
        console.log("✅ ¡Cuenta vinculada correctamente!");
        console.log("El token de acceso se ha guardado localmente. Ya puedes usar el nodo en ComfyUI.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error durante la autorización:", error);
        process.exit(1);
    }
}

authorize();