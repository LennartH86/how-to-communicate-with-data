"""Redraws key findings of the selected papers as simple charts / diagrams.

All numbers come from the papers themselves (see comment per figure).
Figures marked "Illustration" use synthetic data to show the stimulus idea, not results.
Output: Research/figures/<id>-<slug>.png
"""
import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch

OUT = os.path.join(os.path.dirname(__file__), "figures")
os.makedirs(OUT, exist_ok=True)

SURF, INK, INK2, MUTED, GRID = "#fcfcfb", "#0b0b0b", "#52514e", "#8a8984", "#e4e3df"
BLUE, ORANGE, GRAY, LIGHT = "#2a78d6", "#eb6834", "#b9b8b2", "#dbe8f7"

plt.rcParams.update({
    "font.family": "DejaVu Sans", "font.size": 12, "text.color": INK,
    "axes.edgecolor": GRID, "axes.labelcolor": INK2, "xtick.color": INK2, "ytick.color": INK2,
    "axes.spines.top": False, "axes.spines.right": False, "axes.grid": False,
    "figure.facecolor": SURF, "axes.facecolor": SURF, "savefig.facecolor": SURF,
})


def fig(title, subtitle=None, w=11, h=6):
    f = plt.figure(figsize=(w, h), dpi=110)
    f.text(0.04, 0.95, title, fontsize=17, fontweight="bold", va="top", color=INK)
    if subtitle:
        f.text(0.04, 0.885, subtitle, fontsize=12, va="top", color=INK2)
    return f


def save(f, name, source):
    f.text(0.04, 0.02, source, fontsize=9, color=MUTED, va="bottom")
    f.savefig(os.path.join(OUT, name + ".png"))
    plt.close(f)


def hbars(ax, labels, values, hi=None, fmt="{:.0f}", xmax=None, unit=""):
    y = np.arange(len(labels))[::-1]
    cols = [BLUE if (hi is None or i in hi) else GRAY for i in range(len(labels))]
    ax.barh(y, values, color=cols, height=0.6)
    for yi, v in zip(y, values):
        off = (xmax or max(values)) * 0.01
        ax.text(v + off if v >= 0 else off, yi, fmt.format(v) + unit, va="center", fontsize=11, color=INK)
    ax.set_yticks(y, labels)
    ax.set_xlim(0, (xmax or max(values)) * 1.15)
    ax.spines["left"].set_visible(False)
    ax.tick_params(axis="y", length=0)
    ax.xaxis.set_visible(False)
    ax.spines["bottom"].set_visible(False)


def card(name, title, big, lines, source, sub=None):
    """Key-number card for papers without plottable data."""
    f = fig(title, sub, h=4.6)
    f.text(0.04, 0.62, big, fontsize=40, fontweight="bold", color=BLUE, va="center")
    for i, ln in enumerate(lines):
        f.text(0.04, 0.44 - i * 0.085, "•  " + ln, fontsize=13, color=INK, va="center")
    save(f, name, source)


def boxes(name, title, rows, source, sub=None, h=5.5):
    """rows: list of lists of box labels; first row highlighted."""
    f = fig(title, sub, h=h)
    ax = f.add_axes([0.03, 0.08, 0.94, 0.72]); ax.axis("off")
    ax.set_xlim(0, 1); ax.set_ylim(0, len(rows))
    for r, row in enumerate(rows):
        n = len(row); wbox = 0.96 / n
        for c, lab in enumerate(row):
            x = 0.02 + c * wbox; yb = len(rows) - r - 0.85
            col = LIGHT if r == 0 else "#f1f0ec"
            ax.add_patch(FancyBboxPatch((x + 0.005, yb), wbox - 0.02, 0.7, boxstyle="round,pad=0.005,rounding_size=0.02",
                                        fc=col, ec=BLUE if r == 0 else GRID, lw=1.2))
            ax.text(x + wbox / 2, yb + 0.35, lab, ha="center", va="center", fontsize=11, wrap=True, color=INK)
    save(f, name, source)


# ---------------------------------------------------------------- perception
# 98 Cleveland & McGill 1984 - ranking of elementary perceptual tasks (Fig. in paper, p. 536)
boxes("98-cleveland-ranking", "Die klassische Rangfolge der visuellen Kanäle",
      [["1  Position auf gemeinsamer Skala"], ["2  Position auf nicht ausgerichteten Skalen"],
       ["3  Länge", "3  Richtung", "3  Winkel"], ["4  Fläche"], ["5  Volumen", "5  Krümmung"],
       ["6  Schattierung", "6  Farbsättigung"]],
      "Nach Cleveland & McGill (1984), JASA 79(387). Oben = genauer ablesbar.", h=6.5)

# 99 Heer & Bostock 2010 - crowdsourced replication
boxes("99-heer-bostock", "Crowdsourcing reproduziert die Laborbefunde",
      [["Mechanical Turk repliziert Cleveland & McGill:\nPosition > Länge > Winkel > Fläche"],
       ["Rechteckflächen ≈ so genau\nwie Kreisflächen", "Quadrate (Seitenverhältnis 1)\nam schwersten zu vergleichen", "Gitterlinien: Alpha ≈ 0.2\nals sicherer Standard"],
       ["Mit Qualifikationsaufgabe nur 0.75 %\nAusreißer; ohne >10 % unbrauchbar"]],
      "Nach Heer & Bostock (2010), CHI. Werte aus dem Ergebnisteil.")

