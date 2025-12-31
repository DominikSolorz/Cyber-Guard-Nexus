# Margonem-like (polski prototyp) — rozszerzona wersja

To jest rozszerzony prototyp gry single-player w przeglądarce, w stylu klasycznych RPG. Interfejs i komunikaty są w języku polskim.

Funkcje dodane (wersja 0.2.0):
- Automatyczny zapis gry w localStorage (stan: HP, poziom, XP, złoto, ekwipunek, wyposażenie).
- System ekwipunku (broń + zbroja), przedmioty konsumowalne (mikstury).
- Przedmioty dropią z potworów i można je podnieść klawiszem E.
- Prosty sklep (B) — kupowanie przedmiotów za złoto.
- Ulepszony system walki: umiejętność specjalna (Q) z cooldownem, krytyczne trafienia.
- AI potworów: poruszają się w kierunku gracza i zadają obrażenia przy kontakcie.
- Zastąpienie geometrycznych figur wygenerowanymi teksturami (bez zasobów zewnętrznych).
- Interfejs inventory (I) i prosty HUD.

Sterowanie:
- Ruch: WASD / strzałki
- Atak podstawowy: SPACJA
- Umiejętność specjalna: Q
- Podnieś przedmiot: E (gdy jesteś obok przedmiotu)
- Otwórz/zamknij sklep: B
- Otwórz/zamknij ekwipunek: I
- Kup/Użyj przedmiotu: naciśnij numer (1-5) przy otwartym sklepie/ekwipunku

Uruchomienie:
1. npm install
2. npm run dev
3. Otwórz w przeglądarce: http://localhost:5173

Pomysły na dalsze rozszerzenia:
- grafiki pixel-art zamiast generowanych kształtów (mogę przygotować placeholdery lub kartę z assetami)
- efekty dźwiękowe i muzyka
- questy i NPC
- zapis do backendu (konto i cross-device)
- multiplayer (Node.js + Socket.IO / Elixir + Channels)

Jeśli chcesz, mogę podmienić wygląd elementów na pixel-art i dodać animacje, dodać klikane UI lub utworzyć PR z tą wersją.
