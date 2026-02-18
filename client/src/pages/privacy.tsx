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

      <main className="max-w-4xl mx-auto px-4 py-12" data-testid="privacy-policy-content">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Polityka Prywatnosci</h1>
        <p className="text-muted-foreground mb-8">Zgodna z Rozporzadzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO)</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground">

          <section data-testid="section-administrator">
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Administrator danych osobowych</h2>
            <p>Administratorem danych osobowych przetwarzanych w ramach serwisu LexVault jest:</p>
            <p><strong className="text-foreground">Dominik Solarz</strong></p>
            <p>ul. Piastowska 2/1, 40-005 Katowice</p>
            <p>Adres e-mail: <a href="mailto:goldservicepoland@gmail.com" className="text-primary underline" data-testid="link-admin-email">goldservicepoland@gmail.com</a></p>
            <p>Administrator nie wyznaczyl Inspektora Ochrony Danych. We wszelkich sprawach dotyczacych przetwarzania danych osobowych nalezy kontaktowac sie bezposrednio z Administratorem pod wskazanym adresem e-mail.</p>
          </section>

          <section data-testid="section-legal-bases">
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Podstawy prawne przetwarzania danych</h2>
            <p>Dane osobowe Uzytkownikow przetwarzane sa na podstawie art. 6 ust. 1 Rozporzadzenia Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. (RODO), w szczegolnosci:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Art. 6 ust. 1 lit. a RODO</strong> - zgoda osoby, ktorej dane dotycza, w szczegolnosci na przetwarzanie danych w celach komunikacyjnych oraz korzystanie z funkcji Asystenta AI.</li>
              <li><strong className="text-foreground">Art. 6 ust. 1 lit. b RODO</strong> - niezbednosc przetwarzania do wykonania umowy o swiadczenie uslug droga elektroniczna, ktorej strona jest osoba, ktorej dane dotycza, lub do podjecia dzialan na zadanie osoby, ktorej dane dotycza, przed zawarciem umowy.</li>
              <li><strong className="text-foreground">Art. 6 ust. 1 lit. c RODO</strong> - niezbednosc przetwarzania do wypelnienia obowiazku prawnego ciazacego na Administratorze, w tym obowiazkow wynikajacych z przepisow podatkowych i rachunkowych.</li>
              <li><strong className="text-foreground">Art. 6 ust. 1 lit. f RODO</strong> - niezbednosc przetwarzania do celow wynikajacych z prawnie uzasadnionych interesow realizowanych przez Administratora, takich jak zapewnienie bezpieczenstwa Serwisu, dochodzenie lub obrona roszczen oraz prowadzenie analiz wewnetrznych.</li>
            </ul>
          </section>

          <section data-testid="section-purposes">
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Cele przetwarzania danych</h2>
            <p>Dane osobowe Uzytkownikow przetwarzane sa w nastepujacych celach:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Swiadczenie uslug droga elektroniczna, w tym udostepnianie funkcjonalnosci Serwisu (zarzadzanie sprawami, wiadomosci, dokumenty, Asystent AI).</li>
              <li>Rejestracja i prowadzenie konta Uzytkownika w Serwisie.</li>
              <li>Zapewnienie bezpieczenstwa Serwisu, w tym ochrona przed nieautoryzowanym dostepem, naduzywaniem uslug oraz zapobieganie oszustwom.</li>
              <li>Realizacja obowiazkow prawnych ciazacych na Administratorze, w tym obowiazkow wynikajacych z przepisow prawa podatkowego i rachunkowego.</li>
              <li>Komunikacja z Uzytkownikiem, w tym odpowiadanie na zapytania, obsluga reklamacji oraz przesylanie powiadomien dotyczacych dzialania Serwisu.</li>
              <li>Dochodzenie lub obrona roszczen prawnych.</li>
            </ul>
          </section>

          <section data-testid="section-data-categories">
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Kategorie zbieranych danych</h2>
            <p>W ramach korzystania z Serwisu Administrator moze przetwarzac nastepujace kategorie danych osobowych:</p>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.1. Dane osobowe podawane przez Uzytkownika</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Imie i nazwisko</li>
              <li>Adres e-mail</li>
              <li>Numer telefonu</li>
              <li>Numer PESEL (w przypadku Klientow, gdy jest to wymagane do prowadzenia sprawy)</li>
              <li>Numer NIP (w przypadku podmiotow prowadzacych dzialalnosc gospodarcza)</li>
              <li>Adres zamieszkania lub adres korespondencyjny</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.2. Dane logowania</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Identyfikator uzytkownika</li>
              <li>Haslo (przechowywane wylacznie w formie zaszyfrowanej - hash bcrypt)</li>
              <li>Dane sesji (tokeny sesyjne)</li>
              <li>Data i godzina logowania</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.3. Dane urzadzenia i dane techniczne</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Adres IP</li>
              <li>Typ przegladarki internetowej</li>
              <li>System operacyjny</li>
              <li>Rozdzielczosc ekranu</li>
              <li>Jezyk przegladarki</li>
            </ul>

            <h3 className="text-lg font-medium text-foreground mt-4 mb-2">4.4. Dane z plikow cookies</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li>Identyfikator sesji (sesyjne pliki cookies)</li>
            </ul>
          </section>

          <section data-testid="section-rights">
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Prawa Uzytkownika</h2>
            <p>Kazdy Uzytkownik, ktorego dane osobowe sa przetwarzane przez Administratora, posiada nastepujace prawa:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Prawo dostepu do danych</strong> (art. 15 RODO) - prawo do uzyskania informacji o przetwarzanych danych osobowych oraz otrzymania ich kopii.</li>
              <li><strong className="text-foreground">Prawo do sprostowania danych</strong> (art. 16 RODO) - prawo do zadania poprawienia nieprawidlowych lub uzupelnienia niekompletnych danych osobowych.</li>
              <li><strong className="text-foreground">Prawo do usuniecia danych</strong> (art. 17 RODO) - prawo do zadania usuniecia danych osobowych (prawo do bycia zapomnianym), gdy nie istnieje podstawa prawna do ich dalszego przetwarzania.</li>
              <li><strong className="text-foreground">Prawo do ograniczenia przetwarzania</strong> (art. 18 RODO) - prawo do zadania ograniczenia przetwarzania danych osobowych w okreslonych sytuacjach.</li>
              <li><strong className="text-foreground">Prawo do przenoszenia danych</strong> (art. 20 RODO) - prawo do otrzymania danych osobowych w ustrukturyzowanym, powszechnie uzywanym formacie nadajacym sie do odczytu maszynowego.</li>
              <li><strong className="text-foreground">Prawo do sprzeciwu</strong> (art. 21 RODO) - prawo do wniesienia sprzeciwu wobec przetwarzania danych osobowych opartego na prawnie uzasadnionym interesie Administratora.</li>
              <li><strong className="text-foreground">Prawo do cofniecia zgody</strong> - w kazdym momencie, bez wplywu na zgodnosc z prawem przetwarzania dokonanego przed jej cofnieciem.</li>
              <li><strong className="text-foreground">Prawo do wniesienia skargi</strong> - do organu nadzorczego, ktorym jest Prezes Urzedu Ochrony Danych Osobowych (PUODO), ul. Stawki 2, 00-193 Warszawa, strona internetowa: <span className="text-primary">uodo.gov.pl</span>.</li>
            </ul>
            <p className="mt-3">W celu skorzystania z powyzszych praw nalezy skontaktowac sie z Administratorem pod adresem e-mail: <a href="mailto:goldservicepoland@gmail.com" className="text-primary underline">goldservicepoland@gmail.com</a>.</p>
          </section>

          <section data-testid="section-retention">
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Okres przechowywania danych</h2>
            <p>Dane osobowe Uzytkownikow przechowywane sa przez nastepujace okresy:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Dane konta Uzytkownika</strong> - przez caly okres posiadania aktywnego konta w Serwisie oraz przez 30 dni po jego usunieciu (w celu umozliwienia przywrocenia konta).</li>
              <li><strong className="text-foreground">Dane dotyczace spraw prawnych</strong> - przez okres prowadzenia sprawy oraz przez 10 lat od jej zakonczenia, zgodnie z obowiazujacymi przepisami dotyczacymi przechowywania dokumentacji prawnej.</li>
              <li><strong className="text-foreground">Dane komunikacyjne (wiadomosci)</strong> - przez okres prowadzenia sprawy, ktorej dotycza, oraz przez 5 lat od jej zakonczenia.</li>
              <li><strong className="text-foreground">Dane rozliczeniowe i podatkowe</strong> - przez okres wymagany przepisami prawa podatkowego i rachunkowego (co do zasady 5 lat od konca roku podatkowego).</li>
              <li><strong className="text-foreground">Dane techniczne i logi</strong> - przez okres 12 miesiecy od daty ich zebrania.</li>
              <li><strong className="text-foreground">Dane przetwarzane na podstawie zgody</strong> - do momentu cofniecia zgody przez Uzytkownika.</li>
            </ul>
            <p className="mt-3">Po uplywie okresow przechowywania dane osobowe sa trwale usuwane lub anonimizowane.</p>
          </section>

          <section data-testid="section-sharing">
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Udostepnianie danych osobowych</h2>
            <p>Dane osobowe Uzytkownikow moga byc przekazywane nastepujacym kategoriom odbiorcow:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Dostawca uslug hostingowych</strong> - w celu zapewnienia infrastruktury technicznej niezbednej do dzialania Serwisu. Dane przechowywane sa na serwerach znajdujacych sie na terenie Europejskiego Obszaru Gospodarczego (EOG).</li>
              <li><strong className="text-foreground">Dostawca uslug e-mail (SendGrid / Twilio Inc.)</strong> - w celu wysylania wiadomosci e-mail (powiadomienia, weryfikacja konta, komunikacja). SendGrid przetwarza dane zgodnie ze standardowymi klauzulami umownymi (SCC) zatwierdzonymi przez Komisje Europejska.</li>
              <li><strong className="text-foreground">Dostawca uslug AI (OpenAI)</strong> - w zwiazku z funkcja Asystenta AI dostepna w Serwisie. Dane przekazywane do OpenAI obejmuja wylacznie tresc zapytan wprowadzanych przez Uzytkownika w ramach Asystenta AI. <strong className="text-foreground">Uwaga:</strong> Administrator informuje, ze OpenAI moze przetwarzac dane na serwerach znajdujacych sie poza EOG. Transfer danych odbywa sie na podstawie standardowych klauzul umownych (SCC). Uzytkownik korzystajac z Asystenta AI wyra za zgode na przekazanie tresci zapytan do OpenAI.</li>
            </ul>
            <p className="mt-3">Administrator nie sprzedaje danych osobowych Uzytkownikow podmiotom trzecim. Dane nie sa wykorzystywane w celach marketingowych ani profilowania.</p>
          </section>

          <section data-testid="section-cookies">
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Polityka plikow cookies</h2>
            <p>Serwis LexVault wykorzystuje wylacznie sesyjne pliki cookies, niezbedne do prawidlowego dzialania Serwisu.</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Rodzaj cookies:</strong> sesyjne (wygasaja po zakonczeniu sesji przegladarki lub po uplywie okresu waznosci sesji).</li>
              <li><strong className="text-foreground">Cel:</strong> utrzymanie sesji zalogowanego Uzytkownika, zapewnienie bezpieczenstwa oraz prawidlowego dzialania Serwisu.</li>
              <li><strong className="text-foreground">Cookies sledzace:</strong> Serwis nie stosuje plikow cookies sledzacych, reklamowych ani analitycznych.</li>
              <li><strong className="text-foreground">Cookies podmiotow trzecich:</strong> Serwis nie osadza plikow cookies podmiotow trzecich.</li>
            </ul>
            <p className="mt-3">Uzytkownik moze zarzadzac ustawieniami plikow cookies w swojej przegladarce internetowej. Wylaczenie plikow cookies sesyjnych moze uniemozliwic korzystanie z Serwisu.</p>
          </section>

          <section data-testid="section-security">
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Srodki bezpieczenstwa</h2>
            <p>Administrator stosuje odpowiednie srodki techniczne i organizacyjne w celu ochrony danych osobowych przed nieuprawnionym dostepem, utrata, zniszczeniem lub ujawnieniem, w tym:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Szyfrowanie danych</strong> - hasla Uzytkownikow sa przechowywane w formie zaszyfrowanej z wykorzystaniem algorytmu bcrypt. Dane wrazliwe sa szyfrowane w bazie danych.</li>
              <li><strong className="text-foreground">Protokol HTTPS</strong> - cala komunikacja miedzy przegladarka Uzytkownika a Serwisem odbywa sie za posrednictwem szyfrowanego polaczenia HTTPS (TLS/SSL).</li>
              <li><strong className="text-foreground">Zarzadzanie sesjami</strong> - sesje Uzytkownikow maja ograniczony czas trwania. Po okresie nieaktywnosci sesja wygasa automatycznie.</li>
              <li><strong className="text-foreground">Kontrola dostepu oparta na rolach (RBAC)</strong> - dostep do danych i funkcjonalnosci Serwisu jest ograniczony w zaleznosci od roli Uzytkownika (Administrator, Prawnik, Klient). Kazda rola ma dostep wylacznie do danych niezbednych do realizacji jej zadan.</li>
              <li><strong className="text-foreground">Walidacja danych wejsciowych</strong> - wszystkie dane wprowadzane przez Uzytkownikow sa walidowane w celu zapobiegania atakom typu SQL injection, XSS i innym zagrożeniom.</li>
              <li><strong className="text-foreground">Izolacja danych</strong> - dane poszczegolnych Uzytkownikow i spraw sa od siebie odizolowane. Dostep do danych sprawy maja wylacznie uprawnieni uzytkownicy.</li>
            </ul>
          </section>

          <section data-testid="section-changes">
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Zmiany Polityki Prywatnosci</h2>
            <p>Administrator zastrzega sobie prawo do wprowadzania zmian w niniejszej Polityce Prywatnosci. Wszelkie zmiany beda publikowane w Serwisie z odpowiednim wyprzedzeniem.</p>
            <p>O istotnych zmianach Uzytkownik zostanie poinformowany za posrednictwem wiadomosci e-mail lub powiadomienia w Serwisie, co najmniej 14 dni przed wejsciem zmian w zycie.</p>
            <p>Dalsze korzystanie z Serwisu po wejsciu w zycie zmian oznacza akceptacje zaktualizowanej Polityki Prywatnosci.</p>
          </section>

          <section data-testid="section-contact">
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Dane kontaktowe</h2>
            <p>W sprawach dotyczacych przetwarzania danych osobowych prosimy o kontakt:</p>
            <ul className="list-none pl-0 space-y-1">
              <li><strong className="text-foreground">Administrator:</strong> Dominik Solarz</li>
              <li><strong className="text-foreground">Adres:</strong> ul. Piastowska 2/1, 40-005 Katowice</li>
              <li><strong className="text-foreground">E-mail:</strong> <a href="mailto:goldservicepoland@gmail.com" className="text-primary underline" data-testid="link-contact-email">goldservicepoland@gmail.com</a></li>
            </ul>
          </section>

          <section data-testid="section-effective-date">
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Data wejscia w zycie</h2>
            <p>Niniejsza Polityka Prywatnosci obowiazuje od dnia <strong className="text-foreground">1 stycznia 2026 roku</strong>.</p>
          </section>

        </div>
      </main>

      <footer className="border-t border-border mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground" data-testid="text-copyright">&copy; 2026 LexVault. Wszelkie prawa zastrzezone.</p>
          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/terms">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-terms">Regulamin</span>
            </Link>
            <Link href="/confidentiality">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-confidentiality">Klauzula poufnosci</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
