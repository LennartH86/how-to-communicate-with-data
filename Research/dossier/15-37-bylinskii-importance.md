# Learning Visual Importance for Graphic Designs and Data Visualizations (Bylinskii 2017)

> **Bewertung:** Tag `unrated` durch `★0` … `★5` ersetzen (5 = besonders spannend).

**Zoya Bylinskii, Nam Wook Kim, Peter O’Donovan et al.** · ACM UIST 2017 · 2017  
Zitationen: 186 · davon einflussreich: 13 · [DOI](https://doi.org/10.1145/3126594.3126653) · [PDF](https://arxiv.org/pdf/1708.02660) · [Google Scholar](https://scholar.google.com/scholar?q=%22Learning%20Visual%20Importance%20for%20Graphic%20Designs%20and%20Data%20Visualizations%22)

## Kernaussage
Ein neuronales Netz sagt vorher, welche Teile einer Visualisierung Menschen wichtig finden – vor allem Titel, Beschriftungen und Datenextreme.

## Studie
Crowdsourcing von „Wichtigkeit“ per BubbleView-Klicks auf Hunderten Designs und Visualisierungen; Training vollständig konvolutionaler Netze; Anwendungen wie Thumbnails und Retargeting mit Hunderten Testpersonen.

## Ergebnisse
- Vorhersagen schlagen klassische Salienzmodelle für Fotos und liegen auf dem Niveau des besten Deep-Learning-Salienzmodells
- Automatische Thumbnails enthielten vor allem Titel, Haupttext und Datenextreme
- Suche in 60 Vorschaubildern: 1,96 Klicks mit Importance-Thumbnails vs. 3,25 mit verkleinerten Originalen (n = 369)

![37-bylinskii-importance](https://raw.githubusercontent.com/LennartH86/how-to-communicate-with-data/main/Research/figures/37-bylinskii-importance.png)

## Für die Praxis
- ✅ Titel und Kernbeschriftungen so gestalten, dass sie auch verkleinert tragen
- ❌ Die Kernbotschaft in Fußnoten oder Legenden verstecken

## Grenzen
Modell bildet durchschnittliche Wichtigkeit ab, keine individuelle Aufgabe.

## Im Original ansehen
Fig. 5 (Vorhersagen vs. Klicks), Fig. 6 (Wichtigkeit je Element), Fig. 12 (Thumbnails).

*Basis der Zusammenfassung: Volltext. Die Grafik oben ist nach den Zahlen im Paper neu gezeichnet (keine Originalabbildung).*