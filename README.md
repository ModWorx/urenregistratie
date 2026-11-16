# Urenregistratie

Een zelfstandige urenregistratie-app in één HTML-bestand (`index.html`), ontwikkeld voor een Belgisch 40-uurs werkweek (8u/dag) met ondersteuning voor ADV, vakantie, feestdagen en woon-werkverkeer.

## Functies

- **Timer** met pauze; loopt door bij het sluiten of verversen van de app en werkt correct over middernacht
- **Kalender** met kleurcodering per dagtype (werken, vakantie, ADV, ziekte, feestdag, niet geregistreerd)
- **Overzichten** per week, maand en jaar, inclusief saldi (overuren/onderuren)
- **Vervoersregistratie** per maand met afdrukbare aangifte (PDF via print)
- **Belgische feestdagen** (automatisch berekend, incl. Pasen-afhankelijke dagen) met mogelijkheid tot verschuiven
- **CSV-export** per jaar (puntkomma-gescheiden, klaar voor Excel)
- **Back-up** van alle data als JSON, met volledige validatie bij import

## Gebruik

Open `index.html` in een browser (geoptimaliseerd voor mobiel). Er is geen installatie, server of internetverbinding nodig.

## Gegevensopslag

Alle data staat lokaal in de browser (`localStorage`) op het apparaat zelf. Er wordt niets verstuurd of opgeslagen op een server. **Exporteer regelmatig een back-up** (tab "Meer" → Back-up), zeker als je op meerdere apparaten werkt — de data wordt niet gesynchroniseerd.

Het wissen van browsergegevens (sitegegevens/cache) verwijdert ook de registratie.

## Ontwikkeling

De app is bewust één zelfstandig bestand zonder build-stap of dependencies.

```bash
node test/smoke.js   # rooktest: laadt de app in een DOM-stub en controleert kernfuncties
```

CI (`.github/workflows/ci.yml`) controleert bij elke push en pull request de JavaScript-syntaxis en draait de rooktest.