# 109 Talbot et al. 2014 - four bar chart experiments (Fig. 8, 12)
f = fig("Warum gestapelte Balken schwer zu lesen sind", "Zusätzlicher Fehler in Prozentpunkten (Talbot et al., 4 Experimente)")
ax = f.add_axes([0.33, 0.12, 0.6, 0.7])
hbars(ax, ["Vergleich im selben Stapel\n(absoluter Fehler gesamt)", "Nicht ausgerichtet statt\nausgerichtet (Unalignment)", "Ablenkende Nachbarbalken", "Lücke zwischen verglichenen\nSegmenten (senkt Fehler)"],
      [7.38, 1.15, 0.37, -0.87], hi=[0], fmt="{:+.2f}", xmax=8, unit=" pp")
ax.set_xlim(-1.5, 9)
save(f, "109-talbot-bars", "Nach Talbot, Setlur & Anand (2014), TVCG – Exp. 2 & 3, Fig. 8 & 12.")

# 108 Harrison et al. 2014 - Weber models (Table 2)
f = fig("Wie präzise Korrelation abgelesen wird", "Just-noticeable difference (JND) nach Weber-Modell – niedriger = präziser; n = 1.687")
ax = f.add_axes([0.08, 0.12, 0.62, 0.7])
models = {"Scatterplot (+)": (0.17, -0.17), "Scatterplot (−)": (0.21, -0.22), "Parallele Koord. (−)": (0.16, -0.14),
          "Parallele Koord. (+)": (0.37, -0.27), "Gestapelte Balken (−)": (0.22, -0.19), "Donut (−)": (0.26, -0.23),
          "Linie (+)": (0.46, -0.32), "Radar (+)": (0.44, -0.36), "Gestapelte Linie (−)": (0.35, -0.32)}
r = np.linspace(0.3, 0.8, 50)
ends = sorted(((b + k * 0.8, lab) for lab, (b, k) in models.items()))
placed = []
for yv_, lab in ends:
    yl = max(yv_, placed[-1] + 0.018) if placed else yv_
    placed.append(yl)
    hi = lab.startswith("Scatter") or lab == "Parallele Koord. (−)"
    ax.text(0.81, yl, lab, fontsize=9.5, va="center", color=INK if hi else INK2)
for lab, (b, k) in models.items():
    hi = lab.startswith("Scatter") or lab == "Parallele Koord. (−)"
    ax.plot(r, b + k * r, color=BLUE if hi else GRAY, lw=2.4 if hi else 1.4)
ax.set_xlabel("Korrelation r"); ax.set_ylabel("JND")
save(f, "108-harrison-weber", "Nach Harrison et al. (2014), TVCG – Table 2 (Achsenabschnitt/Steigung), vereinfacht mit rA≈r.")

# 9 Kay & Heer 2016
boxes("9-kay-heer", "Neu-Analyse: Scatterplots sind die sichere Wahl für Korrelation",
      [["Hohe Präzision: Scatterplot (positiv & negativ), Parallele Koordinaten (negativ)"],
       ["Mittlere Präzision"], ["Niedrige Präzision"], ["Nicht von Raten unterscheidbar (u.a. mehrere gestapelte Varianten)"]],
      "Nach Kay & Heer (2016), TVCG – Fig. 8. Jede Stufe ist ≈1,5–2× präziser als die nächste.",
      sub="Bayes'sche Neuauswertung der 1.687-Personen-Daten von Harrison et al.")

# 17 McColeman et al. 2021
card("17-mccoleman", "Die Kanal-Rangfolge hängt an der Aufgabe", "92 %",
     ["Wahrscheinlichkeit, dass Werte bei 2 Marks weniger verzerrt erinnert werden als bei 8",
      "Die Anzahl der Werte beeinflusst die Leistung um eine Größenordnung stärker als die Kanalwahl",
      "Beim Nachzeichnen aus dem Gedächtnis hält die Cleveland-McGill-Rangfolge nicht – selbst bei 2 Marks"],
     "Nach McColeman, Yang, Brady & Franconeri (2021), TVCG – Fig. 7 & 8; 49 Teilnehmende.")

# 28 Lee et al. 2026 - pop-out (Fig. 5)
f = fig("Was springt in 100 ms ins Auge?", "Trefferquote bei der Suche nach einem Ausreißer (Pop-out), n = 105")
ax = f.add_axes([0.2, 0.1, 0.74, 0.74])
labs = ["Fläche", "Farbton (Hue)", "Position", "Krümmung", "Neigung", "Länge", "Sättigung", "Helligkeit", "Form: Quadrat", "Form: Dreieck", "Form: Sechseck"]
vals = [91.7, 90.4, 88.9, 86.4, 83.0, 80.3, 79.3, 77.0, 83.0, 80.0, 55.6]
hbars(ax, labs, vals, hi=[0, 1, 5], fmt="{:.1f}", xmax=100, unit=" %")
save(f, "28-lee-popout", "Nach Lee, Park, Chang & Seo (2026), arXiv 2608.04435 – Fig. 5. Länge: Top bei Genauigkeit, nur Mittelfeld beim Pop-out.")

# 7 Skau & Kosara 2016 - donut radius (Table 2)
f = fig("Donut vs. Torte: Das Loch in der Mitte schadet nicht", "Log-Fehler beim Ablesen nach Innenradius (95 %-KI); niedriger = besser")
ax = f.add_axes([0.1, 0.14, 0.85, 0.66])
rad = ["0 %\n(Torte)", "20 %", "40 %", "60 %", "80 %", "97 %\n(dünner Ring)"]
m = [1.327, 1.162, 1.289, 1.333, 1.257, 1.553]; ci = [0.119, 0.130, 0.125, 0.114, 0.128, 0.116]
for i, (mm, c) in enumerate(zip(m, ci)):
    col = ORANGE if i == 5 else BLUE
    ax.errorbar(i, mm, yerr=c, fmt="o", color=col, ms=9, capsize=5, lw=2)
    ax.text(i + 0.12, mm, f"{mm:.2f}", va="center", fontsize=10)
