import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Shield,
  Scale,
  FolderOpen,
  Search,
  Lock,
  FileText,
  ArrowRight,
  MessageSquare,
  Users,
  Briefcase,
  Building2,
  CheckCircle,
  UserPlus,
  ClipboardCheck,
  Laptop,
  Eye,
  Database,
  Mail,
  MapPin,
  Phone,
  Calendar,
} from "lucide-react";
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
            <div className="flex items-center gap-2 flex-wrap">
              <a href="#o-aplikacji">
                <Button variant="ghost" size="sm" data-testid="link-about">O aplikacji</Button>
              </a>
              <a href="#funkcje">
                <Button variant="ghost" size="sm" data-testid="link-features">Funkcje</Button>
              </a>
              <Link href="/contact">
                <Button variant="ghost" size="sm" data-testid="link-contact">Kontakt</Button>
              </Link>
              <Link href="/privacy">
                <Button variant="ghost" size="sm" data-testid="link-privacy">Polityka prywatnosci</Button>
              </Link>
              <Link href="/terms">
                <Button variant="ghost" size="sm" data-testid="link-terms">Regulamin</Button>
              </Link>
              <a href="#klauzula">
                <Button variant="ghost" size="sm" data-testid="link-confidentiality">Klauzula poufnosci</Button>
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

      <section className="relative pt-32 pb-24 px-4 overflow-hidden" data-testid="section-hero">
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-primary/30 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-primary/30 bg-primary/10 text-primary text-sm mb-6">
            <Scale className="h-3.5 w-3.5" />
            <span>Profesjonalny system zarzadzania kancelaria prawna</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-white">
            Kompleksowe zarzadzanie
            <br />
            <span className="text-primary">kancelaria prawna</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            LexVault to nowoczesna platforma dla adwokatow, radcow prawnych i ich klientow.
            Sprawy sadowe, dokumenty, komunikacja i analiza prawna z asystentem AI —
            wszystko bezpiecznie w jednym systemie zgodnym z RODO.
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
              <>
                <a href="/api/login">
                  <Button size="lg" data-testid="button-hero-login">
                    Rozpocznij za darmo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <a href="#funkcje">
                  <Button variant="outline" size="lg" className="backdrop-blur-sm bg-white/5" data-testid="button-hero-features">
                    Poznaj funkcje
                  </Button>
                </a>
              </>
            )}
          </div>
        </div>
      </section>

      <section id="o-aplikacji" className="py-20 px-4 border-t border-border" data-testid="section-roles">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Dla kogo jest LexVault?</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Platforma laczaca prawnikow z klientami w bezpiecznym, profesjonalnym srodowisku
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <RoleCard
              icon={<Scale className="h-6 w-6" />}
              title="Adwokaci"
              desc="Pelne zarzadzanie klientami, sprawami sadowymi i dokumentacja w jednym miejscu. Bezposrednia komunikacja z klientami."
            />
            <RoleCard
              icon={<Briefcase className="h-6 w-6" />}
              title="Radcy prawni"
              desc="Efektywna komunikacja z klientami, obieg dokumentow online i organizacja spraw prawnych."
            />
            <RoleCard
              icon={<Users className="h-6 w-6" />}
              title="Klienci indywidualni"
              desc="Bezposredni kontakt z adwokatem, podglad dokumentow sprawy i sledzenie postepow w czasie rzeczywistym."
            />
            <RoleCard
              icon={<Building2 className="h-6 w-6" />}
              title="Firmy"
              desc="Kompleksowa obsluga prawna firmy z pelnym dostepem do dokumentacji i historii spraw."
            />
          </div>
        </div>
      </section>

      <section id="funkcje" className="py-20 px-4 border-t border-border" data-testid="section-features">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Funkcje systemu</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Kompletny zestaw narzedzi do prowadzenia spraw prawnych
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Czat prawnik-klient"
              description="Bezposrednia, szyfrowana komunikacja miedzy prawnikiem a klientem z mozliwoscia zalaczania plikow PDF, JPG i DOCX."
            />
            <FeatureCard
              icon={<FolderOpen className="h-6 w-6" />}
              title="Zarzadzanie sprawami"
              description="Tworzenie spraw, przypisywanie klientow, kontrola nad dokumentacja i sledzenie statusow postepowan."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Obieg dokumentow"
              description="Wysylanie i odbieranie plikow PDF, JPG, PNG i DOCX z podgladem w przegladarce i pelna historia wersji."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Wyszukiwanie"
              description="Szybkie wyszukiwanie spraw, dokumentow i klientow po nazwie, sygnaturze lub dacie."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Asystent AI"
              description="Wbudowany asystent ChatGPT pomagajacy w analizie prawnej, przygotowaniu pism i interpretacji przepisow."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Kalendarz terminow"
              description="Zarzadzanie terminami rozpraw, spotkan i terminow procesowych z automatycznymi przypomnieniami."
            />
            <FeatureCard
              icon={<Eye className="h-6 w-6" />}
              title="Panel klienta"
              description="Dedykowany panel dla klientow z podgladem spraw, dokumentow i mozliwoscia kontaktu z prawnikiem."
            />
            <FeatureCard
              icon={<Users className="h-6 w-6" />}
              title="Panel administracyjny"
              description="Zarzadzanie uzytkownikami, rolami, weryfikacja kont prawnikow i kontrola dostepu do systemu."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Bezpieczne logowanie"
              description="Logowanie przez Google, GitHub, Apple lub email. Wielopoziomowe uwierzytelnianie i ochrona danych."
            />
          </div>
        </div>
      </section>

      <section id="jak-to-dziala" className="py-20 px-4 border-t border-border" data-testid="section-how-it-works">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Jak to dziala?</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Trzy proste kroki do rozpoczecia pracy z systemem
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              step={1}
              icon={<UserPlus className="h-8 w-8" />}
              title="Rejestracja"
              description="Zaloz konto jako prawnik lub klient. Wybierz swoja role i uzupelnij dane profilowe niezbedne do korzystania z platformy."
            />
            <StepCard
              step={2}
              icon={<ClipboardCheck className="h-8 w-8" />}
              title="Weryfikacja"
              description="Konta prawnikow sa weryfikowane przez administratora. Klienci moga natychmiast korzystac z systemu po potwierdzeniu adresu email."
            />
            <StepCard
              step={3}
              icon={<Laptop className="h-8 w-8" />}
              title="Praca"
              description="Po aktywacji konta zyskujesz pelny dostep do systemu — komunikacji, dokumentow, spraw i asystenta AI."
            />
          </div>
        </div>
      </section>

      <section id="bezpieczenstwo" className="py-20 px-4 border-t border-border" data-testid="section-security">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Bezpieczenstwo</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-12">
            Twoje dane sa chronione na najwyzszym poziomie
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover-elevate" data-testid="card-security-rodo">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                  <Shield className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Zgodnosc z RODO</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    System zostal zaprojektowany zgodnie z wymogami Rozporzadzenia o Ochronie Danych Osobowych (RODO/GDPR).
                    Wszystkie dane osobowe sa przetwarzane zgodnie z obowiazujacymi przepisami prawa.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate" data-testid="card-security-encryption">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Szyfrowanie danych</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Cala komunikacja jest szyfrowana protokolem TLS/SSL.
                    Dane przechowywane w systemie sa chronione z wykorzystaniem nowoczesnych algorytmow kryptograficznych.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate" data-testid="card-security-access">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Kontrola dostepu</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    System rol i uprawnien zapewnia, ze kazdy uzytkownik ma dostep wylacznie do danych, ktore go dotycza.
                    Konta prawnikow podlegaja dodatkowej weryfikacji.
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="hover-elevate" data-testid="card-security-backup">
              <CardContent className="p-6 flex gap-4">
                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 text-primary">
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Kopie zapasowe</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Regularne kopie zapasowe bazy danych zapewniaja bezpieczenstwo i ciaglosc dzialania.
                    Dane sa przechowywane na zabezpieczonych serwerach z redundancja.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="klauzula" className="py-20 px-4 border-t border-border" data-testid="section-confidentiality">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Klauzula poufnosci</h2>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-8">
            Zobowiazanie do zachowania poufnosci informacji
          </p>
          <Card data-testid="card-confidentiality">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Wszelkie informacje przekazywane za posrednictwem platformy LexVault, w tym dane osobowe,
                dokumenty, korespondencja oraz inne materialy zwiazane ze sprawami prawnymi, stanowia
                informacje poufne i sa objete tajemnica zawodowa.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                Operator platformy zobowiazuje sie do zachowania pelnej poufnosci wszystkich danych
                przetwarzanych w systemie. Dostep do informacji jest ograniczony wylacznie do osob
                upowaznionych — prawnikow prowadzacych dana sprawe oraz ich klientow.
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Naruszenie zasad poufnosci moze skutkowac odpowiedzialnoscia prawna zgodnie
                z obowiazujacymi przepisami prawa polskiego, w tym Kodeksem karnym oraz ustawami
                regulujacymi tajemnice zawodowa adwokatow i radcow prawnych.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-4" data-testid="section-footer">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">LexVault</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Profesjonalna platforma do zarzadzania kancelaria prawna.
                Bezpieczna komunikacja, obieg dokumentow i analiza prawna w jednym systemie.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Linki</h4>
              <div className="flex flex-col gap-2">
                <Link href="/terms">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-terms">Regulamin</span>
                </Link>
                <Link href="/privacy">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-privacy">Polityka prywatnosci</span>
                </Link>
                <a href="#klauzula">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-confidentiality">Klauzula poufnosci</span>
                </a>
                <Link href="/contact">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-contact">Kontakt</span>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4 flex-shrink-0" />
                  <span data-testid="text-owner-name">Dominik Solarz</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span data-testid="text-owner-address">ul. Piastowska 2/1, 40-005 Katowice</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href="mailto:goldservicepoland@gmail.com" className="transition-colors" data-testid="link-owner-email">
                    goldservicepoland@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              &copy; 2026 Dominik Solarz. Wszelkie prawa zastrzezone.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <Link href="/terms">
                <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-bottom-terms">Regulamin</span>
              </Link>
              <Link href="/privacy">
                <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-bottom-privacy">Polityka prywatnosci</span>
              </Link>
              <Link href="/contact">
                <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-bottom-contact">Kontakt</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function RoleCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="hover-elevate" data-testid={`card-role-${title.toLowerCase().replace(/\s+/g, '-')}`}>
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

function StepCard({ step, icon, title, description }: { step: number; icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover-elevate" data-testid={`card-step-${step}`}>
      <CardContent className="p-6 text-center">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-bold text-lg mb-4">
          {step}
        </div>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-primary/10 text-primary mb-4">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}
