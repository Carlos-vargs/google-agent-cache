import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import {
  GoogleAICacheManager,
  GoogleAIFileManager,
} from "@google/generative-ai/server";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || "";
if (!apiKey) console.warn("Missing GEMINI_API_KEY in .env");

export const genAI = new GoogleGenerativeAI(apiKey);
export const fileManager = new GoogleAIFileManager(apiKey);
export const cacheManager = new GoogleAICacheManager(apiKey);

export async function waitForFileReady(
  fileName,
  { intervalMs = 2000, maxAttempts = 60 } = {}
) {
  let attempts = 0;
  let file = await fileManager.getFile(fileName);
  while (file.state === "PROCESSING") {
    if (attempts++ >= maxAttempts)
      throw new Error("Timeout waiting for file to be processed");
    await new Promise((r) => setTimeout(r, intervalMs));
    file = await fileManager.getFile(fileName);
  }
  if (file.state !== "ACTIVE")
    throw new Error(`File not active. State: ${file.state}`);
  return file;
}
