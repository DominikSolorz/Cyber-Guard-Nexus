import { useState, useEffect, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, RefreshCw, AlertTriangle, Clock } from "lucide-react";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const verifyMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/verify-email", { code });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Email zweryfikowany" });
      window.location.href = "/dashboard";
    },
    onError: (error: any) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  const resendMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/resend-verification");
    },
    onSuccess: () => {
      setResendCooldown(60);
      setCode("");
      toast({ title: "Kod wyslany ponownie", description: "Sprawdz skrzynke email. Nowy kod wazny 5 minut." });
    },
    onError: (error: any) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  const handleCodeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">
            Lex<span className="text-primary">Vault</span>
          </span>
        </div>

        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-semibold mb-2" data-testid="text-verify-title">Weryfikacja email</h2>
              <p className="text-sm text-muted-foreground">
                Wyslalismy 6-cyfrowy kod weryfikacyjny na Twoj adres email. Wpisz go ponizej, aby potwierdzic konto.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Input
                  value={code}
                  onChange={handleCodeChange}
                  placeholder="______"
                  maxLength={6}
                  className="text-center text-2xl tracking-[0.5em] font-mono"
                  autoComplete="one-time-code"
                  inputMode="numeric"
                  data-testid="input-verification-code"
                />
              </div>

              <Button
                className="w-full"
                onClick={() => verifyMutation.mutate()}
                disabled={code.length !== 6 || verifyMutation.isPending}
                data-testid="button-verify"
              >
                {verifyMutation.isPending ? "Weryfikacja..." : "Zweryfikuj"}
              </Button>

              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">Nie otrzymales kodu?</p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => resendMutation.mutate()}
                  disabled={resendMutation.isPending || resendCooldown > 0}
                  data-testid="button-resend"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  {resendCooldown > 0
                    ? `Wyslij ponownie (${resendCooldown}s)`
                    : resendMutation.isPending
                    ? "Wysylanie..."
                    : "Wyslij ponownie"}
                </Button>
              </div>

              <div className="bg-muted/50 rounded-md p-3 mt-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Kod jest wazny przez <strong>5 minut</strong>. Masz <strong>3 proby</strong> wpisania kodu &mdash; po przekroczeniu limitu weryfikacja zostanie zablokowana na 15 minut. Nigdy nie udostepniaj kodu innym osobom.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
