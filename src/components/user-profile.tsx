
'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/context/language-context';

export function UserProfile() {
  const { getTranslations } = useLanguage();
  const t = getTranslations();

  return (
    <div className="flex items-center gap-3 cursor-pointer">
      <Avatar className="h-9 w-9">
        <AvatarImage src="https://picsum.photos/seed/user-avatar/40/40" />
        <AvatarFallback>U</AvatarFallback>
      </Avatar>
      <div className="flex flex-col text-sm">
        <span className="font-medium text-sidebar-foreground">
          {t.user.name}
        </span>
        <span className="text-muted-foreground">{t.user.email}</span>
      </div>
    </div>
  );
}
