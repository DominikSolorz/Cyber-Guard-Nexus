import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { Link } from "wouter";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Blad", description: "Podaj email i haslo", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest("POST", "/api/admin-login", { email, password });
      const data = await res.json();
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Zalogowano", description: "Witaj w LexVault!" });
      setLocation("/dashboard");
    } catch (error: any) {
      let msg = "Nieprawidlowy email lub haslo";
      try {
        const body = JSON.parse(error?.message?.replace(/^\d+:\s*/, "") || "{}");
        if (body.message) msg = body.message;
      } catch {}
      toast({ title: "Blad logowania", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 cursor-pointer mb-4" data-testid="link-login-home">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight">
                Lex<span className="text-primary">Vault</span>
              </span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold" data-testid="text-login-title">Logowanie</h1>
          <p className="text-muted-foreground text-sm mt-1">Zaloguj sie do swojego konta</p>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="twoj@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    autoComplete="email"
                    data-testid="input-login-email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Haslo</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Wpisz haslo"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    autoComplete="current-password"
                    data-testid="input-login-password"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
                data-testid="button-login-submit"
              >
                {isLoading ? "Logowanie..." : "Zaloguj sie"}
                {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">lub</span>
              </div>
            </div>

            <a href="/api/login" className="block">
              <Button variant="outline" className="w-full" data-testid="button-login-replit">
                Zaloguj sie przez Replit Auth
              </Button>
            </a>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Nie masz konta?{" "}
              <a href="/api/login" className="text-primary cursor-pointer" data-testid="link-register">
                Zarejestruj sie
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
