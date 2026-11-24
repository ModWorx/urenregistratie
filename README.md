# Urenregistratie

Een zelfstandige urenregistratie-app in één HTML-bestand (`index.html`), ontwikkeld voor een Belgisch 40-uurs werkweek (8u/dag) met ondersteuning voor ADV, vakantie, feestdagen en woon-werkverkeer.

## Functies

- **Timer** met pauze; loopt door bij het sluiten of verversen van de app en werkt correct over middernacht
- **Kalender** met kleurcodering per dagtype (werken, vakantie, ADV, ziekte, feestdag, niet geregistreerd)
- **Halve dagen** (4u) voor vakantie en ADV: trekt 0,5 dag af van de vakantieteller of 4u van het ADV-saldo, met een dagdoel van 4u
- **Overzichten** per week, maand en jaar, inclusief saldi (overuren/onderuren)
- **Vervoersregistratie** per maand met afdrukbare aangifte (PDF via print)
- **Belgische feestdagen** (automatisch berekend, incl. Pasen-afhankelijke dagen) met mogelijkheid tot verschuiven
- **CSV-export** per jaar (puntkomma-gescheiden, klaar voor Excel)
- **Back-up** van alle data als JSON, met volledige validatie bij import
- **Cloud-sync** via Proton Drive-map (of een andere gesynchroniseerde map): automatische opstart-prompt bij nieuwere sync-data, plus statusregel met laatste synchronisatie en melding bij nieuwere data in het sync-bestand

## Gebruik

Open `index.html` in een browser (geoptimaliseerd voor mobiel). Er is geen installatie, server of internetverbinding nodig.

**Halve dag vakantie of ADV boeken**: tik in de kalender (of "Vandaag bewerken") op een dag, kies als dagtype *Vakantie* of *ADV-dag* en vink **"Halve dag (4u)"** aan. Je verwacht dan dat je de overige 4u van die dag werkt, waardoor je dagsaldo op 0 uitkomt.

## Gegevensopslag

Alle data staat lokaal in de browser (`localStorage`) op het apparaat zelf. Er wordt niets verstuurd of opgeslagen op een server. **Exporteer regelmatig een back-up** (tab "Meer" → Back-up), zeker als je op meerdere apparaten werkt.

Sinds de cloud-sync (PR #4) kan de data ook gesynchroniseerd worden via een bestand in een gesynchroniseerde map (Proton Drive, of een andere map): de app koppelt een bestands-handle (bewaard in IndexedDB) en houdt een lopend totaal bij.

## Installatie als PWA

De app is installeerbaar als PWA (o.a. Chrome op Android): `manifest.webmanifest` met naam, iconen (192+512, any+maskable), `start_url` en `display: standalone`, plus `sw.js` (minimale service worker met fetch-handler en app-shell-cache) en registratie in `index.html`.

Opmerking: in Brave moet eerst `brave://flags/#file-system-access-api` op **Enabled** staan, anders blijft de sync-kaart "Niet ondersteund" tonen.

## Ontwikkeling

De app is bewust één zelfstandig bestand zonder build-stap of dependencies.

```bash
node test/smoke.js   # rooktest: laadt de app in een DOM-stub en controleert kernfuncties
```

CI (`.github/workflows/ci.yml`) controleert bij elke push en pull request de JavaScript-syntaxis en draait de rooktest.
