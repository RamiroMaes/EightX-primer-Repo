# AI Integration Agent – EightX Style

Mini proyecto en Node.js + TypeScript que procesa feedback de clientes usando la API de Anthropic (Claude) y devuelve una salida estructurada lista para enviar a hojas de cálculo, CRMs o notificaciones internas.

## Requisitos

- Docker
- Una API Key de Anthropic (Claude)

## Setup (solo con Docker)

1. Copiar el archivo de ejemplo de entorno y completar tu API key:

   ```bash
   cp .env.example .env
   # Editar .env y colocar tu ANTHROPIC_API_KEY
   ```

2. Construir la imagen Docker (esto instalará Node, npm y todas las dependencias **dentro del contenedor**):

   ```bash
   docker build -t eightx-ai-agent .
   ```

3. Ejecutar el agente usando la imagen:

   ```bash
   docker run --rm --env-file .env eightx-ai-agent
   ```

   El contenedor:
   - Leerá los feedbacks desde `data/feedbacks.json`.
   - Llamará a la API de Claude.
   - Mostrará en consola el análisis de cada feedback.
   - Generará un CSV dentro del contenedor en `output/feedback_analysis.csv`.

## Flujo actual

Actualmente el agente:

- Lee múltiples feedbacks desde `data/feedbacks.json` (cada uno con `id`, `source` y `text`).
- Llama a `ClaudeService` (que usa `@anthropic-ai/sdk`) para analizar cada texto.
- Pide a Claude que devuelva un JSON con:
  - `sentiment`
  - `category`
  - `suggestedAction`
  - `summary`
- Muestra el resultado de cada feedback en consola (formato tabla).
- Escribe un archivo CSV en `output/feedback_analysis.csv` con las columnas:
  - `id, source, sentiment, category, summary, suggestedAction`

Este es el núcleo del "AI Lead & Sentiment Dispatcher". A partir de aquí es sencillo:

- Reemplazar el feedback hardcodeado por un input externo (archivo, API, webhook).
- Guardar el resultado en CSV o Google Sheets.
- Enviar notificaciones a Slack o email.

## Docker (una vez que tengas npm disponible)

Para construir la imagen:

```bash
docker build -t eightx-ai-agent .
```

Para correrla:

```bash
docker run --rm --env-file .env eightx-ai-agent
```

