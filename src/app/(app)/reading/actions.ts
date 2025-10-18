'use server';

import { personalizeReadingSuggestions } from '@/ai/flows/personalize-reading-suggestions';
import { z } from 'zod';

export interface State {
  suggestions?: string[];
  reasoning?: string;
  error?: string;
}

const readingSchema = z.object({
  userActivity: z.string(),
  readingHistory: z.string(),
});

export async function getSuggestions(
  prevState: State | null,
  formData: FormData
): Promise<State> {
  const validation = readingSchema.safeParse({
    userActivity: formData.get('userActivity'),
    readingHistory: formData.get('readingHistory'),
  });

  if (!validation.success) {
    return { error: 'Invalid input.' };
  }

  try {
    const result = await personalizeReadingSuggestions(validation.data);
    return {
      suggestions: result.suggestions,
      reasoning: result.reasoning,
    };
  } catch (e: any) {
    return { error: e.message || 'An unexpected error occurred.' };
  }
}