ax.set_xticks(range(6), rad); ax.set_ylim(0.9, 1.8); ax.set_ylabel("mittlerer Log-Fehler")
save(f, "7-skau-kosara-donut", "Nach Skau & Kosara (2016), EuroVis/CGF – Table 2, Studie 2 (93 Personen). Winkel ist der unwichtigste Hinweisreiz.")

# 0 Kim & Heer 2018 - Illustration
rng = np.random.default_rng(3)
f = fig("Farbige Scatterplots: gut für Einzelwerte, schlecht für Gruppenmittel", "Illustration (synthetische Daten) – je mehr Kategorien, desto schwerer der Vergleich von Durchschnitten")
for j, k in enumerate([3, 20]):
    ax = f.add_axes([0.06 + j * 0.48, 0.12, 0.42, 0.66])
    cmap = plt.get_cmap("tab20")
    for c in range(k):
        ax.scatter(rng.normal(c % 5, 1.3, 12), rng.normal(c // 5 + c % 3, 1.3, 12), s=18, color=cmap(c % 20), alpha=0.85)
    ax.set_title(f"{k} Kategorien", fontsize=12, color=INK2); ax.set_xticks([]); ax.set_yticks([])
save(f, "0-kim-heer-illustration", "Illustration nach dem Stimulusdesign von Kim & Heer (2018), EuroVis/CGF – Fig. 1. Keine Ergebnisdaten.")

# 27 Saket et al. 2018 - task matrix (guidelines G1-G5, Sec. 5-6)
f = fig("Welcher Charttyp für welche Aufgabe?", "Signifikant beste (●) bzw. schlechte (✕) Typen laut Crowdsourcing-Experiment")
ax = f.add_axes([0.2, 0.08, 0.76, 0.72]); ax.axis("off")
charts = ["Tabelle", "Linie", "Balken", "Scatter", "Torte"]
tasks = {"Cluster finden": {2: "●", 4: "●"}, "Korrelation": {1: "●", 3: "●", 0: "✕", 4: "✕"},
         "Ausreißer finden": {3: "●"}, "Abgeleiteter Wert": {0: "●", 1: "✕"},
         "Verteilung": {3: "●", 2: "●", 0: "✕", 4: "✕"}, "Einzelwert/Extrem/Filter": {4: "○"}}
for c, ch in enumerate(charts):
    ax.text(c + 0.5, len(tasks) + 0.3, ch, ha="center", fontsize=12, fontweight="bold")
for r_, (t, marks) in enumerate(tasks.items()):
    yy = len(tasks) - r_ - 0.5
    ax.text(-0.15, yy, t, ha="right", va="center", fontsize=12)
    for c in range(5):
        s = marks.get(c, "")
        ax.text(c + 0.5, yy, s, ha="center", va="center", fontsize=18, color=BLUE if s == "●" else ORANGE if s == "✕" else INK2)
    ax.axhline(yy - 0.5, color=GRID, lw=0.8)
ax.set_xlim(-2.2, 5); ax.set_ylim(-0.2, len(tasks) + 0.7)
save(f, "27-saket-matrix", "Nach Saket, Endert & Demiralp (2019), TVCG – Guidelines G1–G5. ● schnell & genau · ✕ vermeiden · ○ Torte hier ebenso gut wie andere.")

# 23 Quadri & Rosen survey
boxes("23-quadri-survey", "Survey: Wahrnehmungsstudien seit 1980, sortiert nach Aufgabe",
      [["Kernbotschaft: Effektivität ist aufgabenabhängig – kein Charttyp gewinnt überall"],
       ["Wert ablesen", "Vergleichen", "Extrem finden", "Korrelation", "Verteilung", "Cluster/Ausreißer"],
       ["Schwäche des Feldes: wenige Replikationen, Fokus auf Scatter/Balken/Linie"]],
      "Nach Quadri & Rosen (2022), TVCG – Diskussion Abschnitt 4.")

# ---------------------------------------------------------------- attention & memory
# 100 Borkin 2013 (Fig. 4, 6, Sec 7.2)
f = fig("Was eine Visualisierung einprägsam macht", "Memorability-Score (d′) – höher = besser erinnert; 2.070 Visualisierungen, 410 im Test")
groups = [("Piktogramme", ["ohne", "mit"], [1.14, 1.93]), ("Anzahl Farben", ["1", "2–6", "≥7"], [1.18, 1.48, 1.71]),
          ("Data-Ink-Ratio", ["„gut“ (minimal)", "„schlecht“ (viel Deko)"], [1.23, 1.81])]
for j, (t, labs, vals) in enumerate(groups):
    ax = f.add_axes([0.06 + j * 0.32, 0.14, 0.26, 0.62])
    ax.bar(range(len(vals)), vals, color=[GRAY] * (len(vals) - 1) + [BLUE], width=0.6)
    for i, v in enumerate(vals): ax.text(i, v + 0.03, f"{v:.2f}", ha="center", fontsize=11)
    ax.set_xticks(range(len(vals)), labs, fontsize=10); ax.set_ylim(0, 2.2); ax.set_title(t, fontsize=12, color=INK2)
    ax.yaxis.set_visible(False); ax.spines["left"].set_visible(False)
save(f, "100-borkin-memorability", "Nach Borkin et al. (2013), TVCG – Abschnitt 7.2, Fig. 4 & 6. Einprägsam ≠ verständlich (siehe Borkin 2016).")

card("35-borkin-2016", "Beyond Memorability: Wohin schauen Menschen?", "393 Charts · 33 Personen",
     ["Titel und Text ziehen die meisten Blicke an und bestimmen, was erinnert wird",
      "Passende Piktogramme stören nicht und helfen beim Wiedererkennen; Redundanz hilft",
      "Was auf einen Blick einprägsam ist, vermittelt auch die Botschaft besser"],
     "Nach Borkin et al. (2016), TVCG – Abstract & Ergebnisse (Eye-Tracking + Textbeschreibungen).")

f = fig("BubbleView: Klicks statt Eye-Tracker", "Anteil der echten Blickfixationen, den Maus-Klicks erklären (normalisiert)")
ax = f.add_axes([0.32, 0.14, 0.62, 0.66])
hbars(ax, ["Visualisierungen, Beschreibungsaufgabe\n(20 Personen)", "Visualisierungen, Beschreibungsaufgabe\n(10 Personen)", "Webseiten (10–12 Personen)", "Naturbilder (10–12 Personen)"],
      [92, 90, 78, 78], hi=[0, 1], xmax=100, unit=" %")
save(f, "38-bubbleview", "Nach Kim, Bylinskii et al. (2017), ACM TOCHI – Diskussion, Tables II–IV.")

f = fig("Automatische Thumbnails nach „Wichtigkeit“", "Klicks bis zum gesuchten Chart in einem Raster aus 60 Vorschaubildern")
ax = f.add_axes([0.32, 0.18, 0.6, 0.55])
hbars(ax, ["Verkleinertes Original (n = 200)", "Importance-Thumbnail (n = 169)"], [3.25, 1.96], hi=[1], fmt="{:.2f}", xmax=3.6, unit=" Klicks")
save(f, "37-bylinskii-importance", "Nach Bylinskii et al. (2017), UIST – Thumbnail-Evaluation. Modell sagt Titel, Beschriftung und Datenextreme als wichtig voraus.")

card("39-dvs-saliency", "Salienzmodelle für Fotos versagen bei Charts", "Text zählt",
     ["Klassische Salienzmodelle sagen Blicke auf Datenvisualisierungen schlecht vorher",
      "Das Data-Visualization-Saliency-Modell berücksichtigt Text und passt besser zu Eye-Tracking-Daten",
      "Praxis: Beschriftungen und Titel sind Blickmagneten – bewusst platzieren"],
     "Nach Matzen et al. (2018), TVCG – Abstract. (Volltext nicht frei abrufbar.)")

boxes("106-haroz-isotype", "ISOTYPE: Wann Piktogramme helfen – und wann nicht",
      [["Piktogramme, die selbst die Daten darstellen: keine Kosten, teils Vorteile"],
       ["Bessere Erinnerung unter\nGedächtnislast", "Machen neugierig:\nmehr Leute schauen genauer hin", "Gestapelte Icons helfen\nbei kleinen Werten"],
       ["Überflüssiges Hintergrundbild: signifikant langsamer und mehr Fehler"]],
      "Nach Haroz, Kosara & Franconeri (2015), CHI – Schlussfolgerungen (1)–(4), Fig. 7 & 13.")

# ---------------------------------------------------------------- text
f = fig("Curse of Knowledge: Wer die Geschichte kennt, sieht sie überall", "Vorhergesagte Auffälligkeit für uninformierte Betrachter (Rangwert, Exp. 1b)")
ax = f.add_axes([0.3, 0.2, 0.62, 0.5])
hbars(ax, ["Muster, das in der Geschichte\nnicht vorkam", "Muster aus der gehörten\nGeschichte"], [1.79, 2.48], hi=[1], fmt="{:.2f}", xmax=3)
save(f, "4-xiong-curse", "Nach Xiong, van Weelden & Franconeri (2020), TVCG – Exp. 1b, Fig. 9 (Wilcoxon p = .035). Ohne visuelle Annotation schwächer, aber vorhanden.")

rng = np.random.default_rng(7)
x = np.arange(40); yv = np.cumsum(rng.normal(0, 1, 40)) + 10; yv[25:29] += [4, 7, 5, 2]
f = fig("Bildunterschrift gegen den Chart verliert", "Illustration: Die Caption nennt ein unauffälliges Detail – Leser berichten trotzdem den Peak")
ax = f.add_axes([0.06, 0.2, 0.88, 0.55])
ax.plot(x, yv, color=BLUE, lw=2); ax.annotate("auffälligstes Merkmal", (26, yv[26]), (30, yv[26] + 1.5), color=INK2, arrowprops=dict(arrowstyle="-", color=INK2))
ax.set_xticks([]); ax.set_yticks([])
f.text(0.06, 0.1, "Caption: „Leichter Rückgang in den ersten Wochen.“  →  Takeaway der Leser: „Starker Anstieg in Woche 26“", fontsize=12, color=ORANGE)
save(f, "31-kim-captions", "Illustration nach Kim, Setlur & Agrawala (2021), CHI – Befund aus Fig. 6. Keine Ergebnisdaten.")

f = fig("Viel Text wird nicht bestraft", "Illustration der vier getesteten Varianten – Rangfolge der Leser (302 Personen)")
labels4 = ["kein Text", "Titel + 1 Annotation", "stark annotiert", "nur Text"]
ranks = ["zuletzt", "Mitte", "Platz 1", "14 % bevorzugen das"]
for j in range(4):
    ax = f.add_axes([0.04 + j * 0.24, 0.22, 0.2, 0.5])
    if j < 3:
        ax.plot(x, yv, color=BLUE, lw=1.6)
        if j >= 1: ax.set_title("Titel", fontsize=9, loc="left")
        if j == 2:
            for px in (5, 18, 27): ax.annotate("Notiz", (px, yv[px]), (px, yv[px] + 3), fontsize=7, color=INK2, arrowprops=dict(arrowstyle="-", color=GRAY))
        if j == 1: ax.annotate("Notiz", (27, yv[27]), (20, yv[27] + 2), fontsize=7, color=INK2, arrowprops=dict(arrowstyle="-", color=GRAY))
    else:
        ax.text(0.02, 0.5, "Die Zustimmung lag\nlange bei rund 42 %,\nstieg dann rasch\nauf rund 80 % …", fontsize=9, va="center", transform=ax.transAxes)
    ax.set_xticks([]); ax.set_yticks([])
    f.text(0.04 + j * 0.24 + 0.1, 0.15, labels4[j], ha="center", fontsize=11)
    f.text(0.04 + j * 0.24 + 0.1, 0.09, ranks[j], ha="center", fontsize=11, color=BLUE if j == 2 else INK2, fontweight="bold" if j == 2 else None)
save(f, "32-stokes-text", "Illustration nach Stokes et al. (2023), TVCG – Fig. 1 & 6. Rangfolge aus den Ergebnissen, Grafik neu gezeichnet.")

f = fig("Die Anordnung bestimmt, was verglichen wird", "Illustration der vier getesteten Balken-Arrangements (synthetische Daten)")
a, b = [3, 5, 4], [4, 2, 6]
titles = ["vertikal gestapelt\n→ Vergleich innerhalb einer Gruppe", "nebeneinander\n→ Vergleich innerhalb einer Gruppe", "überlagert (gruppiert)\n→ globales Maximum, Paar-Vergleiche", "gestapelt\n→ kein klarer Favorit"]
for j in range(4):
    ax = f.add_axes([0.04 + j * 0.24, 0.24, 0.2, 0.46])
    if j == 0:
        ax.axis("off")
        for k_, (dd, cc) in enumerate([(a, BLUE), (b, ORANGE)]):
            sub = f.add_axes([0.04, 0.47 - k_ * 0.23, 0.2, 0.2]); sub.bar(np.arange(3), dd, color=cc, width=0.6); sub.set_ylim(0, 6.5); sub.set_xticks([]); sub.set_yticks([])
    elif j == 1:
        ax.bar(np.arange(3), a, color=BLUE, width=0.6); ax.bar(np.arange(3) + 3.6, b, color=ORANGE, width=0.6)
    elif j == 2:
        ax.bar(np.arange(3) - 0.18, a, 0.34, color=BLUE); ax.bar(np.arange(3) + 0.18, b, 0.34, color=ORANGE)
    else:
        ax.bar(np.arange(3), a, color=BLUE, width=0.6); ax.bar(np.arange(3), b, bottom=a, color=ORANGE, width=0.6)
    ax.set_xticks([]); ax.set_yticks([])
    f.text(0.04 + j * 0.24 + 0.1, 0.1, titles[j], ha="center", fontsize=10)
save(f, "40-xiong-arrangements", "Illustration nach Xiong et al. (2022), TVCG – Fig. 1 & Table 9. Experten lagen bei mehreren Vergleichstypen daneben.")

# ---------------------------------------------------------------- misleading
f = fig("Wie stark täuschen klassische Tricks?", "„Wie groß ist der Unterschied?“ (1–5); Kontrolle vs. manipulierter Chart")
ax = f.add_axes([0.3, 0.14, 0.64, 0.62])
items = [("Linie: gestauchtes Seitenverhältnis", 1.39, 3.19), ("Balken: abgeschnittene y-Achse", 1.45, 2.77), ("Blasen: Fläche als Menge", 1.71, 2.71)]
for i, (lab, c, d) in enumerate(items[::-1]):
    ax.plot([c, d], [i, i], color=GRID, lw=3, zorder=1)
    ax.scatter([c], [i], color=GRAY, s=90, zorder=2); ax.scatter([d], [i], color=ORANGE, s=90, zorder=2)
    ax.text(c - 0.08, i, f"{c:.2f}", ha="right", va="center", fontsize=10); ax.text(d + 0.08, i, f"{d:.2f}", va="center", fontsize=10)
ax.set_yticks(range(3), [it[0] for it in items[::-1]]); ax.set_xlim(0.8, 4); ax.set_xlabel("wahrgenommene Größe (1–5)")
ax.tick_params(axis="y", length=0); ax.spines["left"].set_visible(False)
f.text(0.3, 0.82, "grau = Kontrolle   orange = manipuliert   ·   Invertierte Achse: 97,5 % falsch vs. 18,4 % in der Kontrolle", fontsize=10, color=INK2)
save(f, "105-pandey-deceptive", "Nach Pandey et al. (2015), CHI – Table 2 & 3 (Antworten 58,5–129,5 % höher als Kontrolle).")

rng = np.random.default_rng(1)
vals = np.array([62, 64, 63, 66])
f = fig("Abgeschnittene y-Achse: Der Effekt bleibt – auch mit Warnhinweis", "Illustration: dieselben Werte (62–66), y-Achse beginnt bei 0, 40 bzw. 60")
for j, start in enumerate([0, 40, 60]):
    ax = f.add_axes([0.06 + j * 0.31, 0.16, 0.25, 0.58])
    ax.bar(range(4), vals, color=BLUE, width=0.6); ax.set_ylim(start, 68)
    ax.set_xticks([]); ax.set_title(f"Achse ab {start}", fontsize=11, color=INK2)
save(f, "13-correll-truncation", "Illustration nach Correll, Bertini & Franconeri (2020), CHI – Fig. 7/8: Weder Achsenbruch noch Verlauf senkt die empfundene Schwere.")

card("61-lisnic-misleading", "Wie Menschen wirklich mit Charts lügen", "Logik > Optik",
     ["Analyse echter COVID-19-Tweets mit Visualisierungen",
      "Verstöße gegen Designregeln sind NICHT der Hauptweg der Irreführung",
      "Häufiger: korrekt gezeichnete Charts + fehlerhafte Schlussfolgerungen (z. B. Cherry-Picking, falsche Kausalität)"],
     "Nach Lisnic, Polychronis, Lex & Kogan (2023), CHI – Abstract. (Volltext-PDF in dieser Recherche nicht geladen.)")

card("62-lo-misinformed", "Taxonomie irreführender Visualisierungen", "74 Probleme",
     [">1.000 real gemeldete Beispiele offen codiert → 12 Kategorien entlang der Analysekette",
      "Von Dateneingabe über Chartdesign und Plotten bis zu Wahrnehmung & Interpretation",
      "Neue Forschungsfelder: logische Fehlschlüsse, Ausnutzen von Konventionen, exotische Charttypen"],
     "Nach Lo et al. (2022), EuroVis/CGF – Fig. 1.")

card("71-gaba-fairness", "Visuelles Design verändert, wie fair ein ML-Modell wirkt", "> 1.500 Personen",
     ["Fairness wird stärker gewichtet, wenn sie als Text statt als Balkendiagramm erklärt wird",
      "Die explizite Aussage „Modell ist verzerrt“ wirkt stärker als gezeigte verzerrte Ergebnisse",
      "Frauen wählen häufiger das fairere Modell; für Kunden wird fairer entschieden als für sich selbst"],
     "Nach Gaba et al. (2024), TVCG – Abstract & Diskussion Exp. 1–3.")

# ---------------------------------------------------------------- decisions
f = fig("Welcher Chart verführt zur Kausalitäts-Illusion?", "Anteil der Durchgänge, in denen Teilnehmende … (Exp. 1, offene Antworten)")
ax = f.add_axes([0.1, 0.14, 0.86, 0.64])
cats = ["Text", "Balken", "Scatter", "Linie"]; caus = [39.0, 33.8, 20.6, 18.4]; corr = [50.0, 52.9, 69.1, 75.7]
xx = np.arange(4)
ax.bar(xx - 0.2, caus, 0.38, color=ORANGE, label="… Kausalität schlossen")
ax.bar(xx + 0.2, corr, 0.38, color=BLUE, label="… (korrekt) Korrelation beschrieben")
for i in range(4):
    ax.text(i - 0.2, caus[i] + 1.5, f"{caus[i]:.0f} %", ha="center", fontsize=10); ax.text(i + 0.2, corr[i] + 1.5, f"{corr[i]:.0f} %", ha="center", fontsize=10)
ax.set_xticks(xx, cats); ax.set_ylim(0, 90); ax.yaxis.set_visible(False); ax.spines["left"].set_visible(False)
ax.legend(frameon=False, loc="upper left")
save(f, "63-xiong-causality", "Nach Xiong, Shapiro, Hullman & Franconeri (2020), TVCG – Exp. 1, Fig. 9. Aggregation in 2 Gruppen (Balken) fördert Kausal-Deutung.")

f = fig("Bayes-Aufgaben: Formulierung schlägt Visualisierung", "Anteil korrekter Antworten (Laien ohne Statistik-Vorbildung)")
ax = f.add_axes([0.36, 0.1, 0.58, 0.72])
hbars(ax, ["Exp. 1: Original-Textaufgabe", "Exp. 1: umformulierter Text", "Exp. 2: Storyboard", "Exp. 2: Kontroll-Text", "Exp. 2: beste Varianten\n(strukturierter Text / nur Grafik)", "Exp. 2: hohe räumliche Fähigkeit"],
      [5.4, 42.4, 49, 51, 77, 100], hi=[1, 4], fmt="{:.0f}", xmax=100, unit=" %")
save(f, "69-ottley-bayes", "Nach Ottley et al. (2016), TVCG – Fig. 1 & 2. Text + Grafik zusammen war NICHT besser als Text allein.")

f = fig("Balken vs. Torte in einer echten Entscheidung", "Korrelation der Faktoren mit „Würde bei dieser Person promovieren“ (Mentorenwahl)")
ax = f.add_axes([0.1, 0.14, 0.86, 0.64])
xx = np.arange(2)
ax.set_position([0.1, 0.14, 0.86, 0.6]); ax.bar(xx - 0.2, [0.615, 0.158], 0.38, color=BLUE, label="Balkendiagramm")
ax.bar(xx + 0.2, [0.467, 0.111], 0.38, color=GRAY, label="Tortendiagramm")
for i, (p, q) in enumerate(zip([0.615, 0.158], [0.467, 0.111])):
    ax.text(i - 0.2, p + 0.02, f"{p:.2f}", ha="center"); ax.text(i + 0.2, q + 0.02, f"{q:.2f}", ha="center")
ax.set_xticks(xx, ["Produktivität", "Interdisziplinarität"]); ax.set_ylim(0, 0.8); ax.yaxis.set_visible(False); ax.spines["left"].set_visible(False)
ax.legend(frameon=False); f.text(0.1, 0.8, "Unterschied Balken vs. Torte nicht signifikant (p > .05)", fontsize=11, color=INK2)
save(f, "74-li-decision", "Nach Li, Berger, Kahng & Bearfield (2025), IEEE VIS – Table 2.")

card("73-kim-bayesian", "Menschen lesen Daten durch ihre Vorannahmen", "≈ Bayes",
     ["Bei kleinen Stichproben passen Urteile gut zu approximativer Bayes-Inferenz",
      "Bei großen Datensätzen (z. B. N = 750.000) bleiben Menschen zu unsicher – sie glauben den Daten zu wenig",
      "Vorannahmen abzufragen reduziert die Abweichung, aber nicht zuverlässig"],
     "Nach Kim, Walls, Krafft & Hullman (2019), CHI – Studien 1–3, Fig. 8.")

boxes("47-hullman-uncertainty", "Wie Unsicherheits-Visualisierungen evaluiert werden",
      [["86 Studien · 372 Evaluationspfade · 6 Entscheidungsebenen"],
       ["Verhaltensziel", "erwarteter Effekt", "Evaluationsziel", "Messgröße", "Erhebung", "Analyse"],
       ["Befund: Fokus auf Genauigkeit & Zufriedenheit statt Entscheidungsqualität;\neinfache Alternativen (Text, keine Unsicherheit) selten getestet"]],
      "Nach Hullman et al. (2019), TVCG – Fig. 1 & Diskussion.")

boxes("54-dimara-biases", "154 kognitive Verzerrungen, sortiert nach Aufgabe",
      [["Taxonomie mit 7 Aufgaben-Kategorien"],
       ["Schätzen", "Entscheiden", "Hypothesen\nbewerten", "Kausal\nzuordnen"], ["Erinnern", "Meinung\näußern", "Sonstiges"]],
      "Nach Dimara et al. (2020), TVCG – Kategorien laut Paper. (Volltext hinter Bot-Schutz; Basis: Abstract.)")

# ---------------------------------------------------------------- literacy
f = fig("Graph Literacy in Deutschland und den USA", "Anteil korrekter Antworten je Aufgabe (repräsentativ, n ≈ 990)")
ax = f.add_axes([0.42, 0.1, 0.52, 0.7])
q = ["Wert in Balken ablesen", "Viertel einer Torte in %", "Wert in Linie ablesen", "Icons zählen", "Differenz 2 Balken", "Summe Tortenstücke",
     "Steigungen vergleichen", "Differenz 2 Icon-Gruppen", "Balken zwischen 2 Labels", "Trend fortschreiben", "2 Balkencharts: Skala beachten",
     "2 Linien: Achsenbeschriftung beachten", "Steigung vs. Höhe"]
de = [82.7, 87.7, 81.7, 88.6, 67.1, 74.2, 82.1, 51.0, 80.1, 81.8, 62.8, 15.5, 86.1]
us = [84.6, 83.5, 84.8, 90.3, 69.6, 77.6, 61.6, 58.1, 75.2, 79.2, 66.1, 19.3, 77.5]
yy = np.arange(len(q))[::-1]
for yi, d_, u_ in zip(yy, de, us):
    ax.plot([d_, u_], [yi, yi], color=GRID, lw=2)
ax.scatter(de, yy, color=BLUE, s=45, label="Deutschland", zorder=3); ax.scatter(us, yy, color=ORANGE, s=45, label="USA", zorder=3)
ax.set_yticks(yy, q, fontsize=10); ax.set_xlim(0, 100); ax.legend(frameon=False, loc="lower left", bbox_to_anchor=(0.0, 1.0), ncol=2); ax.tick_params(axis="y", length=0)
ax.axhspan(yy[11] - 0.4, yy[11] + 0.4, color="#fbe3d8", zorder=0)
save(f, "113-galesic-graph-literacy", "Nach Galesic & Garcia-Retamero (2011), Medical Decision Making – Table 2. Nur 16–19 % beachten unterschiedliche Achsenbeschriftungen.")

f = fig("VLAT: Was Laien leicht fällt – und was nicht", "Anteil korrekter Antworten ausgewählter Testfragen (n = 191)")
ax = f.add_axes([0.42, 0.08, 0.52, 0.74])
it = [("Torte: Anteile vergleichen", 1.00), ("Linie: Extremwert finden", 0.97), ("Linie: Wert ablesen", 0.95), ("Linie: Spannweite", 0.56),
      ("Scatter: Korrelation erkennen", 0.52), ("Balken: Anzahl vergleichen", 0.40), ("Gestapelte Balken: absoluter Wert", 0.38),
      ("Gestapelte Balken: Verhältnis", 0.36), ("Gestapelte Fläche: Verhältnis", 0.25), ("Histogramm: Schiefe", 0.16), ("Gestapelte Fläche: absoluter Wert", 0.15)]
hbars(ax, [a for a, _ in it], [v * 100 for _, v in it], hi=[6, 7, 8, 10], xmax=100, unit=" %")
save(f, "76-vlat", "Nach Lee, Kim & Kwon (2017), TVCG – Table 2 (Item-Schwierigkeit P). Gestapelte Charts sind die größten Stolpersteine.")

card("77-mini-vlat", "Visualization Literacy in 12 Fragen messen", "12 Items",
     ["Kurzform des 53-Item-VLAT; Reliabilität ω = 0,72; korreliert stark mit dem VLAT",
      "Sagt vorher, wie schnell jemand einen unbekannten Charttyp (Parallele Koordinaten) lernt",
      "Praxis: in wenigen Minuten das Publikum eines Workshops einschätzen"],
     "Nach Pandey & Ottley (2023), EuroVis/CGF – Ergebnisse.")

card("79-boerner-literacy", "Visualization Literacy von Museumsbesuchern", "273 Personen",
     ["20 Visualisierungen (Charts, Karten, Graphen, Netzwerke) in drei US-Science-Museen",
      "Viele konnten Visualisierungen weder benennen noch erklären – selbst bei Interesse an Wissenschaft",
      "Netzwerk-Layouts konnte fast niemand lesen; Deutung oft über Oberflächenmerkmale wie Farbe"],
     "Nach Börner et al. (2016), Information Visualization – Abstract.")

# ---------------------------------------------------------------- storytelling
boxes("102-segel-heer-genres", "Sieben Genres des Daten-Storytellings",
      [["Spektrum: autorgeführt (lineare Botschaft)  ⟷  lesergeführt (freie Exploration)"],
       ["Magazin-Stil", "Annotierter Chart", "Geteiltes Poster", "Flussdiagramm"], ["Comic", "Slideshow", "Film / Animation"],
       ["Mischformen: Martiniglas · interaktive Slideshow · Drill-down-Story"]],
      "Nach Segel & Heer (2010), TVCG – Analyse von 58 Beispielen.")

card("81-mckenna-flow", "Visual Narrative Flow: Scrollen vs. Klicken", "n = 240",
     ["80 Web-Stories analysiert → 7 „Flow-Faktoren“ (Navigation, Kontrolle, Fortschritt, Layout …)",
      "Visualisierungen und animierte Übergänge steigern das empfundene Engagement",
      "Stepper vs. Scroller: kein klarer Sieger – nur 2 von 10 wollten eine Fortschrittsanzeige"],
     "Nach McKenna et al. (2017), EuroVis/CGF – Fig. 4 & 5.")

card("107-boy-storytelling", "Macht eine Einleitungs-Story neugierig auf Exploration?", "Nein",
     ["Web-Feldexperimente mit echten Besuchern einer Visualisierungsseite",
      "Eine vorgeschaltete „Story“ erhöhte das Explorationsverhalten nicht",
      "Storytelling ≠ automatisch mehr Engagement für eigene Analyse"],
     "Nach Boy, Détienne & Fekete (2015), CHI – TLDR/Abstract. (Volltext hinter Bot-Schutz.)")

card("86-boy-anthropographics", "Menschen statt Balken: mehr Empathie?", "≈ kein Effekt",
     ["Vergleich: einzelne Menschenfigur, Gruppen von Figuren vs. Standard-Chart (Menschenrechtsdaten)",
      "Empathie und Spendenbereitschaft waren sehr ähnlich",
      "Folgestudien (Morais 2021): höchstens kleiner Effekt, nur mit sehr großen Stichproben messbar"],
     "Nach Boy et al. (2017), CHI – Abstract/TLDR.")

card("88-wang-comics", "Data Comics vs. Infografik", "Comics gewinnen",
     ["Laborstudie + Studie in freier Wildbahn",
      "Comics: mehr Freude, Fokus und Engagement",
      "Und: besseres Verständnis und bessere Erinnerung als Infografik oder illustrierter Text"],
     "Nach Wang et al. (2019), CHI – Abstract. (ACM-PDF nicht frei ladbar.)")

card("104-pandey-persuasive", "Überzeugen Charts mehr als Tabellen?", "Es kommt drauf an",
     ["Crowdsourcing-Experiment mit 720 Teilnehmenden zu kontroversen Themen",
      "Bei neutraler/schwacher Ausgangsmeinung: Charts überzeugen mehr als Tabellen",
      "Bei stark gegenteiliger Meinung: Tabellen überzeugen eher"],
     "Nach Pandey et al. (2014), TVCG – Abstract + Vortragsfolien zum Paper (Sekundärquelle).")

f = fig("Gapminder-Animation: schnell im Vortrag, schwach in der Analyse", "Mittlere Bearbeitungszeit in Sekunden")
ax = f.add_axes([0.1, 0.14, 0.86, 0.64])
xx = np.arange(2)
for k, (lab, v, col) in enumerate([("Animation", [15.8, 83.1], ORANGE), ("Small Multiples", [25.3, 45.69], BLUE), ("Traces", [27.8, 55.01], GRAY)]):
    ax.bar(xx + (k - 1) * 0.26, v, 0.24, color=col, label=lab)
    for i in range(2): ax.text(i + (k - 1) * 0.26, v[i] + 1.5, f"{v[i]:.0f}", ha="center", fontsize=10)
ax.set_xticks(xx, ["Präsentation", "Analyse"]); ax.set_ylim(0, 95); ax.yaxis.set_visible(False); ax.spines["left"].set_visible(False)
ax.legend(frameon=False, loc="upper left")
f.text(0.1, 0.82, "Genauigkeit: Small Multiples signifikant besser als Animation (p < .001); Gesamt-Trefferquote nur 65 %", fontsize=10, color=INK2)
save(f, "112-robertson-animation", "Nach Robertson et al. (2008), TVCG – Abschnitt 5.6, Fig. 4.")

# ---------------------------------------------------------------- business & overview
boxes("93-bartram-tables", "Untidy Data: Warum Tabellen unersetzlich sind",
      [["Data Worker nutzen Tabellen im gesamten Analyseprozess – nicht nur zur Datenaufbereitung"],
       ["Master-Tabelle bleibt\nunangetastet", "Randnotizen &\nabgeleitete Spalten", "Markierungen\n(Farbe, Zeichen)", "Mehrzellige Labels\n& Strukturen"],
       ["Wer keinen direkten Zugriff auf die Basisdaten bietet, verliert die Nutzer an Excel"]],
      "Nach Bartram, Correll & Tory (2022), TVCG – Fig. 1 & Diskussion (Interviewstudie).")

boxes("80-franconeri-what-works", "The Science of Visual Data Communication – die Kurzfassung",
      [["Schnell: globale Statistiken\n(Mittel, Trend, Ausreißer)", "Langsam: einzelne Werte vergleichen\n(seriell, einer nach dem anderen)"],
       ["Position vor Länge,\nFläche, Farbe", "Vergleiche durch\nNähe & Gruppierung lenken", "Arbeitsgedächtnis\nentlasten", "Konventionen\nrespektieren"],
       ["Unsicherheit als Verteilung zeigen (Dichte, Dotplot, HOPs) statt nur Fehlerbalken"]],
      "Nach Franconeri, Padilla, Shah, Zacks & Hullman (2021), Psychological Science in the Public Interest – Fig. 2, 7–9, 22.")

print("figures:", len(os.listdir(OUT)))
