import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
  fullHeight?: boolean;
}

export function AuthenticatedLayout({ children, fullHeight = false }: AuthenticatedLayoutProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Skeleton className="h-8 w-48" />
      </div>
    );
  }

  if (!user) {
    window.location.href = "/login";
    return null;
  }

  if (!user.onboardingCompleted) {
    window.location.href = "/onboarding";
    return null;
  }

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className={`flex ${fullHeight ? "h-screen" : "min-h-screen"} w-full`}>
        <AppSidebar />
        <div className="flex flex-col flex-1 min-w-0">
          <header className="sticky top-0 z-50 flex items-center gap-2 border-b border-border bg-background/80 backdrop-blur-md h-12 px-3 shrink-0">
            <SidebarTrigger data-testid="button-sidebar-toggle" />
          </header>
          <main className={`flex-1 ${fullHeight ? "overflow-hidden" : "overflow-auto"}`}>
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
