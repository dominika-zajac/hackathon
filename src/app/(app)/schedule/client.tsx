
'use client';

import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/language-context';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Check } from 'lucide-react';

type SavedPlans = Record<string, string>;

const LOCAL_STORAGE_KEY = 'lingate-schedule-plans';

export default function ScheduleClient() {
  const { getTranslations } = useLanguage();
  const t = getTranslations().schedule;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [plan, setPlan] = useState('');
  const [savedPlans, setSavedPlans] = useState<SavedPlans>({});
  const { toast } = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        setSavedPlans(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load plans from local storage', error);
    }
  }, []);

  const plannedDates = Object.keys(savedPlans)
    .filter((key) => savedPlans[key])
    .map((key) => new Date(key));

  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setPlan(savedPlans[formattedDate] || '');
    } else {
      setPlan('');
    }
  }, [date, savedPlans]);

  const handleSavePlan = () => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      let newSavedPlans;
      if (plan) {
        newSavedPlans = { ...savedPlans, [formattedDate]: plan };
        toast({
          title: t.planSaved.title,
          description: `${t.planSaved.description} ${format(date, 'PPP')}`,
        });
      } else {
        const { [formattedDate]: _, ...rest } = savedPlans;
        newSavedPlans = rest;
      }
      setSavedPlans(newSavedPlans);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSavedPlans));
      } catch (error) {
        console.error('Failed to save plans to local storage', error);
      }
    } else {
      toast({
        variant: 'destructive',
        title: t.planError.title,
        description: t.planError.description,
      });
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
            modifiers={{ planned: plannedDates }}
            modifiersClassNames={{
              planned: 'day-planned',
            }}
          />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>
            {t.planFor.title}{' '}
            <span className="text-primary">
              {date ? format(date, 'PPP') : t.planFor.noDateSelected}
            </span>
          </CardTitle>
          <CardDescription>{t.planFor.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder={t.planFor.placeholder}
            className="min-h-[200px]"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            disabled={!date}
          />
          <Button onClick={handleSavePlan} className="w-full" disabled={!date}>
            <Check className="mr-2" />
            {t.planFor.saveButton}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
