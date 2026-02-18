import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Scale, User, Building2, Briefcase, ArrowRight, ArrowLeft } from "lucide-react";

type Role = "adwokat" | "radca_prawny" | "klient" | "firma";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", phone: "", pesel: "",
    address: "", city: "", postalCode: "",
    companyName: "", nip: "", barNumber: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async () => {
      const body: any = {
        role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone || undefined,
      };

      if (role === "adwokat" || role === "radca_prawny") {
        body.barNumber = formData.barNumber || undefined;
        body.lawyerType = role;
      }
      if (role === "klient") {
        body.pesel = formData.pesel || undefined;
        body.address = formData.address || undefined;
        body.city = formData.city || undefined;
        body.postalCode = formData.postalCode || undefined;
      }
      if (role === "firma") {
        body.companyName = formData.companyName || undefined;
        body.nip = formData.nip || undefined;
        body.address = formData.address || undefined;
        body.city = formData.city || undefined;
        body.postalCode = formData.postalCode || undefined;
      }

      await apiRequest("POST", "/api/onboarding", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Profil uzupelniony" });
    },
    onError: (error: any) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const roleCards: { value: Role; icon: React.ReactNode; label: string; desc: string }[] = [
    { value: "adwokat", icon: <Scale className="h-6 w-6" />, label: "Adwokat", desc: "Prowadze kancelarie adwokacka" },
    { value: "radca_prawny", icon: <Briefcase className="h-6 w-6" />, label: "Radca prawny", desc: "Jestem radca prawnym" },
    { value: "klient", icon: <User className="h-6 w-6" />, label: "Klient indywidualny", desc: "Szukam pomocy prawnej" },
    { value: "firma", icon: <Building2 className="h-6 w-6" />, label: "Firma", desc: "Rejestruje konto firmowe" },
  ];

  const canProceed = () => {
    if (step === 1) return !!role;
    if (step === 2) return formData.firstName.trim().length >= 2 && formData.lastName.trim().length >= 2;
    return true;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold tracking-tight">
            Lex<span className="text-primary">Vault</span>
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className={`h-1.5 rounded-md transition-all ${s === step ? "w-12 bg-primary" : s < step ? "w-8 bg-primary/50" : "w-8 bg-muted"}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-center mb-2" data-testid="text-onboarding-title">Kim jestes?</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Wybierz typ konta</p>
            <div className="grid grid-cols-2 gap-3">
              {roleCards.map((r) => (
                <Card
                  key={r.value}
                  className={`cursor-pointer transition-colors ${role === r.value ? "border-primary bg-primary/5" : "hover-elevate"}`}
                  onClick={() => setRole(r.value)}
                  data-testid={`card-role-${r.value}`}
                >
                  <CardContent className="p-4 text-center">
                    <div className={`inline-flex items-center justify-center w-10 h-10 rounded-md mb-2 ${role === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                      {r.icon}
                    </div>
                    <p className="text-sm font-medium">{r.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{r.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-center mb-2">Dane podstawowe</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Podaj swoje dane</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="firstName">Imie *</Label>
                <Input id="firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Jan" data-testid="input-first-name" />
              </div>
              <div>
                <Label htmlFor="lastName">Nazwisko *</Label>
                <Input id="lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Kowalski" data-testid="input-last-name" />
              </div>
              <div>
                <Label htmlFor="phone">Telefon</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+48 123 456 789" data-testid="input-phone" />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-center mb-2">
              {role === "adwokat" || role === "radca_prawny" ? "Dane zawodowe" : role === "firma" ? "Dane firmy" : "Dane dodatkowe"}
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Uzupelnij informacje</p>
            <div className="space-y-4">
              {(role === "adwokat" || role === "radca_prawny") && (
                <div>
                  <Label htmlFor="barNumber">Numer wpisu na liste {role === "adwokat" ? "adwokatow" : "radcow prawnych"}</Label>
                  <Input id="barNumber" value={formData.barNumber} onChange={(e) => updateField("barNumber", e.target.value)} placeholder="np. KAT/Adw/1234" data-testid="input-bar-number" />
                </div>
              )}
              {role === "firma" && (
                <>
                  <div>
                    <Label htmlFor="companyName">Nazwa firmy</Label>
                    <Input id="companyName" value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder="Kancelaria Prawna Sp. z o.o." data-testid="input-company-name" />
                  </div>
                  <div>
                    <Label htmlFor="nip">NIP</Label>
                    <Input id="nip" value={formData.nip} onChange={(e) => updateField("nip", e.target.value)} placeholder="1234567890" data-testid="input-nip" />
                  </div>
                </>
              )}
              {(role === "klient" || role === "firma") && (
                <div>
                  <Label htmlFor="pesel">{role === "firma" ? "PESEL reprezentanta" : "PESEL"}</Label>
                  <Input id="pesel" value={formData.pesel} onChange={(e) => updateField("pesel", e.target.value)} placeholder="12345678901" data-testid="input-pesel" />
                </div>
              )}
              <div>
                <Label htmlFor="address">Adres</Label>
                <Input id="address" value={formData.address} onChange={(e) => updateField("address", e.target.value)} placeholder="ul. Przykladowa 1/2" data-testid="input-address" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="postalCode">Kod pocztowy</Label>
                  <Input id="postalCode" value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="00-000" data-testid="input-postal-code" />
                </div>
                <div>
                  <Label htmlFor="city">Miasto</Label>
                  <Input id="city" value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Katowice" data-testid="input-city" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8 gap-3">
          {step > 1 ? (
            <Button variant="outline" onClick={() => setStep(step - 1)} data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Wstecz
            </Button>
          ) : <div />}
          {step < 3 ? (
            <Button onClick={() => setStep(step + 1)} disabled={!canProceed()} data-testid="button-next">
              Dalej
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={() => submitMutation.mutate()} disabled={submitMutation.isPending || !canProceed()} data-testid="button-submit">
              {submitMutation.isPending ? "Zapisywanie..." : "Zakoncz rejestracje"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
