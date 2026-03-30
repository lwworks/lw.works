# lw.works — Seitenstruktur & Keyword-Strategie
**Planung Website-Relaunch · LW Works GmbH · März 2026**
*Daten: Ahrefs API v3, SERP-Analyse DE*

---

## 0. Strategische Vorab-Einschätzung

Bevor es in die Seitenstruktur geht, drei Erkenntnisse aus den Keyword-Daten, die die gesamte Strategie beeinflussen:

### 0.1 Das "Design Engineering"-Problem

Der Begriff **„Design Engineering"** hat in Deutschland ein Semantikproblem: Google versteht ihn fast ausschließlich im Kontext von **Maschinenbau, CAD-Software und Industriedesign**. Die Top-5-Ergebnisse für „design engineering" in DE sind allesamt Unternehmen für Bauteilkennzeichnung, 3D-CAD und Studiengangsinfos — alle mit DR 3–7. Niemand sucht damit nach einer Webagentur.

Das bedeutet: „Design Engineering" funktioniert als **Positionierungs-Begriff auf der Seite**, aber nicht als **SEO-Keyword**. Die Seite muss sich über diesen Begriff definieren (Differenzierung, Storytelling, Markenidentität), aber für die Auffindbarkeit braucht es andere Keywords.

→ **Empfehlung:** Die Landing Page heißt intern „Design Engineering", rankt aber auf **„Webentwicklung Agentur"**, **„Website erstellen lassen"** und Varianten. Design Engineering wird als Premium-Differenzierungsbegriff eingesetzt, nicht als primäres SEO-Keyword.

### 0.2 Überraschend niedrige Keyword-Difficulty für Kernbegriffe

| Keyword | Vol./Monat (DE) | Difficulty | Traffic-Potenzial |
|---|---|---|---|
| website erstellen lassen | 7.500 | 16 / 100 | 14.000 |
| website erstellen lassen kosten | 500 | 3 / 100 | 9.100 |
| webentwicklung agentur | 1.100 | 3 / 100 | ~0* |
| webdesign agentur deutschland | 150 | 19 / 100 | 4.000 |
| ki automatisierung agentur | 250 | 13 / 100 | n/a |
| n8n agentur | 100 | 0 / 100 | n/a |
| next.js agentur | 20 | 0 / 100 | n/a |
| autohaus website | 100 | 7 / 100 | 40 |

*„Webentwicklung Agentur" hat Difficulty 3 — das ist bemerkenswert niedrig für 1.100 Suchanfragen/Monat. Heißt: Mit DR 26 und einer ordentlich optimierten Seite ist **Top-3 in DE erreichbar**, ohne massiven Linkbuilding-Aufwand.*

### 0.3 Automatisierungs-Keywords sind ein Frühphasen-Markt

Viele Automatisierungs-Keywords haben noch kein messbares Volumen in Ahrefs — was bedeutet, dass auch kaum Wettbewerber optimierte Seiten dafür haben. Das ist eine **Early-Mover-Chance**: Wer jetzt Seiten aufbaut, wird dort in 12–18 Monaten dominieren, wenn das Suchvolumen wächst.

---

## 1. Seitenstruktur-Übersicht

```
lw.works/
│
├── / (Homepage)
├── /design-engineering          ← Landing Page Service 1
├── /automatisierung             ← Landing Page Service 2
├── /digital-dealer              ← Landing Page Produkt (Autohaus)
├── /projekte                    ← Portfolio / Case Studies
├── /blog/                       ← Blog-Index
│   ├── /blog/[slug]             ← Blog-Artikel
├── /ueber-uns                   ← (optional, für E-E-A-T)
└── /kontakt
```

Jede dieser Seiten existiert in zwei Sprachversionen:
- **`/de/[seite]`** → Deutsch (primäre SEO-Zielsprache)
- **`/en/[seite]`** → Englisch (internationaler Traffic, SaaS-Kunden)

Mit korrekten `hreflang`-Tags und `x-default` → `/de/`.

---

## 2. Seite für Seite: Zweck, Keywords, Inhalt

---

### 2.1 Homepage `/`

**Zweck:** Erster Eindruck, Routing zu den drei Kernservices, Vertrauensaufbau.

**Primäres Keyword (DE):** `webentwicklung agentur` (1.100 Vol., Diff. 3)
**Sekundäre Keywords:** `webdesign agentur deutschland`, `website erstellen lassen`, `digitale agentur`

