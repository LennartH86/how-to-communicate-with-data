# Rethinking the Ranks of Visual Channels (McColeman 2021)

> **Bewertung:** Tag `unrated` durch `★0` … `★5` ersetzen (5 = besonders spannend).

**Caitlyn M. McColeman, Fumeng Yang, Timothy F. Brady et al.** · IEEE Transactions on Visualization and Computer Graphics · 2021  
Zitationen: 30 · davon einflussreich: – · [DOI](https://doi.org/10.1109/tvcg.2021.3114684) · [PDF](https://arxiv.org/pdf/2107.11367) · [Google Scholar](https://scholar.google.com/scholar?q=%22Rethinking%20the%20Ranks%20of%20Visual%20Channels%22)

## Kernaussage
Die berühmte Kanal-Rangfolge gilt nicht allgemein: Sollen Leute sich Werte merken, zählt die Anzahl der Datenpunkte viel mehr als der gewählte Kanal.

## Studie
49 Personen sahen kurz Charts mit 2, 4 oder 8 Werten in sechs Kanälen (Balken-Position, Linie, Länge, Winkel, Fläche, Helligkeit) und mussten sie danach aus dem Gedächtnis nachzeichnen. Bayes'sches Mehrebenenmodell für Verzerrung, Präzision und Fehler.

## Ergebnisse
- Die Cleveland-McGill-Rangfolge hielt nicht – nicht einmal bei nur 2 Werten
- Die Anzahl der Marks hatte eine Größenordnung mehr Einfluss als die Kanalwahl
- Mit 92 % Wahrscheinlichkeit ist die Erinnerung bei 2 Marks weniger verzerrt als bei 8
- Kleine Werte werden über-, große unterschätzt; am wenigsten Verzerrung um die Mitte der Skala
- Länge und Balken-Position verzerren am wenigsten; Fläche ist überraschend präzise, aber stärker verzerrt

![17-mccoleman](https://raw.githubusercontent.com/LennartH86/how-to-communicate-with-data/main/Research/figures/17-mccoleman.png)

## Für die Praxis
- ✅ Pro Chart wenige Werte zeigen, wenn sie erinnert werden sollen
- ✅ Die Kernzahl zusätzlich als Text nennen
- ❌ Aus der klassischen Rangfolge ableiten, dass ein Kanal immer besser ist

## Grenzen
Eine spezifische Aufgabe (Nachzeichnen); Liniencharts wurden systematisch zu niedrig gezeichnet.

## Im Original ansehen
Fig. 1 (klassische vs. neue Rangfolge), Fig. 7 (Effekte der Markanzahl), Fig. 8 (probabilistische Rangfolgen).

*Basis der Zusammenfassung: Volltext. Die Grafik oben ist eine Kennzahl-Karte (keine Originalabbildung).*