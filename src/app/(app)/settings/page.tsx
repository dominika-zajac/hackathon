'use client';
import { useLanguage } from '@/context/language-context';
import SettingsClient from './client';

export default function SettingsPage() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  return (
    <div className="ml-[30px] flex-1 space-y-8 p-4 pt-6 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">
          {t.settings.title}
        </h2>
      </div>
      <SettingsClient />
    </div>
  );
}
