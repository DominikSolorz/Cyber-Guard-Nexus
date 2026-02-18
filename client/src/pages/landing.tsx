import { useState } from "react";
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
  CheckCircle,
  Eye,
  Database,
  Mail,
  MapPin,
  Phone,
  Calendar,
  Sparkles,
  Globe,
  Clock,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

import heroLawImg from "@assets/hero-law.jpg";
import lawyerDigitalImg from "@assets/lawyer-digital.jpg";
import teamMeetingImg from "@assets/team-meeting.jpg";
import securityDataImg from "@assets/security-data.jpg";

export default function Landing() {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 glass-strong animate-fade-in">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer" data-testid="link-home">
                  <Shield className="h-7 w-7 text-primary" />
                  <span className="text-xl font-bold tracking-tight">
                    Lex<span className="text-primary">Vault</span>
                  </span>
                </div>
              </Link>
              <div className="hidden md:flex items-center gap-1">
                <a href="#o-platformie">
                  <Button variant="ghost" size="sm" data-testid="link-about">O platformie</Button>
                </a>
                <a href="#funkcje">
                  <Button variant="ghost" size="sm" data-testid="link-features">Funkcje</Button>
                </a>
                <a href="#bezpieczenstwo">
                  <Button variant="ghost" size="sm" data-testid="link-security">Bezpieczenstwo</Button>
                </a>
                <Link href="/contact">
                  <Button variant="ghost" size="sm" data-testid="link-contact">Kontakt</Button>
                </Link>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <Link href="/dashboard">
                  <Button size="sm" data-testid="link-dashboard">Panel</Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" size="sm" data-testid="link-login">Zaloguj sie</Button>
                  </Link>
                  <Link href="/login">
                    <Button size="sm" data-testid="link-register">Rejestracja</Button>
                  </Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
            <div className="px-4 py-3 space-y-1">
              <a href="#o-platformie" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="link-mobile-about">O platformie</Button>
              </a>
              <a href="#funkcje" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="link-mobile-features">Funkcje</Button>
              </a>
              <a href="#bezpieczenstwo" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="link-mobile-security">Bezpieczenstwo</Button>
              </a>
              <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="link-mobile-contact">Kontakt</Button>
              </Link>
              <div className="border-t border-border pt-2 mt-2 flex flex-col gap-1">
                {user ? (
                  <Link href="/dashboard">
                    <Button size="sm" className="w-full" data-testid="link-mobile-dashboard">Panel</Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full" data-testid="link-mobile-login">Zaloguj sie</Button>
                    </Link>
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button size="sm" className="w-full" data-testid="link-mobile-register">Rejestracja</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <section className="relative pt-16 min-h-[600px] flex items-center overflow-hidden bg-gradient-mesh" data-testid="section-hero">
        <div className="absolute inset-0">
          <img
            src={heroLawImg}
            alt="Kancelaria prawna"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/75 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-primary/40 bg-primary/15 text-primary text-sm mb-6 glass animate-fade-in-up">
              <Scale className="h-3.5 w-3.5 animate-float" />
              <span>Profesjonalna platforma prawna</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight mb-6 text-white animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              Nowoczesne zarzadzanie
              <br />
              <span className="text-primary">kancelaria prawna</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl animate-fade-in-up" style={{animationDelay: "0.2s"}}>
              LexVault to kompleksowy system do prowadzenia spraw prawnych, komunikacji z klientami, obiegu dokumentow i analizy prawnej z asystentem AI. Bezpiecznie i zgodnie z RODO.
            </p>
            <div className="flex items-center gap-3 flex-wrap animate-fade-in-up" style={{animationDelay: "0.3s"}}>
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg" data-testid="button-hero-dashboard">
                    Przejdz do panelu
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/login">
                    <Button size="lg" data-testid="button-hero-login">
                      Rozpocznij za darmo
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <a href="#o-platformie">
                    <Button variant="outline" size="lg" className="backdrop-blur-sm bg-white/5" data-testid="button-hero-learn">
                      Dowiedz sie wiecej
                    </Button>
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 border-t border-border" data-testid="section-stats">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatItem icon={<Shield className="h-5 w-5" />} value="RODO" label="Pelna zgodnosc z przepisami" testId="stat-rodo" />
            <StatItem icon={<Lock className="h-5 w-5" />} value="TLS/SSL" label="Szyfrowanie komunikacji" testId="stat-tls" />
            <StatItem icon={<Clock className="h-5 w-5" />} value="24/7" label="Dostep do systemu" testId="stat-access" />
            <StatItem icon={<Globe className="h-5 w-5" />} value="PL" label="Polski system prawny" testId="stat-pl" />
          </div>
        </div>
      </section>

      <section id="o-platformie" className="py-20 px-4 border-t border-border" data-testid="section-about">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in-up">
                Platforma stworzona
                <br />
                <span className="gradient-text">dla profesjonalistow</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                LexVault to zaawansowany system zarzadzania kancelaria prawna, ktory laczy w sobie
                najnowsze technologie z wymogami polskiego systemu prawnego. Platforma umozliwia
                efektywne prowadzenie spraw, bezpieczna komunikacje z klientami oraz pelny obieg dokumentow.
              </p>
              <div className="space-y-4">
                <AboutPoint
                  icon={<MessageSquare className="h-4 w-4" />}
                  title="Bezposrednia komunikacja"
                  desc="Szyfrowany czat miedzy prawnikiem a klientem z mozliwoscia przesylania plikow."
                />
                <AboutPoint
                  icon={<FolderOpen className="h-4 w-4" />}
                  title="Pelny obieg dokumentow"
                  desc="Zarzadzanie dokumentami z podgladem PDF, JPG, PNG i DOCX w przegladarce."
                />
                <AboutPoint
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Asystent AI"
                  desc="Wbudowany ChatGPT ze znajomoscia polskiego prawa — pomoc w analizie i przygotowaniu pism."
                />
                <AboutPoint
                  icon={<Calendar className="h-4 w-4" />}
                  title="Kalendarz terminow"
                  desc="Rozprawy, spotkania i terminy procesowe w przejrzystym kalendarzu."
                />
              </div>
            </div>
            <div className="relative">
              <div className="rounded-md overflow-hidden shadow-2xl hover-lift transition-all-smooth">
                <img
                  src={lawyerDigitalImg}
                  alt="Nowoczesna kancelaria prawna"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -left-4 glass-strong text-primary-foreground px-4 py-3 rounded-md shadow-lg animate-scale-in">
                <div className="text-sm font-semibold">Zgodne z RODO</div>
                <div className="text-xs opacity-80">Rozp. 2016/679</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="funkcje" className="py-20 px-4 border-t border-border" data-testid="section-features">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-in-up">Funkcje systemu</h2>
            <p className="text-muted-foreground max-w-xl mx-auto animate-fade-in-up" style={{animationDelay: "0.1s"}}>
              Kompletny zestaw narzedzi do profesjonalnego prowadzenia spraw prawnych
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
              title="Czat prawnik-klient"
              description="Bezposrednia, szyfrowana komunikacja miedzy prawnikiem a klientem z mozliwoscia zalaczania plikow PDF, JPG i DOCX."
            />
            <FeatureCard
              icon={<FolderOpen className="h-6 w-6" />}
              title="Zarzadzanie sprawami"
              description="Tworzenie spraw wedlug kategorii polskiego systemu prawnego, przypisywanie klientow i sledzenie statusow."
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6" />}
              title="Obieg dokumentow"
              description="Wysylanie i odbieranie plikow z podgladem w przegladarce. Pelna historia dokumentacji sprawy."
            />
            <FeatureCard
              icon={<Search className="h-6 w-6" />}
              title="Wyszukiwanie"
              description="Szybkie przeszukiwanie spraw, dokumentow i klientow po nazwie, sygnaturze lub dacie."
            />
            <FeatureCard
              icon={<Sparkles className="h-6 w-6" />}
              title="Asystent AI"
              description="Wbudowany ChatGPT ze znajomoscia polskiego prawa — Kodeks cywilny, karny, rodzinny, pracy i inne."
            />
            <FeatureCard
              icon={<Calendar className="h-6 w-6" />}
              title="Kalendarz rozpraw"
              description="Zarzadzanie terminami rozpraw sadowych, spotkan i terminow procesowych w widoku miesiecznym i tygodniowym."
            />
            <FeatureCard
              icon={<Eye className="h-6 w-6" />}
              title="Panel klienta"
              description="Dedykowany panel umozliwiajacy klientowi podglad spraw, dokumentow i bezposredni kontakt z prawnikiem."
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6" />}
              title="Weryfikacja email"
              description="Dwuetapowa weryfikacja tozsamosci przez kod email. Bezpieczne logowanie przez Google, GitHub lub Apple."
            />
            <FeatureCard
              icon={<Lock className="h-6 w-6" />}
              title="Kontrola dostepu"
              description="System rol i uprawnien gwarantuje, ze kazdy uzytkownik widzi wylacznie dane, ktore go dotycza."
            />
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border" data-testid="section-workflow">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="rounded-md overflow-hidden shadow-2xl hover-lift transition-all-smooth">
                <img
                  src={teamMeetingImg}
                  alt="Zespol prawnikow"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in-up">
                Jak zaczac korzystac
                <br />
                <span className="gradient-text">z LexVault?</span>
              </h2>
              <div className="space-y-6">
                <StepItem
                  step={1}
                  title="Rejestracja"
                  description="Zaloz konto w kilka sekund. Wybierz swoja role i uzupelnij dane profilowe."
                />
                <StepItem
                  step={2}
                  title="Weryfikacja"
                  description="Potwierdz adres email kodem weryfikacyjnym. Twoje konto jest natychmiast aktywne."
                />
                <StepItem
                  step={3}
                  title="Praca z systemem"
                  description="Pelny dostep do wszystkich funkcji — sprawy, dokumenty, komunikacja i asystent AI."
                />
              </div>
              <div className="mt-8">
                {user ? (
                  <Link href="/dashboard">
                    <Button data-testid="button-workflow-dashboard">
                      Przejdz do panelu
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <a href="/api/login">
                    <Button data-testid="button-workflow-register">
                      Zaloz konto
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="bezpieczenstwo" className="py-20 px-4 border-t border-border" data-testid="section-security">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-fade-in-up">
                Bezpieczenstwo
                <br />
                <span className="gradient-text">na najwyzszym poziomie</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                Dane Twoich klientow sa chronione zgodnie z najwyzszymi standardami bezpieczenstwa.
                System jest w pelni zgodny z RODO i przepisami o tajemnicy zawodowej.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SecurityCard
                  icon={<Shield className="h-5 w-5" />}
                  title="Zgodnosc z RODO"
                  desc="Przetwarzanie danych zgodne z Rozporzadzeniem 2016/679."
                />
                <SecurityCard
                  icon={<Lock className="h-5 w-5" />}
                  title="Szyfrowanie TLS"
                  desc="Cala komunikacja chroniona protokolem SSL/TLS."
                />
                <SecurityCard
                  icon={<CheckCircle className="h-5 w-5" />}
                  title="Kontrola dostepu"
                  desc="Wielopoziomowy system rol i uprawnien."
                />
                <SecurityCard
                  icon={<Database className="h-5 w-5" />}
                  title="Kopie zapasowe"
                  desc="Regularne backupy na zabezpieczonych serwerach."
                />
              </div>
            </div>
            <div className="relative">
              <div className="rounded-md overflow-hidden shadow-2xl hover-lift transition-all-smooth">
                <img
                  src={securityDataImg}
                  alt="Bezpieczenstwo danych"
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 glass-strong text-primary-foreground px-4 py-3 rounded-md shadow-lg animate-scale-in">
                <div className="text-sm font-semibold">Tajemnica zawodowa</div>
                <div className="text-xs opacity-80">Ustawa o ustroju sadow</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 border-t border-border" data-testid="section-cta">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-in-up">
            Gotowy na nowoczesna <span className="gradient-text">kancelarie?</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8 leading-relaxed">
            Dolacz do platformy LexVault i zacznij korzystac z pelni mozliwosci systemu
            zarzadzania kancelaria prawna. Rejestracja jest szybka i darmowa.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            {user ? (
              <Link href="/dashboard">
                <Button size="lg" data-testid="button-cta-dashboard">
                  Przejdz do panelu
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            ) : (
              <>
                <a href="/api/login">
                  <Button size="lg" data-testid="button-cta-register">
                    Zaloz konto za darmo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </a>
                <Link href="/contact">
                  <Button variant="outline" size="lg" data-testid="button-cta-contact">
                    Skontaktuj sie
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-10 px-4" data-testid="section-footer">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <span className="font-semibold text-lg">LexVault</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Profesjonalna platforma do zarzadzania kancelaria prawna. Bezpieczna, nowoczesna, zgodna z RODO.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platforma</h4>
              <div className="flex flex-col gap-2">
                <a href="#o-platformie" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-about">O platformie</a>
                <a href="#funkcje" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-features">Funkcje</a>
                <a href="#bezpieczenstwo" className="text-sm text-muted-foreground transition-colors" data-testid="link-footer-security">Bezpieczenstwo</a>
                <Link href="/contact">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-contact">Kontakt</span>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Prawne</h4>
              <div className="flex flex-col gap-2">
                <Link href="/terms">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-terms">Regulamin</span>
                </Link>
                <Link href="/privacy">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-privacy">Polityka prywatnosci (RODO)</span>
                </Link>
                <Link href="/confidentiality">
                  <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-confidentiality">Klauzula poufnosci</span>
                </Link>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Kontakt</h4>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <Scale className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span data-testid="text-owner-name">Dominik Solarz</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0 text-primary" />
                  <span data-testid="text-owner-address">ul. Piastowska 2/1, 40-005 Katowice</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                  <a href="mailto:goldservicepoland@gmail.com" className="transition-colors" data-testid="link-owner-email">
                    goldservicepoland@gmail.com
                  </a>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                  <Link href="/contact">
                    <span className="cursor-pointer transition-colors" data-testid="link-footer-contact-page">Strona kontaktowa</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" data-testid="text-copyright">
              &copy; 2026 Dominik Solarz. Wszelkie prawa zastrzezone.
            </p>
            <div className="flex items-center gap-4 flex-wrap">
              <Link href="/terms">
                <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-bottom-terms">Regulamin</span>
              </Link>
              <Link href="/privacy">
                <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-bottom-privacy">Polityka prywatnosci</span>
              </Link>
              <Link href="/confidentiality">
                <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-bottom-confidentiality">Klauzula poufnosci</span>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function StatItem({ icon, value, label, testId }: { icon: React.ReactNode; value: string; label: string; testId: string }) {
  return (
    <div className="text-center transition-all-smooth hover-lift" data-testid={testId}>
      <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary mb-3 animate-scale-in">
        {icon}
      </div>
      <div className="text-2xl font-bold gradient-text mb-1">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function AboutPoint({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex gap-3" data-testid={`about-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 text-primary mt-0.5">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="hover-lift transition-all-smooth glass" data-testid={`card-feature-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary mb-4 animate-float">
          {icon}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  );
}

function StepItem({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="flex gap-4" data-testid={`step-${step}`}>
      <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-md bg-primary text-primary-foreground font-bold text-lg">
        {step}
      </div>
      <div>
        <h4 className="font-semibold mb-1">{title}</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function SecurityCard({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <Card className="hover-lift transition-all-smooth glass" data-testid={`card-security-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-4 flex gap-3">
        <div className="flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-md bg-primary/10 text-primary animate-glow">
          {icon}
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-0.5">{title}</h4>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </CardContent>
    </Card>
  );
}
