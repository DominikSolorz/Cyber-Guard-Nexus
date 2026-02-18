import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, Mail, MapPin, Phone, ArrowLeft } from "lucide-react";

export default function Contact() {
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
            <Link href="/">
              <Button variant="ghost" size="sm" data-testid="link-back">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Powrot
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-2" data-testid="text-contact-title">Kontakt</h1>
          <p className="text-muted-foreground mb-8">
            Skontaktuj sie z nami w sprawie systemu LexVault.
          </p>

          <div className="space-y-4">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a
                    href="mailto:goldservicepoland@gmail.com"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    data-testid="link-email"
                  >
                    goldservicepoland@gmail.com
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Adres</h3>
                  <p className="text-sm text-muted-foreground" data-testid="text-address">
                    Dominik Solarz
                    <br />
                    ul. Piastowska 2/1
                    <br />
                    40-005 Katowice
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 text-primary shrink-0">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Informacje</h3>
                  <p className="text-sm text-muted-foreground">
                    LexVault - Profesjonalny System Zarzadzania Dokumentami Prawnymi.
                    W razie pytan dotyczacych systemu, konta lub danych osobowych,
                    prosimy o kontakt mailowy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">LexVault</span>
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/terms">
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-terms">Regulamin</span>
            </Link>
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-privacy">Polityka prywatnosci</span>
            </Link>
            <Link href="/confidentiality">
              <span className="text-sm text-muted-foreground cursor-pointer transition-colors" data-testid="link-footer-confidentiality">Klauzula poufnosci</span>
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Dominik Solarz. Wszelkie prawa zastrzezone.
          </p>
        </div>
      </footer>
    </div>
  );
}
