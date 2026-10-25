# Boyfriends — Swedish → Israeli Hebrew subtitle rules

You are translating Swedish TV subtitles to natural spoken Israeli Hebrew.

Same engine/style as Halv åtta hos mig: produce Hebrew yourself as an LLM translator.
Do NOT use MyMemory / Google free APIs.

## Files (per episode tag, e.g. `s1-ep1`)
- Input cues: `scripts/subs/boyfriends/{tag}.cues.json`
  - JSON array: `{ "i", "start", "end", "text" }` (Swedish)
- Output translations: `scripts/subs/boyfriends/{tag}.he.translations.json`
  - Same length/order; same `i`/`start`/`end`; `text` = Hebrew
- Then run: `python3 scripts/subs/boyfriends/assemble_he_vtt.py {tag}`
  - Writes `subs/boyfriends/{tag}.he.vtt` and `scripts/subs/boyfriends/{tag}.he.vtt`
  - Assembler also applies `name_place_glossary.json` and RTL punctuation fixes

## Strict rules
1. Keep show title exactly: `Boyfriends` (never translate the series name)
2. **Person names in Hebrew letters** (transliteration), not Latin:
   Edvin→אדווין, Oscar→אוסקר, Sebastian→סבסטיאן, Törnblom→תורנבלום, Zia→זיה, Hammarberg→המרברג.
   Prefer entries in `name_place_glossary.json`; invent consistent Hebrew spellings for new names and keep them consistent across the episode.
3. **Place names in Hebrew letters**:
   Stockholm→סטוקהולם, Åre→אורה, Norrköping→נורשפינג.
   Same glossary; invent consistent spellings for new places.
4. Keep brand/event names that are commonly Latin when natural: `QX`, `ELLE`, `Boyfriends`
5. Natural spoken Israeli Hebrew for TV — not literal word-by-word
6. Preserve line breaks inside a cue when Swedish has 2 lines (use `\n`)
7. Keep dialogue dashes as `-`
8. Credits like `Text: Name` → `כתוביות: Name` (translator credit names may stay Latin)
9. Do ALL cues — verify `len(output)==len(input)` and every `i` present
10. **Never start a Hebrew line with `?`, `!`, or `...`** — put punctuation at the **end** of the line
11. Questions: Hebrew first, then name if needed: `מה קורה איתך,\nאדווין?` — never `?אדווין` or leading `?`
12. No `ל-אדווין` style hyphen before Hebrew names — write `לאדווין`, `בסטוקהולם`, etc.
13. Gay slang / register: keep natural Israeli spoken tone; `böggäng` → `חבורת הומואים` / `החבר'ה` as context fits; do not sanitize meaning

## Process
1. Read cues JSON
2. Translate all cues (batch in memory if needed) with Hebrew names/places
3. Write `he.translations.json`
4. Run assemble script
5. Confirm cue count + print first 3 Hebrew texts
