'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Pilcrow } from 'lucide-react';
import React from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { adaptTone, type State } from './actions';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

const writingSchema = z.object({
  text: z.string().min(20, 'Please enter at least 20 characters to adapt.'),
  desiredTone: z.string({ required_error: 'Please select a tone.' }),
});

type WritingFormValues = z.infer<typeof writingSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="mr-2 animate-spin" />}
      Adapt Tone
    </Button>
  );
}

export default function WritingClient() {
  const [state, formAction] = useFormState<State, FormData>(adaptTone, null);
  const { toast } = useToast();
  const formRef = React.useRef<HTMLFormElement>(null);

  const form = useForm<WritingFormValues>({
    resolver: zodResolver(writingSchema),
    defaultValues: {
      text: '',
      desiredTone: undefined,
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
          <CardTitle>Adapt Your Tone</CardTitle>
          <CardDescription>
            Enter your text and choose a desired tone. Our AI will adapt it for
            you.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form
            ref={formRef}
            action={formAction}
            onSubmit={form.handleSubmit(() => {
              const formData = new FormData(formRef.current!);
              formAction(formData);
            })}
            className="space-y-4"
          >
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Original Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your text here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="desiredTone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Desired Tone</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a tone" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="more formal">Formal</SelectItem>
                        <SelectItem value="more persuasive">
                          Persuasive
                        </SelectItem>
                        <SelectItem value="more friendly">Friendly</SelectItem>
                        <SelectItem value="more confident">
                          Confident
                        </SelectItem>
                        <SelectItem value="more empathetic">
                          Empathetic
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the tone you want to convey.
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
          <CardTitle>AI Suggestions</CardTitle>
          <CardDescription>
            Here is the adapted text and an explanation of the changes.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-6">
          {state?.adaptedText ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground">Adapted Text</h3>
                <p className="mt-2 text-sm text-muted-foreground bg-secondary p-4 rounded-md">
                  {state.adaptedText}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground">Explanation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {state.explanation}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <Pilcrow className="w-12 h-12" />
              <p className="max-w-xs">
                Your adapted text will appear here.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
