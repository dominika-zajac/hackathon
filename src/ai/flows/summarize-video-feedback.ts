'use server';

/**
 * @fileOverview A video feedback summarization AI agent.
 *
 * - summarizeVideoFeedback - A function that handles the video feedback summarization process.
 * - SummarizeVideoFeedbackInput - The input type for the summarizeVideoFeedback function.
 * - SummarizeVideoFeedbackOutput - The return type for the summarizeVideoFeedback function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SummarizeVideoFeedbackInputSchema = z.object({
  videoDataUri: z
    .string()
    .describe(
      "A video, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  feedbackRequest: z.string().describe('The specific feedback requested for the video.'),
});
export type SummarizeVideoFeedbackInput = z.infer<typeof SummarizeVideoFeedbackInputSchema>;

const SummarizeVideoFeedbackOutputSchema = z.object({
  summary: z.string().describe('The AI-powered summary of key feedback points from the video.'),
});
export type SummarizeVideoFeedbackOutput = z.infer<typeof SummarizeVideoFeedbackOutputSchema>;

export async function summarizeVideoFeedback(input: SummarizeVideoFeedbackInput): Promise<SummarizeVideoFeedbackOutput> {
  return summarizeVideoFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeVideoFeedbackPrompt',
  input: {schema: SummarizeVideoFeedbackInputSchema},
  output: {schema: SummarizeVideoFeedbackOutputSchema},
  prompt: `You are an AI assistant that provides concise and actionable feedback on videos.

You will analyze the video and provide a summary of key feedback points, focusing on areas for improvement as requested by the user.

User's feedback request: {{{feedbackRequest}}}
Video: {{media url=videoDataUri}}`,
});

const summarizeVideoFeedbackFlow = ai.defineFlow(
  {
    name: 'summarizeVideoFeedbackFlow',
    inputSchema: SummarizeVideoFeedbackInputSchema,
    outputSchema: SummarizeVideoFeedbackOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
