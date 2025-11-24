'use server';
import { config } from 'dotenv';
config();

import '@/ai/flows/personalize-reading-suggestions.ts';
import '@/ai/flows/summarize-video-feedback.ts';
import '@/ai/flows/generate-dictation.ts';
