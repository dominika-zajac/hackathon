'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Library, LoaderCircle } from 'lucide-react';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { getSuggestions, type State } from './actions';
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const readingSchema = z.object({
  userActivity: z
    .string()
    .min(10, 'Please describe your activity in at least 10 characters.'),
  readingHistory: z
    .string()
    .min(10, 'Please describe your history in at least 10 characters.'),
});

type ReadingFormValues = z.infer<typeof readingSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="mr-2 animate-spin" />}
      Get Suggestions
    </Button>
  );
}

export default function ReadingClient() {
  const [state, formAction] = useFormState<State, FormData>(
    getSuggestions,
    null
  );
  const { toast } = useToast();

  const form = useForm<ReadingFormValues>({
    resolver: zodResolver(readingSchema),
    defaultValues: {
      userActivity: '',
      readingHistory: '',
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
  }, [state, toast]);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Personalize Your Reading</CardTitle>
          <CardDescription>
            Tell us about your current activity and past reads to get tailored
            suggestions.
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
                name="userActivity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Current Activity</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'Researching modern web development techniques...'"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      What are you currently focused on or learning about?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="readingHistory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reading History & Preferences</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'I enjoy articles on AI, design systems, and serverless architecture.'"
                        {...field}
                      />
FormControl>
                    <FormDescription>
                      What topics or authors have you enjoyed in the past?
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

      <Card className="flex flex-col">
        <CardHeader>
          <CardTitle>Suggested For You</CardTitle>
          <CardDescription>
            Based on your input, here are some reads you might enjoy.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-6">
          {state?.suggestions ? (
            <div>
              <ul className="space-y-3">
                {state.suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 text-sm rounded-md bg-secondary"
                  >
                    <BookOpen className="w-4 h-4 mt-1 shrink-0 text-primary" />
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
              {state.reasoning && (
                <div className="p-4 mt-6 text-sm border-l-4 rounded-r-md bg-secondary border-primary">
                  <p className="font-semibold">Reasoning</p>
                  <p className="mt-1 text-muted-foreground">{state.reasoning}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <Library className="w-12 h-12" />
              <p className="max-w-xs">
                Your personalized reading list will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
