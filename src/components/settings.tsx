
'use client';

import { Settings as SettingsIcon } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function Settings() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <SettingsIcon className="h-5 w-5 text-sidebar-foreground" />
        <span className="text-sm font-medium text-sidebar-foreground">
          {t.settings.title}
        </span>
      </div>
      <Select defaultValue="intermediate">
        <SelectTrigger className="w-full bg-sidebar-accent border-sidebar-border text-sidebar-accent-foreground">
          <SelectValue placeholder={t.settings.languageLevel.placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="beginner">{t.settings.languageLevel.levels.beginner}</SelectItem>
          <SelectItem value="intermediate">{t.settings.languageLevel.levels.intermediate}</SelectItem>
          <SelectItem value="advanced">{t.settings.languageLevel.levels.advanced}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
