import { promises as fs } from "fs";
import path from "path";

const storePath = path.resolve(process.cwd(), "cache.json");

/**
 * Guarda información de caché localmente admitiendo múltiples entradas.
 * Si recibe un objeto, lo agrega o reemplaza por cacheName en el arreglo persistido.
 * Si recibe un arreglo, reemplaza por completo el contenido persistido.
 * @param {Object|Object[]} info Entrada(s) de caché a guardar.
 * @returns {Promise<Object[]>} Arreglo completo de cachés persistidos.
 */
export async function saveCacheInfo(info) {
  let next = [];
  try {
    const txt = await fs.readFile(storePath, "utf-8");
    const parsed = JSON.parse(txt);
    next = Array.isArray(parsed) ? parsed : parsed ? [parsed] : [];
  } catch {}

  if (Array.isArray(info)) {
    next = info;
  } else if (info && typeof info === "object") {
    const idx = next.findIndex((c) => c?.cacheName === info.cacheName);
    if (idx >= 0) next[idx] = info;
    else next.push(info);
  }

  await fs.writeFile(storePath, JSON.stringify(next, null, 2), "utf-8");
  return next;
}

/**
 * Carga la información de caché almacenada localmente.
 * Devuelve siempre un arreglo; si existe un formato antiguo (objeto), lo normaliza a [obj].
 * @returns {Promise<Object[]>} Arreglo de entradas de caché, [] si no existe.
 */
export async function loadCacheInfo() {
  try {
    const txt = await fs.readFile(storePath, "utf-8");
    const parsed = JSON.parse(txt);
    if (Array.isArray(parsed)) return parsed;
    if (parsed && typeof parsed === "object") return [parsed];
    return [];
  } catch {
    return [];
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
