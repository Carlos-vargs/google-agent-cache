import { promises as fs } from "fs";
import path from "path";

/**
 * Elimina archivos subidos temporalmente
 * @param {Array} files - Array de archivos con propiedad path
 */
export async function cleanupFiles(files) {
  try {
    await Promise.all(
      (files || []).map((f) => fs.unlink(f.path).catch(() => {}))
    );
  } catch {}
}

/**
 * Guarda una respuesta en formato markdown en el directorio data/answer
 * @param {string} text - Texto a guardar
 */
export async function saveMarkdownAnswer(text) {
  // Limpiar escapes para Markdown legible
  const cleanMarkdown = text
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\t/g, "\t");
  // Generar nombre de archivo único y ruta segura
  const timestamp = Date.now();
  const fileName = `answer-${timestamp}.md`;
  const answerDir = path.join(process.cwd(), "data", "answer");
  const answerPath = path.join(answerDir, fileName);
  try {
    await fs.mkdir(answerDir, { recursive: true });
    console.log("Intentando guardar respuesta en:", answerPath);
    await fs.writeFile(answerPath, String(cleanMarkdown), "utf8");
    console.log("Archivo markdown guardado correctamente:", answerPath);
  } catch (err) {
    console.error("Error guardando respuesta markdown:", err);
  }
}
