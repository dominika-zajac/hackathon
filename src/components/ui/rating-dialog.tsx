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
            Rate the Summary
          </DialogTitle>
          <DialogDescription className="text-center">
            Let us know how you found the AI-generated summary.
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
              Add a comment (optional)
            </label>
            <Textarea
              id="comment"
              placeholder="What did you like? What could be improved?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="mt-2"
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
              rating > 0
                ? 'bg-blue-300 hover:bg-blue-400'
                : 'bg-gray-300'
            )}
          >
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
