import { LanguageSwitcher } from '@/components/language-switcher';
import { Logo } from '@/components/logo';
import { MainNav } from '@/components/main-nav';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarProvider,
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
