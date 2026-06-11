// El mismo polyfill necesario
if (typeof global.CustomEvent === 'undefined') {
    global.CustomEvent = class CustomEvent extends Event {
        constructor(event, params = {}) {
            super(event, params);
            this.detail = params.detail;
        }
    };
}

const { puter } = await import('@heyputer/puter.js');

console.log("--- Inspeccionando el objeto 'puter' ---");
console.log("Propiedades principales:", Object.keys(puter));

if (puter.auth) {
    console.log("--- Inspeccionando 'puter.auth' ---");
    console.log("Propiedades de auth:", Object.keys(puter.auth));
}

process.exit(0);