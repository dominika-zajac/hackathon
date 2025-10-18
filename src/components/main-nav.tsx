'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, PenSquare, Video } from 'lucide-react';

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';

const navItems = [
  { href: '/video-feedback', label: 'Video Feedback', icon: Video },
  { href: '/writing', label: 'Writing', icon: PenSquare },
  { href: '/reading', label: 'Reading', icon: BookOpen },
];

export function MainNav() {
  const pathname = usePathname();

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
