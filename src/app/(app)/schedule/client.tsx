
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

export default function ScheduleClient() {
  const { getTranslations } = useLanguage();
  const t = getTranslations().schedule;
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [plan, setPlan] = useState('');
  const [savedPlans, setSavedPlans] = useState<SavedPlans>({});
  const { toast } = useToast();

  useEffect(() => {
    if (date) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setPlan(savedPlans[formattedDate] || '');
    }
  }, [date, savedPlans]);

  const handleSavePlan = () => {
    if (date && plan) {
      const formattedDate = format(date, 'yyyy-MM-dd');
      setSavedPlans((prev) => ({ ...prev, [formattedDate]: plan }));
      toast({
        title: t.planSaved.title,
        description: `${t.planSaved.description} ${format(date, 'PPP')}`,
      });
    } else {
      toast({
        variant: 'destructive',
        title: t.planError.title,
        description: t.planError.description,
      });
    }
  };

  const DayWithDot = ({
    displayMonth,
    date,
  }: {
    displayMonth: Date;
    date: Date;
  }) => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    const hasPlan = !!savedPlans[formattedDate];
    return (
      <div className="relative">
        {date.getDate()}
        {hasPlan && (
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-primary rounded-full"></div>
        )}
      </div>
    );
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
            components={{
              DayContent: DayWithDot,
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
          />
          <Button onClick={handleSavePlan} className="w-full">
            <Check className="mr-2" />
            {t.planFor.saveButton}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
