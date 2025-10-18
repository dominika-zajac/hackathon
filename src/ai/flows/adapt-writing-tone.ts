'use server';

/**
 * @fileOverview A flow to analyze text and suggest adjustments to the tone.
 *
 * - adaptWritingTone - A function that handles the tone adaptation process.
 * - AdaptWritingToneInput - The input type for the adaptWritingTone function.
 * - AdaptWritingToneOutput - The return type for the adaptWritingTone function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdaptWritingToneInputSchema = z.object({
  text: z.string().describe('The text to analyze and adapt the tone of.'),
  desiredTone: z
    .string()
    .describe(
      'The desired tone for the text (e.g., more formal, persuasive, or friendly).'
    ),
});
export type AdaptWritingToneInput = z.infer<typeof AdaptWritingToneInputSchema>;

const AdaptWritingToneOutputSchema = z.object({
  adaptedText: z
    .string()
    .describe('The text adapted to the desired tone.'),
  explanation: z
    .string()
    .describe(
      'An explanation of the changes made to adapt the text to the desired tone.'
    ),
});
export type AdaptWritingToneOutput = z.infer<typeof AdaptWritingToneOutputSchema>;

export async function adaptWritingTone(
  input: AdaptWritingToneInput
): Promise<AdaptWritingToneOutput> {
  return adaptWritingToneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adaptWritingTonePrompt',
  input: {schema: AdaptWritingToneInputSchema},
  output: {schema: AdaptWritingToneOutputSchema},
  prompt: `You are an AI writing assistant that helps users adapt the tone of their writing.

You will be given a text and a desired tone. You will adapt the text to the desired tone and explain the changes you made.

Text: {{{text}}}
Desired Tone: {{{desiredTone}}}

Adapted Text:`,
});

const adaptWritingToneFlow = ai.defineFlow(
  {
    name: 'adaptWritingToneFlow',
    inputSchema: AdaptWritingToneInputSchema,
    outputSchema: AdaptWritingToneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
