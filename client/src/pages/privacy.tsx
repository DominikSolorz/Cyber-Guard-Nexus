import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4 flex-wrap">
          <Link href="/">
            <Button variant="ghost" size="sm" data-testid="button-back">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Powrot
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">LexVault</span>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Polityka prywatnosci (RODO)</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Administrator danych osobowych</h2>
            <p>Administratorem danych osobowych jest Dominik Solarz, prowadzacy dzialalnosc pod adresem: ul. Piastowska 2/1, 40-005 Katowice.</p>
            <p>Kontakt z administratorem: goldservicepoland@gmail.com</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Cele przetwarzania danych</h2>
            <p>Dane osobowe Uzytkownikow sa przetwarzane w celu:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Swiadczenia uslug droga elektroniczna (art. 6 ust. 1 lit. b RODO)</li>
              <li>Zapewnienia bezpieczenstwa uslug (art. 6 ust. 1 lit. f RODO)</li>
              <li>Realizacji obowiazkow prawnych (art. 6 ust. 1 lit. c RODO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Zakres zbieranych danych</h2>
            <p>W ramach rejestracji zbierane sa nastepujace dane:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Imie i nazwisko</li>
              <li>Adres e-mail</li>
              <li>Numer telefonu</li>
              <li>Data urodzenia</li>
            </ul>
            <p>Haslo uzytkownika jest przechowywane wylacznie w formie zaszyfrowanej (hash bcrypt).</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Prawa uzytkownika</h2>
            <p>Uzytkownik ma prawo do:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dostepu do swoich danych osobowych</li>
              <li>Sprostowania danych</li>
              <li>Usuniecia danych (prawo do bycia zapomnianym)</li>
              <li>Ograniczenia przetwarzania</li>
              <li>Przenoszenia danych</li>
              <li>Wniesienia sprzeciwu wobec przetwarzania</li>
              <li>Wniesienia skargi do organu nadzorczego (PUODO)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Okres przechowywania danych</h2>
            <p>Dane osobowe sa przechowywane przez okres korzystania z Serwisu oraz przez okres wymagany przepisami prawa po zakonczeniu korzystania z uslug.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Bezpieczenstwo danych</h2>
            <p>Administrator stosuje odpowiednie srodki techniczne i organizacyjne w celu ochrony danych osobowych, w tym:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Szyfrowanie hasel algorytmem bcrypt</li>
              <li>Sesje uzytkownikow z ograniczonym czasem trwania</li>
              <li>Walidacje danych wejsciowych</li>
              <li>Izolacje danych miedzy uzytkownikami</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Pliki cookies</h2>
            <p>Serwis wykorzystuje pliki cookies wylacznie w celu utrzymania sesji uzytkownika. Nie sa stosowane pliki cookies sledzace ani reklamowe.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Zmiany polityki prywatnosci</h2>
            <p>Administrator zastrzega sobie prawo do wprowadzenia zmian w niniejszej Polityce Prywatnosci. O wszelkich zmianach Uzytkownik zostanie poinformowany za posrednictwem Serwisu.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
