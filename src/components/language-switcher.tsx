'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/context/language-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const languages = [
  {
    code: 'en',
    name: 'English',
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 60 30"
        width="32"
        height="16"
      >
        <clipPath id="s">
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
        <clipPath id="t">
          <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
        </clipPath>
        <g clip-path="url(#s)">
          <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
          <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" stroke-width="6" />
          <path
            d="M0,0 L60,30 M60,0 L0,30"
            clip-path="url(#t)"
            stroke="#C8102E"
            stroke-width="4"
          />
          <path d="M30,0 v30 M0,15 h60" stroke="#fff" stroke-width="10" />
          <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6" />
        </g>
      </svg>
    ),
  },
  {
    code: 'pl',
    name: 'Polish',
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 640 480"
        width="32"
        height="16"
      >
        <g fill-rule="evenodd" stroke-width="1.25">
          <path fill="#fff" d="M640 480H0V0h640z" />
          <path fill="#dc143c" d="M640 480H0V240h640z" />
        </g>
      </svg>
    ),
  },
  {
    code: 'ua',
    name: 'Ukrainian',
    flag: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 600 400"
        width="32"
        height="16"
      >
        <path fill="#005BBB" d="M0 0h600v200H0z" />
        <path fill="#FFD500" d="M0 200h600v200H0z" />
      </svg>
    ),
  },
];

export function LanguageSwitcher() {
  const { language, setLanguage, getTranslations } = useLanguage();
  const t = getTranslations();
  const selectedLanguage =
    languages.find((lang) => lang.code === language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    if (langCode !== selectedLanguage.code) {
      setLanguage(langCode as 'en' | 'pl' | 'ua');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          {selectedLanguage.flag}
          <span className="hidden sm:inline">{t.languages[selectedLanguage.code as 'en' | 'pl' | 'ua']}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              'flex items-center gap-2',
              selectedLanguage.code === lang.code && 'bg-accent'
            )}
          >
            {lang.flag}
            <span>{t.languages[lang.code as 'en' | 'pl' | 'ua']}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
