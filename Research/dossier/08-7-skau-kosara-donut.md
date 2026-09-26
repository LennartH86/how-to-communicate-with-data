# Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts (Skau 2016)

> **Bewertung:** Tag `unrated` durch `★0` … `★5` ersetzen (5 = besonders spannend).

**Drew Skau, Robert Kosara** · Computer Graphics Forum · 2016  
Zitationen: 100 · davon einflussreich: 7 · [DOI](https://doi.org/10.1111/cgf.12888) · [Google Scholar](https://scholar.google.com/scholar?q=%22Arcs%2C%20Angles%2C%20or%20Areas%3A%20Individual%20Data%20Encodings%20in%20Pie%20and%20Donut%20Charts%22)

## Kernaussage
Torten und Donuts werden nicht über den Winkel gelesen, sondern über Bogenlänge und Fläche – deshalb ist ein Donut so genau wie eine Torte.

## Studie
Zwei Crowdsourcing-Studien: (1) Torten-Varianten, die jeweils nur Winkel, nur Bogen oder nur Fläche zeigen; (2) Donuts mit Innenradius von 0 % bis 97 % (93 gültige Teilnehmende).

## Ergebnisse
- Reine Winkel-Varianten schnitten deutlich am schlechtesten ab – Winkel ist der unwichtigste Hinweisreiz
- Donuts mit 20–80 % Innenradius waren so genau wie die Torte (Log-Fehler 1,16–1,33 vs. 1,33)
- Erst der sehr dünne Ring (97 %) war schlechter (1,55)
- Beide sind trotzdem ungenauer als Balkendiagramme

![7-skau-kosara-donut](https://raw.githubusercontent.com/LennartH86/how-to-communicate-with-data/main/Research/figures/7-skau-kosara-donut.png)

## Für die Praxis
- ✅ Wenn schon Teil-vom-Ganzen als Kreis, dann darf es ein Donut sein – die Mitte eignet sich für die Kernzahl
- ✅ Segmente mit gleichem Radius zeichnen
- ❌ Radius als Dekoration variieren
- ❌ Explodierte Tortenstücke, wenn Segmente summiert werden sollen

## Grenzen
Nur Diagramme mit zwei Segmenten; Männer und Jüngere waren im Schnitt genauer.

## Im Original ansehen
Fig. 1 & 4 (Encoding-Varianten), Table 1 (Fehler je Variante), Fig. 10–11 & Table 2 (Innenradius).

*Basis der Zusammenfassung: Volltext. Die Grafik oben ist nach den Zahlen im Paper neu gezeichnet (keine Originalabbildung).*