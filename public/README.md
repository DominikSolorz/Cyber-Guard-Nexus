# Margonem-like — Static Game Prototype

Prototypowa wersja gry inspirowanej Margonkiem, zbudowana jako statyczna strona HTML/CSS/JavaScript.

## Funkcjonalności

- **Responsywne skalowanie**: Gra automatycznie dostosowuje się do rozmiaru okna (Phaser RESIZE)
- **Interfejs dotykowy**: Przyciski ekranowe (ATAK, UMIEJ., WEŹ, EQ, SKLP) do sterowania na urządzeniach mobilnych
- **Grafika pixel-art**: Wszystkie tekstury generowane w czasie rzeczywistym bez potrzeby zewnętrznych zasobów
- **Efekty dźwiękowe**: Proste dźwięki WebAudio dla ataków, umiejętności, podnoszenia przedmiotów i awansów poziomów
- **Zapis gry**: Automatyczny zapis do localStorage (autosave co 5 sekund)
- **System walki**: Atakuj wrogów, używaj umiejętności, zdobywaj doświadczenie i złoto
- **Ekwipunek i sklep**: Zbieraj przedmioty, kupuj broń i zbroję
- **System poziomów**: Zdobywaj poziomy i ulepszaj swoją postać

## Struktura projektu

```
/public
├── README.md
├── index.html          # Główny plik gry
├── styles.css          # Stylowanie gry i UI
└── js/
    └── game.js         # Logika gry (Phaser 3)
```

## Jak uruchomić lokalnie

### Opcja 1: Bezpośrednie otwarcie pliku
Możesz otworzyć plik `index.html` bezpośrednio w przeglądarce, ale niektóre funkcje mogą nie działać prawidłowo.

### Opcja 2: Lokalny serwer HTTP (zalecane)

**Python:**
```bash
cd public
python3 -m http.server 8080
```

**Node.js:**
```bash
cd public
npx http-server -p 8080
```

**PHP:**
```bash
cd public
php -S localhost:8080
```

Następnie otwórz przeglądarkę i przejdź do `http://localhost:8080`

## Jak grać

### Sterowanie
- **Kliknij/dotknij** na planszę, aby poruszać postacią
- **ATAK** - zaatakuj najbliższego wroga
- **UMIEJ.** - użyj specjalnej umiejętności (cooldown 6s)
- **WEŹ** - podnieś przedmiot z ziemi
- **EQ** - otwórz ekwipunek
- **SKLP** - otwórz sklep

### Wskazówki
- Wrogowie atakują automatycznie po zbliżeniu się
- Zbieraj złoto i przedmioty po pokonaniu wrogów
- Kupuj lepszy ekwipunek w sklepie
- Postać zapisuje się automatycznie co 5 sekund
- Zdobądź doświadczenie, aby awansować na wyższy poziom

## GitHub Pages

Po zmergowaniu tego PR i uruchomieniu GitHub Actions workflow, gra będzie dostępna pod adresem:
```
https://DominikSolorz.github.io/Cyber-Guard-Nexus/
```

## Technologie

- **Phaser 3.60.0** - silnik gry (ładowany z CDN)
- **WebAudio API** - generowanie efektów dźwiękowych
- **localStorage** - zapis postępu gry
- **Vanilla JavaScript** - bez dodatkowych zależności

## Licencja

Ten projekt jest prototypem edukacyjnym.