**Was auf die Seite gehört:**
- Klarer Hero mit Headline, die sowohl positioniert als auch Keywords enthält — z.B. *„Webentwicklung & Design Engineering für Unternehmen, die Qualität ernst nehmen."*
- Kurze Übersicht der drei Kernleistungen mit Links zu den Landing Pages
- Ausgewählte Projekte (3–4 Highlights, Link zu /projekte)
- Logos oder Nennung von Kunden/Branchen
- Ein klares CTA (Gespräch vereinbaren)
- Evtl. kurze „Warum LW Works"-Sektion (Differenzierung über Techstack, Prozess, Qualität)

**Title Tag (DE):** `Webentwicklung Agentur | LW Works`
**Title Tag (EN):** `Web Development Agency | LW Works`
**Meta Description (DE):** `Professionelle Webentwicklung & Design Engineering für Unternehmen. Custom Next.js, API-Integrationen und KI-gestützte Automatisierung. Jetzt Projekt besprechen.`

**Interne Verlinkung:** Alle drei Landing Pages, /projekte, /blog

---

### 2.2 Design Engineering Landing Page `/design-engineering`

**Zweck:** Hauptservice-Seite für Website-Entwicklung. Zeigt Projekte, Clients, Prozess und die Qualitätsdifferenzierung über den Begriff „Design Engineering".

**Primäres Keyword (DE):** `website erstellen lassen` (7.500 Vol., Diff. 16, TP 14.000)
**Sekundäre Keywords:** `website erstellen lassen kosten`, `webentwicklung agentur`, `next.js agentur`, `maßgeschneiderte website`
**Englisches Primär-Keyword:** `web design engineering agency`, `custom website development agency`

> **Hinweis:** „Design Engineering" selbst hat kein messbares Suchvolumen in DE und wird im SERP mit Maschinenbau assoziiert. Der Begriff bleibt auf der Seite als Differenzierungs-Claim, das SEO-Targeting läuft aber über „website erstellen lassen" und verwandte Keywords. Der Titel der Seite kann trotzdem „Design Engineering" heißen — das H1 und die Meta-Title folgen dem Keyword.

**Was auf die Seite gehört:**

1. **Hero:** Was ist Design Engineering (im Web-Kontext)? — kurze, prägnante Definition, die den Begriff besetzt und gleichzeitig erklärt, warum das besser ist als Standard-Webdesign.
2. **Was du damit bekommst:** Leistungsübersicht — Custom Development, Next.js, API-Integrationen, Performance, keine Page-Builder.
3. **Projekte & Kunden:** Das ist der Kern dieser Seite. Pro Projekt: Kunden-Logo, Kurzbeschreibung, Key Deliverable, evtl. Screenshot. Branchen-Vielfalt zeigen (Automotive, Industrial, Equestrian, SaaS).
4. **Prozess:** Wie läuft eine Zusammenarbeit ab? (Discovery → Design → Development → Launch → Maintenance)
5. **Testimonials / Stimmen von Kunden** (wenn vorhanden)
6. **FAQ:** Was kostet eine Website? Wie lange dauert es? Was ist der Unterschied zu Webflow/Framer?
7. **CTA:** Projekt anfragen

**Title Tag (DE):** `Website erstellen lassen – Design Engineering | LW Works`
**Meta Description (DE):** `Professionelles Webdesign & Entwicklung mit Next.js. Keine Templates, kein Page-Builder – individuelle Websites, die performen. Projekte & Preise ansehen.`

