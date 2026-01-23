
export const chaptersSeedData = [
  {
  slug: 'brandfall',
  order: 1,
  title: 'Verhalten im Brandfall',
  heroImage: null,
  introVideo: null,
  slides: [
    // Überblick
    {
      type: 'content',
      order: 1,
      title: 'Überblick: Melden – Flüchten – Löschen',
      body: `Im Brandfall zählt: ruhig bleiben und richtig handeln.

Melden
- Alarm auslösen (Brandmelder / Notrufschalter)
- Hilfe holen (Lehrperson, Portier, Sekretariat)

Flüchten
- Fluchtweg-Schildern folgen
- Türen schließen (nicht versperren)
- Kein Lift

Löschen
- Nur wenn es ein kleiner Entstehungsbrand ist
- Eigenschutz geht vor`,
      imageUrl: '/media/images/melden_fluechten_loeschen.png',
    },
    // Interaktiv: Entscheidungsteil (Buttons kommen im Frontend)
    {
      type: 'content',
      order: 2,
      title: 'Interaktiv: Brand entdeckt',
      body: `Du siehst Rauch/Flammen. Wähle aus, was du als Nächstes machst.`,
      imageUrl: null,
    },

    {
      type: 'summary',
      order: 3,
      title: 'Merksatz',
      body: `Melden – Flüchten – Löschen
Immer in dieser Reihenfolge. Eigenschutz zuerst!`,
      imageUrl: null,
    },
    {
  type: 'video',
  order: 4,
  title: 'Video: Verhalten im Brandfall (Schule)',
  body: `Schau dir das Video bis zum Ende an – danach üben wir das Ganze interaktiv.`,
  videoUrl: '/media/videos/firefly.mp4',
},

    // 1.1 Brand melden
    {
      type: 'content',
      order: 5,
      title: '1.1 Brand melden',
      body: `Wenn du einen Brand bemerkst, muss SOFORT gemeldet werden.

So meldest du richtig:
- Brandmelder / Notrufschalter betätigen
- Lehrperson/Portier informieren
- Nicht davon ausgehen: „Das macht schon wer anderer“`,
      imageUrl: '/media/images/brandmelder.png',
    },

    // Interaktiv: Meldung Simulation
    {
      type: 'content',
      order: 6,
      title: 'Interaktiv: Brandmeldung absetzen',
      body: `Du bist die erste Person am Brandort.
Beantworte die Fragen wie bei einem echten Notruf.`,
      imageUrl: null,
    },

    {
      type: 'content',
      order: 7,
      title: 'Checkliste: Brandmeldung',
      body: `- WAS ist passiert? (Brand/Rauch/Explosion)
- WO ist es? (Gebäude/Stock/Raum)
- VERLETZTE? (ja/nein, wie viele)
- WER meldet? (Name)
- WARTEN auf Rückfragen`,
      imageUrl: null,
    },

    // 1.2 In Sicherheit bringen
    {
      type: 'content',
      order: 8,
      title: '1.2 In Sicherheit bringen',
      body: `ZIEL: raus aus der Gefahr, ohne Chaos.

- Fluchtwege nutzen (Schilder folgen)
- Tür schließen, damit Rauch/Feuer sich langsamer ausbreitet
- Kein Lift – nur Stiegenhäuser
- Zum Sammelplatz gehen`,
      imageUrl: '/media/images/fluchtweg.png',
    },

    {
      type: 'content',
      order: 9,
      title: 'Interaktiv: Richtig evakuieren',
      body: `Triff schnelle Entscheidungen und sieh die Konsequenzen.`,
      imageUrl: null,
    },

    {
      type: 'summary',
      order: 10,
      title: 'Merksatz',
      body: `Geordnet raus. Türen zu. Lift nie. Sammelplatz finden.`,
      imageUrl: null,
    },

    // 1.3 Löschversuch
    {
      type: 'content',
      order: 11,
      title: '1.3 Löschversuch unternehmen',
      body: `Ein Löschversuch ist nur sinnvoll, wenn:

- Es ein kleiner Entstehungsbrand ist
- Du einen freien Rückzugsweg hast
- Du dich nicht in Gefahr bringst`,
      imageUrl: null,
    },
    {
      type: 'content',
      order: 12,
      title: 'Interaktiv: Löschen oder flüchten?',
      body: `Wähle für jede Situation: Löschen oder Flüchten*.`,
      imageUrl: null,
    },

    {
      type: 'summary',
      order: 13,
      title: 'Merksatz',
      body: `Eigenschutz zuerst.
Wenn du unsicher bist: nicht löschen – flüchten & melden.`,
      imageUrl: null,
    },
    
  ],
},


 {
  slug: 'brandverhuetung',
  order: 2,
  title: 'Brandverhütung',
  heroImage: null,
  introVideo: null,
  slides: [
    {
      type: 'content',
      order: 1,
      title: 'Warum Brandverhütung wichtig ist',
      body: `Brandverhütung heißt: Brände gar nicht erst entstehen lassen.

In der Schule sind viele Menschen, enge Wege und viel Technik – deshalb zählt Vorbeugung.`,
      imageUrl: null,
    },

    {
      type: 'content',
      order: 2,
      title: 'Übersicht: Wichtige Verbote',
      body: `Diese Regeln gelten im gesamten Schulbereich:

- Rauchverbot
- Keine offenen Flammen
- Keine privaten Elektrogeräte ohne Freigabe
- Akkus & E-Fahrzeuge nicht laden
- Fluchtwege freihalten`,
      imageUrl: '/media/images/verbotschild.png', 
    },

    {
      type: 'content',
      order: 3,
      title: 'Typische Brandverursacher',
      body: `Brände entstehen oft durch Alltagsfehler:

- Glut / Zigarettenreste
- Überlastete Steckdosen
- Defekte Akkus
- Offene Flammen
- Unachtsamkeit`,
      imageUrl: null,
    },

    // 2.1
    {
      type: 'content',
      order: 4,
      title: '2.1 Rauchverbot',
      body: `Am gesamten Schulgelände gilt Rauchverbot.

Grund: Glutreste, Wind und Müll können sehr schnell Feuer auslösen – auch draußen.`,
      imageUrl: '/media/images/rauchverbot.png',
    },

    {
      type: 'content',
      order: 5,
      title: 'Interaktiv: Gefahren erkennen',
      body: `Klicke alle Dinge an, die Brandgefahr bedeuten.
Du musst alle richtigen markieren, um weiterzugehen.`,
      imageUrl: null,
    },

    {
      type: 'summary',
      order: 6,
      title: 'Merksatz',
      body: `Glut ist nie „harmlos“.
Rauchverbot schützt Menschen und Gebäude.`,
      imageUrl: null,
    },

    // 2.2
    {
      type: 'content',
      order: 7,
      title: '2.2 Umgang mit Feuer & offenen Flammen',
      body: `Offene Flammen sind im Schulgebäude grundsätzlich verboten.

Schon eine kleine Flamme + Papier/Staub/Materialien kann reichen.`,
      imageUrl: '/media/images/offenesFeuer.png',
    },

    {
      type: 'content',
      order: 8,
      title: 'Was ist erlaubt – was nicht?',
      body: `Erlaubt (nur mit Aufsicht):
- Bunsenbrenner im Unterricht
- Geräte, die von Lehrpersonen freigegeben sind

Nicht erlaubt:
- Kerzen im Klassenraum
- Feuerzeuge „zum Spaß“
- Eigenmächtige Experimente`,
      imageUrl: null,
    },

    {
      type: 'content',
      order: 9,
      title: 'Wenn eine Flamme reicht',
      body: `Mini-Szenario:
Ein Feuerzeug wird kurz „ausprobiert“. Jemand erschrickt, lässt es fallen – Papier fängt Feuer, Rauch füllt den Raum.

Brandverhütung heißt: solche Situationen gar nicht entstehen lassen.`,
      imageUrl: null,
    },

    {
      type: 'summary',
      order: 10,
      title: 'Abschluss',
      body: `Brandverhütung beginnt bei dir:
Regeln einhalten, Gefahren melden, keine Experimente.`,
      imageUrl: null,
    },
  ],
},



 {
  slug: "elektrische-geraete",
  order: 3,
  title: "Elektrische Geräte & Akkus",
  heroImage: "/media/images/elektro_header.jpg",         // optional
  introVideo: null,                                     // optional
  slides: [
  {
    type: "content",
    order: 1,
    title: "3 Beschreibung: Elektrische Geräte",
    body: `Elektrische Geräte und Akkus sind im Alltag praktisch – aber sie können schnell zum Brandrisiko werden.

Wichtig ist:
- nur intakte Geräte verwenden
- keine Bastellösungen / Billig-Netzteile
- Kabel und Stecker regelmäßig prüfen`,
    imageUrl: null,
  },

  {
    type: "content",
    order: 2,
    title: "Überblick der Risiken",
    body: `Die häufigsten Ursachen sind:

- Überhitzung (z. B. beim Laden)
- beschädigte Akkus (Sturz, Wasser, Alter)
- überlastete Steckdosen/Mehrfachstecker

⚠️ Wenn etwas heiß wird, riecht oder sich aufbläht: sofort ausstecken und melden.`,
    imageUrl: "/media/images/elektro_risiken.png",
  },

  // ===== 3.1 E-Bikes / E-Roller =====
  {
    type: "content",
    order: 3,
    title: "3.1 E-Bikes & E-Roller",
    body: `E-Bikes und E-Roller haben leistungsstarke Akkus.

Darum gilt:
- nicht im Schulgebäude abstellen
- nicht im Gebäude laden
- bei Schäden (Sturz/Hitze/Wasser) besonders vorsichtig sein`,
    imageUrl: "/media/images/E-Scooter.jpg",
  },

  {
    type: "content",
    order: 4,
    title: "Warum nicht im Gebäude abstellen?",
    body: `Im Gebäude sind viele Menschen und Fluchtwege.

Ein Akku-Brand:
- entwickelt sehr hohe Temperaturen
- kann starken, giftigen Rauch erzeugen
- ist schwer zu löschen

✅ Abstellen ist erlaubt:
- nur draußen (z. B. Fahrradständer / markierter Außenbereich)
- so, dass Eingänge & Fluchtwege frei bleiben.`,
    imageUrl: null,
  },

  {
    type: "content",
    order: 5,
    title: "Übung: Wo darf ich abstellen?",
    body: `Wähle 4 richtige Abstellorte aus.`,
    imageUrl: null,
  },

  {
    type: "summary",
    order: 6,
    title: "Merksatz: E-Bikes & E-Roller",
    body: `E-Roller/E-Bike bleibt draußen.
Fluchtwege frei – Akkus nicht im Gebäude.`,
    imageUrl: null,
  },

  // ===== 3.2 Akkus & Ladeverbot =====
  {
    type: "content",
    order: 7,
    title: "3.2 Akkus & Ladeverbot",
    body: `In der Schule gilt: Privat-Akkus und unbekannte Ladegeräte sind ein Risiko.

Warum?
- Ladegeräte können überhitzen
- defekte Akkus reagieren unvorhersehbar
- Steckdosen können überlastet werden`,
    imageUrl: "/media/images/Ladeverbot.png",
  },

  {
    type: "content",
    order: 8,
    title: "Überhitzung: Warnzeichen",
    body: `Achte auf diese Warnzeichen:

- Gerät/Akku wird ungewöhnlich heiß
- Geruch nach Plastik/Chemie
- Akku bläht sich auf
- Knacken/Zischen oder Rauch

⚠️ Dann gilt: ausstecken – Abstand – Lehrperson/Portier informieren.`,
    imageUrl: null,
  },

  {
    type: "content",
    order: 9,
    title: "Übung: Laden in der Schule – darf / darf nicht",
    body: `Ziehe jeden Gegenstand in die richtige Box.`,
    imageUrl: null,
  },

  {
    type: "summary",
    order: 10,
    title: "Merksatz: Akkus & Laden",
    body: `Nur freigegebene Schulgeräte laden.
Bei Hitze/Geruch: ausstecken und melden.`,
    imageUrl: null,
  },

  // ===== 3.3 Private Elektrogeräte =====
  {
    type: "content",
    order: 11,
    title: "3.3 Private Elektrogeräte",
    body: `Schulgerät vs. Privatgerät:

✅ Schulgerät
- von der Schule freigegeben
- geprüft / passende Netzteile

✗ Privatgerät
- Zustand oft unbekannt
- Billig-Netzteil / Kabelschaden möglich

Darum: Private Geräte nur nach Regelung der Schule – im Zweifel **nicht anschließen**.`,
    imageUrl: "/media/images/handyladen.jpg",
  },

  {
    type: "summary",
    order: 12,
    title: "Merksatz: Private Elektrogeräte",
    body: `Nur geprüfte Geräte verwenden.
Privatgerät + unbekanntes Netzteil = unnötiges Risiko.`,
    imageUrl: null,
  },
],

},

// Kapitel 4
{
  slug: "flucht-rettungswege",
  order: 4,
  title: "Flucht & Rettungswege",
  heroImage: null,
  introVideo: null,
  slides: [
  {
    type: "content",
    order: 1,
    title: "4 Beschreibung: Flucht & Rettungswege",
    body: `Flucht- und Rettungswege sind dafür da, dass alle Personen das Gebäude im Notfall schnell und sicher verlassen können.

Dazu gehören:
- Fluchtweg-Schilder
- Notausgänge
- Stiegenhäuser und Gänge`,
    imageUrl: "/media/images/fluchtweg_schilder.png",
  },

  {
    type: "content",
    order: 2,
    title: "Gefahr durch Hindernisse",
    body: `Hindernisse auf Fluchtwegen sind gefährlich, weil:

- Menschen stolpern oder bleiben hängen
- Fluchtwege verengen sich (Stau)
- Rauch macht Sicht und Orientierung schlechter

! Auch kleine Dinge (Taschen, Kartons, Sessel) können im Notfall kritisch sein.`,
    imageUrl: null,
  },
{
    type: "content",
    order: 4,
    title: "Regeln: Fluchtwege freihalten",
    body: `Die wichtigsten Regeln:

- nichts in Gänge / Stiegenhäuser stellen
- Türen, Notausgänge und Beschilderung nicht verdecken
- keine Kabel als Stolperfallen quer über Wege legen
- im Zweifel: wegräumen oder melden
`,
    imageUrl: null,
  },
  {
    type: "content",
    order: 3,
    title: "4.1 Fluchtwege freihalten",
    body: `Schau dir die Beispiele an:`,
    imageUrl: "/media/images/fluchtweg_vergleich.png",
  },

  {
    type: "summary",
    order: 5,
    title: "Merksatz: Rettungswege",
    body: `Rettungsweg = Lebensweg.
Alles muss frei bleiben – immer.`,
    imageUrl: null,
  },
],
},
{
  slug: "verhalten-bei-veranstaltungen",
  order: 5,
  title: "Verhalten bei Schulveranstaltungen",
  heroImage: null,
  introVideo: null,
  slides: [
  // ===== Kapitel 5 Intro =====
  {
    type: "content",
    order: 1,
    title: "5 Beschreibung: Schulveranstaltungen",
    body: `Bei Schulveranstaltungen sind mehr Menschen im Gebäude als sonst – viele kennen die Fluchtwege nicht.

Darum gibt es extra Regeln:
- damit Wege frei bleiben
- damit es keine Panik gibt
- damit im Ernstfall alle schnell rauskommen`,
    imageUrl: null,
  },

  {
    type: "content",
    order: 2,
    title: "Menschenmenge: Warum ist das ein Risiko?",
    body: `Viele Personen auf engem Raum = höheres Risiko:

- Stau in Gängen & bei Türen
- Unübersichtlichkeit (Rauch / Lärm)
- Besucher kennen Notausgänge nicht
- Stolperfallen (Kabel, Taschen, Deko)

✓ Ziel: Ordnung schaffen, bevor etwas passiert.`,
    imageUrl: null,
  },

  {
    type: "content",
    order: 3,
    title: "Übersicht: Rollen bei Veranstaltungen",
    body: `Damit alles sicher läuft, hat jede Gruppe Aufgaben:

Lehrpersonen
- verantworten Organisation & Evakuierung
- geben Anweisungen, koordinieren Besucher

Schüler:innen
- halten Wege frei, melden Hindernisse
- unterstützen ruhig beim Leiten (wenn eingeteilt)

Besucher:innen
- folgen Anweisungen
- bleiben ruhig, gehen geordnet mit`,
    imageUrl: null,
  },

  // ===== 5.1 Vorbereitung =====
  {
    type: "content",
    order: 4,
    title: "5.1 Vorbereitung",
    body: `Vorbereitung ist der wichtigste Teil: Wenn vorher alles passt, passiert im Ernstfall weniger Chaos.`,
    imageUrl: "/media/images/brandschutztuer.png",
  },

  {
    type: "content",
    order: 5,
    title: "Aufgaben vor dem Event",
    body: `Checkliste vor Beginn:

- Fluchtwege komplett frei (keine Stühle/Kartons/Deko)
- Türen/Notausgänge nicht zustellen
- Kabel sichern (nicht quer über Wege)
- Feuerlöscher/Brandmelder zugänglich
- Aufbau so planen, dass Gänge breit bleiben`,
    imageUrl: null,
  },

  {
    type: "content",
    order: 6,
    title: "Miniquiz: Vorbereitung – richtig oder falsch?",
    body: `Beantworte die Aussagen mit Richtig/Falsch.`,
    imageUrl: null,
  },

  {
    type: "summary",
    order: 7,
    title: "Merksatz: Vorbereitung",
    body: `Die beste Evakuierung ist die,
die durch gute Vorbereitung ruhig bleibt.`,
    imageUrl: null,
  },

  // ===== 5.2 Evakuierung =====
  {
    type: "content",
    order: 8,
    title: "5.2 Evakuierung",
    body: `Wenn Alarm ist, zählt: ruhig bleiben, Anweisungen folgen, geordnet raus.`,
    imageUrl: "/media/images/alarm_sirene.png",
  },

  {
    type: "content",
    order: 9,
    title: "Schrittfolge der Evakuierung",
    body: `So läuft es richtig ab:

1) Alarm wahrnehmen – Ruhe bewahren
2) Anweisungen der Lehrperson befolgen
3) Nächsten Fluchtweg nehmen (Schilder)
4) Kein Drängeln – nicht zurücklaufen
5) Sammelplatz aufsuchen
6) Warten auf weitere Infos`,
    imageUrl: null,
  },

  {
    type: "content",
    order: 10,
    title: "Übung: Evakuierung – richtige Reihenfolge",
    body: `Ziehe die Schritte in die richtige Reihenfolge.`,
    imageUrl: null,
  },

  {
    type: "summary",
    order: 11,
    title: "Merksatz: Evakuierung",
    body: `Ruhig bleiben. Fluchtweg folgen.
Sammelplatz. Nicht zurück.`,
    imageUrl: null,
  },

  // ===== 5.3 Personen ohne Ortskenntnisse =====
  {
    type: "content",
    order: 12,
    title: "5.3 Personen ohne Ortskenntnisse",
    body: `Besucher:innen kennen die Fluchtwege nicht.

Darum ist deine Verantwortung:
- ruhig bleiben
- kurz und klar helfen
- nicht diskutieren, sondern führen`,
    imageUrl: "/media/images/besucher_hilfe.png",
  },

  {
    type: "content",
    order: 13,
    title: "Fragen im Ernstfall: Was tun?",
    body: `Beispiele, die du dir merken kannst:

- „Wo geht’s raus?“ → zur nächsten beschilderten Tür führen
- „Soll ich meine Jacke holen?“ → Nein, sofort mitkommen
- „Ich finde meine Gruppe nicht“ → mitnehmen, später am Sammelplatz klären
- „Jemand braucht Hilfe“ → Lehrperson/Portier informieren, nicht alleine riskieren`,
    imageUrl: null,
  },

  {
    type: "summary",
    order: 14,
    title: "Abschluss: Du bist Teil der Sicherheit",
    body: `Wenn du ruhig bleibst und richtig handelst,
hilfst du dir – und allen anderen.

✓ Wege frei
✓ Anweisungen folgen
✓ Besucher mitnehmen`,
    imageUrl: null,
  },
],

}
]