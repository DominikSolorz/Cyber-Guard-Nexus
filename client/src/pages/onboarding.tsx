import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Scale, User, Building2, Briefcase, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { VOIVODESHIP_LABELS, validateNIP, validatePESEL } from "@shared/schema";

type Role = "adwokat" | "radca_prawny" | "klient" | "firma";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    street: "", city: "", postalCode: "", voivodeship: "", country: "Polska",
    pesel: "", companyName: "", nip: "", barNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitMutation = useMutation({
    mutationFn: async () => {
      const body: any = {
        role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        voivodeship: formData.voivodeship,
        country: formData.country || "Polska",
      };

      if (role === "adwokat" || role === "radca_prawny") {
        body.barNumber = formData.barNumber || undefined;
        body.lawyerType = role;
        body.nip = formData.nip || undefined;
      }
      if (role === "klient") {
        body.pesel = formData.pesel || undefined;
      }
      if (role === "firma") {
        body.companyName = formData.companyName || undefined;
        body.nip = formData.nip || undefined;
        body.pesel = formData.pesel || undefined;
      }

      await apiRequest("POST", "/api/onboarding", body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Profil uzupelniony", description: "Kod weryfikacyjny wyslany na email" });
      window.location.href = "/verify-email";
    },
    onError: (error: any) => {
      toast({ title: "Blad", description: error.message, variant: "destructive" });
    },
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const roleCards: { value: Role; icon: React.ReactNode; label: string; desc: string }[] = [
    { value: "adwokat", icon: <Scale className="h-6 w-6" />, label: "Adwokat", desc: "Prowadze kancelarie adwokacka" },
    { value: "radca_prawny", icon: <Briefcase className="h-6 w-6" />, label: "Radca prawny", desc: "Jestem radca prawnym" },
    { value: "klient", icon: <User className="h-6 w-6" />, label: "Klient indywidualny", desc: "Szukam pomocy prawnej" },
    { value: "firma", icon: <Building2 className="h-6 w-6" />, label: "Firma", desc: "Rejestruje konto firmowe" },
  ];

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.firstName.trim().length < 2) newErrors.firstName = "Minimum 2 znaki";
    if (formData.lastName.trim().length < 2) newErrors.lastName = "Minimum 2 znaki";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Nieprawidlowy email";
    if (formData.phone.replace(/[\s-+]/g, "").length < 9) newErrors.phone = "Minimum 9 cyfr";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.street.trim().length < 3) newErrors.street = "Minimum 3 znaki";
    if (formData.city.trim().length < 2) newErrors.city = "Minimum 2 znaki";
    if (!/^\d{2}-\d{3}$/.test(formData.postalCode)) newErrors.postalCode = "Format: XX-XXX";
    if (!formData.voivodeship) newErrors.voivodeship = "Wymagane";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = () => {
    const newErrors: Record<string, string> = {};
    if ((role === "adwokat" || role === "radca_prawny" || role === "firma") && formData.nip) {
      if (!validateNIP(formData.nip)) newErrors.nip = "Nieprawidlowy NIP (algorytm kontrolny)";
    }
    if ((role === "klient" || role === "firma") && formData.pesel) {
      if (!validatePESEL(formData.pesel)) newErrors.pesel = "Nieprawidlowy PESEL (algorytm kontrolny)";
    }
    if (role === "firma" && !formData.companyName?.trim()) newErrors.companyName = "Nazwa firmy wymagana";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 2 && !validateStep2()) return;
    if (step === 3 && !validateStep3()) return;
    setStep(step + 1);
  };

  const handleSubmit = () => {
    if (!validateStep4()) return;
    submitMutation.mutate();
  };

  const totalSteps = 4;

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
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-md transition-all ${i + 1 === step ? "w-12 bg-primary" : i + 1 < step ? "w-8 bg-primary/50" : "w-8 bg-muted"}`} />
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
            <p className="text-sm text-muted-foreground text-center mb-6">Podaj swoje dane kontaktowe</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="firstName">Imie *</Label>
                  <Input id="firstName" value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Jan" data-testid="input-first-name" />
                  {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Nazwisko *</Label>
                  <Input id="lastName" value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Kowalski" data-testid="input-last-name" />
                  {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="jan.kowalski@example.com" data-testid="input-email" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="phone">Telefon *</Label>
                <Input id="phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} placeholder="+48 123 456 789" data-testid="input-phone" />
                {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-center mb-2">Adres</h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Podaj swoj adres zamieszkania / siedziby</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="street">Ulica *</Label>
                <Input id="street" value={formData.street} onChange={(e) => updateField("street", e.target.value)} placeholder="ul. Piastowska 2/1" data-testid="input-street" />
                {errors.street && <p className="text-xs text-destructive mt-1">{errors.street}</p>}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="postalCode">Kod pocztowy *</Label>
                  <Input id="postalCode" value={formData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder="40-005" data-testid="input-postal-code" />
                  {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  <Label htmlFor="city">Miasto *</Label>
                  <Input id="city" value={formData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Katowice" data-testid="input-city" />
                  {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="voivodeship">Wojewodztwo *</Label>
                <select
                  id="voivodeship"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={formData.voivodeship}
                  onChange={(e) => updateField("voivodeship", e.target.value)}
                  data-testid="select-voivodeship"
                >
                  <option value="">Wybierz wojewodztwo...</option>
                  {Object.entries(VOIVODESHIP_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
                {errors.voivodeship && <p className="text-xs text-destructive mt-1">{errors.voivodeship}</p>}
              </div>
              <div>
                <Label htmlFor="country">Kraj</Label>
                <Input id="country" value={formData.country} onChange={(e) => updateField("country", e.target.value)} placeholder="Polska" data-testid="input-country" />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-xl font-semibold text-center mb-2">
              {role === "adwokat" || role === "radca_prawny" ? "Dane zawodowe" : role === "firma" ? "Dane firmy" : "Dane dodatkowe"}
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-6">Uzupelnij informacje specyficzne dla Twojej roli</p>
            <div className="space-y-4">
              {(role === "adwokat" || role === "radca_prawny") && (
                <>
                  <div>
                    <Label htmlFor="barNumber">Numer wpisu na liste {role === "adwokat" ? "adwokatow" : "radcow prawnych"}</Label>
                    <Input id="barNumber" value={formData.barNumber} onChange={(e) => updateField("barNumber", e.target.value)} placeholder="np. KAT/Adw/1234" data-testid="input-bar-number" />
                  </div>
                  <div>
                    <Label htmlFor="nip">NIP (opcjonalny)</Label>
                    <Input id="nip" value={formData.nip} onChange={(e) => updateField("nip", e.target.value.replace(/[^\d-\s]/g, ""))} placeholder="1234567890" maxLength={13} data-testid="input-nip" />
                    {errors.nip && <p className="text-xs text-destructive mt-1">{errors.nip}</p>}
                  </div>
                </>
              )}
              {role === "firma" && (
                <>
                  <div>
                    <Label htmlFor="companyName">Nazwa firmy *</Label>
                    <Input id="companyName" value={formData.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder="Kancelaria Prawna Sp. z o.o." data-testid="input-company-name" />
                    {errors.companyName && <p className="text-xs text-destructive mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="nip">NIP *</Label>
                    <Input id="nip" value={formData.nip} onChange={(e) => updateField("nip", e.target.value.replace(/[^\d-\s]/g, ""))} placeholder="1234567890" maxLength={13} data-testid="input-nip" />
                    {errors.nip && <p className="text-xs text-destructive mt-1">{errors.nip}</p>}
                  </div>
                </>
              )}
              {(role === "klient" || role === "firma") && (
                <div>
                  <Label htmlFor="pesel">{role === "firma" ? "PESEL reprezentanta" : "PESEL"}</Label>
                  <Input id="pesel" value={formData.pesel} onChange={(e) => updateField("pesel", e.target.value.replace(/\D/g, ""))} placeholder="12345678901" maxLength={11} data-testid="input-pesel" />
                  {errors.pesel && <p className="text-xs text-destructive mt-1">{errors.pesel}</p>}
                </div>
              )}

              <div className="bg-muted/50 rounded-md p-3 flex items-start gap-2">
                <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Twoje dane osobowe sa scisle chronione zgodnie z RODO. NIP i PESEL sa weryfikowane algorytmem kontrolnym. Dane sa szyfrowane i przechowywane bezpiecznie.
                </p>
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
          {step < totalSteps ? (
            <Button onClick={handleNext} disabled={step === 1 && !role} data-testid="button-next">
              Dalej
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={submitMutation.isPending} data-testid="button-submit">
              {submitMutation.isPending ? "Zapisywanie..." : "Zakoncz rejestracje"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
