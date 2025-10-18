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
  video: z.instanceof(File),
  feedbackRequest: z.string(),
});

export async function getFeedback(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validation = videoFeedbackSchema.safeParse({
    video: formData.get('video'),
    feedbackRequest: formData.get('feedbackRequest'),
  });

  if (!validation.success) {
    return { error: validation.error.flatten().fieldErrors.video?.[0] || 'Invalid input.' };
  }

  try {
    const { video, feedbackRequest } = validation.data;
    const videoBuffer = Buffer.from(await video.arrayBuffer());
    const videoDataUri = toDataURI(videoBuffer, video.type);

    const result = await summarizeVideoFeedback({
      videoDataUri,
      feedbackRequest,
    });
    return { summary: result.summary };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
