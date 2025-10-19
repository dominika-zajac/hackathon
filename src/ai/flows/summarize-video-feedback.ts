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
  mediaDataUri: z
    .string()
    .describe(
      "A video or audio file, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  feedbackRequest: z.string().describe('The specific feedback requested for the video or audio.'),
});
export type SummarizeVideoFeedbackInput = z.infer<typeof SummarizeVideoFeedbackInputSchema>;

const SummarizeVideoFeedbackOutputSchema = z.object({
  summary: z.string().describe('The AI-powered summary of key feedback points from the video or audio, in HTML format.'),
});
export type SummarizeVideoFeedbackOutput = z.infer<typeof SummarizeVideoFeedbackOutputSchema>;

export async function summarizeVideoFeedback(input: SummarizeVideoFeedbackInput): Promise<SummarizeVideoFeedbackOutput> {
  return summarizeVideoFeedbackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeVideoFeedbackPrompt',
  input: {schema: SummarizeVideoFeedbackInputSchema},
  output: {schema: SummarizeVideoFeedbackOutputSchema},
  prompt: `You are an AI assistant that provides concise and actionable feedback on video or audio.

You will analyze the media and provide a summary of key feedback points, focusing on areas for improvement as requested by the user. If the user asks to "check the speak errors of user", you should analyze the audio track and identify any grammar mistakes, filler words, or awkward phrasing, and suggest improvements.

User's feedback request: {{{feedbackRequest}}}
Media: {{media url=mediaDataUri}}

The output should be a valid HTML string with the following structure:
- A summary rating out of 10.
- A grammar rating out of 10.
- Additional detailed feedback.

Example Output:
<p><b>Summary Rate:</b> 8/10</p>
<p><b>Grammar Rate:</b> 9/10</p>
<p><b>Feedback:</b> Your presentation was clear and well-paced. Consider adding more specific examples to illustrate your points.</p>
`,
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
