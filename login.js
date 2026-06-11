// Aplicamos el parche de compatibilidad para Node 18
if (typeof global.CustomEvent === 'undefined') {
    global.CustomEvent = class CustomEvent extends Event {
        constructor(event, params = {}) {
            super(event, params);
            this.detail = params.detail;
        }
    };
}

const { puter } = await import('@heyputer/puter.js');

async function authorize() {
    console.log("⏳ Iniciando proceso de autorización con Puter...");
    try {
        // Llamamos a la función correcta de autenticación
        await puter.auth.signIn();
        
        console.log("✅ ¡Cuenta vinculada correctamente!");
        console.log("El token de acceso se ha guardado localmente. Ya puedes usar el nodo en ComfyUI.");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error durante la autorización:", error);
        process.exit(1);
    }
}

authorize();