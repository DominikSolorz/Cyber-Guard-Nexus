import { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Scale, User, Building2, Briefcase, ArrowRight, ArrowLeft, Lock, Eye, EyeOff, Search, ChevronDown, AlertTriangle, Globe, Phone } from "lucide-react";
import { VOIVODESHIP_LABELS, validateNIP, validatePESEL } from "@shared/schema";
import { COUNTRIES, POLISH_CITIES, isDisposableEmail } from "@/lib/countries-data";

type Role = "adwokat" | "radca_prawny" | "klient" | "firma";

function SearchableSelect({ value, onChange, options, placeholder, label, testId, error }: {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  label: string;
  testId: string;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const selectedLabel = options.find(o => o.value === value)?.label || "";

  return (
    <div ref={ref} className="relative">
      <Label>{label}</Label>
      <div
        className={`flex items-center w-full rounded-md border bg-background px-3 py-2 text-sm cursor-pointer ${error ? "border-destructive" : "border-input"}`}
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
        data-testid={testId}
      >
        <span className={`flex-1 ${value ? "" : "text-muted-foreground"}`}>
          {selectedLabel || placeholder}
        </span>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-input">
            <div className="flex items-center gap-2 px-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                className="w-full bg-transparent text-sm outline-none"
                placeholder="Szukaj..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                data-testid={`${testId}-search`}
              />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 text-center">Brak wynikow</p>
            ) : (
              filtered.map((o) => (
                <div
                  key={o.value}
                  className={`px-3 py-2 text-sm cursor-pointer hover-elevate ${o.value === value ? "bg-primary/10 text-primary" : ""}`}
                  onClick={() => { onChange(o.value); setOpen(false); setSearch(""); }}
                  data-testid={`${testId}-option-${o.value}`}
                >
                  {o.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {error && <p className="text-xs text-destructive mt-1">{error}</p>}
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    phoneCountry: "PL",
    street: "", city: "", postalCode: "", voivodeship: "", country: "PL",
    pesel: "", companyName: "", nip: "", barNumber: "",
  });
  const [showPesel, setShowPesel] = useState(false);
  const [showNip, setShowNip] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("");
  const phoneDropdownRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (phoneDropdownRef.current && !phoneDropdownRef.current.contains(e.target as Node)) {
        setPhoneDropdownOpen(false);
        setPhoneCountrySearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selectedPhoneCountry = COUNTRIES.find(c => c.code === formData.phoneCountry);
  const selectedCountry = COUNTRIES.find(c => c.code === formData.country);
  const isPoland = formData.country === "PL";

  const submitMutation = useMutation({
    mutationFn: async () => {
      const phoneCode = selectedPhoneCountry?.phoneCode || "+48";
      const fullPhone = formData.phone ? `${phoneCode} ${formData.phone}` : "";
      const countryName = selectedCountry?.name || "Polska";

      const body: any = {
        role,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: fullPhone,
        street: formData.street,
        city: formData.city,
        postalCode: formData.postalCode,
        voivodeship: isPoland ? formData.voivodeship : "",
        country: countryName,
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Nieprawidlowy email";
    } else if (isDisposableEmail(formData.email)) {
      newErrors.email = "Tymczasowe adresy email nie sa akceptowane. Uzyj stalego adresu email.";
    }
    const phoneDigits = formData.phone.replace(/[\s-]/g, "");
    if (phoneDigits.length < 6) newErrors.phone = "Minimum 6 cyfr";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (formData.street.trim().length < 3) newErrors.street = "Minimum 3 znaki";
    if (formData.city.trim().length < 2) newErrors.city = "Minimum 2 znaki";
    if (isPoland) {
      if (!/^\d{2}-\d{3}$/.test(formData.postalCode)) newErrors.postalCode = "Format: XX-XXX";
      if (!formData.voivodeship) newErrors.voivodeship = "Wymagane";
    } else {
      if (formData.postalCode.trim().length < 3) newErrors.postalCode = "Minimum 3 znaki";
    }
    if (!formData.country) newErrors.country = "Wymagane";
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

  const countryOptions = COUNTRIES.map(c => ({ value: c.code, label: c.name }));
  const cityOptions = isPoland
    ? POLISH_CITIES.map(c => ({ value: c, label: c }))
    : [];
  const voivodeshipOptions = Object.entries(VOIVODESHIP_LABELS).map(([key, label]) => ({
    value: key, label,
  }));

  const filteredPhoneCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(phoneCountrySearch.toLowerCase()) ||
    c.phoneCode.includes(phoneCountrySearch) ||
    c.code.toLowerCase().includes(phoneCountrySearch.toLowerCase())
  );

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
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => updateField("firstName", e.target.value)}
                    placeholder="Jan"
                    autoComplete="off"
                    data-testid="input-first-name"
                  />
                  {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <Label htmlFor="lastName">Nazwisko *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => updateField("lastName", e.target.value)}
                    placeholder="Kowalski"
                    autoComplete="off"
                    data-testid="input-last-name"
                  />
                  {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  placeholder="jan.kowalski@example.com"
                  autoComplete="off"
                  data-testid="input-email"
                />
                {errors.email && (
                  <div className="flex items-start gap-1.5 mt-1">
                    {isDisposableEmail(formData.email) && <AlertTriangle className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />}
                    <p className="text-xs text-destructive">{errors.email}</p>
                  </div>
                )}
              </div>
              <div>
                <Label>Telefon *</Label>
                <div className="flex gap-0">
                  <div ref={phoneDropdownRef} className="relative">
                    <button
                      type="button"
                      className="flex items-center gap-1 h-9 px-2.5 rounded-l-md border border-r-0 border-input bg-muted/50 text-sm whitespace-nowrap min-w-[90px]"
                      onClick={() => { setPhoneDropdownOpen(!phoneDropdownOpen); setPhoneCountrySearch(""); }}
                      data-testid="button-phone-country"
                    >
                      <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <span className="font-medium">{selectedPhoneCountry?.phoneCode || "+48"}</span>
                      <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                    </button>
                    {phoneDropdownOpen && (
                      <div className="absolute z-50 top-full mt-1 left-0 w-64 rounded-md border border-input bg-background shadow-lg max-h-60 overflow-hidden">
                        <div className="p-2 border-b border-input">
                          <div className="flex items-center gap-2 px-2">
                            <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                            <input
                              type="text"
                              className="w-full bg-transparent text-sm outline-none"
                              placeholder="Szukaj kraju..."
                              value={phoneCountrySearch}
                              onChange={(e) => setPhoneCountrySearch(e.target.value)}
                              autoFocus
                              data-testid="input-phone-country-search"
                            />
                          </div>
                        </div>
                        <div className="overflow-y-auto max-h-48">
                          {filteredPhoneCountries.map((c) => (
                            <div
                              key={c.code}
                              className={`flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer hover-elevate ${c.code === formData.phoneCountry ? "bg-primary/10 text-primary" : ""}`}
                              onClick={() => {
                                updateField("phoneCountry", c.code);
                                setPhoneDropdownOpen(false);
                                setPhoneCountrySearch("");
                              }}
                              data-testid={`phone-country-${c.code}`}
                            >
                              <span>{c.name}</span>
                              <span className="text-muted-foreground font-mono text-xs">{c.phoneCode}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <Input
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value.replace(/[^\d\s-]/g, ""))}
                    placeholder="123 456 789"
                    className="rounded-l-none"
                    autoComplete="off"
                    data-testid="input-phone"
                  />
                </div>
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
              <SearchableSelect
                value={formData.country}
                onChange={(val) => {
                  updateField("country", val);
                  if (val !== "PL") {
                    setFormData(prev => ({ ...prev, country: val, voivodeship: "", city: "" }));
                  }
                }}
                options={countryOptions}
                placeholder="Wybierz kraj..."
                label="Kraj *"
                testId="select-country"
                error={errors.country}
              />

              <div>
                <Label htmlFor="street">Ulica *</Label>
                <Input
                  id="street"
                  value={formData.street}
                  onChange={(e) => updateField("street", e.target.value)}
                  placeholder="ul. Piastowska 2/1"
                  autoComplete="off"
                  data-testid="input-street"
                />
                {errors.street && <p className="text-xs text-destructive mt-1">{errors.street}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="postalCode">Kod pocztowy *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => updateField("postalCode", e.target.value)}
                    placeholder={isPoland ? "40-005" : "Kod pocztowy"}
                    autoComplete="off"
                    data-testid="input-postal-code"
                  />
                  {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
                </div>
                <div>
                  {isPoland ? (
                    <SearchableSelect
                      value={formData.city}
                      onChange={(val) => updateField("city", val)}
                      options={cityOptions}
                      placeholder="Wybierz miasto..."
                      label="Miasto *"
                      testId="select-city"
                      error={errors.city}
                    />
                  ) : (
                    <>
                      <Label htmlFor="city">Miasto *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="Miasto"
                        autoComplete="off"
                        data-testid="input-city"
                      />
                      {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                    </>
                  )}
                </div>
              </div>

              {isPoland && (
                <SearchableSelect
                  value={formData.voivodeship}
                  onChange={(val) => updateField("voivodeship", val)}
                  options={voivodeshipOptions}
                  placeholder="Wybierz wojewodztwo..."
                  label="Wojewodztwo *"
                  testId="select-voivodeship"
                  error={errors.voivodeship}
                />
              )}
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
                    <Input
                      id="barNumber"
                      value={formData.barNumber}
                      onChange={(e) => updateField("barNumber", e.target.value)}
                      placeholder="np. KAT/Adw/1234"
                      autoComplete="off"
                      data-testid="input-bar-number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="nip">NIP (opcjonalny)</Label>
                    <div className="relative">
                      <Input
                        id="nip"
                        type={showNip ? "text" : "password"}
                        value={formData.nip}
                        onChange={(e) => updateField("nip", e.target.value.replace(/[^\d-\s]/g, ""))}
                        placeholder="1234567890"
                        maxLength={13}
                        autoComplete="off"
                        className="pr-10"
                        data-testid="input-nip"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowNip(!showNip)}
                        tabIndex={-1}
                        data-testid="button-toggle-nip"
                      >
                        {showNip ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.nip && <p className="text-xs text-destructive mt-1">{errors.nip}</p>}
                  </div>
                </>
              )}
              {role === "firma" && (
                <>
                  <div>
                    <Label htmlFor="companyName">Nazwa firmy *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateField("companyName", e.target.value)}
                      placeholder="Kancelaria Prawna Sp. z o.o."
                      autoComplete="off"
                      data-testid="input-company-name"
                    />
                    {errors.companyName && <p className="text-xs text-destructive mt-1">{errors.companyName}</p>}
                  </div>
                  <div>
                    <Label htmlFor="nip">NIP *</Label>
                    <div className="relative">
                      <Input
                        id="nip"
                        type={showNip ? "text" : "password"}
                        value={formData.nip}
                        onChange={(e) => updateField("nip", e.target.value.replace(/[^\d-\s]/g, ""))}
                        placeholder="1234567890"
                        maxLength={13}
                        autoComplete="off"
                        className="pr-10"
                        data-testid="input-nip"
                      />
                      <button
                        type="button"
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowNip(!showNip)}
                        tabIndex={-1}
                        data-testid="button-toggle-nip"
                      >
                        {showNip ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.nip && <p className="text-xs text-destructive mt-1">{errors.nip}</p>}
                  </div>
                </>
              )}
              {(role === "klient" || role === "firma") && (
                <div>
                  <Label htmlFor="pesel">{role === "firma" ? "PESEL reprezentanta" : "PESEL"}</Label>
                  <div className="relative">
                    <Input
                      id="pesel"
                      type={showPesel ? "text" : "password"}
                      value={formData.pesel}
                      onChange={(e) => updateField("pesel", e.target.value.replace(/\D/g, ""))}
                      placeholder="12345678901"
                      maxLength={11}
                      autoComplete="off"
                      className="pr-10"
                      data-testid="input-pesel"
                    />
                    <button
                      type="button"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPesel(!showPesel)}
                      tabIndex={-1}
                      data-testid="button-toggle-pesel"
                    >
                      {showPesel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
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
