# Viz Research – Lesedossier

45 Paper zur Frage, wie Menschen Datenvisualisierungen wahrnehmen, verstehen und darauf reagieren – in Lesereihenfolge.

**Bewerten:** Auf jeder Paper-Seite den Tag `unrated` durch `★0` bis `★5` ersetzen. Daraus entsteht danach die Sektion „Visual best practices – do's and don'ts and why“.

## 1. Grundlagen der Wahrnehmung
Welche visuellen Kanäle wir wie genau ablesen – und warum die klassische Rangfolge nur die halbe Wahrheit ist.

- Graphical Perception: Theory, Experimentation, and Application to the Development of Graphical Methods (Cleveland 1984) – Das Fundament der Disziplin: Menschen lesen Werte aus Position am genauesten ab, aus Winkel, Fläche und Farbe deutlich ungenauer.
- Crowdsourcing graphical perception (Heer 2010) – Crowdsourcing über Mechanical Turk liefert dieselben Wahrnehmungsergebnisse wie Laborstudien – der methodische Startschuss für die meisten Studien in diesem Dossier.
- Four Experiments on the Perception of Bar Charts (Talbot 2014) – Gestapelte Balken sind schwer zu lesen, weil die Segmente nicht ausgerichtet sind und Nachbarn stören – eine kleine Lücke hilft überraschend.
- Ranking Visualizations of Correlation Using Weber's Law (Harrison 2014) – Korrelation liest man am präzisesten aus Scatterplots; wie gut andere Charts funktionieren, hängt sogar davon ab, ob die Korrelation positiv oder negativ ist.
- Beyond Weber's Law: A Second Look at Ranking Visualizations of Correlation (Kay 2016) – Eine saubere statistische Neuauswertung bestätigt: Scatterplots sind für Korrelation die robusteste Wahl – mit geringer Streuung zwischen Personen.
- Rethinking the Ranks of Visual Channels (McColeman 2021) – Die berühmte Kanal-Rangfolge gilt nicht allgemein: Sollen Leute sich Werte merken, zählt die Anzahl der Datenpunkte viel mehr als der gewählte Kanal.
- Revisiting Channel Effectiveness: A Multi-Dimensional Evaluation with Primitive Visual Stimuli (Lee 2026) – Kanal-Effektivität ist mehrdimensional: Was sich genau ablesen lässt (Länge), springt nicht unbedingt ins Auge (dafür sind Fläche und Farbton top).
- Arcs, Angles, or Areas: Individual Data Encodings in Pie and Donut Charts (Skau 2016) – Torten und Donuts werden nicht über den Winkel gelesen, sondern über Bogenlänge und Fläche – deshalb ist ein Donut so genau wie eine Torte.
- Assessing Effects of Task and Data Distribution on the Effectiveness of Visual Encodings (Kim 2018) – Welche Kodierung am besten ist, hängt von Aufgabe und Datenverteilung ab – farbige Scatterplots sind gut für Einzelwerte, aber schlecht für Gruppenvergleiche bei vielen Kategorien.
- Task-Based Effectiveness of Basic Visualizations (Saket 2018) – „No one size fits all“: Tabelle, Linie, Balken, Scatter und Torte gewinnen jeweils bei anderen Aufgaben – sogar die Torte hat ihre Stärken.
- A Survey of Perception-Based Visualization Studies by Task (Quadri 2021) – Die Übersicht zu Wahrnehmungsstudien seit 1980, geordnet nach Aufgabe – ein Nachschlagewerk, dessen Kernbotschaft lautet: Effektivität ist immer aufgabenabhängig.

## 2. Aufmerksamkeit & Gedächtnis
Wohin Menschen schauen, was sie behalten und wann Deko hilft oder schadet.

