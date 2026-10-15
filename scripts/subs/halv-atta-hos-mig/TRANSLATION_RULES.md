# Halv åtta hos mig — Swedish → Israeli Hebrew subtitle rules

You are translating Swedish TV subtitles to natural spoken Israeli Hebrew.

## Files (per episode tag, e.g. `s27-ep1`)
- Input cues: `scripts/subs/halv-atta-hos-mig/{tag}.cues.json`
  - JSON array: `{ "i", "start", "end", "text" }` (Swedish)
- Output translations: `scripts/subs/halv-atta-hos-mig/{tag}.he.translations.json`
  - Same length/order; same `i`/`start`/`end`; `text` = Hebrew
- Then run: `python3 scripts/subs/halv-atta-hos-mig/assemble_he_vtt.py {tag}`
  - Writes `subs/halv-atta-hos-mig/{tag}.he.vtt` and `scripts/subs/.../{tag}.he.vtt`
  - Assembler also applies `name_place_glossary.json` and RTL punctuation fixes

## Strict rules
1. Keep show title exactly: `Halv åtta hos mig` (never שמונה וחצי / 7:30 אצלי / שבע וחצי אצלי)
2. **Person names in Hebrew letters** (transliteration), not Latin:
   Simone→סימון, Hampus→המפוס, Maria→מריה, Lars→לארס.
   Prefer entries in `name_place_glossary.json`; invent consistent Hebrew spellings for new names and keep them consistent across the episode.
3. **Place names in Hebrew letters**:
   Stockholm→סטוקהולם, Göteborg→גטבורג, Kungshamn→קונגסהמן, Umeå→אומאו, Smögen→סמוגן.
   Same glossary; invent consistent spellings for new places.
4. Natural spoken Israeli Hebrew for TV — not literal word-by-word
5. Preserve line breaks inside a cue when Swedish has 2 lines (use `\n`)
6. Keep dialogue dashes as `-`
7. Credits like `Text: Name / Iyuno` → `כתוביות: Name / Iyuno` (translator credit names may stay Latin)
8. `kronor` / `kr` → `קרונות`
9. `go'ingar` / `goingar` → `חבר'ה`
10. Do ALL cues — verify `len(output)==len(input)` and every `i` present
11. **Never start a Hebrew line with `?`, `!`, or `...`** — put punctuation at the **end** of the line
12. Questions: Hebrew first, then name if needed: `מה כל כך מיוחד בסרטן מלך,\nסימון?` — never `?סימון` or leading `?`
13. Do NOT use MyMemory / Google free APIs — produce Hebrew yourself as an LLM translator
14. Food terms: kungskrabba = סרטן מלך; marulk = מרולק / דג מרולק; keep familiar Swedish food words when natural
15. No `ל-מריה` style hyphen before Hebrew names — write `למריה`, `בסטוקהולם`, etc.

## Process
1. Read cues JSON
2. Translate all cues (batch in memory if needed) with Hebrew names/places
3. Write `he.translations.json`
4. Run assemble script
5. Confirm cue count + print first 3 Hebrew texts
