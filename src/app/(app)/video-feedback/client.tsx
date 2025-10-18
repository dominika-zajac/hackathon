'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Upload, Wand2 } from 'lucide-react';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

import { getFeedback, type State } from './actions';

const videoFeedbackSchema = z.object({
  media: z
    .custom<FileList>()
    .refine((files) => files?.length === 1, 'A video or audio file is required.')
    .refine(
      (files) =>
        files?.[0]?.type?.startsWith('video/') ||
        files?.[0]?.type?.startsWith('audio/'),
      'Only video or audio files are accepted.'
    ),
  feedbackRequest: z
    .string()
    .min(10, 'Please describe the feedback you want in at least 10 characters.'),
});

type VideoFeedbackFormValues = z.infer<typeof videoFeedbackSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="mr-2 animate-spin" />}
      Get Feedback
    </Button>
  );
}

export default function VideoFeedbackClient() {
  const [state, formAction] = useFormState<State, FormData>(getFeedback, null);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const form = useForm<VideoFeedbackFormValues>({
    resolver: zodResolver(videoFeedbackSchema),
    defaultValues: {
      media: undefined,
      feedbackRequest: '',
    },
  });

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
    if (state?.summary) {
      form.reset();
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [state, toast, form]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Refine Your Content</CardTitle>
          <CardDescription>
            Upload a video or audio file and tell our AI what you&apos;d like feedback on.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={form.handleSubmit(() => {
              const formData = new FormData(formRef.current!);
              formData.set('feedbackRequest', form.getValues('feedbackRequest'));
              formAction(formData);
            })}
          >
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="media"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Media File</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Upload className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                          type="file"
                          accept="video/*,audio/*"
                          ref={fileInputRef}
                          className="pl-10"
                          onChange={(e) => {
                            field.onChange(e.target.files);
                            if (formRef.current) {
                              const dataTransfer = new DataTransfer();
                              if (e.target.files && e.target.files.length > 0) {
                                dataTransfer.items.add(e.target.files[0]);
                              }
                              // To get file in server action, we need to create a new input
                              const newFile = formRef.current.querySelector('input[name="media"]');
                              if(newFile) {
                                (newFile as HTMLInputElement).files = dataTransfer.files;
                              } else {
                                const newInput = document.createElement('input');
                                newInput.type = 'file';
                                newInput.name = 'media';
                                newInput.files = dataTransfer.files;
                                newInput.style.display = 'none';
                                formRef.current.appendChild(newInput);
                              }
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="feedbackRequest"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Feedback Request</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Is my presentation clear and engaging?' or 'check the speak errors of user'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Be specific about the advice you&apos;re looking for.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <SubmitButton />
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card
        className={
          'flex flex-col ' + (!state?.summary && !state?.error ? 'justify-center items-center' : '')
        }
      >
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
          <CardDescription>
            Here are the key points from our AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {state?.summary ? (
            <div className="space-y-4 text-sm">
              <p>{state.summary}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <Wand2 className="w-12 h-12" />
              <p className="max-w-xs">
                Your feedback will appear here once you submit a file.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
