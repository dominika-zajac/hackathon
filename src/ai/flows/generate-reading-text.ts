
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating reading text based on language and difficulty level.
 *
 * The flow takes a language and level as input and generates a short text for reading practice.
 * It exports the `generateReadingText` function, the `GenerateReadingTextInput` type, and the `GenerateReadingTextOutput` type.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateReadingTextInputSchema = z.object({
  language: z.string().describe('The language for the reading text.'),
  level: z
    .string()
    .describe(
      'The difficulty level for the text (e.g., beginner, intermediate, advanced).'
    ),
});
export type GenerateReadingTextInput = z.infer<
  typeof GenerateReadingTextInputSchema
>;

const GenerateReadingTextOutputSchema = z.object({
  text: z.string().describe('The generated text for reading practice.'),
});
export type GenerateReadingTextOutput = z.infer<
  typeof GenerateReadingTextOutputSchema
>;

export async function generateReadingText(
  input: GenerateReadingTextInput
): Promise<GenerateReadingTextOutput> {
  return generateReadingTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadingTextPrompt',
  input: { schema: GenerateReadingTextInputSchema },
  output: { schema: GenerateReadingTextOutputSchema },
  prompt: 
  `Generate a new, unique, short text for reading practice in {{{language}}} for a person with a {{{level}}} language level. The text should be between 120 and 170 words. The topic should be about everyday life, technology, or nature. Do not repeat texts you have generated before. Evaluate only: intonation on a scale from 1 to 10; accent on a scale from 1 to 10.`,
});

const generateReadingTextFlow = ai.defineFlow(
  {
    name: 'generateReadingTextFlow',
    inputSchema: GenerateReadingTextInputSchema,
    outputSchema: GenerateReadingTextOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
