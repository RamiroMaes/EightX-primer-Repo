# AI Integration Agent – EightX Style

A mini project in Node.js + TypeScript that processes customer feedback using the Anthropic API (Claude) and returns a structured output ready to be sent to spreadsheets, CRMs, or internal notifications.

## Requirements

- Docker
- An Anthropic API Key (Claude)

## Setup (Docker only)

1. Copy the environment example file and add your API key:

   ```bash
   cp .env.example .env
   # Edit .env and add your ANTHROPIC_API_KEY
   ```

2. Build the Docker image (this will install Node, npm, and all dependencies **inside the container**):

   ```bash
   docker build -t eightx-ai-agent .
   ```

3. Run the agent using the image:

   ```bash
   docker run --rm --env-file .env eightx-ai-agent
   ```

   The container will:
   - Read feedback entries from `data/feedbacks.json`.
   - Call the Claude API.
   - Print the analysis for each feedback entry to the console.
   - Generate a CSV file inside the container at `output/feedback_analysis.csv`.

## Current Flow

The agent currently:

- Reads multiple feedback entries from `data/feedbacks.json` (each with `id`, `source`, and `text`).
- Calls `ClaudeService` (which uses `@anthropic-ai/sdk`) to analyze each text.
- Asks Claude to return a JSON object with:
  - `sentiment`
  - `category`
  - `suggestedAction`
  - `summary`
- Prints the result of each feedback entry to the console (table format).
- Writes a CSV file to `output/feedback_analysis.csv` with the columns:
  - `id, source, sentiment, category, summary, suggestedAction`

This is the core of the "AI Lead & Sentiment Dispatcher." From here, it's easy to:

- Replace hardcoded feedback with an external input source (file, API, webhook).
- Save results to CSV or Google Sheets.
- Send notifications to Slack or email.

## Docker (once npm is available)

To build the image:

```bash
docker build -t eightx-ai-agent .
```

To run it:

```bash
docker run --rm --env-file .env eightx-ai-agent
```

