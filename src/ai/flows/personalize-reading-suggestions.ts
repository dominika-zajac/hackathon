'use server';
/**
 * @fileOverview This file defines a Genkit flow for personalizing reading suggestions based on user activity and reading history.
 *
 * The flow takes user activity and reading history as input and suggests relevant articles or resources.
 * It exports the `personalizeReadingSuggestions` function, the `PersonalizeReadingSuggestionsInput` type, and the `PersonalizeReadingSuggestionsOutput` type.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PersonalizeReadingSuggestionsInputSchema = z.object({
  userActivity: z
    .string()
    .describe('A description of the user\'s current activity within the reading tab.'),
  readingHistory: z
    .string()
    .describe('A summary of the user\'s reading history and preferences.'),
});
export type PersonalizeReadingSuggestionsInput = z.infer<
  typeof PersonalizeReadingSuggestionsInputSchema
>;

const PersonalizeReadingSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe(
      'A list of suggested articles or resources tailored to the user\'s interests.'
    ),
  reasoning: z
    .string()
    .describe('Explanation of why the suggestions were given based on the input.'),
});
export type PersonalizeReadingSuggestionsOutput = z.infer<
  typeof PersonalizeReadingSuggestionsOutputSchema
>;

export async function personalizeReadingSuggestions(
  input: PersonalizeReadingSuggestionsInput
): Promise<PersonalizeReadingSuggestionsOutput> {
  return personalizeReadingSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'personalizeReadingSuggestionsPrompt',
  input: {schema: PersonalizeReadingSuggestionsInputSchema},
  output: {schema: PersonalizeReadingSuggestionsOutputSchema},
  prompt: `You are an AI assistant designed to provide personalized reading suggestions to users based on their current activity and reading history.

  Current Activity: {{{userActivity}}}
  Reading History: {{{readingHistory}}}

  Based on this information, suggest relevant articles or resources that the user might find interesting and helpful. Explain your reasoning for the suggestions.

  Format your response as a JSON object with 'suggestions' (an array of article/resource titles) and 'reasoning' (an explanation of why these suggestions were made).
  `,
});

const personalizeReadingSuggestionsFlow = ai.defineFlow(
  {
    name: 'personalizeReadingSuggestionsFlow',
    inputSchema: PersonalizeReadingSuggestionsInputSchema,
    outputSchema: PersonalizeReadingSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
