# Historien om Sverige — Swedish → Israeli Hebrew subtitle rules

You are translating Swedish documentary TV subtitles to natural spoken Israeli Hebrew.

Same engine/style as Boyfriends / Pippi / Halv åtta hos mig: produce Hebrew yourself as an LLM translator.
Do NOT use MyMemory / Google free APIs.

## Files (per episode tag, e.g. `s1-ep1`)
- Input cues: `scripts/subs/historien-om-sverige/{tag}.cues.json`
  - JSON array: `{ "i", "start", "end", "text" }` (Swedish)
- Output translations: `scripts/subs/historien-om-sverige/{tag}.he.translations.json`
  - Same length/order; same `i`/`start`/`end`; `text` = Hebrew
- Then run: `python3 scripts/subs/historien-om-sverige/assemble_he_vtt.py {tag}`
  - Writes `subs/historien-om-sverige/{tag}.he.vtt` and `scripts/subs/historien-om-sverige/{tag}.he.vtt`
  - Assembler also applies `name_place_glossary.json` and RTL punctuation fixes

## Strict rules
1. Keep show title exactly: `Historien om Sverige` (never translate the series name in credits/titles)
2. Narrator **Simon J Berger** → `סימון י. ברגר` (or `סימון י ברגר`)
3. **Person / dynasty / ruler names in Hebrew letters** (prefer glossary):
   Gustav Vasa→גוסטב וסה, Karl XII→קרל ה־12, Kristina→כריסטינה, Birger Jarl→בירגר יארל,
   Olof Skötkonung→אולוף סקיוטקונונג, etc. Invent consistent Hebrew spellings for new names and keep them across the episode.
4. **Place names in Hebrew letters**:
   Sverige→שוודיה, Stockholm→סטוקהולם, Uppsala→אופסלה, Götaland→יטאלנד, Svealand→סוֵאלנד,
   Skåne→סקונה, Gotland→גוטלנד, Birka→בירקה. Same glossary; invent consistent spellings for new places.
5. Historical terms: use natural Israeli documentary Hebrew (ויקינגים, תקופת האבן, מגפת הדבר, וכו')
6. Natural spoken Israeli Hebrew for TV documentary narration — clear, not stiff academic
7. Preserve line breaks inside a cue when Swedish has 2 lines (use `\n`)
8. Keep dialogue dashes as `-`
9. Credits like `Text: Name` → `כתוביות: Name` (translator credit names may stay Latin)
10. Do ALL cues — verify `len(output)==len(input)` and every `i` present
11. **Never start a Hebrew line with `?`, `!`, or `...`** — put punctuation at the **end** of the line
12. Questions: Hebrew first — never leading `?`
13. No `ל-שוודיה` style hyphen before Hebrew names — write `לשוודיה`, `בסטוקהולם`, etc.
14. Years/centuries: keep readable Israeli style (`המאה ה־17`, `1700 לפנה״ס`, `שנת 1523`)

## Process
1. Read cues JSON
2. Translate ALL cues (batch in memory; write partials to disk if needed, then merge) with Hebrew names/places
3. Write `he.translations.json`
4. Run assemble script
5. Confirm cue count + print first 3 Hebrew texts
