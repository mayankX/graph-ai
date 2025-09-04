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
  prompt: z.string().optional().describe('User-provided instructions for enhancement.'),
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
  prompt: `You are an AI graph enhancement tool. Your task is to modify the provided DOT code to improve its aesthetics based on user instructions, with a primary focus on colors and styles.

  **IMPORTANT RULE: Do NOT change the graph's structure or layout (e.g., node positions, connections, rankdir). Only modify attributes like colors, styles, and fonts.**

  Analyze the provided DOT code. If the user has provided specific instructions, prioritize them. If not, suggest and apply creative improvements to the color palette, node/edge styles (like 'filled', 'rounded'), and fonts to make the graph more visually appealing and easier to understand.

  Always provide the complete, enhanced DOT code and a summary of the changes you made.

  User Instructions:
  {{#if prompt}}
    {{prompt}}
  {{else}}
    No specific instructions provided. Focus on improving colors and styles.
  {{/if}}

  Original DOT Code:
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
