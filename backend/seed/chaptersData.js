
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
      title: "Überblick: Warum Elektrik ein Risiko ist",
      body: `Akkus speichern viel Energie. Wenn etwas schiefgeht, wird es schnell gefährlich.

✓ Hitze + Energie = Brandrisiko
✓ Rauch kann giftig sein
✓ Akkubrände sind schwer zu löschen`,
      imageUrl: null,
    },

    {
      type: "content",
      order: 2,
      title: "Typische Brandverursacher",
      body: `Klick dich durch: Welche Dinge siehst du im Alltag?

- beschädigte Kabel
- billige Netzteile
- überlastete Mehrfachsteckdosen
- Akkus, die heiß werden oder aufblähen`,
      imageUrl: null,
    },

    {
      type: "content",
      order: 3,
      title: "Elektrik = Risiko (Mini-Fazit)",
      body: `Wenn du unsicher bist:
✓ lieber ausstecken
✓ Abstand halten
✓ Lehrperson informieren`,
      imageUrl: null,
    },

    // ===== 3.1 E-Bikes / E-Roller =====
    {
      type: "content",
      order: 4,
      title: "3.1 E-Bikes & E-Roller",
      body: `E-Bikes und E-Roller dürfen nicht im Schulgebäude abgestellt werden.

Warum?
- Akku kann beschädigt sein (Sturz, Wasser, Hitze)
- Im Gebäude sind Fluchtwege und viele Menschen
- Ein Akkubrand eskaliert schnell`,
      imageUrl: "/media/images/E-Scooter.jpg", // placeholder
    },

    {
      type: "content",
      order: 5,
      title: "Risikostufen: Akku-Check",
      body: `Merke dir diese 3 Stufen (wie eine Ampel):
      🟢 Grün (normal)
      🟡 Gelb (Warnung)
      🔴 Rot (Gefahr) `,
      imageUrl: null,
    },

    {
      type: "content",
      order: 6,
      title: "Interaktiv: Risiko richtig einschätzen",
      body: `Tippe die passende Stufe an.`,
      imageUrl: null,
    },

    {
      type: "content",
      order: 7,
      title: "Interaktiv: Wo Roller abstellen?",
      body: `Du bist mit dem E-Roller da. Wähle ALLE sicheren Abstellorte aus.`,
      imageUrl: null,
    },

    {
      type: "summary",
      order: 8,
      title: "Merksatz",
      body: `E-Roller/E-Bike bleibt draußen.
Akkus + Gebäude = unnötiges Risiko.`,
      imageUrl: null,
    },

    // ===== 3.2 Akkus & Ladeverbot =====
    {
      type: "content",
      order: 9,
      title: "3.2 Akkus & Ladeverbot",
      body: `Warum Ladeverbot?
- Ladegeräte können überhitzen
- Akkus können defekt sein
- Überlastung von Steckdosen ist gefährlich`,
      imageUrl: "/media/images/Ladeverbot.jpg", // placeholder
    },

    {
      type: "content",
      order: 10,
      title: "Interaktiv: Was darf NICHT geladen werden?",
      body: `Wähle ALLE Dinge aus, die in der Schule nicht geladen werden dürfen.`,
      imageUrl: null,
    },

    {
      type: "content",
      order: 11,
      title: "Abschlussfrage: Akku wird heiß",
      body: `Dein Akku wird beim Laden heiß und riecht komisch. Was machst du?`,
      imageUrl: null,
    },

    // ===== 3.3 Private Elektrogeräte =====
    {
      type: "content",
      order: 12,
      title: "3.3 Private Elektrogeräte",
      body: `Private Geräte sind oft nicht geprüft (Netzteil/Kabel/Leistung).

Schulgerät vs. Privatgerät:
✓ Schulgerät: freigegeben, geprüft
✗ Privatgerät: unbekanntes Risiko`,
      imageUrl: "/media/images/handyladen.jpg", // placeholder
    },

    {
      type: "content",
      order: 13,
      title: "Interaktiv: Was ist das Risiko?",
      body: `Wähle ALLE typischen Risiko-Faktoren aus.`,
      imageUrl: null,
    },

    {
      type: "summary",
      order: 14,
      title: "Fazit: Elektrik = Risiko",
      body: `Billig-Netzteil, heißer Akku, volle Steckdose?
Dann: AUSSTECKEN + MELDEN.`,
      imageUrl: null,
    },
  ],
},


  {
    slug: 'flucht-und-rettungswege',
    order: 4,
    title: 'Flucht- und Rettungswege',
    heroImage: '/media/images/fluchtweg_header.jpg',
    introVideo: '/media/videos/htl_fluchtwege_intro.mp4',
    slides: [
      {
  type: 'content',
  order: 1,
  title: 'Fluchtwege freihalten',
  body: `
Fluchtwege sind **Lebenswege**.

- Gänge, Türen und Stiegen müssen immer frei bleiben
- Auch kurz abgestellte Gegenstände sind gefährlich
- Im Rauch sieht man Hindernisse oft zu spät

👉 Merke: Was heute nur stört, kann im Notfall tödlich sein.
  `,
  imageUrl: '/media/images/fluchtVersperren.png',
},

      {
  type: 'content',
  order: 2,
  title: 'Notausgänge & Beschilderung',
  body: `
Im Brandfall zählt Orientierung.

- Notausgänge sind mit **grünen Fluchtweg-Schildern** markiert
- Diese Schilder sind auch bei Rauch sichtbar
- Präge dir Wege **vorher** ein, nicht erst im Notfall

🧠 Challenge: Weißt du jetzt, wo dein nächster Notausgang ist?
  `,
  imageUrl: '/media/images/fluchtweg.png',
},

     {
  type: 'content',
  order: 3,
  title: 'Liftverbot im Brandfall',
  body: `
🚫 **Warum du niemals den Lift benutzen darfst:**

- Stromausfall kann den Lift stoppen
- Rauch kann in den Schacht eindringen
- Du kannst eingeschlossen werden

✅ **Richtig:** Immer Stiegenhäuser benutzen – auch wenn es länger dauert.
  `,
  imageUrl: '/media/images/aufzugverbot.png',
},
{
  type: 'summary',
  order: 4,
  title: 'Kurz & Klar – Das musst du wissen',
  body: `
- Fluchtwege immer freihalten
- Notausgänge & Schilder kennen
- Lift im Brandfall tabu
- Zum Sammelplatz gehen

✔️ Wenn du das kannst, bist du vorbereitet.
  `,
  imageUrl: '/media/images/fluchtkarte.jpg',
},

    ],
  },

  {
    slug: 'schulveranstaltungen',
    order: 5,
    title: 'Verhalten bei Schulveranstaltungen',
    heroImage: '/media/images/schulveranstaltung_header.jpg',
    introVideo: '/media/videos/htl_schulveranstaltung_intro.mp4',
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Besondere Situation bei Veranstaltungen',
        body: `Bei Schulveranstaltungen sind viele Gäste im Haus, die Fluchtwege nicht kennen. 
Darum ist dein Verhalten besonders wichtig.`,
        imageUrl: '/media/images/veranstaltung_aula.png',
      },
      {
        type: 'content',
        order: 2,
        title: 'Vorbereitung & Freihalten der Wege',
        body: `Stände, Plakate oder Technik dürfen Fluchtwege nicht blockieren. 
Mindestbreiten in Gängen und bei Türen müssen eingehalten werden.`,
        imageUrl: '/media/images/stand_fluchtweg.png',
      },
      {
        type: 'content',
        order: 3,
        title: 'Evakuierung & Besucher',
        body: `Im Alarmfall werden Besucher zu Notausgängen und Sammelplatz geleitet. 
Lehrpersonen und Schüler ab der 3. Klasse unterstützen aktiv.`,
        imageUrl: '/media/images/evakuierung_besucher.png',
      },
      {
        type: 'summary',
        order: 4,
        title: 'Merkliste: Schulveranstaltungen',
        body: `- Fluchtwege auch bei Veranstaltungen freihalten\n- Besucher ruhig zu Notausgängen und Sammelplatz führen\n- Bei Alarm in der Freistunde selbständig zum Sammelplatz gehen`,
        imageUrl: '/media/images/checkliste_veranstaltung.png',
      },
    ],
  },
];
