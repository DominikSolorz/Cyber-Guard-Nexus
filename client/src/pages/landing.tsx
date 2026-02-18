import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Scale, FolderOpen, Search, Lock, FileText, ArrowRight, MessageSquare, Users, Briefcase, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-4 flex-wrap">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
                <Shield className="h-7 w-7 text-primary" />
                <span className="text-xl font-bold tracking-tight">
                  Lex<span className="text-primary">Vault</span>
                </span>
              </div>
            </Link>
            <div className="flex items-center gap-2">
              <a href="#o-aplikacji">
                <Button variant="ghost" size="sm" data-testid="link-about">O aplikacji</Button>
              </a>
              <a href="#funkcje">
                <Button variant="ghost" size="sm" data-testid="link-features">Funkcje</Button>
              </a>
              {user ? (
                <Link href="/dashboard">
                  <Button size="sm" data-testid="link-dashboard">Panel</Button>
                </Link>
              ) : (
                <a href="/api/login">
                  <Button size="sm" data-testid="link-login">Zaloguj sie</Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-primary/30 bg-primary/5 text-primary text-sm mb-6">
            <Scale className="h-3.5 w-3.5" />
            <span>Profesjonalny system dla prawnikow</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Zarzadzaj kancelaria
            <br />
            <span className="text-primary">w jednym miejscu</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            LexVault to profesjonalna platforma dla adwokatow, radcow prawnych i ich klientow.
            Komunikacja, dokumenty i sprawy sadowe - wszystko bezpiecznie w jednym systemie.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" data-testid="button-hero-dashboard">
                  Przejdz do panelu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <a href="/api/login">
                <Button size="lg" data-testid="button-hero-login">
                  Rozpocznij za darmo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </a>
            )}
          </div>
        </div>
      </section>

      <section id="o-aplikacji" className="py-20 px-4 border-t border-border">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Dla kogo jest LexVault?</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Platforma laczaca prawnikow z klientami w bezpiecznym srodowisku
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RoleCard icon={<Scale className="h-6 w-6" />} title="Adwokaci" desc="Zarzadzanie klientami, sprawami i dokumentacja w jednym miejscu." />
            <RoleCard icon={<Briefcase className="h-6 w-6" />} title="Radcy prawni" desc="Komunikacja z klientami i obieg dokumentow online." />
            <RoleCard icon={<Users className="h-6 w-6" />} title="Klienci indywidualni" desc="Bezposredni kontakt z adwokatem i podglad dokumentow sprawy." />
            <RoleCard icon={<Building2 className="h-6 w-6" />} title="Firmy" desc="Obsluga prawna firmy z pelnym dostepem do dokumentacji." />
          </div>
        </div>
      </section>

      <section id="funkcje" className="py-20 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Funkcje systemu</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Kompletny zestaw narzedzi do prowadzenia spraw prawnych
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard icon={<MessageSquare className="h-6 w-6" />} title="Czat prawnik-klient" description="Bezposrednia komunikacja miedzy prawnikiem a klientem z mozliwoscia zalaczania plikow PDF." />
            <FeatureCard icon={<FolderOpen className="h-6 w-6" />} title="Zarzadzanie sprawami" description="Tworzenie spraw, przypisywanie klientow i pelna kontrola nad dokumentacja." />
            <FeatureCard icon={<FileText className="h-6 w-6" />} title="Obieg dokumentow" description="Wysylanie i odbieranie plikow PDF, JPG, PNG i DOCX z podgladem w przegladarce." />
            <FeatureCard icon={<Search className="h-6 w-6" />} title="Wyszukiwanie" description="Szybkie wyszukiwanie spraw, dokumentow i klientow po nazwie lub sygnaturze." />
            <FeatureCard icon={<Lock className="h-6 w-6" />} title="Bezpieczenstwo" description="Logowanie przez Google, GitHub, Apple lub email. Dane chronione zgodnie z RODO." />
            <FeatureCard icon={<Shield className="h-6 w-6" />} title="Asystent AI" description="Wbudowany asystent ChatGPT pomagajacy w analizie prawnej i przygotowaniu pism." />
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">LexVault</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dominik Solarz. Wszelkie prawa zastrzezone.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/terms">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors" data-testid="link-footer-terms">Regulamin</span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors" data-testid="link-footer-privacy">Polityka prywatnosci</span>
            </Link>
            <Link href="/contact">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors" data-testid="link-footer-contact">Kontakt</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="hover-elevate" data-testid={`card-role-${title.toLowerCase()}`}>
      <CardContent className="p-5 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary mb-3">
          {icon}
        </div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover-elevate" data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
