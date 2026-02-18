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

      <main className="max-w-4xl mx-auto px-4 py-12" data-testid="terms-content">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Regulamin Serwisu LexVault</h1>
        <p className="text-muted-foreground mb-8">Obowiazujacy od 1 stycznia 2026 roku</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-8 text-muted-foreground">

          <section data-testid="section-general">
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Postanowienia ogolne</h2>
            <p>Niniejszy Regulamin okresla zasady swiadczenia uslug droga elektroniczna za posrednictwem serwisu internetowego LexVault (dalej: "Serwis").</p>
            <p>Wlascicielem i operatorem Serwisu jest:</p>
            <p><strong className="text-foreground">Dominik Solarz</strong></p>
            <p>ul. Piastowska 2/1, 40-005 Katowice</p>
            <p>Adres e-mail: <a href="mailto:goldservicepoland@gmail.com" className="text-primary underline" data-testid="link-owner-email">goldservicepoland@gmail.com</a></p>
            <p>Korzystanie z Serwisu oznacza akceptacje niniejszego Regulaminu w calosci.</p>
          </section>

          <section data-testid="section-definitions">
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Definicje</h2>
            <p>Uzycie w Regulaminie ponizszych pojec oznacza:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Serwis</strong> - aplikacja internetowa LexVault dostepna pod adresem internetowym, sluzaca do zarzadzania sprawami prawnymi, dokumentami, komunikacja oraz wspomagania pracy prawnikow i ich klientow.</li>
              <li><strong className="text-foreground">Uzytkownik</strong> - kazda osoba fizyczna, ktora dokonala rejestracji w Serwisie i posiada aktywne Konto, niezaleznie od przypisanej roli.</li>
              <li><strong className="text-foreground">Konto</strong> - zindywidualizowany zestaw zasobow, danych i uprawnien przypisanych konkretnemu Uzytkownikowi w ramach Serwisu, utworzony w procesie rejestracji.</li>
              <li><strong className="text-foreground">Prawnik</strong> - Uzytkownik posiadajacy role "prawnik" w Serwisie, uprawniony do zarzadzania sprawami, tworzenia dokumentow, komunikacji z Klientami oraz korzystania z pelnego zakresu funkcjonalnosci Serwisu.</li>
              <li><strong className="text-foreground">Klient</strong> - Uzytkownik posiadajacy role "klient" w Serwisie, majacy dostep do spraw, w ktorych jest strona, oraz do komunikacji z przypisanym Prawnikiem.</li>
              <li><strong className="text-foreground">Sprawa</strong> - jednostka organizacyjna w Serwisie reprezentujaca konkretna sprawe prawna, zawierajaca powiazane dokumenty, wiadomosci, notatki oraz informacje o stronach.</li>
              <li><strong className="text-foreground">Dokument</strong> - plik lub tresc przesylana, przechowywana lub generowana w ramach Serwisu, powiazana z konkretna Sprawa.</li>
            </ul>
          </section>

          <section data-testid="section-registration">
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Rejestracja i konto Uzytkownika</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Rejestracja w Serwisie jest dobrowolna. Warunkiem korzystania z funkcjonalnosci Serwisu jest zalozenie Konta.</li>
              <li>Podczas rejestracji Uzytkownik zobowiazuje sie do podania prawdziwych, aktualnych i kompletnych danych osobowych.</li>
              <li>Uzytkownik ponosi pelna odpowiedzialnosc za zachowanie poufnosci swojego hasla dostepu do Konta.</li>
              <li>Kazdy Uzytkownik moze posiadac wylacznie jedno Konto w Serwisie.</li>
              <li>Uzytkownik zobowiazany jest do niezwlocznej aktualizacji swoich danych w przypadku ich zmiany.</li>
              <li>Konto moze zostac zweryfikowane za posrednictwem adresu e-mail podanego podczas rejestracji.</li>
              <li>Administrator zastrzega sobie prawo do odmowy rejestracji lub zablokowania Konta w przypadku naruszenia postanowien Regulaminu.</li>
            </ul>
          </section>

          <section data-testid="section-roles">
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Role i uprawnienia Uzytkownikow</h2>
            <p>W Serwisie funkcjonuja nastepujace role:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Administrator</strong> - posiada pelny dostep do wszystkich funkcjonalnosci Serwisu, w tym zarzadzania Uzytkownikami, sprawami, ustawieniami systemowymi oraz monitorowania aktywnosci.</li>
              <li><strong className="text-foreground">Prawnik</strong> - posiada dostep do zarzadzania przypisanymi sprawami, tworzenia i edycji dokumentow, komunikacji z Klientami, korzystania z Asystenta AI oraz generowania raportow.</li>
              <li><strong className="text-foreground">Klient</strong> - posiada dostep do przegladania spraw, w ktorych jest strona, komunikacji z przypisanym Prawnikiem, przegladania dokumentow udostepnionych przez Prawnika oraz przesylania dokumentow.</li>
            </ul>
            <p>Dostep do danych i funkcjonalnosci Serwisu jest ograniczony zgodnie z przypisana rola (zasada najmniejszych uprawnien).</p>
          </section>

          <section data-testid="section-services">
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Opis uslug</h2>
            <p>Serwis LexVault umozliwia korzystanie z nastepujacych uslug:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-foreground">Zarzadzanie sprawami</strong> - tworzenie, edycja i sledzenie postepow spraw prawnych, przypisywanie Klientow i Prawnikow, zarzadzanie terminami i statusami.</li>
              <li><strong className="text-foreground">System wiadomosci</strong> - komunikacja miedzy Prawnikami a Klientami w ramach przypisanych spraw, z mozliwoscia przesylania zalacznikow.</li>
              <li><strong className="text-foreground">Zarzadzanie dokumentami</strong> - przesylanie, przechowywanie, organizowanie i udostepnianie dokumentow w ramach spraw prawnych.</li>
              <li><strong className="text-foreground">Asystent AI</strong> - narzedzie wspomagajace prace prawnika, umozliwiajace analiz e tekstow, generowanie propozycji dokumentow oraz udzielanie ogolnych informacji prawnych.</li>
            </ul>
          </section>

          <section data-testid="section-ai-disclaimer">
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Asystent AI - zastrzezenia</h2>
            <p><strong className="text-foreground">Asystent AI dostepny w Serwisie nie stanowi porady prawnej i nie zastepuje konsultacji z wykwalifikowanym prawnikiem.</strong></p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tresci generowane przez Asystenta AI maja charakter wylacznie informacyjny i pomocniczy.</li>
              <li>Asystent AI moze generowac odpowiedzi niepelne, nieaktualne lub bledne. Uzytkownik jest zobowiazany do samodzielnej weryfikacji wszelkich informacji uzyskanych za posrednictwem Asystenta AI.</li>
              <li>Administrator nie ponosi odpowiedzialnosci za decyzje podjete na podstawie tresci wygenerowanych przez Asystenta AI.</li>
              <li>Tresc zapytan kierowanych do Asystenta AI moze byc przekazywana do zewnetrznego dostawcy uslug AI (OpenAI) w celu przetworzenia. Szczegoly dotyczace przetwarzania danych okreslone sa w Polityce Prywatnosci.</li>
              <li>Uzytkownik nie powinien wprowadzac danych wrazliwych (np. PESEL, numery dokumentow) w zapytaniach do Asystenta AI, chyba ze jest to bezwzglednie konieczne do uzyskania odpowiedzi.</li>
            </ul>
          </section>

          <section data-testid="section-obligations">
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Obowiazki Uzytkownika</h2>
            <p>Uzytkownik zobowiazuje sie do:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Korzystania z Serwisu zgodnie z obowiazujacym prawem polskim oraz postanowieniami niniejszego Regulaminu.</li>
              <li>Podawania prawdziwych i aktualnych danych osobowych.</li>
              <li>Nieudostepniania swoich danych logowania osobom trzecim.</li>
              <li>Niezwlocznego informowania Administratora o kazdym przypadku nieautoryzowanego dostepu do Konta.</li>
              <li>Poszanowania praw wlasnosci intelektualnej Administratora oraz osob trzecich.</li>
              <li>Niepodejmowania dzialan mogacych zaklucic prawidlowe funkcjonowanie Serwisu.</li>
            </ul>
          </section>

          <section data-testid="section-prohibited">
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Tresci zabronione</h2>
            <p>Zabronione jest przesylanie, publikowanie lub udostepnianie za posrednictwem Serwisu tresci, ktore:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Sa niezgodne z obowiazujacym prawem polskim lub miedzynarodowym.</li>
              <li>Naruszaja prawa osob trzecich, w tym prawa autorskie, znaki towarowe, dobra osobiste.</li>
              <li>Zawieraja tresci obsceniczne, obraźliwe, dyskryminujace lub nawolujace do przemocy.</li>
              <li>Zawieraja zlośliwe oprogramowanie (wirusy, trojany, ransomware itp.).</li>
              <li>Stanowia spam lub niezamawiana korespondencje handlowa.</li>
              <li>Maja na celu wprowadzenie w blad lub oszustwo.</li>
            </ul>
            <p>Administrator zastrzega sobie prawo do usuniecia tresci naruszajacych powyzsze zasady bez uprzedniego powiadomienia.</p>
          </section>

          <section data-testid="section-ip">
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Wlasnosc intelektualna</h2>
            <p>Serwis LexVault, w tym jego struktura, kod zrodlowy, interfejs graficzny, logo, nazwy i znaki towarowe, stanowia wlasnosc intelektualna Administratora i sa chronione przepisami prawa autorskiego oraz prawa wlasnosci przemyslowej.</p>
            <p>Uzytkownik nie nabywa zadnych praw wlasnosci intelektualnej do Serwisu ani jego elementow poprzez korzystanie z Serwisu.</p>
            <p>Tresci przesylane przez Uzytkownika (dokumenty, wiadomosci) pozostaja wlasnoscia Uzytkownika. Administrator uzyskuje jedynie licencje na ich przechowywanie i przetwarzanie w zakresie niezbednym do swiadczenia uslug.</p>
          </section>

          <section data-testid="section-liability">
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Ograniczenie odpowiedzialnosci</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Administrator doklada wszelkich staran w celu zapewnienia prawidlowego i nieprzerwanego dzialania Serwisu, jednak nie gwarantuje jego dostepnosci 24/7.</li>
              <li>Administrator nie ponosi odpowiedzialnosci za przerwy w dzialaniu Serwisu spowodowane awariami technicznymi, pracami konserwacyjnymi, dzialaniem sily wyzszej lub dzialaniami osob trzecich.</li>
              <li>Administrator nie ponosi odpowiedzialnosci za tresc dokumentow i wiadomosci przesylanych przez Uzytkownikow.</li>
              <li>Administrator nie ponosi odpowiedzialnosci za szkody wynikajace z korzystania z tresci generowanych przez Asystenta AI.</li>
              <li>Odpowiedzialnosc Administratora wobec Uzytkownika jest ograniczona do wartosci uslug swiadczonych na rzecz danego Uzytkownika w okresie ostatnich 12 miesiecy.</li>
            </ul>
          </section>

          <section data-testid="section-complaints">
            <h2 className="text-xl font-semibold text-foreground mb-3">11. Postepowanie reklamacyjne</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uzytkownik ma prawo zlozenia reklamacji dotyczacej funkcjonowania Serwisu.</li>
              <li>Reklamacje nalezy skladac drogą elektroniczna na adres: <a href="mailto:goldservicepoland@gmail.com" className="text-primary underline">goldservicepoland@gmail.com</a>.</li>
              <li>Reklamacja powinna zawierac: imie i nazwisko Uzytkownika, adres e-mail powiazany z Kontem, opis problemu oraz oczekiwany sposob rozwiazania.</li>
              <li>Administrator rozpatrzy reklamacje w terminie 14 dni roboczych od dnia jej otrzymania i poinformuje Uzytkownika o sposobie jej rozpatrzenia drogą elektroniczna.</li>
            </ul>
          </section>

          <section data-testid="section-termination">
            <h2 className="text-xl font-semibold text-foreground mb-3">12. Rozwiazanie umowy i usuniecie Konta</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Uzytkownik moze w kazdym momencie zrezygnowac z korzystania z Serwisu i zadac usuniecia swojego Konta.</li>
              <li>Zadanie usuniecia Konta nalezy zlozyc drogą elektroniczna na adres Administratora.</li>
              <li>Administrator usunie Konto w terminie 30 dni od otrzymania zadania, z zastrzezeniem obowiazku przechowywania danych wynikajacego z obowiazujacych przepisow prawa.</li>
              <li>Administrator moze rozwiazac umowe i usunac Konto Uzytkownika ze skutkiem natychmiastowym w przypadku rażacego naruszenia postanowien Regulaminu.</li>
              <li>Usuniecie Konta nie wplywa na zobowiazania powstale przed data usuniecia.</li>
            </ul>
          </section>

          <section data-testid="section-governing-law">
            <h2 className="text-xl font-semibold text-foreground mb-3">13. Prawo wlasciwe i rozwiazywanie sporow</h2>
            <p>Niniejszy Regulamin podlega prawu polskiemu.</p>
            <p>Wszelkie spory wynikajace z korzystania z Serwisu beda rozstrzygane przez <strong className="text-foreground">Sad Rejonowy Katowice-Wschod w Katowicach</strong>, chyba ze bezwzglednie obowiazujace przepisy prawa stanowia inaczej.</p>
            <p>Przed skierowaniem sprawy do sadu strony podejma probe polubownego rozwiazania sporu.</p>
            <p>Uzytkownik bedacy konsumentem ma mozliwosc skorzystania z pozasadowych sposobow rozpatrywania reklamacji i dochodzenia roszczen, w tym za posrednictwem platformy ODR (Online Dispute Resolution) Komisji Europejskiej.</p>
          </section>

          <section data-testid="section-changes">
            <h2 className="text-xl font-semibold text-foreground mb-3">14. Zmiany Regulaminu</h2>
            <p>Administrator zastrzega sobie prawo do zmiany niniejszego Regulaminu.</p>
            <p>O kazdej zmianie Regulaminu Uzytkownik zostanie poinformowany za posrednictwem wiadomosci e-mail lub powiadomienia w Serwisie, co najmniej 14 dni przed wejsciem zmian w zycie.</p>
            <p>W przypadku braku akceptacji zmian Uzytkownik ma prawo do rozwiazania umowy i usuniecia Konta przed wejsciem zmian w zycie.</p>
            <p>Dalsze korzystanie z Serwisu po wejsciu w zycie zmian oznacza akceptacje zaktualizowanego Regulaminu.</p>
          </section>

          <section data-testid="section-final">
            <h2 className="text-xl font-semibold text-foreground mb-3">15. Postanowienia koncowe</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>W sprawach nieuregulowanych niniejszym Regulaminem zastosowanie maja odpowiednie przepisy prawa polskiego, w szczegolnosci Kodeksu cywilnego, ustawy o swiadczeniu uslug droga elektroniczna oraz ustawy o prawach konsumenta.</li>
              <li>Jezeli ktorekolwiek z postanowien niniejszego Regulaminu zostanie uznane za niewazne lub nieskuteczne, pozostale postanowienia zachowuja pelna moc obowiazujaca.</li>
              <li>Regulamin jest dostepny nieodplatnie na stronie Serwisu w formie umozliwiajacej jego pobranie, utrwalenie i wydrukowanie.</li>
            </ul>
          </section>

          <section data-testid="section-effective-date">
            <h2 className="text-xl font-semibold text-foreground mb-3">16. Data wejscia w zycie</h2>
            <p>Niniejszy Regulamin obowiazuje od dnia <strong className="text-foreground">1 stycznia 2026 roku</strong>.</p>
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
            <Link href="/confidentiality">
              <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer" data-testid="link-confidentiality">Klauzula poufnosci</span>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
