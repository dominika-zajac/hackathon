import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import { SettingsLink } from '@/components/settings-link';
import { UserProfile } from '@/components/user-profile';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { LanguageProvider } from '@/context/language-context';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <SidebarProvider>
        <Sidebar style={{ '--sidebar-width': '18rem' } as React.CSSProperties}>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <MainNav />
          </SidebarContent>
          <SidebarFooter>
            <SettingsLink />
            <SidebarSeparator />
            <UserProfile />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <header className="flex justify-end p-4">
            <LanguageSwitcher />
          </header>
          <div className="animate-in fade-in-50 duration-500">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </LanguageProvider>
  );
}
