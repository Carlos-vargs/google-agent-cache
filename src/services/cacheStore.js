import { promises as fs } from "fs";
import path from "path";

const storePath = path.resolve(process.cwd(), "cache.json");

/**
 * Guarda la información del caché localmente.
 * @param {Object} info Información del caché a guardar.
 * @returns {Promise<Object>} La información guardada.
 */
export async function saveCacheInfo(info) {
  await fs.writeFile(storePath, JSON.stringify(info, null, 2), "utf-8");
  return info;
}

/**
 * Carga la información del caché almacenada localmente.
 * @returns {Promise<Object|null>} Información del caché o null si no existe.
 */
export async function loadCacheInfo() {
  try {
    const txt = await fs.readFile(storePath, "utf-8");
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

/**
 * Elimina la información del caché almacenada localmente.
 */
export async function clearCacheInfo() {
  try {
    await fs.unlink(storePath);
  } catch {}
}
