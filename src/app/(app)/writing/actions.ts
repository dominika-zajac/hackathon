'use server';

import {
  generateDictation,
  analyzeDictation,
  type GenerateDictationInput,
  type GenerateDictationOutput,
  type AnalyzeDictationInput,
  type AnalyzeDictationOutput,
} from '@/ai/flows/generate-dictation';
import { z } from 'zod';

export interface GenerationState extends Partial<GenerateDictationOutput> {
  error?: string;
}

export interface AnalysisState extends Partial<AnalyzeDictationOutput> {
  error?: string;
}

const generationSchema = z.object({
  language: z.string(),
  level: z.string(),
});

export async function getDictation(
  prevState: GenerationState | null,
  formData: FormData
): Promise<GenerationState> {
  const validation = generationSchema.safeParse({
    language: formData.get('language'),
    level: formData.get('level'),
  });

  if (!validation.success) {
    return { error: 'Invalid input for dictation generation.' };
  }

  try {
    const result = await generateDictation(validation.data);
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to generate dictation.' };
  }
}

const analysisSchema = z.object({
  originalText: z.string(),
  userText: z.string(),
  language: z.string(),
});

export async function getAnalysis(
  prevState: AnalysisState | null,
  formData: FormData
): Promise<AnalysisState> {
  const validation = analysisSchema.safeParse({
    originalText: formData.get('originalText'),
    userText: formData.get('userText'),
    language: formData.get('language'),
  });

  if (!validation.success) {
    return { error: 'Invalid input for analysis.' };
  }

  try {
    const result = await analyzeDictation(validation.data);
    return result;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Failed to analyze dictation.' };
  }
}
