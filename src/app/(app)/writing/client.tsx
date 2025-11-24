
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  LoaderCircle,
  Play,
  Mic,
  FileCheck,
  RotateCcw,
} from 'lucide-react';
import React, { useActionState, useState, useRef, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import {
  getDictation,
  getAnalysis,
  type GenerationState,
  type AnalysisState,
} from './actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';

const writingSchema = z.object({
  userText: z
    .string()
    .min(1, 'Please enter the text you heard from the dictation.'),
});

type WritingFormValues = z.infer<typeof writingSchema>;

function GenerateButton() {
  const { pending } = useFormStatus();
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full"
      variant="secondary"
    >
      {pending && <LoaderCircle className="mr-2 animate-spin" />}
      <Play className="mr-2" />
      {t.writing.startDictationButton}
    </Button>
  );
}
function AnalyzeButton() {
  const { pending } = useFormStatus();
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="mr-2 animate-spin" />}
      <FileCheck className="mr-2" />
      {t.writing.analyzeButton}
    </Button>
  );
}

export default function WritingClient() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  const { toast } = useToast();

  const [generationState, generationAction] =
    useActionState<GenerationState, FormData>(getDictation, null);
  const [analysisState, analysisAction, isAnalysisPending] =
    useActionState<AnalysisState, FormData>(getAnalysis, null);

  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const form = useForm<WritingFormValues>({
    resolver: zodResolver(writingSchema),
    defaultValues: {
      userText: '',
    },
  });

  useEffect(() => {
    if (generationState?.error) {
      toast({
        variant: 'destructive',
        title: 'Error generating dictation',
        description: generationState.error,
      });
    }
  }, [generationState, toast]);

  useEffect(() => {
    if (analysisState?.error) {
      toast({
        variant: 'destructive',
        title: 'Error analyzing text',
        description: analysisState.error,
      });
    }
  }, [analysisState, toast]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const handleReset = () => {
    form.reset();
    // A bit of a hack to reset the action states
    generationAction(new FormData());
    analysisAction(new FormData());
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t.writing.dictation.title}</CardTitle>
            <CardDescription>{t.writing.dictation.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form action={generationAction} className="space-y-4">
              <input type="hidden" name="language" value="English" />
              <input type="hidden" name="level" value="intermediate" />
              <GenerateButton />
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.writing.yourTranscription.title}</CardTitle>
            <CardDescription>
              {t.writing.yourTranscription.description}
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form action={analysisAction}>
              <CardContent className="space-y-6">
                {generationState?.audioDataUri && (
                  <div className="space-y-4 pt-4">
                    <audio
                      ref={audioRef}
                      src={generationState.audioDataUri}
                      controls
                      className="w-full"
                    />
                    <div className="space-y-2">
                      <Label htmlFor="speed">{t.writing.speed.label}</Label>
                      <Slider
                        id="speed"
                        defaultValue={[1]}
                        min={0.5}
                        max={1.5}
                        step={0.1}
                        onValueChange={(value) => setPlaybackRate(value[0])}
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t.writing.speed.slow}</span>
                        <span>{t.writing.speed.normal}</span>
                        <span>{t.writing.speed.fast}</span>
                      </div>
                    </div>
                  </div>
                )}
                <input
                  type="hidden"
                  name="originalText"
                  value={generationState?.dictationText || ''}
                />
                <input type="hidden" name="language" value="English" />
                <FormField
                  control={form.control}
                  name="userText"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder={t.writing.yourTranscription.placeholder}
                          className="min-h-[200px]"
                          {...field}
                          disabled={!generationState?.dictationText}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
              <CardFooter className="flex-col gap-2">
                <AnalyzeButton />
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full"
                  onClick={handleReset}
                >
                  <RotateCcw className="mr-2" />
                  {t.writing.startOverButton}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{t.writing.analysis.title}</CardTitle>
          <CardDescription>{t.writing.analysis.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-6">
          {isAnalysisPending ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <LoaderCircle className="w-12 h-12 animate-spin" />
              <p>{t.writing.analysis.loading}</p>
            </div>
          ) : analysisState?.analysis ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-base"
              dangerouslySetInnerHTML={{ __html: analysisState.analysis }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <Mic className="w-12 h-12" />
              <p className="max-w-xs">{t.writing.analysis.emptyState}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
