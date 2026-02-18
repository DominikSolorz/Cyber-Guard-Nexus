import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
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
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/case/:id" component={CaseDetail} />
      <Route path="/chat" component={Chat} />
      <Route path="/admin" component={Admin} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/profile" component={ProfileSettings} />
      <Route path="/calendar" component={CalendarPage} />
      <Route path="/contact" component={Contact} />
      <Route path="/terms" component={Terms} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/confidentiality" component={Confidentiality} />
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
