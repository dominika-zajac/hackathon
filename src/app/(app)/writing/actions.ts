'use server';

import { adaptWritingTone } from '@/ai/flows/adapt-writing-tone';
import { z } from 'zod';

export interface State {
  adaptedText?: string;
  explanation?: string;
  error?: string;
}

const writingSchema = z.object({
  text: z.string(),
  desiredTone: z.string(),
});

export async function adaptTone(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validation = writingSchema.safeParse({
    text: formData.get('text'),
    desiredTone: formData.get('desiredTone'),
  });

  if (!validation.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await adaptWritingTone(validation.data);
    return {
      adaptedText: result.adaptedText,
      explanation: result.explanation,
    };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
