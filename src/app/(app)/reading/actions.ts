
'use server';

import { generateReadingText } from '@/ai/flows/generate-reading-text';
import { summarizeVideoFeedback } from '@/ai/flows/summarize-video-feedback';
import { z } from 'zod';

export interface GenerationState {
  text?: string;
  error?: string;
}

export interface AnalysisState {
  summary?: string;
  videoExercises?: { title: string; url: string; description: string }[];
  error?: string;
}

const generationSchema = z.object({
  language: z.string(),
  level: z.string(),
});

export async function getText(
  prevState: GenerationState | null,
  formData: FormData
): Promise<GenerationState> {
  const validation = generationSchema.safeParse({
    language: formData.get('language'),
    level: formData.get('level'),
  });

  if (!validation.success) {
    return { error: 'Invalid input for text generation.' };
  }

  try {
    const result = await generateReadingText(validation.data);
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate text.' };
  }
}

const analysisSchema = z.object({
  media: z.instanceof(File),
  language: z.string(),
});

function toBase64(buffer: ArrayBuffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export async function getAnalysis(
  prevState: AnalysisState | null,
  formData: FormData
): Promise<AnalysisState> {
  const validation = analysisSchema.safeParse({
    media: formData.get('media'),
    language: formData.get('language'),
  });

  if (!validation.success) {
    return { error: 'Invalid input. A recording is required.' };
  }

  const { media, language } = validation.data;

  try {
    const mediaBuffer = await media.arrayBuffer();
    const mediaDataUri = `data:${media.type};base64,${toBase64(mediaBuffer)}`;

    const result = await summarizeVideoFeedback({
      mediaDataUri,
      feedbackRequest:
        'Analyze my speech for pronunciation, fluency, and grammar based on the text I read.',
      language,
    });
    return result;
  } catch (e: any)
{
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
