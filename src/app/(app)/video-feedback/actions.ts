'use server';

import { summarizeVideoFeedback } from '@/ai/flows/summarize-video-feedback';
import { z } from 'zod';

export interface State {
  summary?: string;
  error?: string;
}

const toDataURI = (arrayBuffer: ArrayBuffer, mimeType: string): string => {
  const
   uint8Array = new Uint8Array(arrayBuffer);
  let
   binary = '';
  uint8Array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  const base64 = btoa(binary);
  return `data:${mimeType};base64,${base64}`;
}

const videoFeedbackSchema = z.object({
  media: z.instanceof(File),
  feedbackRequest: z.string(),
});

export async function getFeedback(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validation = videoFeedbackSchema.safeParse({
    media: formData.get('media'),
    feedbackRequest: formData.get('feedbackRequest'),
  });

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors.media?.[0] || 'Invalid input.' };
  }

  try {
    const { media, feedbackRequest } = validation.data;
    const mediaArrayBuffer = await media.arrayBuffer();
    const mediaDataUri = toDataURI(mediaArrayBuffer, media.type);

    const result = await summarizeVideoFeedback({
      mediaDataUri,
      feedbackRequest,
    });
    return { summary: result.summary };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
