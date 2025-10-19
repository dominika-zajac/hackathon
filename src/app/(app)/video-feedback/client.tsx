'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Upload, Wand2 } from 'lucide-react';
import React, { useActionState, useMemo } from 'react';
import { useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getFeedback, type State } from './actions';
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
import { RatingDialog } from '@/components/ui/rating-dialog';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const videoFeedbackSchema = z.object({
  media: z.any().refine((file) => file, 'A video or audio file is required.'),
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
  const [state, formAction] = useActionState<State, FormData>(getFeedback, null);
  const { toast } = useToast();

  const [isRatingDialogOpen, setRatingDialogOpen] = React.useState(false);

  const showSummary = useMemo(() => {
    return !!state?.summary;
  }, [state?.summary]);
  
  const form = useForm<VideoFeedbackFormValues>({
    resolver: zodResolver(videoFeedbackSchema),
    defaultValues: {
      media: undefined,
      feedbackRequest: '',
    },
  });

  const fileInputRef = form.register('media');

  React.useEffect(() => {
    if (state?.error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.error,
      });
    }
  }, [state, toast]);

  const handleFeedbackSubmit = () => {
    // Handle feedback submission logic here
    console.log('Feedback submitted');
    setRatingDialogOpen(false);
    toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
    });
    form.reset();
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Refine Your Content</CardTitle>
          <CardDescription>
            Upload a video or audio file and tell our AI what you&apos;d like
            feedback on.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            action={formAction}
            className="space-y-4"
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
                          className="pl-10"
                          ref={fileInputRef.ref}
                          name={fileInputRef.name}
                          onBlur={fileInputRef.onBlur}
                          onChange={(e) => {
                            if (e.target.files) {
                              field.onChange(e.target.files[0]);
                            }
                          }}
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Upload a video or audio file for analysis.
                    </FormDescription>
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
          'flex flex-col ' +
          (!showSummary && !state?.error
            ? 'justify-center items-center'
            : '')
        }
      >
        <CardHeader>
          <CardTitle>AI Summary</CardTitle>
          <CardDescription>
            Here are the key points from our AI analysis.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          {showSummary && state?.summary ? (
            <div className="space-y-4 text-sm" dangerouslySetInnerHTML={{ __html: state.summary }}>
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
        {showSummary && state?.summary && (
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setRatingDialogOpen(true)}
            >
              Rate
            </Button>
          </CardFooter>
        )}
      </Card>
      <RatingDialog
        open={isRatingDialogOpen}
        onOpenChange={setRatingDialogOpen}
        onSubmit={handleFeedbackSubmit}
      />
    </div>
  );
}
