export interface AIAnalysisResult {
  sentiment: 'positive' | 'negative' | 'neutral';
  category: 'billing' | 'technical' | 'shipping' | 'general';
  suggestedAction: string;
  summary: string;
}

export interface IAIService {
  analyzeFeedback(text: string): Promise<AIAnalysisResult>;
}

