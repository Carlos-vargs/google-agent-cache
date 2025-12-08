API de Chat con Google Generative AI (con Context Cache)

Flujo de trabajo por secciones

1. Configurar y entrenar el caché (una sola vez):

   - POST /api/cache/setup
     body: { filePath: string, mimeType: string, displayName?, model?, ttlSeconds?, systemInstruction?, cacheDisplayName? }
     Sube el archivo, espera procesamiento, crea el caché en Google y guarda su nombre en cache.json.
   - GET /api/cache -> ver información del caché guardado
   - DELETE /api/cache -> eliminar referencia local (no borra el caché remoto)

2. Chatbot usando el caché
   - POST /api/chat
     body: { question: string, context?: string, files?: [{ path: string, mimeType: string, displayName?: string }] }
     Usa el caché previamente creado como contexto base, más el contexto y archivos opcionales del request.
   - POST /api/chat/upload (multipart/form-data)
     fields: question (requerido), context (opcional)
     files: uno o varios archivos en el campo "files" (PDF, TXT, MD, ...). El servidor sube estos archivos al File API de Gemini y los añade al prompt junto con el caché.

Configuración:

- Copia .env.example a .env y coloca tu GEMINI_API_KEY.
- npm install
- Crea y coloca tus fuentes en data/cache_sources/ (PDF, TXT, MD, etc.).
- Configura caché por CLI: npm run setup-cache [sourcesDir] [displayName] [model] [ttlSeconds] [systemInstruction]
  Ejemplo: npm run setup-cache data/cache_sources "Cache_Experto" models/gemini-2.5-pro 3600 "Eres experto en aduanas..."
- npm run start

Healthcheck:

- GET /health -> { status: 'ok' }

Ejemplos de uso (API)

- JSON (ruta local en el servidor):

  ```bash
  curl -X POST http://localhost:3000/api/chat \
    -H 'Content-Type: application/json' \
    -d '{
      "question": "¿Qué documentos faltan?",
      "context": "Embarque MX-001",
      "files": [{
        "path": "data/cache_sources/mi-archivo.pdf",
        "mimeType": "application/pdf",
        "displayName": "mi-archivo.pdf"
      }]
    }'
  ```

- Subiendo PDFs desde el cliente (multipart/form-data):
  ```bash
  curl -X POST http://localhost:3000/api/chat/upload \
    -F "question=¿Qué BL aplica?" \
    -F "context=Embarque MX-001" \
    -F "files=@data/cache_sources/ejemplo1.pdf;type=application/pdf" \
    -F "files=@data/cache_sources/ejemplo2.pdf;type=application/pdf"
  ```

CLI

- list-models

  - Muestra los modelos disponibles y sus métodos soportados.
  - Uso:
    - `npm run list-models`

- setup-cache

  - Sube archivos desde un directorio, espera a que estén listos y crea un Context Cache remoto.
  - Parámetros:
    - `sourcesDir` (opcional, por defecto `data/cache_sources`)
    - `displayName` (opcional, por defecto `Context_Cache`)
    - `model` (opcional, por defecto `models/gemini-2.5-pro`)
    - `ttlSeconds` (opcional, por defecto `3600`)
    - `systemInstruction` (opcional)
  - Ejemplo:
    - `npm run setup-cache -- data/cache_sources "Cache_Experto" models/gemini-2.5-pro 3600 "Eres experto en aduanas..."`

- list-caches

  - Lista los cachés creados en la API (nombre, modelo, displayName, createTime, expireTime).
  - Uso:
    - `npm run list-caches`

- delete-cache
  - Elimina un caché remoto por su `name` completo o solo el ID.
  - Uso:
    - Con nombre completo devuelto por la API: `npm run delete-cache -- cachedContents/XXXXXXXXXXXX`
    - Con solo el ID (el comando añade `cachedContents/` automáticamente): `npm run delete-cache -- XXXXXXXXXXXX`
  - Tip:
    - Usa `npm run list-caches` para copiar el campo `name` exacto.

Requisitos

- `.env` debe contener `GEMINI_API_KEY` válido.
- Los modelos deben soportar `createCachedContent` para crear cachés.
- Fuentes válidas: `.pdf`, `.txt`, `.md`.
