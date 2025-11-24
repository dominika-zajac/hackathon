
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
import { languages } from '@/lib/languages';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check, Sun, Moon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { useSettings } from '@/context/settings-context';

export default function SettingsClient() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();
  const { theme, setTheme } = useTheme();
  const {
    studyLanguage,
    setStudyLanguage,
    languageLevel,
    setLanguageLevel,
  } = useSettings();

  const [open, setOpen] = useState(false);

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.theme.title}</CardTitle>
          <CardDescription>{t.settings.theme.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <Button
              variant={theme === 'light' ? 'default' : 'outline'}
              onClick={() => setTheme('light')}
              className="flex items-center gap-2"
            >
              <Sun className="w-5 h-5" />
              {t.settings.theme.light}
            </Button>
            <Button
              variant={theme === 'dark' ? 'default' : 'outline'}
              onClick={() => setTheme('dark')}
              className="flex items-center gap-2"
            >
              <Moon className="w-5 h-5" />
              {t.settings.theme.dark}
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.languageLevel.title}</CardTitle>
          <CardDescription>
            {t.settings.languageLevel.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm">
            <Select
              value={languageLevel}
              onValueChange={(value) =>
                setLanguageLevel(value as 'beginner' | 'intermediate' | 'advanced')
              }
            >
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
      <Card>
        <CardHeader>
          <CardTitle>{t.settings.studyLanguage.title}</CardTitle>
          <CardDescription>
            {t.settings.studyLanguage.description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full max-w-sm">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-full justify-between"
                >
                  {studyLanguage
                    ? languages.find(
                        (language) => language.value === studyLanguage
                      )?.label
                    : t.settings.studyLanguage.placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                  <CommandInput
                    placeholder={t.settings.studyLanguage.searchPlaceholder}
                  />
                  <CommandEmpty>
                    {t.settings.studyLanguage.notFound}
                  </CommandEmpty>
                  <CommandList>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          key={language.value}
                          value={language.value}
                          onSelect={(currentValue) => {
                            setStudyLanguage(
                              currentValue === studyLanguage ? '' : currentValue
                            );
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              studyLanguage === language.value
                                ? 'opacity-100'
                                : 'opacity-0'
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
