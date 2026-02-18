import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  MessageSquare,
  Calendar,
  Settings,
  Users,
  LogOut,
  Shield,
  Scale,
} from "lucide-react";

function getRoleLabel(role: string | null | undefined): string {
  switch (role) {
    case "adwokat": return "Adwokat";
    case "radca_prawny": return "Radca prawny";
    case "firma": return "Firma";
    case "klient": return "Klient";
    default: return "";
  }
}

export function AppSidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  if (!user) return null;

  const navItems = [
    { title: "Panel glowny", url: "/dashboard", icon: LayoutDashboard, testId: "nav-dashboard" },
    { title: "Czat AI", url: "/chat", icon: MessageSquare, testId: "nav-chat" },
    { title: "Kalendarz", url: "/calendar", icon: Calendar, testId: "nav-calendar" },
    { title: "Profil", url: "/profile", icon: Settings, testId: "nav-profile" },
  ];

  if (user.isAdmin) {
    navItems.push({ title: "Administracja", url: "/admin", icon: Users, testId: "nav-admin" });
  }

  const initials = `${(user.firstName || "").charAt(0)}${(user.lastName || "").charAt(0)}`.toUpperCase() || "U";

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/dashboard">
          <div className="flex items-center gap-2 cursor-pointer" data-testid="sidebar-logo">
            <Shield className="h-7 w-7 text-primary shrink-0" />
            <span className="font-bold text-lg tracking-tight">
              Lex<span className="text-primary">Vault</span>
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location === item.url || (item.url === "/dashboard" && location.startsWith("/case/"));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      data-testid={item.testId}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-3">
        <div className="flex items-center gap-3 px-1 mb-2">
          <Avatar className="h-8 w-8 shrink-0">
            <AvatarImage src={user.profileImageUrl || undefined} />
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="sidebar-user-name">
              {user.firstName} {user.lastName}
            </p>
            <Badge variant="secondary" className="text-[10px]" data-testid="sidebar-user-role">
              {getRoleLabel(user.role)}
            </Badge>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start"
          onClick={() => logout()}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Wyloguj sie
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
