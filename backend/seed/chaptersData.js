
export const chaptersSeedData = [
  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 1 – Brandschutzordnung & Brandverhütung
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: 'brandschutzordnung-brandverhuetung',
    order: 1,
    title: 'Brandschutzordnung & Brandverhütung',
    heroImage: null,
    introVideo: null,
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Allgemeine Pflichten & Rauchverbot',
        body: `Alle in dem Objekt Beschäftigten sind verpflichtet, durch ihr Verhalten zur Verhütung von Bränden beizutragen. Alle haben sich mit dieser Brandschutzordnung vertraut zu machen, um dadurch einen effektiven, vorbeugenden Brandschutz und ein umsichtiges Handeln im Brandfall zu ermöglichen.

Am gesamten Schulgelände gilt ein allgemeines Rauchverbot.`,
        imageUrl: '/media/images/rauchverbot.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 2,
        title: 'Verbot offener Flammen & Feuerarbeiten',
        body: `Das Verwenden von Feuer und offenen Flammen ist im gesamten Gebäude verboten. Ausgenommen sind feuergefährliche Arbeiten in den dafür vorgesehenen Arbeitsplätzen der technischen Werkstätten durch fachkundiges Personal sowie Arbeiten im Labor, in der Küche oder im naturwissenschaftlichen Unterricht, sofern eine entsprechende Unterweisung erfolgt ist.

Feuer- und Heißarbeiten wie Schweißen, Schneiden oder Löten dürfen nur nach vorheriger Genehmigung durch den Brandschutzbeauftragten durchgeführt werden.`,
        imageUrl: '/media/images/offenesFeuer.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 3,
        title: 'Kerzenregelung & elektrische Geräte',
        body: `Kerzen dürfen grundsätzlich nicht entzündet werden. Ausnahmen gelten nur bei besonderen Anlässen unter Verwendung feuerfester Unterlagen, nicht brennbarer Dekoration und ständiger Aufsicht.

Elektrisch betriebene Geräte müssen den gesetzlichen Bestimmungen entsprechen. Defekte Geräte sind sofort außer Betrieb zu nehmen und zu melden. Reparaturen dürfen nur von Fachpersonal durchgeführt werden.`,
        imageUrl: '/media/images/elektro_risiken.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 4,
        title: 'E-Fahrzeuge, Gefahrstoffe & Brandschutztüren',
        body: `Elektrisch betriebene Fortbewegungsmittel dürfen nicht im Schulgebäude abgestellt werden. Das Laden von Akkus ist im Schulgebäude verboten.

Brennbare Stoffe und Gefahrstoffe sind gemäß den geltenden Vorschriften zu lagern. Flure und Treppenräume dürfen nicht als Lagerflächen genutzt werden. Brandschutz- und Rauchschutztüren sind stets geschlossen zu halten und dürfen nicht verkeilt werden.`,
        imageUrl: '/media/images/e_scooter_akku.png',
        videoUrl: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 2 – Flucht- und Rettungswege
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: 'flucht-und-rettungswege',
    order: 2,
    title: 'Flucht- und Rettungswege',
    heroImage: null,
    introVideo: null,
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Informationspflicht & Zugänglichkeit',
        body: `Jede Person im Objekt ist verpflichtet, sich über Lage und Verlauf der Flucht- und Rettungswege sowie über Notrufnummern und Standorte der Melde- und Löscheinrichtungen zu informieren.

Flucht- und Rettungswege müssen ständig in voller Breite begehbar sein. Offene Brandlasten oder lose Gegenstände dürfen sich dort nicht befinden.`,
        imageUrl: '/media/images/fluchtVersperren.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 2,
        title: 'Notausgänge & Feuerwehrzufahrten',
        body: `Türen im Verlauf von Fluchtwegen sowie Notausgänge müssen jederzeit ohne fremde Hilfsmittel benutzbar sein und von innen leicht zu öffnen sein.

Feuerwehrzufahrten und Aufstellflächen sind unbedingt freizuhalten. Sicherheitskennzeichnungen dürfen nicht verdeckt oder ausgeschaltet werden.`,
        imageUrl: '/media/images/fluchtweg_schilder.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 3,
        title: 'Sammelstellen',
        body: `Sammelstellen befinden sich:

- zwischen Schule und Thaliastraße
- zwischen Schule und Paltaufgasse
- Parkplatz zwischen Schule und Hettenkofergasse`,
        imageUrl: '/media/images/fluchtkarte.jpg',
        videoUrl: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 3 – Melde- und Löscheinrichtungen
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: 'melde-und-loescheinrichtungen',
    order: 3,
    title: 'Melde- und Löscheinrichtungen',
    heroImage: null,
    introVideo: null,
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Notrufnummern & Druckknopfmelder',
        body: `Feuerwehr und Rettungsdienst können unter den Notrufnummern 112, 122 und 144 alarmiert werden.

In den Fluren befinden sich rote Druckknopfmelder. Die Betätigung löst einen Alarm im gesamten Schulgebäude aus, verständigt jedoch nicht automatisch die Feuerwehr. Diese ist zusätzlich telefonisch zu alarmieren.`,
        imageUrl: '/media/images/brandmelder.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 2,
        title: 'Automatische Feuermelder',
        body: `Im Gebäude sind automatische Feuermelder installiert, die auf Rauch oder Hitze reagieren. Abschaltungen dürfen nur durch den Brandschutzbeauftragten erfolgen.`,
        imageUrl: '/media/images/alarm_sirene.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 3,
        title: 'Feuerlöscher & Brandklassen',
        body: `Feuerlöscher befinden sich in den Fluren, in der Aula, in der Eingangshalle sowie in Fachräumen. Sie dürfen nicht verstellt werden.

Die Feuerlöscher sind entsprechend der Brandklassen A, B, C, D und F gekennzeichnet und nur für die jeweiligen Einsatzbereiche zu verwenden.`,
        imageUrl: '/media/images/melden_fluechten_loeschen.png',
        videoUrl: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 4 – Verhalten im Brandfall
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: 'verhalten-im-brandfall',
    order: 4,
    title: 'Verhalten im Brandfall',
    heroImage: null,
    introVideo: null,
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Ruhe bewahren & Brand melden',
        body: `Im Brandfall ist Ruhe zu bewahren. Unüberlegtes Handeln kann zu Panik führen. Auf panisch reagierende Personen ist beruhigend einzuwirken.

Jeder Brand ist sofort zu melden oder die Meldung ist zu veranlassen.`,
        imageUrl: '/media/images/brandfall_ruhe_bewahren.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 2,
        title: 'Was beim Notruf sagen?',
        body: `Beim Notruf sind folgende Angaben zu machen:

Wo brennt es?
Was brennt?
Wie viele Personen sind betroffen?
Welche besonderen Gefahren bestehen?`,
        imageUrl: '/media/images/fluchtweg.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 3,
        title: 'Alarmsignal & Gebäude betreten',
        body: `Das Alarmsignal zur Räumung des Gebäudes ist ein durchgehendes Klingelsignal. Jeder Alarm ist ernst zu nehmen.

Das Gebäude darf erst nach ausdrücklicher Aufhebung des Alarms durch die Schulleitung oder die Feuerwehr wieder betreten werden.`,
        imageUrl: '/media/images/alarm_sirene.png',
        videoUrl: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 5 – In Sicherheit bringen & Löschversuch
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: 'sicherheit-und-loeschversuch',
    order: 5,
    title: 'In Sicherheit bringen & Löschversuch',
    heroImage: null,
    introVideo: null,
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Menschenrettung & Raumverlassen',
        body: `Menschenrettung geht vor Brandbekämpfung.

Fenster sind zu schließen. Klassenbuch ist mitzunehmen. Türen sind nach dem Verlassen des Raumes zu schließen, jedoch nicht abzuschließen.`,
        imageUrl: '/media/images/brandschutztuer.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 2,
        title: 'Evakuierung & Sammelplatz',
        body: `Das Gebäude ist ruhig und zügig über die gekennzeichneten Rettungswege zu verlassen. Aufzüge dürfen nicht benutzt werden.

Am Sammelplatz ist die Vollständigkeit zu überprüfen. Fehlende Personen sind der Einsatzleitung zu melden.`,
        imageUrl: '/media/images/klasse_evakuierung.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 3,
        title: 'Löschversuch',
        body: `Ein Löschversuch darf nur bei kleinen Entstehungsbränden und unter Beachtung der Eigensicherung unternommen werden. Zuerst ist die Alarmierung vorzunehmen.

Geeignete Löschmittel sind zu verwenden. Rückzugswege sind freizuhalten. Auf Wiederentzündung ist zu achten.`,
        imageUrl: '/media/images/aufzugverbot.png',
        videoUrl: null,
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────────────────
  // CHAPTER 6 – Besondere Verhaltensregeln & Schulveranstaltungen
  // ─────────────────────────────────────────────────────────────────────────────
  {
    slug: 'besondere-verhaltensregeln',
    order: 6,
    title: 'Besondere Verhaltensregeln & Schulveranstaltungen',
    heroImage: null,
    introVideo: null,
    slides: [
      {
        type: 'content',
        order: 1,
        title: 'Unterweisung & Dokumentation',
        body: `Alle Klassenlehrerinnen und Klassenlehrer haben die Schüler/innen zu Beginn des Schuljahres über die Brandschutzordnung zu unterweisen. Die Unterweisung ist im Klassenbuch zu dokumentieren.

In Räumen mit besonderen Gefährdungen ist eine zusätzliche Unterweisung erforderlich.`,
        imageUrl: '/media/images/schul_tablet.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 2,
        title: 'Anweisungen im Alarmfall',
        body: `Im Alarmfall ist auf Anweisungen der Brandschutzbeauftragten, der Feuerwehr oder anderer Sicherheitskräfte zu achten.`,
        imageUrl: '/media/images/verbotschild.png',
        videoUrl: null,
      },
      {
        type: 'content',
        order: 3,
        title: 'Schulveranstaltungen',
        body: `Bei Schulveranstaltungen sind Fluchtwege freizuhalten und besondere Evakuierungsmaßnahmen zu treffen. Personen ohne Ortskenntnisse sind über die Fluchtwege zu den Sammelstellen zu begleiten.`,
        imageUrl: '/media/images/besucher_hilfe.png',
        videoUrl: null,
      },
    ],
  },

  // ─── (alte Kapitel entfernt – siehe Git-History) ───────────────────────────
];