- What Makes a Visualization Memorable? (Borkin 2013) – Visualisierungen werden konsistent erinnert oder vergessen – und Farbe, erkennbare Objekte und visuelle Dichte machen sie einprägsamer.
- Beyond Memorability: Visualization Recognition and Recall (Borkin 2016) – Titel und Text sind die Blickmagneten jeder Visualisierung – und was „auf einen Blick“ einprägsam ist, wird auch inhaltlich besser verstanden.
- BubbleView (Kim 2017) – Man braucht keinen Eye-Tracker: Maus-Klicks auf ein verschwommenes Bild bilden die Blicke auf Visualisierungen zu bis zu 92 % nach.
- Learning Visual Importance for Graphic Designs and Data Visualizations (Bylinskii 2017) – Ein neuronales Netz sagt vorher, welche Teile einer Visualisierung Menschen wichtig finden – vor allem Titel, Beschriftungen und Datenextreme.
- Data Visualization Saliency Model: A Tool for Evaluating Abstract Data Visualizations (Matzen 2017) – Klassische Salienzmodelle (entwickelt für Fotos) sagen nicht vorher, wohin Menschen in Charts schauen – Text ist der fehlende Faktor.
- ISOTYPE Visualization (Haroz 2015) – Piktogramme sind keine Chartjunk, solange sie selbst die Daten darstellen – rein dekorative Bilder kosten dagegen Zeit und Genauigkeit.

## 3. Text, Titel & Takeaways
Wie Titel, Captions, Annotationen und Anordnung steuern, was Leser mitnehmen.

- The Curse of Knowledge in Visual Data Communication (Xiong 2019) – Wer die Geschichte hinter den Daten kennt, hält „sein“ Muster für offensichtlich – und überschätzt systematisch, was das Publikum sieht.
- Towards Understanding How Readers Integrate Charts and Captions: A Case Study with Line Charts (Kim 2021) – Chart und Caption müssen dasselbe betonen – beschreibt die Caption ein unauffälliges Detail, gewinnt der Chart und die Caption wird ignoriert.
- Striking a Balance: Reader Takeaways and Preferences when Integrating Text and Charts (Stokes 2022) – Mehr Annotation wird nicht bestraft – Leser bevorzugen stark annotierte Charts gegenüber sparsamen Charts und reinem Text.
- Visual Arrangements of Bar Charts Influence Comparisons in Viewer Takeaways (Xiong 2021) – Wie Balken angeordnet sind, bestimmt, welchen Vergleich Menschen spontan ziehen – und selbst Experten sagen das oft falsch vorher.

## 4. Irreführung & Vertrauen
Wie Charts täuschen – absichtlich oder nicht – und was das mit Vertrauen macht.

- How Deceptive are Deceptive Visualizations? (Pandey 2015) – Die Klassiker der Chart-Manipulation wirken massiv: Abgeschnittene Achsen, Fläche als Menge und gestauchte Seitenverhältnisse vergrößern den wahrgenommenen Unterschied um 58–130 %.
- Truncating the Y-Axis: Threat or Menace? (Correll 2020) – Eine abgeschnittene y-Achse vergrößert den empfundenen Effekt – bei Balken UND Linien, und selbst Achsenbrüche oder Verläufe als Warnsignal verhindern das nicht.
- Misleading Beyond Visual Tricks: How People Actually Lie with Charts (Lisnic 2023) – Im echten Leben lügen Menschen mit Charts selten über Designtricks – meist über korrekte Charts plus falsche Schlussfolgerungen.
- Misinformed by Visualization: What Do We Learn From Misinformative Visualizations? (Lo 2022) – Aus über 1.000 real gemeldeten Fällen entsteht eine Landkarte irreführender Visualisierungen: 74 Problemtypen entlang der gesamten Analysekette.
- My Model is Unfair, Do People Even Care? Visual Design Affects Trust and Perceived Bias in Machine Learning (Gaba 2024) – Ob Menschen ein unfaires ML-Modell wählen, hängt vom Design ab: Als Text erklärt, wiegt Fairness schwerer als im Balkendiagramm.

## 5. Entscheidungen, Unsicherheit & Bias
Wie Visualisierungen Urteile, Kausalschlüsse und Wahrscheinlichkeitsdenken beeinflussen.

