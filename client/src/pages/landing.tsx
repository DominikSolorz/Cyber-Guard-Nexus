import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, FolderOpen, Search, Lock, FileText, ArrowRight } from "lucide-react";

export default function Landing() {
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
              <Link href="/terms">
                <Button variant="ghost" size="sm" data-testid="link-terms">Regulamin</Button>
              </Link>
              <Link href="/privacy">
                <Button variant="ghost" size="sm" data-testid="link-privacy">RODO</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="sm" data-testid="link-login">Logowanie</Button>
              </Link>
              <Link href="/register">
                <Button size="sm" data-testid="link-register">Rejestracja</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 text-primary text-sm mb-6">
            <Lock className="h-3.5 w-3.5" />
            <span>Bezpieczna biblioteka spraw sadowych</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6">
            Twoje sprawy sadowe
            <br />
            <span className="text-primary">w jednym miejscu</span>
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            LexVault to profesjonalny system zarzadzania dokumentami prawnymi.
            Organizuj, przechowuj i przeszukuj swoje akta z pelnym bezpieczenstwem.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link href="/register">
              <Button size="lg" data-testid="button-hero-register">
                Rozpocznij za darmo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" data-testid="button-hero-login">
                Zaloguj sie
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Wszystko, czego potrzebujesz</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Kompletny system do zarzadzania dokumentacja prawna
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard
              icon={<FolderOpen className="h-6 w-6" />}
              title="Organizacja spraw"
              description="Tworzenie folderow i podfolderow dla kazdej sprawy. Pelna kontrola nad struktura dokumentow."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Zarzadzanie plikami"
              description="Dodawanie plikow PDF, JPG, PNG i DOCX. Podglad dokumentow bezposrednio w przegladarce."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Szybkie wyszukiwanie"
              description="Wyszukiwanie dokumentow po nazwie i sygnaturze. Natychmiastowe wyniki wyszukiwania."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Bezpieczenstwo"
              description="Szyfrowanie hasel, sesje uzytkownikow i ochrona danych zgodna z RODO."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Prywatnosc"
              description="Kazdy uzytkownik widzi wylacznie swoje dokumenty. Pelna izolacja danych."
            />
            <FeatureCard
              icon={<ArrowRight className="h-6 w-6" />}
              title="Przyszlosc"
              description="Przygotowane pod integracje z AI, logowanie Google i generowanie PDF."
            />
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
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="rounded-md border border-border bg-card p-6 hover-elevate transition-colors" data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}
