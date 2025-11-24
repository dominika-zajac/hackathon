
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
import { ChevronsUpDown, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function SettingsClient() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('en');

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
                  {value
                    ? languages.find((language) => language.value === value)
                        ?.label
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
                            setValue(currentValue === value ? '' : currentValue);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              value === language.value
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
