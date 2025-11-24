'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Settings } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

export function SettingsLink() {
  const pathname = usePathname();
  const { getTranslations } = useLanguage();
  const t = getTranslations();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === '/settings'}
          tooltip={t.navigation.settings}
        >
          <Link href="/settings">
            <Settings />
            <span>{t.navigation.settings}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
