import dotenv from "dotenv";

dotenv.config();

/**
 * Script para eliminar un caché de contexto existente en Google Generative AI.
 *
 * Uso:
 *
 *   npm run delete-cache -- <cache_name>
 *
 * - cache_name: Nombre del caché a eliminar (obtenido al crear el caché o listando cachés)
 *
 * Asegúrate de tener configurada la variable de entorno GEMINI_API_KEY en un archivo .env
 * en la raíz del proyecto antes de ejecutar el script.
 *
 * Ejemplo:
 *   npm run delete-cache -- cachedContents/abc123
 */
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY no configurado en .env");
    process.exit(1);
  }

  const cacheName = process.argv[2];
  if (!cacheName) {
    console.error(
      "Uso: npm run delete-cache -- <cache_name>\nTip: obtén nombres con 'npm run list-caches'"
    );
    process.exit(1);
  }

  // El nombre debe ser el 'name' completo devuelto al crear, p.ej.
  // cachedContents/abc123 o projects/*/locations/*/cachedContents/* (si aplica)
  // Importante: el recurso debe incluir la barra (p.ej. cachedContents/ID) sin codificarla
  // Usar el nombre tal cual fue devuelto por la API al crear el caché
  let resourceName = cacheName;
  if (!resourceName.startsWith("cachedContents/")) {
    resourceName = `cachedContents/${resourceName}`;
  }
  const url = `https://generativelanguage.googleapis.com/v1beta/${resourceName}?key=${apiKey}`;

  try {
    const resp = await fetch(url, { method: "DELETE" });
    if (resp.status === 204 || resp.status === 200) {
      console.log(`Eliminado: ${cacheName}`);
      return;
    }
    if (!resp.ok) {
      const text = await resp.text();
      throw new Error(`HTTP ${resp.status} ${resp.statusText} - ${text}`);
    }
    console.log(`Respuesta: ${await resp.text()}`);
  } catch (e) {
    console.error("No se pudo eliminar el caché:", e?.message || e);
    process.exit(1);
  }
}

main();
