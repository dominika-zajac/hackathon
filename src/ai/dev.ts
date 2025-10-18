import { config } from 'dotenv';
config();

import '@/ai/flows/personalize-reading-suggestions.ts';
import '@/ai/flows/adapt-writing-tone.ts';
import '@/ai/flows/summarize-video-feedback.ts';