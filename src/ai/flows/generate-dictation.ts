'use server';
/**
 * @fileOverview A flow to generate a dictation, convert it to speech, and analyze user input.
 *
 * - generateDictation - A function that handles the dictation generation and analysis process.
 * - GenerateDictationInput - The input type for the generateDictation function.
 * - GenerateDictationOutput - The return type for the generateDictation function.
 * - AnalyzeDictationInput - The input type for the analyzeDictation function.
 * - AnalyzeDictationOutput - The return type for the analyzeDictation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';

// Schema for generating dictation text
const GenerateDictationInputSchema = z.object({
  language: z.string().describe('The language for the dictation text.'),
  level: z
    .string()
    .describe(
      'The difficulty level for the dictation (e.g., beginner, intermediate, advanced).'
    ),
});
export type GenerateDictationInput = z.infer<
  typeof GenerateDictationInputSchema
>;

const GenerateDictationOutputSchema = z.object({
  dictationText: z.string().describe('The generated text for dictation.'),
  audioDataUri: z.string().describe('The base64 encoded WAV audio data URI.'),
});
export type GenerateDictationOutput = z.infer<
  typeof GenerateDictationOutputSchema
>;

// Schema for analyzing user's dictation
const AnalyzeDictationInputSchema = z.object({
  originalText: z.string().describe('The original dictation text.'),
  userText: z.string().describe('The text written by the user.'),
  language: z.string().describe('The language of the dictation.'),
});
export type AnalyzeDictationInput = z.infer<typeof AnalyzeDictationInputSchema>;

const AnalyzeDictationOutputSchema = z.object({
  analysis: z
    .string()
    .describe('An HTML string highlighting the mistakes in the user\'s text.'),
});
export type AnalyzeDictationOutput = z.infer<
  typeof AnalyzeDictationOutputSchema
>;

// Main function to generate dictation and audio
export async function generateDictation(
  input: GenerateDictationInput
): Promise<GenerateDictationOutput> {
  return generateDictationFlow(input);
}

// Main function to analyze dictation
export async function analyzeDictation(
  input: AnalyzeDictationInput
): Promise<AnalyzeDictationOutput> {
  return analyzeDictationFlow(input);
}

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', function (d) {
      bufs.push(d);
    });
    writer.on('end', function () {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateTextPrompt = ai.definePrompt({
  name: 'generateDictationTextPrompt',
  input: { schema: GenerateDictationInputSchema },
  output: { schema: z.object({ dictationText: z.string() }) },
  prompt: `Generate a short dictation text in {{{language}}} for a person with a {{{level}}} language level. The text should be between 180 and 200 words. The topic should be about everyday life, technology, or nature.`,
});

const generateDictationFlow = ai.defineFlow(
  {
    name: 'generateDictationFlow',
    inputSchema: GenerateDictationInputSchema,
    outputSchema: GenerateDictationOutputSchema,
  },
  async (input) => {
    const { output: textOutput } = await generateTextPrompt(input);
    if (!textOutput) {
      throw new Error('Failed to generate dictation text.');
    }
    const { dictationText } = textOutput;

    const { media } = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: dictationText,
    });

    if (!media) {
      throw new Error('no media returned from TTS model');
    }

    const audioBuffer = Buffer.from(
      media.url.substring(media.url.indexOf(',') + 1),
      'base64'
    );
    const wavBase64 = await toWav(audioBuffer);

    return {
      dictationText,
      audioDataUri: `data:audio/wav;base64,${wavBase64}`,
    };
  }
);

const analysisPrompt = ai.definePrompt({
  name: 'analyzeDictationPrompt',
  input: { schema: AnalyzeDictationInputSchema },
  output: { schema: AnalyzeDictationOutputSchema },
  prompt: `You are an expert language teacher. Analyze the user's dictation text and compare it to the original. Provide feedback in {{{language}}}.

Original Text:
{{{originalText}}}

User's Text:
{{{userText}}}

Your task is to return an HTML string that shows the user's text with mistakes clearly marked.
- Use a <del> tag for incorrect or extra words.
- Use an <ins> tag for missing words or corrections.
- Keep correct words as they are.
- Ensure the entire response is a single block of HTML that can be rendered.

Example: If the original is "Hello world, this is a test." and the user wrote "Helo world this was test.", the output should be:
"<p><del>Helo</del><ins>Hello</ins> world, this <del>was</del><ins>is a</ins> test.</p>"
`,
});

const analyzeDictationFlow = ai.defineFlow(
  {
    name: 'analyzeDictationFlow',
    inputSchema: AnalyzeDictationInputSchema,
    outputSchema: AnalyzeDictationOutputSchema,
  },
  async (input) => {
    const { output } = await analysisPrompt(input);
    return output!;
  }
);