**Verlinkung zu Blog-Posts:** Auf dieser Seite sollten die Blog-Artikel verlinkt sein, die die Kaufentscheidung unterstützen (z.B. „Agentur oder KI?", „Was ist Design Engineering?", „Kosten einer professionellen Website").

**Keyword-Gap-Notiz:** Der Parent-Topic für „webentwicklung agentur" laut Ahrefs ist `agentur webentwicklung` — beide Varianten auf der Seite natürlich einbauen.

---

### 2.3 Automatisierung Landing Page `/automatisierung`

**Zweck:** Für lokale Unternehmen und Mittelstand, die interne Prozesse automatisieren wollen. Positioniert LW Works als technischen Partner, nicht als generische IT-Agentur.

**Primäres Keyword (DE):** `ki automatisierung agentur` (250 Vol., Diff. 13)
**Sekundäre Keywords:** `prozessautomatisierung ki` (100 Vol.), `n8n agentur` (100 Vol., Diff. 0), `agentur automatisierung` (20 Vol.), `geschäftsprozesse automatisieren`
**Englisches Primär-Keyword:** `ai automation agency`, `business process automation`

> **Keyword-Einschätzung:** Das sind verhältnismäßig kleine Volumina — aber Difficulty nahe 0. „n8n agentur" mit Difficulty 0 ist ein echter Quick Win: wenig Wettbewerb, sehr spezifische Suchanfrage mit hoher Kaufintention. Außerdem ist das ein Wachstumsmarkt — Volumina werden steigen.

**Was auf die Seite gehört:**

1. **Hero:** Was wird automatisiert? Klarer Problemframe — „Ihre Mitarbeiter verbringen Zeit mit Aufgaben, die ein Computer übernehmen könnte."
2. **Anwendungsfälle / Beispiele:** Konkrete Szenarien, z.B.:
   - Angebotserstellung automatisieren (z.B. aus CRM-Daten)
   - Dokumentenverarbeitung mit KI
   - E-Mail- und Benachrichtigungs-Workflows
   - Datenübergabe zwischen Tools (ERP, CRM, Website)
   - Terminbuchung, Lead-Routing, Rechnungsverarbeitung
3. **Technologie:** n8n, Make, API-Integrationen, KI-Modelle (Claude, OpenAI) — als Tech-Stack transparent zeigen
4. **Prozess:** Wie läuft eine Automatisierungs-Zusammenarbeit ab?
5. **Für wen:** Branchen und Unternehmensgrößen, die du ansprichst (lokale KMU, Handwerksbetriebe, Händler, Dienstleister)
6. **Referenzen / Beispiel-Projekte** (Lütjen Toranlagen o.ä. als Case Study geeignet)
7. **FAQ:** Was kostet Automatisierung? Was brauche ich dafür? Wie lange bis zur ersten Einsparung?
8. **CTA:** Kostenloses Erstgespräch

**Title Tag (DE):** `KI-Automatisierung für Unternehmen | LW Works`
**Meta Description (DE):** `Wir automatisieren Ihre internen Prozesse mit KI und n8n. Weniger Handarbeit, mehr Effizienz – für lokale Unternehmen und Mittelstand. Jetzt beraten lassen.`

**Blog-Verlinkung:** Informativer Artikel „Welche Prozesse lassen sich mit KI automatisieren?" direkt auf dieser Seite verlinken.

---

### 2.4 Digital Dealer Landing Page `/digital-dealer`

**Zweck:** Dedizierte Produkt-Seite für das Autohaus-Angebot. Soll sowohl Entscheidungsgrundlage als auch Conversion-Seite sein — mit Pricing, Paketen, klarem Nutzwert und Entscheidungshilfe.

**Primäres Keyword (DE):** `autohaus website` (100 Vol., Diff. 7)
**Sekundäre Keywords:** `autohaus digitalisierung` (20 Vol.), `autohaus homepage` (30 Vol.), `autohaus digital` (40 Vol.), `händler website erstellen lassen`
**Englisches Keyword:** Wenig relevant — Zielgruppe ist DE-sprachig.

> **Keyword-Einschätzung:** Das Gesamtvolumen ist klein, aber das ist eine klassische Nischen-Domination: Wenn du die einzige Agentur bist, die eine dedizierte Seite für „Autohaus Website" hat, wirst du dort ranken — ohne nennenswerten Wettbewerb. Außerdem ist der Traffic hochqualifiziert: Wer „autohaus website agentur" sucht, ist kaufbereit.

**Was auf die Seite gehört:**

1. **Hero:** Starke Headline die das Problem benennt — z.B. *„Die meisten Autohaus-Websites sind veraltet. Digital Dealer 2026 ändert das."*
2. **Das Problem:** Warum brauchen Autohäuser eine moderne Website? (Leads, Online-Auftritt, Wettbewerb mit großen Portalen, Google-Sichtbarkeit)
3. **Das Produkt — Module & Pakete:**
   - Basis-Paket: Was ist drin? (Website, Next.js, Performance, Design)
   - Add-on: Service-Seite
   - Add-on: Convert (Lead-Generierung, CTAs)
   - Add-on: Scale (aiCMS, Pflege-Abo)
   - Klar als Tabelle oder visuelle Paket-Übersicht darstellen
4. **Pricing:** Offen kommunizieren — auch wenn nur Preisbereiche. Das ist ein Entscheidungs-Tool, keine Geheimhaltungsseite. Monats-Preise für aiCMS-Wartungs-Tier separat hervorheben.
5. **Was unterscheidet Digital Dealer 2026 von Standard-Websites?**
   - Next.js vs. WordPress
   - aiCMS für eigenständige Pflege
   - Branchenkenntnis (Fahrzeugbestand, Lead-Formulare, Service-Buchung)
6. **Beispiel-Seiten / Preview** (Screenshots, Demo-Link wenn vorhanden)
7. **Entscheidungshilfe:** Wann ist welches Paket das Richtige? (Einfache Matrix oder Fragen-Guide)
8. **Häufige Einwände / FAQ:** „Wir haben schon eine Website", „Das ist zu teuer", „Wir nutzen bereits ein Händlerportal"
9. **CTA:** Jetzt Paket anfragen / Demo ansehen

**Title Tag (DE):** `Autohaus Website – Digital Dealer 2026 | LW Works`
**Meta Description (DE):** `Moderne Website für Autohäuser: Next.js, KI-gestützte Pflege und klare Pakete. Jetzt Preise & Module ansehen – Digital Dealer 2026 von LW Works.`

**Besonderheit dieser Seite:** Sie ist stärker produktähnlich als die anderen Landing Pages. Weniger „Agentur-Seite", mehr „Software-Produkt-Seite" — das ist genau richtig für die Zielgruppe (Autohaus-Inhaber, die schnell entscheiden wollen).

---

### 2.5 Projekte / Portfolio `/projekte`

**Zweck:** Vertrauen aufbauen, Qualität demonstrieren, Branchen-Breite zeigen.

**Keyword:** `webdesign portfolio agentur` (niedrig, aber wertvoll für E-E-A-T und internen Linkjuice)

**Was auf die Seite gehört:**
- Grid oder Liste der Projekte mit Thumbnail, Kunden-Name (wenn freigegeben), Branche, kurzer Beschreibung des Kernproblems und der Lösung
- Filter nach Branche oder Leistungsart (optional)
- Jedes Projekt sollte eine eigene Unterseite `/projekte/[kunde]` bekommen (für Long-Tail-Keywords und E-E-A-T)

**Unterseiten `/projekte/[kunde]`:** Pro Projekt: Ausgangssituation → Was wurde gebaut → Ergebnis. Das sind die besten Seiten für E-E-A-T — sie zeigen echte Erfahrung mit echten Ergebnissen.

---

### 2.6 Blog `/blog`

**Zweck:** Informationellen Traffic anziehen, Buyer-Funnel von oben befüllen, interne Verlinkung auf Landing Pages aufbauen.

**Wichtiger Hinweis:** Viele der geplanten Blog-Themen (z.B. „Agentur vs. KI") haben **kein messbares Suchvolumen** in Ahrefs — das bedeutet nicht, dass sie wertlos sind. Es gibt zwei Typen von Blog-Inhalten:
- **SEO-Artikel**: Gezielt auf Keywords mit Volumen (werden gefunden)
- **Thought-Leadership-Artikel**: Positionierung, werden geteilt und verlinkt, unterstützen E-E-A-T (z.B. der „Design Engineering"-Erklärartikel)

Beide Typen gehören in den Blog — aber die Priorität liegt auf SEO-Artikeln, solange die Seite noch aufgebaut wird.

---

## 3. Blog-Artikel: Vollständige Planung

### 3.1 Tier 1 — SEO-Artikel mit messbarem Volumen (Priorität)

Diese Artikel werden auf Keywords mit nachweisbarem Suchvolumen optimiert und sollten zuerst erscheinen.

---

#### Blog 01 · `Was kostet eine professionelle Website? (2026)`
**URL:** `/blog/website-erstellen-lassen-kosten`
**Primäres Keyword:** `website erstellen lassen kosten` — **500 Vol., Difficulty 3, Traffic-Potenzial 9.100**
**Sekundäre Keywords:** `website erstellen lassen`, `website kosten agentur`, `webseite kosten`
**Intent:** Kommerziell + Informational (Preisrecherche vor dem Kauf)
**Inhalt:**
- Preisrahmen für verschiedene Website-Typen (Visitenkarte vs. Custom vs. E-Commerce)
- Was kostet LW Works im Vergleich zu alternativen Optionen (Page-Builder, Freelancer, große Agentur)
- Woraus sich der Preis zusammensetzt (Design, Entwicklung, Wartung, Hosting)
- Was man für günstiger bekommt und was man verliert
**Interne Links:** → /design-engineering, → /digital-dealer (für Autohaus-Pricing)
**Tipp:** Dieser Artikel hat das höchste Traffic-Potenzial (9.100) aller gemessenen Keywords. Er sollte als erster Artikel erscheinen.

---

#### Blog 02 · `KI Automatisierung für Unternehmen: Was ist realistisch?`
**URL:** `/blog/ki-automatisierung-unternehmen`
**Primäres Keyword:** `ki automatisierung agentur` — **250 Vol., Difficulty 13**
**Sekundäre Keywords:** `prozessautomatisierung ki`, `ki prozesse automatisieren`, `n8n automatisierung`
**Intent:** Informational + Commercial (Recherche vor Beauftragung)
**Inhalt:**
- Was lässt sich tatsächlich mit KI automatisieren (mit konkreten Beispielen)
- Was ist Hype, was ist realistisch
- Welche Tools und Ansätze es gibt (n8n, Make, API-basierte KI)
- Für welche Unternehmensgrößen es sich lohnt
- Nächste Schritte / Einstieg
**Interne Links:** → /automatisierung

---

#### Blog 03 · `Website selbst mit KI erstellen oder Agentur beauftragen?`
**URL:** `/blog/website-ki-oder-agentur`
**Primäres Keyword:** `ki website builder` — **250 Vol.** (kein Difficulty-Wert, Hinweis auf geringe Konkurrenz)
**Sekundäre Keywords:** `website mit ki erstellen lassen`, `webflow vs agentur`, `website selbst erstellen`
**Intent:** Informational (Entscheidungssuche — sehr wertvoller Intent)
**Inhalt:**
- Für wen sind KI-Website-Builder geeignet (ehrliche Antwort: für einfache Fälle)
- Was KI-Tools aktuell noch nicht können (komplexe Integrationen, Custom Logic, Brand-spezifisches Design)
- Wann eine Agentur den Unterschied macht
- Kosten-Nutzen-Vergleich über 3 Jahre
- Fazit: kein "entweder-oder", sondern "wofür"
**Interne Links:** → /design-engineering, → /automatisierung
**Wichtig:** Dieser Artikel ist gleichzeitig der wichtigste Thought-Leadership-Text und ein SEO-Artikel. Er sollte ehrlich und hilfreich sein — nicht als Verkaufstext. Wer KI-Builder wirklich braucht, sollte das auch gesagt bekommen. Das baut Vertrauen auf.

---

#### Blog 04 · `Next.js vs. WordPress: Warum moderne Webentwicklung anders funktioniert`
**URL:** `/blog/nextjs-vs-wordpress`
**Primäres Keyword:** `next.js agentur` — **20 Vol., Difficulty 0** + Long-Tail via `wordpress alternative agentur`
**Intent:** Informational + Commercial
**Inhalt:**
- Was Next.js ist und was es von WordPress unterscheidet
- Performance, Sicherheit, Flexibilität im Vergleich
- Wann WordPress trotzdem sinnvoll ist
- Warum LW Works auf Next.js setzt
**Interne Links:** → /design-engineering

---

#### Blog 05 · `Autohaus-Website 2026: Was Kunden wirklich erwarten`
**URL:** `/blog/autohaus-website-anforderungen`
**Primäres Keyword:** `autohaus website` — **100 Vol., Difficulty 7**
**Sekundäre Keywords:** `autohaus homepage`, `autohaus digitalisierung`, `autohaus digital`
**Intent:** Informational (Autohaus-Inhaber, die recherchieren)
**Inhalt:**
- Wie sich das Kaufverhalten von Autokäufern verändert hat
- Was eine moderne Autohaus-Website leisten muss (Lead-Formulare, Mobile, Fahrzeugbestand)
- Was typische Autohaus-Websites falsch machen
- Wie Digital Dealer 2026 diese Lücken schließt
**Interne Links:** → /digital-dealer

---

### 3.2 Tier 2 — Thought-Leadership & Positioning-Artikel

Diese Artikel haben wenig bis kein messbares Suchvolumen, aber hohes Potenzial für Verlinkungen, Social Sharing und E-E-A-T-Aufbau. Sie sollten nach den Tier-1-Artikeln erscheinen.

---

#### Blog 06 · `Was ist Design Engineering? (und warum es einen Unterschied macht)`
**URL:** `/blog/was-ist-design-engineering`
**Keyword-Ansatz:** Begriffsdefinition — kaum Suchvolumen, aber wichtig für Brand-Positionierung
**Inhalt:**
- Herkunft des Begriffs (aus dem Produktdesign/Engineering-Bereich)
- Was es auf Webentwicklung übertragen bedeutet: Design und Technik werden zusammen gedacht, nicht nacheinander
- Konkrete Beispiele: wie sich das im Ergebnis zeigt
- Unterschied zu reinem Webdesign oder reiner Entwicklung
**Interne Links:** → /design-engineering
**Zweck:** Dieser Artikel ist das definitorische Fundament der Marke. Er wird auf der Design-Engineering-Landing-Page verlinkt, kann in anderen Artikeln referenziert werden und stärkt die E-E-A-T-Signale.

---

#### Blog 07 · `Welche Prozesse lassen sich wirklich mit KI automatisieren?`
**URL:** `/blog/prozesse-ki-automatisierung`
**Keyword-Ansatz:** Long-Tail, spezifische Suchanfragen
**Inhalt:**
- Prozesstypen und ihr Automatisierungspotenzial (Dateneingabe, Kommunikation, Reporting, etc.)
- Reale Beispiele aus KMU-Kontext
- Was KI noch nicht alleine kann
- Wie eine Automatisierungs-Roadmap aussieht
**Interne Links:** → /automatisierung

---

#### Blog 08 · `Warum Ihre Website Ihrem Unternehmen schadet (ohne dass Sie es merken)`
**URL:** `/blog/veraltete-website-kosten`
**Keyword-Ansatz:** Problem-Awareness, Long-Tail
**Inhalt:**
- 5–7 konkrete Zeichen, dass eine Website Geld kostet statt bringt (langsam, nicht mobil-optimiert, kein CTA, veraltetes Design, schlechtes SEO)
- Was das in Euro bedeutet (Leads, die abspringen)
- Wann Redesign vs. Rebuild
**Interne Links:** → /design-engineering, → /projekte

---

## 4. Keyword-Map — Zusammenfassung

| Seite | Primäres Keyword (DE) | Vol. | Diff. | Typ |
|---|---|---|---|---|
| / (Homepage) | webentwicklung agentur | 1.100 | 3 | Commercial |
| /design-engineering | website erstellen lassen | 7.500 | 16 | Commercial |
| /automatisierung | ki automatisierung agentur | 250 | 13 | Commercial |
| /digital-dealer | autohaus website | 100 | 7 | Commercial |
| /projekte | webdesign portfolio | niedrig | — | Navigational |
| Blog 01 | website erstellen lassen kosten | 500 | 3 | Informational |
| Blog 02 | ki automatisierung unternehmen | 250 | 13 | Informational |
| Blog 03 | ki website builder | 250 | — | Informational |
| Blog 04 | next.js agentur | 20 | 0 | Informational |
| Blog 05 | autohaus website | 100 | 7 | Informational |
| Blog 06 | was ist design engineering | — | — | Thought Leadership |
| Blog 07 | prozesse ki automatisieren | — | — | Thought Leadership |
| Blog 08 | veraltete website | — | — | Thought Leadership |

---

## 5. Interne Verlinkungsstruktur

Interne Links sind der wichtigste Hebel, um Linkjuice von der Homepage auf die Landing Pages zu verteilen und den Blog mit Conversion-Seiten zu verbinden.

```
Homepage
├── → /design-engineering
├── → /automatisierung
├── → /digital-dealer
├── → /projekte (Teaser)
└── → /blog (Teaser)

/design-engineering
├── → /blog/website-ki-oder-agentur
├── → /blog/was-ist-design-engineering
├── → /blog/website-erstellen-lassen-kosten
└── → /projekte

/automatisierung
├── → /blog/ki-automatisierung-unternehmen
└── → /blog/prozesse-ki-automatisierung

/digital-dealer
├── → /blog/autohaus-website-anforderungen
└── → /projekte

Blog-Artikel
└── → jeweils die thematisch passende Landing Page (jeder Artikel hat mind. 1 internen Link auf eine Landing Page)
```

---

## 6. Sprachversionen — Was bedeutet das konkret

**DE ist die primäre SEO-Sprache.** Alle Keyword-Daten oben beziehen sich auf DE. Die deutschen Seiten bekommen die volle SEO-Behandlung (optimierte Titles, Metas, H1-Struktur, Schema-Markup).

**EN ist sekundär** — aber nicht zu vernachlässigen, da potenzielle SaaS-Kunden oder internationale Unternehmen in DE englischsprachig suchen. Für EN gelten andere Keywords:

| Seite | Primäres Keyword (EN) |
|---|---|
| / | `web development agency germany` / `custom web development` |
| /design-engineering | `web design engineering agency` / `custom website development` |
| /automatisierung | `ai automation agency` / `business process automation` |
| /digital-dealer | wenig relevant — Zielgruppe ist DE |
| Blog-Artikel | EN-Versionen für die Tier-1-Artikel sinnvoll |

**Technische Umsetzung:**
```html
<link rel="alternate" hreflang="de" href="https://lw.works/de/[seite]" />
<link rel="alternate" hreflang="en" href="https://lw.works/en/[seite]" />
<link rel="alternate" hreflang="x-default" href="https://lw.works/de/[seite]" />
```

Alle Blog-Artikel zunächst auf DE erscheinen lassen — EN-Übersetzungen der wichtigsten Artikel können schrittweise folgen.

---

## 7. Schema-Markup — Was wo implementiert werden sollte

| Seite | Schema-Typ | Zweck |
|---|---|---|
| / | `Organization` + `LocalBusiness` | Business-Grundinfos, NAP, Logo |
| / | `WebSite` + `SearchAction` | Sitelinks-Suchbox |
| /design-engineering | `Service` | Service-Beschreibung für Rich Results |
| /automatisierung | `Service` | dto. |
| /digital-dealer | `Product` oder `Service` | Pricing-Infos strukturiert |
| /projekte/[kunde] | `CreativeWork` | Fallstudien |
| /blog/[artikel] | `Article` + `BreadcrumbList` | Blog-Artikel-Rich-Results |

---

## 8. Priorisierter Umsetzungsplan

### Phase 1 — Launch (Woche 1–4)
1. Homepage mit korrektem Title Tag + Keyword-Targeting
2. /design-engineering Landing Page (inkl. 3–5 Projekte)
3. /automatisierung Landing Page
4. /digital-dealer Landing Page mit Pricing
5. hreflang-Implementierung auf allen Seiten
6. Schema-Markup: Organization auf Homepage, Service auf Landing Pages
7. Sitemap einreichen (Google Search Console)

### Phase 2 — Content-Start (Woche 5–8)
8. Blog 01: „Was kostet eine professionelle Website?"
9. Blog 03: „Website mit KI oder Agentur?" (höchste strategische Priorität)
10. Blog 05: „Autohaus-Website 2026"
11. /projekte mit ersten 4–6 Case Studies

### Phase 3 — Content-Ausbau (Monat 3–6)
12. Blog 02: „KI Automatisierung für Unternehmen"
13. Blog 04: „Next.js vs. WordPress"
14. Blog 06: „Was ist Design Engineering?" (Thought Leadership)
15. Blog 07 + 08
16. EN-Versionen der wichtigsten Blog-Artikel
17. Individuelle Projekt-Unterseiten `/projekte/[kunde]`

---

## 9. Wichtigste Erkenntnis für den Relaunch

Die Keyword-Daten zeigen eine unerwartete Chance: **Die Kerntermini dieser Branche sind in Deutschland deutlich einfacher zu ranken als gedacht.** „Webentwicklung Agentur" hat Difficulty 3, „website erstellen lassen kosten" hat Difficulty 3 bei 9.100 Traffic-Potenzial. Das sind Begriffe, für die Seiten mit deutlich weniger DR als 26 in den Top 5 stehen.

Das bedeutet: **Der Relaunch ist nicht nur eine technische Aufgabe, sondern eine direkte SEO-Opportunity.** Wer zum Launch-Zeitpunkt saubere Seitenstruktur, richtige Title Tags, interne Verlinkung und die ersten Blog-Artikel live hat, kann binnen 3–6 Monaten messbare organische Sichtbarkeit aufbauen — ohne aufwändiges Linkbuilding.

---

*Erstellt März 2026 · Daten: Ahrefs API v3 · LW Works GmbH — Intern*
