# Pippi Långstrump — Swedish → Israeli Hebrew subtitle rules

You are translating Swedish TV subtitles to natural spoken Israeli Hebrew (kids TV tone).

Same engine/style as Boyfriends / Halv åtta hos mig: produce Hebrew yourself as an LLM translator.
Do NOT use MyMemory / Google free APIs.

## Files (per episode tag, e.g. `s1-ep1`)
- Input cues: `scripts/subs/pippi-langstrump/{tag}.cues.json`
  - JSON array: `{ "i", "start", "end", "text" }` (Swedish)
- Output translations: `scripts/subs/pippi-langstrump/{tag}.he.translations.json`
  - Same length/order; same `i`/`start`/`end`; `text` = Hebrew
- Then run: `python3 scripts/subs/pippi-langstrump/assemble_he_vtt.py {tag}`
  - Writes `subs/pippi-langstrump/{tag}.he.vtt` and `scripts/subs/pippi-langstrump/{tag}.he.vtt`
  - Assembler also applies `name_place_glossary.json` and RTL punctuation fixes

## Strict rules
1. Keep show title exactly: `Pippi Långstrump` (never translate the series name)
2. Character name **Pippi** → `פיפי` (not בילי בלינס in dialogue — this is the Swedish SVT series)
3. **Person names in Hebrew letters** (prefer glossary):
   Tommy→תומי, Annika→אניקה, Herr Nilsson→מר נילסון, Lilla Gubben→הסוסיק / ליליה גוּבן as context fits,
   Dunder-Karlsson→דונדר-קרלסון, Blom→בלום, Kling→קלינג, Klang→קלנג, Prussiluskan/Prusseluskan→פרוסילוסקן,
   Kapten Långstrump→קפטן לנגסטרומפ, Inger Nilsson etc. in credits may stay Latin or transliterate.
4. **Place names**: Villa Villekulla→וילה וילהקולה
5. Natural spoken Israeli Hebrew for kids TV — warm, clear, not stiff literary
6. Preserve line breaks inside a cue when Swedish has 2 lines (use `\n`)
7. Keep dialogue dashes as `-`
8. Credits like `Text: Name` → `כתוביות: Name`
9. Do ALL cues — verify `len(output)==len(input)` and every `i` present
10. **Never start a Hebrew line with `?`, `!`, or `...`** — put punctuation at the **end** of the line
11. Questions: Hebrew first, then name if needed — never leading `?`
12. No `ל-פיפי` style hyphen before Hebrew names — write `לפיפי`, `בווילה וילהקולה`, etc.
13. Keep nonsense words like `spunk` as a consistent transliteration: `ספאנק`
14. Keep ship name `Hoppetossa` as `הופטוסה` (or Latin if clearer in context)

## Process
1. Read cues JSON
2. Translate all cues with Hebrew names/places
3. Write `he.translations.json`
4. Run assemble script
5. Confirm cue count + print first 3 Hebrew texts
