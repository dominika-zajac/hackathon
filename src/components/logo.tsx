import { Layers3 } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <Layers3 className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold tracking-tight font-headline">Echo</h1>
    </div>
  );
}
