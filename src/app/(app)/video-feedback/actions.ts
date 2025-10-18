'use server';

import { summarizeVideoFeedback } from '@/ai/flows/summarize-video-feedback';
import { z } from 'zod';

export interface State {
  summary?: string;
  error?: string;
}

const toDataURI = (buffer: Buffer, mimeType: string): string =>
  `data:${mimeType};base64,${buffer.toString('base64')}`;

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
    const mediaBuffer = Buffer.from(await media.arrayBuffer());
    const mediaDataUri = toDataURI(mediaBuffer, media.type);

    const result = await summarizeVideoFeedback({
      mediaDataUri,
      feedbackRequest,
    });
    return { summary: result.summary };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
