
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircle, Pilcrow } from 'lucide-react';
import React, { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
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
import { useLanguage } from '@/context/language-context';
import { useToast } from '@/hooks/use-toast';

const writingSchema = z.object({
  text: z.string().min(20, 'Please enter at least 20 characters to adapt.'),
  desiredTone: z.string({ required_error: 'Please select a tone.' }),
});

type WritingFormValues = z.infer<typeof writingSchema>;

function SubmitButton() {
  const { pending } = useFormStatus();
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <LoaderCircle className="mr-2 animate-spin" />}
      {t.writing.adaptToneButton}
    </Button>
  );
}

export default function WritingClient() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  const [state, formAction] = useActionState<State, FormData>(adaptTone, null);
  const { toast } = useToast();

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
          <CardTitle>{t.writing.adaptTone.title}</CardTitle>
          <CardDescription>{t.writing.adaptTone.description}</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form action={formAction} className="space-y-4">
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t.writing.originalText.label}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={t.writing.originalText.placeholder}
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
                    <FormLabel>{t.writing.desiredTone.label}</FormLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={t.writing.desiredTone.placeholder}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="more formal">
                          {t.writing.desiredTone.tones.formal}
                        </SelectItem>
                        <SelectItem value="more persuasive">
                          {t.writing.desiredTone.tones.persuasive}
                        </SelectItem>
                        <SelectItem value="more friendly">
                          {t.writing.desiredTone.tones.friendly}
                        </SelectItem>
                        <SelectItem value="more confident">
                          {t.writing.desiredTone.tones.confident}
                        </SelectItem>
                        <SelectItem value="more empathetic">
                          {t.writing.desiredTone.tones.empathetic}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t.writing.desiredTone.description}
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
          <CardTitle>{t.writing.aiSuggestions.title}</CardTitle>
          <CardDescription>
            {t.writing.aiSuggestions.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 space-y-6">
          {state?.adaptedText ? (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-foreground">
                  {t.writing.aiSuggestions.adaptedText}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground bg-secondary p-4 rounded-md">
                  {state.adaptedText}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold text-foreground">
                  {t.writing.aiSuggestions.explanation}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {state.explanation}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center space-y-4 text-center text-muted-foreground">
              <Pilcrow className="w-12 h-12" />
              <p className="max-w-xs">{t.writing.aiSuggestions.emptyState}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
