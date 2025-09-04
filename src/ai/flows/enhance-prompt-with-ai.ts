'use server';
/**
 * @fileOverview An AI flow to enhance user-provided prompts for graph styling.
 *
 * - enhancePromptWithAI - A function that refines a user's prompt.
 * - EnhancePromptWithAIInput - The input type for the enhancePromptWithAI function.
 * - EnhancePromptWithAIOutput - The return type for the enhancePromptWithAI function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhancePromptWithAIInputSchema = z.object({
  prompt: z.string().describe('The user-provided prompt to be enhanced.'),
});
export type EnhancePromptWithAIInput = z.infer<typeof EnhancePromptWithAIInputSchema>;

const EnhancePromptWithAIOutputSchema = z.object({
  enhancedPrompt: z.string().describe('The AI-enhanced prompt.'),
});
export type EnhancePromptWithAIOutput = z.infer<typeof EnhancePromptWithAIOutputSchema>;

export async function enhancePromptWithAI(input: EnhancePromptWithAIInput): Promise<EnhancePromptWithAIOutput> {
  return enhancePromptFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhancePromptForGraphAI',
  input: {schema: EnhancePromptWithAIInputSchema},
  output: {schema: EnhancePromptWithAIOutputSchema},
  prompt: `You are an expert prompt engineer. Your task is to refine the user's instructions to be more effective for an AI that styles DOT graphs. The styling AI only modifies colors, styles, and fonts; it does not change the graph structure.

  Take the user's prompt and make it clearer, more detailed, and more specific for the styling AI. For example, if the user says "make it look modern", you could translate that to "Use a modern color palette with a dark background, vibrant blue for primary nodes, and a contrasting accent color like lime green. Use a sans-serif font like 'Inter' for all labels."

  User's Prompt:
  {{prompt}}`,
});

const enhancePromptFlow = ai.defineFlow(
  {
    name: 'enhancePromptFlow',
    inputSchema: EnhancePromptWithAIInputSchema,
    outputSchema: EnhancePromptWithAIOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);