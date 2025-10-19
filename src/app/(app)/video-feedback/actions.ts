'use server';

import {
  summarizeVideoFeedback,
  type SummarizeVideoFeedbackOutput,
} from '@/ai/flows/summarize-video-feedback';
import { z } from 'zod';

export interface State extends SummarizeVideoFeedbackOutput {
  error?: string;
}

const videoFeedbackSchema = z.object({
  media: z.instanceof(File),
  feedbackRequest: z.string(),
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

export async function getFeedback(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validation = videoFeedbackSchema.safeParse({
    media: formData.get('media'),
    feedbackRequest: formData.get('feedbackRequest'),
  });

  if (!validation.success) {
    return { error: 'Invalid input. A file and feedback request are required.' };
  }

  const { media, feedbackRequest } = validation.data;

  try {
    const mediaBuffer = await media.arrayBuffer();
    const mediaDataUri = `data:${media.type};base64,${toBase64(mediaBuffer)}`;

    const result = await summarizeVideoFeedback({
      mediaDataUri,
      feedbackRequest,
    });
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
