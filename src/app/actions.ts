'use server';

import { aiPoweredGraphEnhancement, type AIPoweredGraphEnhancementInput } from '@/ai/flows/ai-powered-graph-enhancement';
import { enhancePromptWithAI, type EnhancePromptWithAIInput } from '@/ai/flows/enhance-prompt-with-ai';

export async function enhanceGraphAction(input: AIPoweredGraphEnhancementInput) {
  try {
    const result = await aiPoweredGraphEnhancement(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to enhance graph with AI. The model may be unavailable or the input may be invalid.' };
  }
}

export async function enhancePromptAction(input: EnhancePromptWithAIInput) {
  try {
    const result = await enhancePromptWithAI(input);
    return { data: result };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to enhance prompt with AI. The model may be unavailable or the input may be invalid.' };
  }
}
