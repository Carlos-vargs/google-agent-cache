import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

/**
 * Script para listar cachés de contexto existentes en Google Generative AI.
 *
 * Uso:
 *
 *   npm run list-caches
 *
 * Asegúrate de tener configurada la variable de entorno GEMINI_API_KEY en un archivo .env
 * en la raíz del proyecto antes de ejecutar el script.
 *
 * Ejemplo:
 *   npm run list-caches
 */
async function main() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY no configurado en .env");
    process.exit(1);
  }

  console.log("Modelos disponibles (API v1beta):");
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    const models = data.models || [];
    for (const m of models) {
      const name = m.name || m.id || "(sin nombre)";
      const caps = m.supportedGenerationMethods || m.supportedMethods || [];
      console.log(`- ${name}${caps.length ? ` [${caps.join(", ")}]` : ""}`);
    }
  } catch (e) {
    console.warn("No se pudo listar modelos:", e?.message || e);
    process.exit(1);
  }
}

main();
