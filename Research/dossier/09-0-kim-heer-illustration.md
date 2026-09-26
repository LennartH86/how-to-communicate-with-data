# Assessing Effects of Task and Data Distribution on the Effectiveness of Visual Encodings (Kim 2018)

> **Bewertung:** Tag `unrated` durch `★0` … `★5` ersetzen (5 = besonders spannend).

**Young-Hoon Kim, Jeffrey Heer** · Computer Graphics Forum · 2018  
Zitationen: 114 · davon einflussreich: 19 · [DOI](https://doi.org/10.1111/cgf.13409) · [Google Scholar](https://scholar.google.com/scholar?q=%22Assessing%20Effects%20of%20Task%20and%20Data%20Distribution%20on%20the%20Effectiveness%20of%20Visual%20Encodings%22)

## Kernaussage
Welche Kodierung am besten ist, hängt von Aufgabe und Datenverteilung ab – farbige Scatterplots sind gut für Einzelwerte, aber schlecht für Gruppenvergleiche bei vielen Kategorien.

## Studie
Crowdsourcing-Experiment: 12 Kodierungen dreidimensionaler Daten (1 Kategorie, 2 Kennzahlen) über x, y, Farbe, Größe und Facettierung; 4 Aufgaben (Wert ablesen, Werte vergleichen, Maximum finden, Durchschnitte vergleichen) × 24 Datenverteilungen.

## Ergebnisse
- Position (x/y) bleibt insgesamt am stärksten, aber die Rangfolge verschiebt sich je nach Aufgabe
- Farbige Scatterplots: gut zum Vergleichen einzelner Punkte, schlecht für Durchschnittsvergleiche, sobald die Zahl der Kategorien steigt
- Mehr Überlappung/Gedränge verschlechtert die Leistung
- Aufgabe und Datenmerkmale sollten in automatische Chart-Empfehlungen einfließen

![0-kim-heer-illustration](https://raw.githubusercontent.com/LennartH86/how-to-communicate-with-data/main/Research/figures/0-kim-heer-illustration.png)

## Für die Praxis
- ✅ Bei vielen Kategorien facettieren (Small Multiples) statt alles einzufärben
- ✅ Vor der Chartwahl klären: Einzelwerte oder Gruppenaussage?
- ❌ 20 Farben in einem Scatterplot, wenn die Botschaft ein Gruppenvergleich ist

## Grenzen
Nur Punkt-basierte Charts; binäre Fragen mit fester Schwierigkeit.

## Im Original ansehen
Fig. 1 & 3 (Stimuli), Fig. 5 & 7 (Effektivitäts-Rankings nach Aufgabe und Datenverteilung).

*Basis der Zusammenfassung: Volltext. Die Grafik oben ist eine Illustration mit synthetischen Daten (keine Originalabbildung).*