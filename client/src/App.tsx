import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthenticatedLayout } from "@/components/authenticated-layout";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import CaseDetail from "@/pages/case-detail";
import Chat from "@/pages/chat";
import Admin from "@/pages/admin";
import Onboarding from "@/pages/onboarding";
import VerifyEmail from "@/pages/verify-email";
import ProfileSettings from "@/pages/profile-settings";
import CalendarPage from "@/pages/calendar";
import Contact from "@/pages/contact";
import Terms from "@/pages/terms";
import Privacy from "@/pages/privacy";
import Confidentiality from "@/pages/confidentiality";
import Login from "@/pages/login";
import NotFound from "@/pages/not-found";

function ProtectedPage({ component: Component }: { component: React.ComponentType }) {
  return (
    <AuthenticatedLayout>
      <Component />
    </AuthenticatedLayout>
  );
}

function ProtectedFullHeight({ component: Component }: { component: React.ComponentType }) {
  return (
    <AuthenticatedLayout fullHeight>
      <Component />
    </AuthenticatedLayout>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/confidentiality" component={Confidentiality} />
      <Route path="/dashboard">{() => <ProtectedPage component={Dashboard} />}</Route>
      <Route path="/case/:id">{(params) => <AuthenticatedLayout><CaseDetail /></AuthenticatedLayout>}</Route>
      <Route path="/chat">{() => <ProtectedFullHeight component={Chat} />}</Route>
      <Route path="/admin">{() => <ProtectedPage component={Admin} />}</Route>
      <Route path="/profile">{() => <ProtectedPage component={ProfileSettings} />}</Route>
      <Route path="/calendar">{() => <ProtectedPage component={CalendarPage} />}</Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
