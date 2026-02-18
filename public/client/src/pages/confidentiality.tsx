import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, ArrowLeft } from "lucide-react";

export default function Confidentiality() {
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

      <main className="max-w-4xl mx-auto px-4 py-12" data-testid="confidentiality-content">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Klauzula Poufnosci</h1>
        <p className="text-muted-foreground mb-8">Zasady ochrony poufnosci informacji w serwisie LexVault</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground">

          <section data-testid="section-preamble">
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Postanowienia wstepne</h2>
            <p>Niniejsza Klauzula Poufnosci okresla zasady ochrony informacji poufnych przetwarzanych w ramach serwisu LexVault, ze szczegolnym uwzglednieniem tajemnicy zawodowej prawnikow oraz ochrony danych Klientow.</p>
            <p>Klauzula stanowi integralna czesc Regulaminu Serwisu LexVault i obowiazuje wszystkich Uzytkownikow Serwisu, niezaleznie od przypisanej roli.</p>
            <p>Klauzula zostala opracowana z uwzglednieniem nastepujacych aktow prawnych:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Ustawa z dnia 26 maja 1982 r. - Prawo o adwokaturze (Dz.U. z 2022 r. poz. 1184 ze zm.)</li>
              <li>Ustawa z dnia 6 lipca 1982 r. o radcach prawnych (Dz.U. z 2022 r. poz. 1166 ze zm.)</li>
              <li>Rozporzadzenie Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO)</li>
              <li>Ustawa z dnia 10 maja 2018 r. o ochronie danych osobowych (Dz.U. z 2019 r. poz. 1781)</li>
              <li>Kodeks cywilny - ustawa z dnia 23 kwietnia 1964 r. (Dz.U. z 2023 r. poz. 1610 ze zm.)</li>
              <li>Kodeks karny - ustawa z dnia 6 czerwca 1997 r. (Dz.U. z 2022 r. poz. 1138 ze zm.) - w zakresie art. 266 (naruszenie tajemnicy)</li>
            </ul>
          </section>

          <section data-testid="section-professional-secrecy">
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Tajemnica zawodowa prawnikow</h2>
            <p>Serwis LexVault zaprojektowany zostal z pelnym poszanowaniem tajemnicy zawodowej prawnikow, o ktorej mowa w:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Art. 6 ustawy Prawo o adwokaturze</strong> - adwokat obowiazany jest zachowac w tajemnicy wszystko, o czym dowiedzial sie w zwiazku z udzielaniem pomocy prawnej. Obowiazek ten nie jest ograniczony w czasie.</li>
              <li><strong className="text-foreground">Art. 3 ustawy o radcach prawnych</strong> - radca prawny jest obowiazany zachowac w tajemnicy wszystko, o czym dowiedzial sie w zwiazku z udzielaniem pomocy prawnej.</li>
            </ul>
            <p>Serwis LexVault wspiera realizacje obowiazku zachowania tajemnicy zawodowej poprzez:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Izolacje danych poszczegolnych spraw i Klientow - Prawnik ma dostep wylacznie do spraw, do ktorych zostal przypisany.</li>
              <li>Szyfrowanie komunikacji miedzy Prawnikiem a Klientem.</li>
              <li>Kontrole dostepu oparta na rolach, uniemozliwiajaca dostep osob nieuprawnionych do tresci objętych tajemnica.</li>
              <li>Brak mozliwosci przegladania tresci spraw przez Administratora systemu w zakresie tresci merytorycznych (dokumenty, wiadomosci) - Administrator posiada dostep wylacznie do danych technicznych i metadanych.</li>
            </ul>
          </section>

          <section data-testid="section-client-data">
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Obowiazki ochrony danych Klientow</h2>
            <p>Kazdy Uzytkownik Serwisu zobowiazany jest do:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Zachowania poufnosci wszelkich informacji uzyskanych w ramach korzystania z Serwisu, w szczegolnosci danych osobowych Klientow oraz tresci spraw prawnych.</li>
              <li>Niewykorzystywania informacji uzyskanych za posrednictwem Serwisu w celach innych niz realizacja uslug prawnych na rzecz Klienta.</li>
              <li>Nieudostepniania informacji poufnych osobom trzecim, chyba ze obowiazek taki wynika z bezwzglednie obowiazujacych przepisow prawa.</li>
              <li>Stosowania odpowiednich srodkow bezpieczenstwa przy korzystaniu z Serwisu, w tym zabezpieczenia urzadzenia dostepu, korzystania z bezpiecznego polaczenia internetowego oraz nieudostepniania danych logowania.</li>
              <li>Niezwlocznego powiadomienia Administratora o kazdym podejrzeniu naruszenia poufnosci danych.</li>
            </ul>
            <p>Prawnik ponosi odpowiedzialnosc za poufnosc danych Klientow rowniez po zakonczeniu wspolpracy z danym Klientem, zgodnie z zasadami tajemnicy zawodowej.</p>
          </section>

          <section data-testid="section-communication">
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Poufnosc komunikacji w ramach platformy</h2>
            <p>Komunikacja prowadzona za posrednictwem systemu wiadomosci w Serwisie LexVault objeta jest poufnoscia:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Wiadomosci wymieniane miedzy Prawnikiem a Klientem w ramach sprawy sa dostepne wylacznie dla stron tej komunikacji oraz Administratora w uzasadnionych przypadkach (np. reklamacja, nakazanie przez organ pantstwowy).</li>
              <li>Tresc wiadomosci nie jest wykorzystywana przez Administratora Serwisu w celach marketingowych, analitycznych ani zadnych innych celach niezwiazanych ze swiadczeniem uslug.</li>
              <li>Wiadomosci sa przechowywane w zaszyfrowanej bazie danych z ograniczonym dostepem.</li>
              <li>W przypadku korzystania z funkcji Asystenta AI, tresc zapytan moze byc przekazywana do zewnetrznego dostawcy uslug AI (OpenAI) wylacznie w celu wygenerowania odpowiedzi. Uzytkownik powinien unikac umieszczania danych wrazliwych w zapytaniach do Asystenta AI.</li>
            </ul>
          </section>

          <section data-testid="section-document-access">
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Ograniczenia dostepu do dokumentow</h2>
            <p>Dostep do dokumentow w Serwisie LexVault podlega scislym ograniczeniom:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Zasada minimalnego dostepu</strong> - kazdy Uzytkownik ma dostep wylacznie do dokumentow powiazanych ze sprawami, do ktorych zostal przypisany.</li>
              <li><strong className="text-foreground">Kontrola na poziomie sprawy</strong> - dokumenty sa powiazane z konkretnymi sprawami. Dostep do dokumentow sprawy maja wylacznie Prawnik prowadzacy sprawe oraz Klient bedacy strona w sprawie.</li>
              <li><strong className="text-foreground">Brak dostepu miedzy sprawami</strong> - Uzytkownik nie moze przegladac dokumentow nalezacych do spraw, do ktorych nie jest przypisany, nawet jezeli dotycza tego samego Klienta (chyba ze jest do nich rowniez przypisany).</li>
              <li><strong className="text-foreground">Ograniczenia dla Administratora</strong> - Administrator systemu posiada dostep do metadanych dokumentow (nazwa pliku, data przeslania, rozmiar) w celach administracyjnych, lecz nie posiada dostepu do tresci merytorycznej dokumentow powiazanych ze sprawami.</li>
              <li><strong className="text-foreground">Zakaz pobierania masowego</strong> - Serwis nie udostepnia funkcji pozwalajacych na masowe pobieranie lub eksport dokumentow z wielu spraw jednoczesnie.</li>
            </ul>
          </section>

          <section data-testid="section-penalties">
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Konsekwencje naruszenia poufnosci</h2>
            <p>Naruszenie obowiazkow poufnosci okreslonych w niniejszej Klauzuli moze skutkowac:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Konsekwencje w ramach Serwisu:</strong>
                <ul className="list-disc pl-6 mt-1 space-y-1">
                  <li>Natychmiastowe zablokowanie Konta Uzytkownika.</li>
                  <li>Trwale usuniecie Konta i odebranie dostepu do Serwisu.</li>
                  <li>Powiadomienie poszkodowanych stron o naruszeniu.</li>
                </ul>
              </li>
              <li><strong className="text-foreground">Odpowiedzialnosc cywilna:</strong> Uzytkownik, ktory naruszyl obowiazek poufnosci, ponosi odpowiedzialnosc odszkodowawcza na zasadach ogolnych Kodeksu cywilnego (art. 415 i nast.) wobec poszkodowanych stron.</li>
              <li><strong className="text-foreground">Odpowiedzialnosc karna:</strong> Naruszenie tajemnicy zawodowej przez Prawnika moze stanowic przestepstwo z art. 266 Kodeksu karnego (ujawnienie informacji uzyskanych w zwiazku z pelnieniem funkcji lub wykonywaniem pracy), zagrozzone kara grzywny, ograniczenia wolnosci albo pozbawienia wolnosci do lat 2.</li>
              <li><strong className="text-foreground">Odpowiedzialnosc dyscyplinarna:</strong> Prawnik naruszajacy tajemnice zawodowa podlega odpowiedzialnosci dyscyplinarnej na podstawie przepisow Prawa o adwokaturze lub ustawy o radcach prawnych, wlacznie z mozliwoscia zawieszenia lub pozbawienia prawa do wykonywania zawodu.</li>
              <li><strong className="text-foreground">Odpowiedzialnosc na gruncie RODO:</strong> Naruszenie przepisow o ochronie danych osobowych moze skutkowac nalozeniem kar administracyjnych przez Prezesa Urzedu Ochrony Danych Osobowych (PUODO) na podstawie art. 83 RODO.</li>
            </ul>
          </section>

          <section data-testid="section-law-references">
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Podstawy prawne</h2>
            <p>Niniejsza Klauzula Poufnosci opiera sie na nastepujacych przepisach prawa polskiego i europejskiego:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Prawo o adwokaturze</strong> (Dz.U. z 2022 r. poz. 1184 ze zm.) - art. 6 (tajemnica adwokacka).</li>
              <li><strong className="text-foreground">Ustawa o radcach prawnych</strong> (Dz.U. z 2022 r. poz. 1166 ze zm.) - art. 3 (tajemnica radcowska).</li>
              <li><strong className="text-foreground">RODO</strong> (Rozporzadzenie 2016/679) - w szczegolnosci art. 5 (zasady przetwarzania), art. 25 (ochrona danych w fazie projektowania), art. 32 (bezpieczenstwo przetwarzania).</li>
              <li><strong className="text-foreground">Kodeks karny</strong> (Dz.U. z 2022 r. poz. 1138 ze zm.) - art. 266 (naruszenie tajemnicy).</li>
              <li><strong className="text-foreground">Kodeks cywilny</strong> (Dz.U. z 2023 r. poz. 1610 ze zm.) - art. 415 i nast. (odpowiedzialnosc deliktowa), art. 471 i nast. (odpowiedzialnosc kontraktowa).</li>
              <li><strong className="text-foreground">Ustawa o ochronie danych osobowych</strong> (Dz.U. z 2019 r. poz. 1781) - przepisy krajowe uzupelniajace RODO.</li>
            </ul>
          </section>

          <section data-testid="section-data-handling">
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Procedury postepowania z danymi</h2>
            <p>W celu zapewnienia najwyzszego poziomu ochrony informacji poufnych, w Serwisie LexVault obowiazuja nastepujace procedury:</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">8.1. Przesylanie danych</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Wszelkie dane przesylane do i z Serwisu sa chronione protokolem HTTPS (TLS/SSL).</li>
              <li>Przesylanie dokumentow odbywa sie za posrednictwem szyfrowanego kanalu komunikacyjnego.</li>
              <li>Uzytkownik nie powinien przesylac danych poufnych za posrednictwem nieszyfrowanych kanalow komunikacji (np. zwykly e-mail) poza Serwisem.</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">8.2. Przechowywanie danych</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Dane przechowywane sa w zaszyfrowanej bazie danych z ograniczonym dostepem.</li>
              <li>Kopie zapasowe danych sa tworzone regularnie i przechowywane w sposob zabezpieczony.</li>
              <li>Dostep do bazy danych jest ograniczony do upowaznionych osob i monitorowany.</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">8.3. Usuwanie danych</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Po uplywie okresu przechowywania dane sa trwale usuwane z systemow Serwisu.</li>
              <li>Na zadanie Uzytkownika dane moga zostac usuniete wczesniej, z zastrzezeniem obowiazkow prawnych dotyczacych ich przechowywania.</li>
              <li>Usuniecie danych obejmuje rowniez kopie zapasowe, z zachowaniem odpowiedniego okresu rotacji kopii zapasowych.</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">8.4. Zglaszanie incydentow</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>W przypadku podejrzenia naruszenia poufnosci danych Uzytkownik zobowiazany jest niezwlocznie powiadomic Administratora pod adresem: <a href="mailto:goldservicepoland@gmail.com" className="text-primary underline" data-testid="link-incident-email">goldservicepoland@gmail.com</a>.</li>
              <li>Administrator zobowiazuje sie do podjecia natychmiastowych dzialan w celu zminimalizowania skutkow naruszenia.</li>
              <li>W przypadku naruszenia ochrony danych osobowych Administrator powiadomi organ nadzorczy (PUODO) w terminie 72 godzin od stwierdzenia naruszenia, zgodnie z art. 33 RODO.</li>
            </ul>
          </section>

          <section data-testid="section-effective-date">
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Data wejscia w zycie</h2>
            <p>Niniejsza Klauzula Poufnosci obowiazuje od dnia <strong className="text-foreground">1 stycznia 2026 roku</strong>.</p>
          </section>

        </div>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">&copy; 2026 LexVault. Wszelkie prawa zastrzezone.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/privacy">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-privacy">Polityka prywatnosci</span>
            </Link>
            <Link href="/terms">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-terms">Regulamin</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
