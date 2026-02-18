import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

export default function Terms() {
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
        <h1 className="text-3xl font-bold mb-8">Regulamin serwisu LexVault</h1>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-muted-foreground">
          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Postanowienia ogolne</h2>
            <p>Niniejszy regulamin okresla zasady korzystania z serwisu internetowego LexVault, dostepnego pod adresem internetowym aplikacji.</p>
            <p>Wlascicielem serwisu jest: Dominik Solarz, ul. Piastowska 2/1, 40-005 Katowice. Kontakt: goldservicepoland@gmail.com</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Definicje</h2>
            <p><strong className="text-foreground">Serwis</strong> - aplikacja internetowa LexVault sluzaca do zarzadzania dokumentami prawnymi.</p>
            <p><strong className="text-foreground">Uzytkownik</strong> - osoba fizyczna, ktora dokonala rejestracji w Serwisie.</p>
            <p><strong className="text-foreground">Konto</strong> - zestaw zasobow i uprawnien przypisanych konkretnemu Uzytkownikowi w ramach Serwisu.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Rejestracja i konto uzytkownika</h2>
            <p>Rejestracja w Serwisie jest dobrowolna i bezplatna. Uzytkownik zobowiazuje sie do podania prawdziwych danych osobowych podczas rejestracji.</p>
            <p>Uzytkownik ponosi odpowiedzialnosc za zachowanie poufnosci swojego hasla dostepu.</p>
            <p>Kazdy Uzytkownik moze posiadac tylko jedno Konto w Serwisie.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Zasady korzystania z Serwisu</h2>
            <p>Uzytkownik zobowiazuje sie do korzystania z Serwisu zgodnie z obowiazujacym prawem oraz postanowieniami niniejszego regulaminu.</p>
            <p>Zabronione jest przesylanie tresci niezgodnych z prawem, naruszajacych prawa osob trzecich lub dobre obyczaje.</p>
            <p>Uzytkownik jest odpowiedzialny za tresc przesylanych dokumentow.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Odpowiedzialnosc</h2>
            <p>Wlasciciel Serwisu doklada wszelkich staran w celu zapewnienia prawidlowego dzialania Serwisu, jednak nie gwarantuje jego nieprzerwanej i bezblednej pracy.</p>
            <p>Wlasciciel Serwisu nie ponosi odpowiedzialnosci za tresc dokumentow przesylanych przez Uzytkownikow.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Ochrona danych osobowych</h2>
            <p>Zasady przetwarzania danych osobowych okreslone sa w Polityce Prywatnosci, stanowiacej odrebny dokument.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Postanowienia koncowe</h2>
            <p>Wlasciciel Serwisu zastrzega sobie prawo do zmiany niniejszego regulaminu. Uzytkownik zostanie poinformowany o zmianach za posrednictwem Serwisu.</p>
            <p>W sprawach nieuregulowanych niniejszym regulaminem zastosowanie maja przepisy prawa polskiego.</p>
          </section>
        </div>
      </main>
    </div>
  );
}
