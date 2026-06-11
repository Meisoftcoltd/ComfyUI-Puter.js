import os
import subprocess
import sys

def install_npm_dependencies():
    # Obtiene la ruta absoluta de la carpeta del nodo
    node_dir = os.path.dirname(os.path.realpath(__file__))

    print(f"--- Instalando dependencias de Node.js para ComfyUI-Puter.js en {node_dir} ---")

    try:
        # Ejecuta 'npm install' dentro de la carpeta del nodo
        # shell=True es útil en Windows para que reconozca el comando npm correctamente
        is_windows = sys.platform.startswith('win')
        subprocess.check_call(["npm", "install"], cwd=node_dir, shell=is_windows)
        print("--- Dependencias de Node.js instaladas correctamente ---")
    except subprocess.CalledProcessError as e:
        print(f"--- Error al ejecutar npm install: {e} ---", file=sys.stderr)
    except FileNotFoundError:
        print("--- ERROR: No se encontró el comando 'npm'. Asegúrate de tener Node.js instalado en tu sistema. ---", file=sys.stderr)

if __name__ == "__main__":
    install_npm_dependencies()