- Illusion of Causality in Visualized Data (Xiong 2019) – Balkendiagramme und Text verleiten eher zu Kausalschlüssen als Scatterplots und Linien – weil sie Daten in zwei Gruppen verdichten.
- Improving Bayesian Reasoning: The Effects of Phrasing, Visualization, and Spatial Ability (Ottley 2016) – Bei Wahrscheinlichkeitsaufgaben (Bayes) bringt die Formulierung mehr als eine Grafik – und Text plus Grafik zusammen hilft nicht automatisch.
- A Bayesian Cognition Approach to Improve Data Visualization (Kim 2019) – Menschen interpretieren Daten im Licht ihrer Vorannahmen – ungefähr wie Bayesianer, aber bei großen Datenmengen glauben sie den Daten zu wenig.
- From Perception to Decision: Assessing the Role of Chart Type Affordances in High-Level Decision Tasks (Li 2025) – Wahrnehmungsvorteile übertragen sich nicht automatisch auf echte Entscheidungen: Balken oder Torte änderten die Wahl eines Doktorvaters kaum.
- In Pursuit of Error: A Survey of Uncertainty Visualization Evaluation (Hullman 2018) – Wie wird geprüft, ob Unsicherheits-Visualisierungen funktionieren? Meist falsch herum: Gemessen wird Ablesegenauigkeit statt Entscheidungsqualität.
- A Task-Based Taxonomy of Cognitive Biases for Information Visualization (Dimara 2018) – 154 kognitive Verzerrungen, geordnet nach der Aufgabe, bei der sie beim Arbeiten mit Visualisierungen auftreten.

## 6. Visualization Literacy
Was das Publikum überhaupt lesen kann – und wie man es misst.

- Graph Literacy (Galesic 2011) – Etwa ein Drittel der Erwachsenen in Deutschland und den USA hat eine geringe Graph Literacy und geringe Rechenfähigkeit – und nur 16–19 % beachten unterschiedliche Achsenbeschriftungen.
- VLAT: Development of a Visualization Literacy Assessment Test (Lee 2016) – Der Standardtest für Visualization Literacy: 53 Fragen zu 12 Charttypen – und er zeigt, dass gestapelte Charts für Laien die größten Stolpersteine sind.
- Mini‐VLAT: A Short and Effective Measure of Visualization Literacy (Pandey 2023) – Visualization Literacy in 12 Fragen messen – fast so gut wie mit dem 53-Fragen-VLAT.
- Investigating aspects of data visualization literacy using 20 information visualizations and 273 science museum visitors (Börner 2016) – Selbst wissenschaftsinteressierte Museumsbesucher können viele gängige Visualisierungen weder benennen noch lesen.

## 7. Storytelling & Engagement
Narrative Formen, Animation, Comics und Emotion: was Engagement wirklich bringt.

- Narrative Visualization: Telling Stories with Data (Segel 2010) – Der Klassiker zum Daten-Storytelling: sieben Genres und das Spektrum von autorgeführt bis lesergeführt.
- Visual Narrative Flow: Exploring Factors Shaping Data Visualization Story Reading Experiences (McKenna 2017) – Visualisierungen und animierte Übergänge steigern das Engagement bei Daten-Stories – ob man scrollt oder klickt, ist weniger wichtig.
- Storytelling in Information Visualizations (Boy 2015) – Eine vorangestellte Story macht Menschen nicht neugieriger darauf, selbst in den Daten zu stöbern.
- Showing People Behind Data (Boy 2017) – Menschenfiguren statt Balken erzeugen nicht mehr Empathie – die Effekte auf Mitgefühl und Spendenbereitschaft waren nahezu gleich.
- Comparing Effectiveness and Engagement of Data Comics and Infographics (Wang 2019) – Data Comics schlagen Infografiken: mehr Freude, mehr Engagement und besseres Verständnis und Erinnern.
- The Persuasive Power of Data Visualization (Pandey 2014) – Charts überzeugen stärker als Tabellen – aber nur Menschen ohne feste Meinung; wer stark dagegen ist, lässt sich eher von Tabellen überzeugen.
- Effectiveness of Animation in Trend Visualization (Robertson 2008) – Gapminder-Animationen sind schnell und machen Spaß im Vortrag, führen aber zu vielen Fehlern – für die Analyse sind Small Multiples besser.

## 8. Business & Überblick
Tabellen im Arbeitsalltag und die beste Gesamt-Zusammenfassung des Feldes.

- Untidy Data: The Unreasonable Effectiveness of Tables (Bartram 2021) – Für die meisten Business-Nutzer ist die Tabelle kein Vorstadium der Visualisierung, sondern ihr wichtigstes Werkzeug – wer keinen Zugriff auf die Rohdaten bietet, verliert sie an Excel.
- The Science of Visual Data Communication: What Works (Franconeri 2021) – Die beste Einzelübersicht des Feldes: Wie das visuelle System Daten verarbeitet und welche Designregeln sich daraus ableiten – ideale Grundlage für den Vortrag.
