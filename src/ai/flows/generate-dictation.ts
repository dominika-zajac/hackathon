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

Your task is to return an HTML string with a complete analysis. The response should have three parts:
1.  **General Assessment**: Start with a <h4> titled "General Assessment". Write a brief, encouraging summary of the user's performance.
2.  **Detailed Analysis**: Follow with a <h4> titled "Detailed Analysis". Display the user's text, marking mistakes clearly:
    - Use a <del> tag for incorrect or extra words.
    - Use an <ins> tag for missing words or corrections.
    - Keep correct words as they are, wrapped in a <p> tag.
3.  **Corrections**: Finally, include a <h4> titled "Corrections". Provide a bulleted list (<ul> with <li>) explaining each mistake and how to correct it. If there are no mistakes, state that.

Ensure the entire response is a single block of valid HTML that can be rendered directly.

Example for a text with mistakes:
"<h4>General Assessment</h4><p>Good job! You've captured most of the text correctly. There are just a few minor points to work on, mainly with articles and verb tenses.</p><h4>Detailed Analysis</h4><p><del>Helo</del><ins>Hello</ins> world, this <del>was</del><ins>is a</ins> test.</p><h4>Corrections</h4><ul><li>'Helo' should be 'Hello'.</li><li>'was' should be 'is a'.</li></ul>"

Example for a perfect text:
"<h4>General Assessment</h4><p>Excellent work! Your transcription is perfect. You've correctly captured every word, including punctuation and capitalization.</p><h4>Detailed Analysis</h4><p>Hello world, this is a test.</p><h4>Corrections</h4><ul><li>No mistakes found. Well done!</li></ul>"
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
