import { IAIService, AIAnalysisResult } from './ai.interface.js';
import { logger } from '../utils/logger.js';

export class MockAIService implements IAIService {
  async analyzeFeedback(text: string): Promise<AIAnalysisResult> {
    logger.info("Simulando respuesta de IA (Mock Mode)...");
    // Simulamos un pequeño delay para que parezca real
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      sentiment: text.includes('encantó') ? 'positive' : 'negative',
      category: text.includes('envío') ? 'shipping' : 'technical',
      suggestedAction: "Enviar cupón de descuento o revisar logística.",
      summary: "Feedback simulado para testeo local."
    };
  }
}