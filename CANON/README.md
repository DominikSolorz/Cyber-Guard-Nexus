# CANON dla Cyber Guard Nexus
Minimalna struktura audytowa, gotowa do działania offline bez zależności.

## Moduły
- **00-core-html**: podstawowy szkielet aplikacji HTML/CSS/JS
- **01-ui-patterns**: wzorce UI (navbars, modals, loaders, errors, forms)
- **02-maps**: integracje map (Leaflet + OpenStreetMap)
- **03-ai**: prompty systemowe i integracje AI (OpenAI, Gemini)
- **06-data**: schematy baz danych i migracje
- **07-config**: przykłady konfiguracji (.env)
- **09-checklists**: checklisty i procedury

## Użytkowanie
Przeglądaj offline przez index.html.

## Migracja z Legal-Buddy-AI
Wszystkie komponenty zostały zneutralizowane:
- Usunięto branding
- Usunięto zależności backend
- Sekrety zastąpiono placeholderami
- Komponenty działają standalone

Zobacz [MIGRATION_LOG.md](MIGRATION_LOG.md) dla szczegółów migracji.

