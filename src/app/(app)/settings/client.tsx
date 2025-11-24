
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useLanguage } from '@/context/language-context';

export default function SettingsClient() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.languageLevel.title}</CardTitle>
          <CardDescription>
            {t.settings.languageLevel.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm">
            <Select defaultValue="intermediate">
              <SelectTrigger>
                <SelectValue
                  placeholder={t.settings.languageLevel.placeholder}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">
                  {t.settings.languageLevel.levels.beginner}
                </SelectItem>
                <SelectItem value="intermediate">
                  {t.settings.languageLevel.levels.intermediate}
                </SelectItem>
                <SelectItem value="advanced">
                  {t.settings.languageLevel.levels.advanced}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
