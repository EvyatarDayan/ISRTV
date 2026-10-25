# La Camilla — Swedish → Israeli Hebrew subtitle rules

You are translating Swedish documentary TV subtitles to natural spoken Israeli Hebrew.

Same engine/style as Historien om Sverige / Boyfriends: produce Hebrew yourself as an LLM translator.
Do NOT use MyMemory / Google free APIs.

## Files (tag = `s1-ep1`)
- Input cues: `scripts/subs/la-camilla-fran-gata-till-glamour-tur-och-retur/s1-ep1.cues.json`
- Output: `scripts/subs/la-camilla-fran-gata-till-glamour-tur-och-retur/s1-ep1.he.translations.json`
- Then: `python3 scripts/subs/la-camilla-fran-gata-till-glamour-tur-och-retur/assemble_he_vtt.py s1-ep1`

## Strict rules
1. Keep show/artist branding: `La Camilla`, `Army of Lovers` (Latin)
2. **Names in Hebrew** (prefer glossary): Camilla Henemark→קמילה הנמארק, Camilla→קמילה, Henemark→הנמארק,
   Johan Renck→יוהאן רנק, Amelia Adamo→אמליה אדמו, Göran Persson→יוראן פרסון, Marie Nyreröd→מארי ניררוד
3. Places: Stockholm→סטוקהולם, Sverige→שוודיה
4. Natural spoken Israeli Hebrew for music/culture documentary
5. **Keep song lyrics in their original language** (English Army of Lovers lines stay English — do not translate sung lyrics)
6. Preserve line breaks (`\n`), dialogue dashes `-`
7. Credits `Textning: Name` / `Text: Name` → `כתוביות: Name`
8. Do ALL cues — `len(output)==len(input)`, same `i`/`start`/`end`
9. **Never start a Hebrew line with `?`, `!`, or `...`**
10. No `ל-קמילה` — write `לקמילה`, `בסטוקהולם`

## Process
1. Read cues → translate all → write he.translations.json → run assemble → print first 3 Hebrew texts
