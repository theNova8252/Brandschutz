
export const chaptersSeedData = [
  {
    slug: 'brandfall',
    order: 1,
    title: 'Verhalten im Brandfall',
    heroImage: '/media/images/brandfall_header.jpg',
    introVideo: '/media/videos/htl_brandfall_intro.mp4',
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Einführung: Verhalten im Brandfall',
        body: `Bei einem Brand ist es wichtig, ruhig zu bleiben und strukturiert vorzugehen. 
Dieses Kapitel zeigt dir, wie du Alarm auslöst, dich in Sicherheit bringst und wann ein Löschversuch sinnvoll ist. 
Die Inhalte basieren auf der Brandschutzordnung der HTL Wien West.`,
        imageUrl: '/media/images/brandfall_ruhe_bewahren.png',
      },
      {
        type: 'video',
        order: 2,
        title: 'Video: Was tun, wenn du Feuer entdeckst?',
        body: `Kurzes Schulungsvideo: Feuer im Gang, Brandmelder, Kanzlei/Portier verständigen, Verhalten im Klassenraum.`,
        videoUrl: '/media/videos/htl_feuer_entdeckt.mp4',
      },
      {
        type: 'content',
        order: 3,
        title: 'Feuer entdeckt – korrekt melden',
        body: `Wenn du selbst ein Feuer siehst:
- Betätige den Brandmelder **oder** verständige Kanzlei/Portier.
- Melde, **wo** es brennt und **was** passiert ist.
- Bleib ruhig und folge den Anweisungen der Lehrpersonen bzw. des Brandschutzteams.`,
        imageUrl: '/media/images/brandmelder.png',
      },
      {
        type: 'content',
        order: 4,
        title: 'Verhalten in der Klasse beim Alarm',
        body: `Beim Alarm im Unterricht:
- Fenster, wenn möglich, schließen.
- Nur nötige Sachen mitnehmen.
- Tür schließen (nicht versperren).
- Geordnet den Fluchtweg benutzen und zum Sammelplatz gehen.`,
        imageUrl: '/media/images/klasse_evakuierung.png',
      },
      {
        type: 'content',
        order: 5,
        title: 'Löschen mit Feuerlöschern',
        body: `In der Schule stehen Nasslöscher zur Verfügung. Bedienung:
1. Sicherungslasche abziehen
2. Schlagknopf kräftig einschlagen
3. Löschpistole betätigen

Wichtig: Selbstschutz geht vor – nur kleine Entstehungsbrände löschen.`,
        imageUrl: '/media/images/feuerloescher_anleitung.png',
        videoUrl: '/media/videos/htl_feuerloescher_demo.mp4',
      },
      {
        type: 'content',
        order: 6,
        title: 'Flucht möglich oder nicht?',
        body: `Zuerst prüfen:
- **Flucht möglich:** Fluchtweg nutzen, Sammelplatz aufsuchen.
- **Flucht nicht möglich (Gang verraucht):**
  - In der Klasse bleiben
  - Tür schließen, feuchtes Tuch vor den Türschlitz
  - Am Fenster bemerkbar machen
  - Auf Feuerwehr warten.`,
        imageUrl: '/media/images/rauch_im_gang.png',
      },
      {
        type: 'summary',
        order: 7,
        title: 'Merkliste: Verhalten im Brandfall',
        body: `- Alarm auslösen (Brandmelder / Kanzlei / Portier)\n- Fenster schließen, Klasse geordnet verlassen\n- Türen schließen, aber nicht versperren\n- Fluchtwege nutzen, Lift nie verwenden\n- Bei Rauch im Gang in der Klasse bleiben und bemerkbar machen\n- Nur kleine Brände löschen – Selbstschutz geht vor\n- Direkt zum Sammelplatz, Vollständigkeit melden`,
        imageUrl: '/media/images/checkliste_brandfall.png',
      },
    ],
  },

  {
    slug: 'brandverhuetung',
    order: 2,
    title: 'Brandverhütung',
    heroImage: '/media/images/brandverhuetung_header.jpg',
    introVideo: '/media/videos/htl_brandverhuetung_intro.mp4',
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Warum Brandverhütung wichtig ist',
        body: `Brandverhütung bedeutet, Brände von Anfang an zu vermeiden. 
Dazu gehören Rauchverbot, korrektes Verhalten mit Feuer und das Erkennen von Gefahrenquellen.`,
        imageUrl: '/media/images/brandverhuetung_icons.png',
      },
      {
        type: 'content',
        order: 2,
        title: 'Rauchverbot am Schulgelände',
        body: `Am gesamten Schulgelände gilt ein Rauchverbot. 
Zigaretten und andere Rauchwaren können leicht Glutnester und Brände verursachen – daher ist Rauchen verboten.`,
        imageUrl: '/media/images/rauchverbot_schild.png',
      },
      {
        type: 'content',
        order: 3,
        title: 'Umgang mit Feuer & offenen Flammen',
        body: `Offene Flammen (z. B. Kerzen, Feuerzeuge, Bunsenbrenner) sind im Gebäude nur in klar geregelten Unterrichtssituationen erlaubt. 
Unbeaufsichtigte Flammen sind ein hohes Risiko und daher verboten.`,
        imageUrl: '/media/images/offene_flamme_verboten.png',
      },
      {
        type: 'summary',
        order: 4,
        title: 'Merkliste: Brandverhütung',
        body: `- Rauchen am Schulgelände ist verboten\n- Keine offenen Flammen im Schulgebäude\n- Auffällige Brandgefahren (verschmorte Steckdosen, überhitzte Geräte) sofort melden`,
        imageUrl: '/media/images/checkliste_brandverhuetung.png',
      },
    ],
  },

  {
    slug: 'elektrische-geraete',
    order: 3,
    title: 'Elektrische Geräte & Akkus',
    heroImage: '/media/images/elektro_header.jpg',
    introVideo: '/media/videos/htl_elektrisch_intro.mp4',
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'E-Bikes & E-Roller',
        body: `E-Bikes und E-Roller dürfen nicht im Schulgebäude abgestellt werden. 
Beschädigte oder überhitzte Akkus stellen ein erhebliches Brandrisiko dar.`,
        imageUrl: '/media/images/ebike_verboten.png',
      },
      {
        type: 'content',
        order: 2,
        title: 'Akkus & Ladeverbot',
        body: `Das Laden von Akkus aller Art ist im Schulgebäude grundsätzlich verboten (E-Scooter, E-Bike, Powerbank, etc.). 
Defekte oder überlastete Akkus können explosionsartig brennen.`,
        imageUrl: '/media/images/akku_warnsymbol.png',
      },
      {
        type: 'content',
        order: 3,
        title: 'Private Elektrogeräte',
        body: `Private Elektrogeräte (Wasserkocher, Heizlüfter, Kaffeemaschinen usw.) dürfen nicht einfach eingesteckt werden. 
Nur von der Schule freigegebene Geräte sind erlaubt.`,
        imageUrl: '/media/images/steckdose_ueberlastet.png',
      },
      {
        type: 'summary',
        order: 4,
        title: 'Merkliste: Elektrische Geräte',
        body: `- Keine E-Bikes/E-Roller im Gebäude abstellen\n- Akkus nicht in der Schule laden\n- Private Elektrogeräte nur mit Freigabe verwenden`,
        imageUrl: '/media/images/checkliste_elektro.png',
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
        body: `Fluchtwege müssen immer frei bleiben. 
Abgestellte Gegenstände im Gang können zur Todesfalle werden, weil sie Flucht verzögern oder blockieren.`,
        imageUrl: '/media/images/fluchtweg_frei.png',
      },
      {
        type: 'content',
        order: 2,
        title: 'Notausgänge & Beschilderung',
        body: `Merke dir, wo sich in deinem Bereich Notausgänge und Stiegenhäuser befinden. 
Im Ernstfall folgst du den grünen Fluchtweg-Schildern.`,
        imageUrl: '/media/images/fluchtweg_schild.png',
      },
      {
        type: 'content',
        order: 3,
        title: 'Liftverbot im Brandfall',
        body: `Der Lift darf im Brandfall niemals verwendet werden – es besteht Lebensgefahr. 
Benutze immer die Stiegenhäuser.`,
        imageUrl: '/media/images/lift_verboten.png',
      },
      {
        type: 'summary',
        order: 4,
        title: 'Merkliste: Flucht- und Rettungswege',
        body: `- Fluchtwege nie zustellen\n- Notausgänge kennen\n- Lift im Brandfall nie benutzen\n- Immer zum Sammelplatz gehen`,
        imageUrl: '/media/images/checkliste_fluchtwege.png',
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
