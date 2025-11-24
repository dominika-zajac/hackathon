
'use client';

import {
  LoaderCircle,
  Mic,
  MicOff,
  BookText,
  Wand2,
  RefreshCcw,
} from 'lucide-react';
import React, { useActionState, useEffect, useRef, useState } from 'react';
import { useFormStatus } from 'react-dom';

import {
  getAnalysis,
  getText,
  type AnalysisState,
  type GenerationState,
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
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSettings } from '@/context/settings-context';

function GenerateButton() {
  const { pending } = useFormStatus();
  const { getTranslations } = useLanguage();
  const t = getTranslations().reading;
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <LoaderCircle className="mr-2 animate-spin" />
      ) : (
        <RefreshCcw className="mr-2" />
      )}
      {t.generateButton}
    </Button>
  );
}

export default function ReadingClient() {
  const { language, getTranslations } = useLanguage();
  const { studyLanguage, languageLevel } = useSettings();
  const t = getTranslations().reading;
  const { toast } = useToast();

  const [generationState, generationAction, isGenerationPending] =
    useActionState<GenerationState, FormData>(getText, null);
  const [analysisState, analysisAction, isAnalysisPending] =
    useActionState<AnalysisState, FormData>(getAnalysis, null);

  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        chunks.push(event.data);
      };
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };
      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast({
        variant: 'destructive',
        title: 'Recording Error',
        description:
          'Could not start recording. Please check microphone permissions.',
      });
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      // Stop all media tracks to turn off the microphone light
      mediaRecorderRef.current.stream
        .getTracks()
        .forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  useEffect(() => {
    if (audioBlob) {
      const formData = new FormData();
      formData.append('media', audioBlob, 'recording.webm');
      formData.append('language', language);
      analysisAction(formData);
      setAudioBlob(null);
    }
  }, [audioBlob, analysisAction, language]);

  useEffect(() => {
    if (generationState?.error) {
      toast({
        variant: 'destructive',
        title: 'Generation Error',
        description: generationState.error,
      });
    }
  }, [generationState, toast]);

  useEffect(() => {
    if (analysisState?.error) {
      toast({
        variant: 'destructive',
        title: 'Analysis Error',
        description: analysisState.error,
      });
    }
  }, [analysisState, toast]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t.practice.title}</CardTitle>
          <CardDescription>{t.practice.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Card className="min-h-[200px] p-4 bg-muted/50">
            {isGenerationPending ? (
              <div className="flex items-center justify-center h-full">
                <LoaderCircle className="animate-spin text-primary" />
              </div>
            ) : generationState?.text ? (
              <p className="text-base leading-relaxed">{generationState.text}</p>
            ) : (
              <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
                <BookText className="w-12 h-12" />
                <p>{t.practice.emptyState}</p>
              </div>
            )}
          </Card>
          {!isRecording ? (
            <Button
              onClick={handleStartRecording}
              disabled={
                !generationState?.text || isRecording || isAnalysisPending
              }
              className="w-full"
            >
              <Mic className="mr-2" />
              {t.practice.startRecording}
            </Button>
          ) : (
            <Button
              onClick={handleStopRecording}
              variant="destructive"
              className="w-full"
            >
              <MicOff className="mr-2" />
              {t.practice.stopRecording}
            </Button>
          )}
          {isRecording && (
            <Alert variant="destructive" className="animate-pulse">
              <Mic className="h-4 w-4" />
              <AlertTitle>{t.practice.recordingInProgress.title}</AlertTitle>
              <AlertDescription>
                {t.practice.recordingInProgress.description}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <form action={generationAction} className="w-full">
            <input type="hidden" name="language" value={studyLanguage} />
            <input type="hidden" name="level" value={languageLevel} />
            <GenerateButton />
          </form>
        </CardFooter>
      </Card>

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>{t.analysis.title}</CardTitle>
          <CardDescription>{t.analysis.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-6">
          {isAnalysisPending ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
              <p>{t.analysis.loading}</p>
            </div>
          ) : analysisState?.summary ? (
            <div
              className="prose prose-sm dark:prose-invert max-w-none space-y-4 text-base"
              dangerouslySetInnerHTML={{ __html: analysisState.summary }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <Wand2 className="w-12 h-12" />
              <p className="max-w-xs">{t.analysis.emptyState}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
