import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ClaudeService } from './services/claudeService.js';
import { MockAIService } from './services/mockService.js';
import { logger } from './utils/logger.js';

dotenv.config();

type RawFeedback = {
  id: string;
  source: string;
  text: string;
};

const DATA_DIR = path.resolve(process.cwd(), 'data');
const INPUT_FILE = path.join(DATA_DIR, 'feedbacks.json');
const OUTPUT_DIR = path.resolve(process.cwd(), 'output');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'feedback_analysis.csv');

async function main() {
  const useMock = process.env.USE_MOCK === 'true';
  const apiKey = process.env.ANTHROPIC_API_KEY || '';

  const aiService = useMock ? new MockAIService() : new ClaudeService(apiKey);

  logger.info(useMock ? 'Corriendo en MODO MOCK' : 'Corriendo en MODO PRODUCCIÓN');

  if (!fs.existsSync(INPUT_FILE)) {
    throw new Error(`No se encontró el archivo de entrada: ${INPUT_FILE}`);
  }

  const rawContent = fs.readFileSync(INPUT_FILE, 'utf-8');
  const feedbacks: RawFeedback[] = JSON.parse(rawContent);

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  logger.info(`Procesando ${feedbacks.length} feedbacks con ${useMock ? 'MockAI' : 'Claude'}...`);

  const header = 'id,source,sentiment,category,summary,suggestedAction\n';
  fs.writeFileSync(OUTPUT_FILE, header, 'utf-8');

  for (const fbk of feedbacks) {
    try {
      logger.info(`Analizando feedback ${fbk.id} (${fbk.source})...`);
      const result = await aiService.analyzeFeedback(fbk.text);

      logger.info('Resultado estructurado:');
      console.table(result);

      const row =
        [
          fbk.id,
          fbk.source,
          result.sentiment,
          result.category,
          JSON.stringify(result.summary).replace(/"/g, '""'),
          JSON.stringify(result.suggestedAction).replace(/"/g, '""'),
        ].join(',') + '\n';

      fs.appendFileSync(OUTPUT_FILE, row, 'utf-8');
    } catch (error) {
      logger.error(
        `Error procesando feedback ${fbk.id}. Se salta este registro.`,
        error
      );
    }
  }

  logger.info(`Proceso completado. Archivo generado: ${OUTPUT_FILE}`);
}

main().catch((err) => {
  logger.error('Error ejecutando el agente de integración', err);
  process.exit(1);
});

