"""Builds dossier markdown (one file per paper + overview) from dossier_content.py and papers.json."""
import json, os
from dossier_content import P, CHAPTERS
RAW = "https://raw.githubusercontent.com/LennartH86/how-to-communicate-with-data/main/Research/figures/"
meta = {p["id"]: p for p in json.load(open("papers.json", encoding="utf-8"))}
os.makedirs("dossier", exist_ok=True)
ORDER = {"1": [98, 99, 109, 108, 9, 17, 28, 7, 0, 27, 23], "2": [100, 35, 38, 37, 39, 106], "3": [4, 31, 32, 40],
         "4": [105, 13, 61, 62, 71], "5": [63, 69, 73, 74, 47, 54], "6": [113, 76, 77, 79],
         "7": [102, 81, 107, 86, 88, 104, 112], "8": [93, 80]}
assert sorted(sum(ORDER.values(), [])) == sorted(P)

CARD = [17, 35, 39, 61, 62, 71, 73, 77, 79, 81, 107, 86, 88, 104]
SCHEMA = [98, 99, 9, 23, 106, 47, 54, 102, 93, 80, 27]
ILLU = [0, 31, 32, 40, 13]
FIGKIND = {**{i: "eine Kennzahl-Karte" for i in CARD}, **{i: "ein Schema zur Zusammenfassung" for i in SCHEMA},
           **{i: "eine Illustration mit synthetischen Daten" for i in ILLU}}

def title(i):
    m = meta[i]; first = m["authors"].split(",")[0].split()[-1] if m["authors"] else ""
    return f"{m['title']} ({first} {m['year']})"

def body(i):
    c, m = P[i], meta[i]
    links = " · ".join(x for x in [f"[DOI]({m['doi']})" if m.get("doi") else "", f"[PDF]({m['pdf']})" if m.get("pdf") else "",
                                    f"[Google Scholar]({m['scholar']})"] if x)
    L = [f"> **Bewertung:** Tag `unrated` durch `★0` … `★5` ersetzen (5 = besonders spannend).", "",
         f"**{m['authors']}** · {m['venue']} · {m['year']}  ",
         f"Zitationen: {m.get('citations') or '–'} · davon einflussreich: {m.get('influential') if m.get('influential') is not None else '–'} · {links}", "",
         "## Kernaussage", c["core"], "",
         "## Studie", c["study"], "",
         "## Ergebnisse"] + [f"- {r}" for r in c["results"]] + ["",
         f"![{c['fig']}]({RAW}{c['fig']}.png)", "",
         "## Für die Praxis"] + [f"- ✅ {d}" for d in c["do"]] + [f"- ❌ {d}" for d in c["dont"]] + ["",
         "## Grenzen", c["limits"], "",
         "## Im Original ansehen", c["orig"], "",
         f"*Basis der Zusammenfassung: {c['basis']}. Die Grafik oben ist {FIGKIND.get(i, 'nach den Zahlen im Paper neu gezeichnet')} (keine Originalabbildung).*"]
    return "\n".join(L)

idx = ["# Viz Research – Lesedossier", "",
       "45 Paper zur Frage, wie Menschen Datenvisualisierungen wahrnehmen, verstehen und darauf reagieren – in Lesereihenfolge.", "",
       "**Bewerten:** Auf jeder Paper-Seite den Tag `unrated` durch `★0` bis `★5` ersetzen. Daraus entsteht danach die Sektion „Visual best practices – do's and don'ts and why“.", ""]
for ch, name, desc in CHAPTERS:
    idx += [f"## {ch}. {name}", desc, ""] + [f"- {title(i)} – {P[i]['core']}" for i in ORDER[ch]] + [""]
open("dossier/00-uebersicht.md", "w", encoding="utf-8").write("\n".join(idx))
n = 0
for ch in ORDER:
    for i in ORDER[ch]:
        n += 1
        open(f"dossier/{n:02d}-{P[i]['fig']}.md", "w", encoding="utf-8").write(f"# {title(i)}\n\n" + body(i))
json.dump({"order": ORDER, "titles": {i: title(i) for i in P}, "chapters": CHAPTERS}, open("dossier/_index.json", "w", encoding="utf-8"), ensure_ascii=False)
print(n, "papers written")

# ---- Capacities variant: image as embedded object, meta on one line, frontmatter with tags
CH_TAG = {"1": "viz-grundlagen", "2": "viz-aufmerksamkeit", "3": "viz-text", "4": "viz-irrefuehrung",
          "5": "viz-entscheidung", "6": "viz-literacy", "7": "viz-storytelling", "8": "viz-business"}
os.makedirs("dossier/capacities", exist_ok=True)
n = 0
for ch in ORDER:
    for i in ORDER[ch]:
        n += 1
        c, m = P[i], meta[i]
        md = body(i).replace("  \nZitationen:", " · Zitationen:")
        md = md.replace(f"![{c['fig']}]({RAW}{c['fig']}.png)", f"[[viz-fig {c['fig']}]]")
        chname = dict((a, b) for a, b, _ in CHAPTERS)[ch]
        fm = (f"---\ntags: viz-research, unrated, {CH_TAG[ch]}\ncoverImage: \"[[viz-fig {c['fig']}]]\"\n"
              f"description: \"{ch}. {chname} – {c['core'].replace(chr(34), '')}\"\n---\n")
        open(f"dossier/capacities/{n:02d}.md", "w", encoding="utf-8").write(json.dumps({"title": title(i), "fig": c["fig"], "md": fm + md}, ensure_ascii=False))
