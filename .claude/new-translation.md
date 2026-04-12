Add translation keys to both English and Polish message files.

Keys/section to add: $ARGUMENTS

## Rules
1. Read `src/messages/en.json` and `src/messages/pl.json`
2. Add the new keys to BOTH files simultaneously — they must stay in sync
3. Follow existing key structure: nested by section (e.g. `hero.title`, `nav.howItWorks`)
4. English text should be natural, concise, and match the app's tone
5. Polish text should be a proper translation (not a transliteration)
6. If adding to an existing namespace, insert alphabetically or logically next to related keys
7. If creating a new namespace, add it in a logical position in the JSON
8. Validate both files are valid JSON after editing
9. Report what was added to each file
