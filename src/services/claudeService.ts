import Anthropic from '@anthropic-ai/sdk';
import { IAIService, AIAnalysisResult } from './ai.interface.js';

export class ClaudeService implements IAIService {
  private client: Anthropic;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is required');
    }
    this.client = new Anthropic({ apiKey });
  }

  async analyzeFeedback(text: string): Promise<AIAnalysisResult> {
    const response = await this.client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      system:
        'Eres un asistente para equipos de soporte y ventas. ' +
        'Analiza el feedback de clientes de e-commerce y responde estrictamente en formato JSON ' +
        'con las claves: sentiment, category, suggestedAction, summary.',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza este feedback de cliente y responde SOLO JSON válido:\n\n${text}`,
            },
          ],
        },
      ],
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected Claude response format');
    }

    const raw = content.text.trim();
    return JSON.parse(raw) as AIAnalysisResult;
  }
}

