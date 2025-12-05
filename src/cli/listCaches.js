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

  console.log("Cachés creados (API v1beta):");
  try {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/cachedContents?key=${apiKey}`
    );
    if (!resp.ok) {
      throw new Error(`HTTP ${resp.status} ${resp.statusText}`);
    }
    const data = await resp.json();
    const cachedContents = data.cachedContents || data.contents || [];
    if (!cachedContents.length) {
      console.log("(sin resultados)");
      return;
    }
    for (const c of cachedContents) {
      const name = c.name || "(sin nombre)";
      const displayName = c.displayName || "(sin displayName)";
      const model = c.model || "(sin modelo)";
      const createTime = c.createTime || c.createdAt || "(sin createTime)";
      const expireTime = c.expireTime || c.ttl || "(sin expireTime)";
      console.log(`- ${name}`);
      console.log(`  displayName: ${displayName}`);
      console.log(`  model: ${model}`);
      console.log(`  createTime: ${createTime}`);
      console.log(`  expireTime: ${expireTime}`);
    }
  } catch (e) {
    console.warn("No se pudo listar cachés:", e?.message || e);
    process.exit(1);
  }
}

main();
