import { useState, useRef, useEffect } from "react";
import { useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Shield, Mail, Lock, ArrowRight, ArrowLeft, Eye, EyeOff, Scale, User, Building2, Briefcase, Search, ChevronDown, Globe, Phone } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
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

  const filtered = options.filter(o => o.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = options.find(o => o.value === value)?.label || "";

  return (
    <div ref={ref} className="relative">
      <Label>{label}</Label>
      <div
        className={`flex items-center w-full rounded-md border bg-background px-3 py-2 text-sm cursor-pointer ${error ? "border-destructive" : "border-input"}`}
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50); }}
        data-testid={testId}
      >
        <span className={`flex-1 ${value ? "" : "text-muted-foreground"}`}>{selectedLabel || placeholder}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>
      {open && (
        <div className="absolute z-50 mt-1 w-full rounded-md border border-input bg-background shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-input">
            <div className="flex items-center gap-2 px-2">
              <Search className="h-4 w-4 text-muted-foreground shrink-0" />
              <input ref={inputRef} type="text" className="w-full bg-transparent text-sm outline-none" placeholder="Szukaj..." value={search} onChange={(e) => setSearch(e.target.value)} data-testid={`${testId}-search`} />
            </div>
          </div>
          <div className="overflow-y-auto max-h-48">
            {filtered.length === 0 ? (
              <p className="text-sm text-muted-foreground p-3 text-center">Brak wynikow</p>
            ) : (
              filtered.map((o) => (
                <div key={o.value} className={`px-3 py-2 text-sm cursor-pointer hover-elevate ${o.value === value ? "bg-primary/10 text-primary" : ""}`} onClick={() => { onChange(o.value); setOpen(false); setSearch(""); }} data-testid={`${testId}-option-${o.value}`}>
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

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [tab, setTab] = useState<"login" | "register">("login");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [regStep, setRegStep] = useState(1);
  const [role, setRole] = useState<Role | null>(null);
  const [regData, setRegData] = useState({
    email: "", password: "", confirmPassword: "",
    firstName: "", lastName: "", phone: "", phoneCountry: "PL",
    street: "", city: "", postalCode: "", voivodeship: "", country: "PL",
    pesel: "", companyName: "", nip: "", barNumber: "",
  });
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showPesel, setShowPesel] = useState(false);
  const [showNip, setShowNip] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [phoneDropdownOpen, setPhoneDropdownOpen] = useState(false);
  const [phoneCountrySearch, setPhoneCountrySearch] = useState("");
  const phoneDropdownRef = useRef<HTMLDivElement>(null);

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

  const selectedPhoneCountry = COUNTRIES.find(c => c.code === regData.phoneCountry);
  const selectedCountry = COUNTRIES.find(c => c.code === regData.country);
  const isPoland = regData.country === "PL";

  const updateField = (field: string, value: string) => {
    setRegData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" }));
  };

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) {
      toast({ title: "Blad", description: "Podaj email i haslo", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/admin-login", { email, password });
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

  const validateRegStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!role) { toast({ title: "Wybierz typ konta", variant: "destructive" }); return false; }
    return true;
  };

  const validateRegStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(regData.email)) {
      newErrors.email = "Nieprawidlowy email";
    } else if (isDisposableEmail(regData.email)) {
      newErrors.email = "Tymczasowe adresy email nie sa akceptowane";
    }
    if (regData.password.length < 8) newErrors.password = "Minimum 8 znakow";
    if (regData.password !== regData.confirmPassword) newErrors.confirmPassword = "Hasla nie sa identyczne";
    if (regData.firstName.trim().length < 2) newErrors.firstName = "Minimum 2 znaki";
    if (regData.lastName.trim().length < 2) newErrors.lastName = "Minimum 2 znaki";
    const phoneDigits = regData.phone.replace(/[\s-]/g, "");
    if (phoneDigits.length < 6) newErrors.phone = "Minimum 6 cyfr";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegStep3 = () => {
    const newErrors: Record<string, string> = {};
    if (regData.street.trim().length < 3) newErrors.street = "Minimum 3 znaki";
    if (regData.city.trim().length < 2) newErrors.city = "Minimum 2 znaki";
    if (isPoland) {
      if (!/^\d{2}-\d{3}$/.test(regData.postalCode)) newErrors.postalCode = "Format: XX-XXX";
      if (!regData.voivodeship) newErrors.voivodeship = "Wymagane";
    } else {
      if (regData.postalCode.trim().length < 3) newErrors.postalCode = "Minimum 3 znaki";
    }
    if (!regData.country) newErrors.country = "Wymagane";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegStep4 = () => {
    const newErrors: Record<string, string> = {};
    if ((role === "adwokat" || role === "radca_prawny" || role === "firma") && regData.nip) {
      if (!validateNIP(regData.nip)) newErrors.nip = "Nieprawidlowy NIP";
    }
    if ((role === "klient" || role === "firma") && regData.pesel) {
      if (!validatePESEL(regData.pesel)) newErrors.pesel = "Nieprawidlowy PESEL";
    }
    if (role === "firma" && !regData.companyName?.trim()) newErrors.companyName = "Nazwa firmy wymagana";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegNext = () => {
    if (regStep === 1 && !validateRegStep1()) return;
    if (regStep === 2 && !validateRegStep2()) return;
    if (regStep === 3 && !validateRegStep3()) return;
    setRegStep(regStep + 1);
  };

  async function handleRegister() {
    if (!validateRegStep4()) return;
    setIsLoading(true);
    try {
      const phoneCode = selectedPhoneCountry?.phoneCode || "+48";
      const fullPhone = regData.phone ? `${phoneCode} ${regData.phone}` : "";
      const countryName = selectedCountry?.name || "Polska";

      const body: any = {
        email: regData.email,
        password: regData.password,
        role,
        firstName: regData.firstName,
        lastName: regData.lastName,
        phone: fullPhone,
        street: regData.street,
        city: regData.city,
        postalCode: regData.postalCode,
        voivodeship: isPoland ? regData.voivodeship : "",
        country: countryName,
      };

      if (role === "adwokat" || role === "radca_prawny") {
        body.barNumber = regData.barNumber || undefined;
        body.nip = regData.nip || undefined;
      }
      if (role === "klient") { body.pesel = regData.pesel || undefined; }
      if (role === "firma") {
        body.companyName = regData.companyName || undefined;
        body.nip = regData.nip || undefined;
        body.pesel = regData.pesel || undefined;
      }

      await apiRequest("POST", "/api/register", body);
      await queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      toast({ title: "Konto utworzone!", description: "Witaj w LexVault!" });
      setLocation("/dashboard");
    } catch (error: any) {
      let msg = "Blad rejestracji";
      try {
        const body = JSON.parse(error?.message?.replace(/^\d+:\s*/, "") || "{}");
        if (body.message) msg = body.message;
      } catch {}
      toast({ title: "Blad", description: msg, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  const roleCards: { value: Role; icon: React.ReactNode; label: string; desc: string }[] = [
    { value: "adwokat", icon: <Scale className="h-5 w-5" />, label: "Adwokat", desc: "Kancelaria adwokacka" },
    { value: "radca_prawny", icon: <Briefcase className="h-5 w-5" />, label: "Radca prawny", desc: "Radca prawny" },
    { value: "klient", icon: <User className="h-5 w-5" />, label: "Klient", desc: "Szukam pomocy prawnej" },
    { value: "firma", icon: <Building2 className="h-5 w-5" />, label: "Firma", desc: "Konto firmowe" },
  ];

  const countryOptions = COUNTRIES.map(c => ({ value: c.code, label: c.name }));
  const cityOptions = isPoland ? POLISH_CITIES.map(c => ({ value: c, label: c })) : [];
  const voivodeshipOptions = Object.entries(VOIVODESHIP_LABELS).map(([key, label]) => ({ value: key, label }));
  const filteredPhoneCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(phoneCountrySearch.toLowerCase()) ||
    c.phoneCode.includes(phoneCountrySearch) ||
    c.code.toLowerCase().includes(phoneCountrySearch.toLowerCase())
  );

  const totalRegSteps = 4;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link href="/">
            <div className="inline-flex items-center gap-2 cursor-pointer mb-3" data-testid="link-login-home">
              <Shield className="h-8 w-8 text-primary" />
              <span className="text-2xl font-bold tracking-tight">Lex<span className="text-primary">Vault</span></span>
            </div>
          </Link>
        </div>

        <div className="flex gap-1 mb-4 p-1 bg-muted rounded-md">
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${tab === "login" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            onClick={() => { setTab("login"); setErrors({}); }}
            data-testid="tab-login"
          >
            Logowanie
          </button>
          <button
            className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${tab === "register" ? "bg-background shadow-sm" : "text-muted-foreground"}`}
            onClick={() => { setTab("register"); setErrors({}); }}
            data-testid="tab-register"
          >
            Rejestracja
          </button>
        </div>

        {tab === "login" && (
          <Card>
            <CardContent className="p-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-email" type="email" placeholder="twoj@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10" autoComplete="email" data-testid="input-login-email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Haslo</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="login-password" type={showPassword ? "text" : "password"} placeholder="Wpisz haslo" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10" autoComplete="current-password" data-testid="input-login-password" />
                    <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowPassword(!showPassword)} data-testid="button-toggle-password">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-login-submit">
                  {isLoading ? "Logowanie..." : "Zaloguj sie"}
                  {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </form>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">lub</span></div>
              </div>

              <a href="/api/login" className="block">
                <Button variant="outline" className="w-full" data-testid="button-login-replit">Zaloguj sie przez Replit Auth</Button>
              </a>
            </CardContent>
          </Card>
        )}

        {tab === "register" && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-5">
                {Array.from({ length: totalRegSteps }).map((_, i) => (
                  <div key={i} className={`h-1.5 rounded-md transition-all ${i + 1 === regStep ? "w-10 bg-primary" : i + 1 < regStep ? "w-6 bg-primary/50" : "w-6 bg-muted"}`} />
                ))}
              </div>

              {regStep === 1 && (
                <div>
                  <h2 className="text-lg font-semibold text-center mb-1" data-testid="text-reg-title">Kim jestes?</h2>
                  <p className="text-sm text-muted-foreground text-center mb-4">Wybierz typ konta</p>
                  <div className="grid grid-cols-2 gap-3">
                    {roleCards.map((r) => (
                      <Card
                        key={r.value}
                        className={`cursor-pointer transition-colors ${role === r.value ? "border-primary bg-primary/5" : "hover-elevate"}`}
                        onClick={() => setRole(r.value)}
                        data-testid={`card-role-${r.value}`}
                      >
                        <CardContent className="p-3 text-center">
                          <div className={`inline-flex items-center justify-center w-9 h-9 rounded-md mb-1.5 ${role === r.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {r.icon}
                          </div>
                          <p className="text-sm font-medium">{r.label}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{r.desc}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {regStep === 2 && (
                <div>
                  <h2 className="text-lg font-semibold text-center mb-1">Dane i konto</h2>
                  <p className="text-sm text-muted-foreground text-center mb-4">Podaj dane i utworz haslo</p>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Imie *</Label>
                        <Input value={regData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="Jan" autoComplete="off" data-testid="input-first-name" />
                        {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
                      </div>
                      <div>
                        <Label>Nazwisko *</Label>
                        <Input value={regData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Kowalski" autoComplete="off" data-testid="input-last-name" />
                        {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
                      </div>
                    </div>
                    <div>
                      <Label>Email *</Label>
                      <Input type="email" value={regData.email} onChange={(e) => updateField("email", e.target.value)} placeholder="jan@example.com" autoComplete="off" data-testid="input-reg-email" />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label>Haslo *</Label>
                      <div className="relative">
                        <Input type={showRegPassword ? "text" : "password"} value={regData.password} onChange={(e) => updateField("password", e.target.value)} placeholder="Min. 8 znakow" autoComplete="new-password" className="pr-10" data-testid="input-reg-password" />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2" onClick={() => setShowRegPassword(!showRegPassword)} data-testid="button-toggle-reg-password">
                          {showRegPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
                    </div>
                    <div>
                      <Label>Powtorz haslo *</Label>
                      <Input type="password" value={regData.confirmPassword} onChange={(e) => updateField("confirmPassword", e.target.value)} placeholder="Powtorz haslo" autoComplete="new-password" data-testid="input-reg-confirm-password" />
                      {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
                    </div>
                    <div>
                      <Label>Telefon *</Label>
                      <div className="flex gap-0">
                        <div ref={phoneDropdownRef} className="relative">
                          <button type="button" className="flex items-center gap-1 h-9 px-2.5 rounded-l-md border border-r-0 border-input bg-muted/50 text-sm whitespace-nowrap min-w-[90px]" onClick={() => { setPhoneDropdownOpen(!phoneDropdownOpen); setPhoneCountrySearch(""); }} data-testid="button-phone-country">
                            <Globe className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                            <span className="font-medium">{selectedPhoneCountry?.phoneCode || "+48"}</span>
                            <ChevronDown className="h-3 w-3 text-muted-foreground shrink-0" />
                          </button>
                          {phoneDropdownOpen && (
                            <div className="absolute z-50 top-full mt-1 left-0 w-64 rounded-md border border-input bg-background shadow-lg max-h-60 overflow-hidden">
                              <div className="p-2 border-b border-input">
                                <div className="flex items-center gap-2 px-2">
                                  <Search className="h-4 w-4 text-muted-foreground shrink-0" />
                                  <input type="text" className="w-full bg-transparent text-sm outline-none" placeholder="Szukaj kraju..." value={phoneCountrySearch} onChange={(e) => setPhoneCountrySearch(e.target.value)} autoFocus data-testid="input-phone-country-search" />
                                </div>
                              </div>
                              <div className="overflow-y-auto max-h-48">
                                {filteredPhoneCountries.map((c) => (
                                  <div key={c.code} className={`flex items-center justify-between gap-2 px-3 py-2 text-sm cursor-pointer hover-elevate ${c.code === regData.phoneCountry ? "bg-primary/10 text-primary" : ""}`} onClick={() => { updateField("phoneCountry", c.code); setPhoneDropdownOpen(false); setPhoneCountrySearch(""); }} data-testid={`phone-country-${c.code}`}>
                                    <span>{c.name}</span>
                                    <span className="text-muted-foreground font-mono text-xs">{c.phoneCode}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <Input value={regData.phone} onChange={(e) => updateField("phone", e.target.value.replace(/[^\d\s-]/g, ""))} placeholder="123 456 789" className="rounded-l-none" autoComplete="off" data-testid="input-phone" />
                      </div>
                      {errors.phone && <p className="text-xs text-destructive mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>
              )}

              {regStep === 3 && (
                <div>
                  <h2 className="text-lg font-semibold text-center mb-1">Adres</h2>
                  <p className="text-sm text-muted-foreground text-center mb-4">Podaj adres zamieszkania / siedziby</p>
                  <div className="space-y-3">
                    <SearchableSelect value={regData.country} onChange={(val) => { updateField("country", val); if (val !== "PL") setRegData(prev => ({ ...prev, country: val, voivodeship: "", city: "" })); }} options={countryOptions} placeholder="Wybierz kraj..." label="Kraj *" testId="select-country" error={errors.country} />
                    <div>
                      <Label>Ulica *</Label>
                      <Input value={regData.street} onChange={(e) => updateField("street", e.target.value)} placeholder="ul. Piastowska 2/1" autoComplete="off" data-testid="input-street" />
                      {errors.street && <p className="text-xs text-destructive mt-1">{errors.street}</p>}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label>Kod pocztowy *</Label>
                        <Input value={regData.postalCode} onChange={(e) => updateField("postalCode", e.target.value)} placeholder={isPoland ? "40-005" : "Kod"} autoComplete="off" data-testid="input-postal-code" />
                        {errors.postalCode && <p className="text-xs text-destructive mt-1">{errors.postalCode}</p>}
                      </div>
                      <div>
                        {isPoland ? (
                          <SearchableSelect value={regData.city} onChange={(val) => updateField("city", val)} options={cityOptions} placeholder="Wybierz miasto..." label="Miasto *" testId="select-city" error={errors.city} />
                        ) : (
                          <>
                            <Label>Miasto *</Label>
                            <Input value={regData.city} onChange={(e) => updateField("city", e.target.value)} placeholder="Miasto" autoComplete="off" data-testid="input-city" />
                            {errors.city && <p className="text-xs text-destructive mt-1">{errors.city}</p>}
                          </>
                        )}
                      </div>
                    </div>
                    {isPoland && (
                      <SearchableSelect value={regData.voivodeship} onChange={(val) => updateField("voivodeship", val)} options={voivodeshipOptions} placeholder="Wybierz wojewodztwo..." label="Wojewodztwo *" testId="select-voivodeship" error={errors.voivodeship} />
                    )}
                  </div>
                </div>
              )}

              {regStep === 4 && (
                <div>
                  <h2 className="text-lg font-semibold text-center mb-1">
                    {role === "adwokat" || role === "radca_prawny" ? "Dane zawodowe" : role === "firma" ? "Dane firmy" : "Dane dodatkowe"}
                  </h2>
                  <p className="text-sm text-muted-foreground text-center mb-4">Informacje specyficzne dla Twojej roli</p>
                  <div className="space-y-3">
                    {(role === "adwokat" || role === "radca_prawny") && (
                      <>
                        <div>
                          <Label>Numer wpisu na liste {role === "adwokat" ? "adwokatow" : "radcow prawnych"}</Label>
                          <Input value={regData.barNumber} onChange={(e) => updateField("barNumber", e.target.value)} placeholder="np. KAT/Adw/1234" autoComplete="off" data-testid="input-bar-number" />
                        </div>
                        <div>
                          <Label>NIP (opcjonalny)</Label>
                          <div className="relative">
                            <Input type={showNip ? "text" : "password"} value={regData.nip} onChange={(e) => updateField("nip", e.target.value.replace(/[^\d-\s]/g, ""))} placeholder="1234567890" maxLength={13} autoComplete="off" className="pr-10" data-testid="input-nip" />
                            <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNip(!showNip)} tabIndex={-1} data-testid="button-toggle-nip">
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
                          <Label>Nazwa firmy *</Label>
                          <Input value={regData.companyName} onChange={(e) => updateField("companyName", e.target.value)} placeholder="Kancelaria Prawna Sp. z o.o." autoComplete="off" data-testid="input-company-name" />
                          {errors.companyName && <p className="text-xs text-destructive mt-1">{errors.companyName}</p>}
                        </div>
                        <div>
                          <Label>NIP *</Label>
                          <div className="relative">
                            <Input type={showNip ? "text" : "password"} value={regData.nip} onChange={(e) => updateField("nip", e.target.value.replace(/[^\d-\s]/g, ""))} placeholder="1234567890" maxLength={13} autoComplete="off" className="pr-10" data-testid="input-nip" />
                            <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowNip(!showNip)} tabIndex={-1} data-testid="button-toggle-nip">
                              {showNip ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                          {errors.nip && <p className="text-xs text-destructive mt-1">{errors.nip}</p>}
                        </div>
                      </>
                    )}
                    {(role === "klient" || role === "firma") && (
                      <div>
                        <Label>{role === "firma" ? "PESEL reprezentanta" : "PESEL"}</Label>
                        <div className="relative">
                          <Input type={showPesel ? "text" : "password"} value={regData.pesel} onChange={(e) => updateField("pesel", e.target.value.replace(/\D/g, ""))} placeholder="12345678901" maxLength={11} autoComplete="off" className="pr-10" data-testid="input-pesel" />
                          <button type="button" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" onClick={() => setShowPesel(!showPesel)} tabIndex={-1} data-testid="button-toggle-pesel">
                            {showPesel ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        </div>
                        {errors.pesel && <p className="text-xs text-destructive mt-1">{errors.pesel}</p>}
                      </div>
                    )}
                    <div className="bg-muted/50 rounded-md p-3 flex items-start gap-2">
                      <Lock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Twoje dane osobowe sa scisle chronione zgodnie z RODO. NIP i PESEL sa weryfikowane algorytmem kontrolnym.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-5 gap-3">
                {regStep > 1 ? (
                  <Button variant="outline" onClick={() => setRegStep(regStep - 1)} data-testid="button-reg-back">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Wstecz
                  </Button>
                ) : <div />}
                {regStep < totalRegSteps ? (
                  <Button onClick={handleRegNext} disabled={regStep === 1 && !role} data-testid="button-reg-next">
                    Dalej <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={handleRegister} disabled={isLoading} data-testid="button-reg-submit">
                    {isLoading ? "Tworzenie konta..." : "Utworz konto"}
                  </Button>
                )}
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                <div className="relative flex justify-center text-xs"><span className="bg-card px-2 text-muted-foreground">lub</span></div>
              </div>

              <a href="/api/login" className="block">
                <Button variant="outline" className="w-full" data-testid="button-register-replit">Zarejestruj sie przez Replit Auth</Button>
              </a>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
