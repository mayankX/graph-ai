'use server';
/**
 * @fileOverview An AI-powered graph enhancement flow that analyzes DOT code and suggests improvements.
 *
 * - aiPoweredGraphEnhancement - A function that enhances the graph based on the DOT code.
 * - AIPoweredGraphEnhancementInput - The input type for the aiPoweredGraphEnhancement function.
 * - AIPoweredGraphEnhancementOutput - The return type for the aiPoweredGraphEnhancement function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIPoweredGraphEnhancementInputSchema = z.object({
  dotCode: z.string().describe('The DOT code of the graph to be enhanced.'),
});
export type AIPoweredGraphEnhancementInput = z.infer<typeof AIPoweredGraphEnhancementInputSchema>;

const AIPoweredGraphEnhancementOutputSchema = z.object({
  enhancedDotCode: z
    .string()
    .describe('The enhanced DOT code with improved layout, styles, and colors.'),
  suggestions: z.string().describe('AI suggestions for graph improvements.'),
});
export type AIPoweredGraphEnhancementOutput = z.infer<typeof AIPoweredGraphEnhancementOutputSchema>;

export async function aiPoweredGraphEnhancement(input: AIPoweredGraphEnhancementInput): Promise<AIPoweredGraphEnhancementOutput> {
  return aiPoweredGraphEnhancementFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiPoweredGraphEnhancementPrompt',
  input: {schema: AIPoweredGraphEnhancementInputSchema},
  output: {schema: AIPoweredGraphEnhancementOutputSchema},
  prompt: `You are an AI graph enhancement tool. Analyze the provided DOT code and suggest improvements to enhance the graph's readability and aesthetics.

  Consider improvements to the layout, node/edge styles, and color palettes to make the graph more visually appealing and easier to understand.
  Provide the enhanced DOT code and a summary of the suggestions made.

  DOT Code:
  {{dotCode}}`,
});

const aiPoweredGraphEnhancementFlow = ai.defineFlow(
  {
    name: 'aiPoweredGraphEnhancementFlow',
    inputSchema: AIPoweredGraphEnhancementInputSchema,
    outputSchema: AIPoweredGraphEnhancementOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
