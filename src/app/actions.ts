'use server';

import { aiPoweredGraphEnhancement, type AIPoweredGraphEnhancementInput } from '@/ai/flows/ai-powered-graph-enhancement';
import { enhancePromptWithAI, type EnhancePromptWithAIInput } from '@/ai/flows/enhance-prompt-with-ai';
import { saveGraph, getGraph } from '@/lib/graph-service';

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

export async function saveGraphAction(dotCode: string): Promise<{ data?: string; error?: string }> {
  try {
    const id = await saveGraph(dotCode);
    return { data: id };
  } catch (error) {
    console.error('Failed to save graph:', error);
    return { error: 'Could not save the graph to the database.' };
  }
}

export async function getGraphAction(id: string): Promise<{ data?: string; error?: string }> {
  try {
    const dotCode = await getGraph(id);
    if (dotCode === null) {
      return { error: 'No graph found with the provided link.' };
    }
    return { data: dotCode };
  } catch (error) {
    console.error('Failed to get graph:', error);
    return { error: 'Could not retrieve the graph from the database.' };
  }
}
