
'use client';

import { Star } from 'lucide-react';
import React, { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';

interface RatingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (rating: number, comment: string) => void;
}

export function RatingDialog({
  open,
  onOpenChange,
  onSubmit,
}: RatingDialogProps) {
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onSubmit(rating, comment);
    setRating(0);
    setComment('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-sky-50">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {t.ratingDialog.title}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t.ratingDialog.description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex justify-center mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-8 h-8 cursor-pointer',
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                )}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
          <div>
            <label
              htmlFor="comment"
              className="text-sm font-medium text-gray-700"
            >
              {t.ratingDialog.commentLabel}
            </label>
            <Textarea
              id="comment"
              placeholder={t.ratingDialog.commentPlaceholder}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2 bg-muted"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={rating === 0}
            className={cn(
              'w-full text-white',
              rating > 0 ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-300'
            )}
          >
            {t.ratingDialog.submitButton}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
