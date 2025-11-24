'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BookOpen,
  PenSquare,
  Video,
  Calendar,
  Phone,
  BookCopy,
} from 'lucide-react';
import { useLanguage } from '@/context/language-context';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItemsConfig = [
  { href: '/video-feedback', translationKey: 'videoFeedback', icon: Video },
  { href: '/writing', translationKey: 'writing', icon: PenSquare },
  { href: '/reading', translationKey: 'reading', icon: BookOpen },
  { href: '/schedule', translationKey: 'schedule', icon: Calendar },
  { href: '/call-practice', translationKey: 'callPractice', icon: Phone },
  { href: '#', translationKey: 'lessons', icon: BookCopy },
];

export function MainNav() {
  const pathname = usePathname();
  const { getTranslations } = useLanguage();
  const t = getTranslations();

  const navItems = navItemsConfig.map((item) => ({
    ...item,
    label: t.navigation[item.translationKey as keyof typeof t.navigation],
  }));

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={pathname === item.href}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
