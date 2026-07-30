# Spanish localisation pilot

Status: branch-only experiment. Do not merge to `main` until the review gates below are complete.

## Purpose

Use Spanish as the first end-to-end localisation exercise for the Manifesto and the Official Test result. The pilot is intended to reveal technical, editorial, accessibility and operating-model problems before the site adds more languages.

The Spanish version lives at:

- `/es/`
- `/es/test`

The English pages and canonical evidence remain unchanged during the pilot.

## Architecture used in the pilot

### Static manifesto copy

`es/index.html` is a translated static page that reuses the existing shared visual system. This gives reviewers a complete page without introducing a build system during the first experiment.

This is intentionally not the final scaling model. A third or fourth language would create unacceptable HTML duplication, so the pilot must inform a later decision between:

1. generated static pages from locale dictionaries and templates; or
2. a small site framework with build-time internationalisation.

Runtime-only translation is not preferred for the final site because it can flash the wrong language, weakens no-JavaScript behaviour and makes translated search metadata less dependable.

### Canonical facts, translated narrative

The Test continues to load the canonical files:

- `data/test/current-result.json`
- `data/test/evidence-ledger.json`

Spanish narrative is stored separately in `data/test/es/content.json` and joined to the canonical facts by stable IDs.

This prevents scores, dates, source URLs and measurements from drifting between languages. The locale overlay contains labels, questions, summaries, callouts, evidence claims, caveats and provider explanations, but not duplicate numeric truth.

### Locale-aware runtime behaviour

Spanish-specific scripts localise:

- share-sheet title and text
- clipboard and prompt messages
- error and live-region messages
- dates through `Intl.DateTimeFormat`
- decimal punctuation through `Intl.NumberFormat`
- confidence and evidence-state labels
- dynamically rendered Test content

### Routes and assets

All Spanish page links and assets use root-relative paths. This is required because Vercel has `cleanUrls` enabled: a relative link such as `test.html` can resolve differently when the visible URL is `/es` rather than `/es/`.

## Translation decisions requiring review

### Project name

The pilot uses **El Manifiesto de los Seis Años** and **La Prueba de los Seis Años**.

Spanish has no equally compact noun phrase for “six-year-old”. More literal alternatives are accurate but clumsy, while the selected wording is elegant but can also sound as though the manifesto itself is six years old. A native editorial reviewer should decide whether the brand remains in English, uses this transcreation, or adopts a longer precise form.

### Common Foundry

The pilot translates “Common Foundry” as **Forja Común**. “Fundición Común” is more literal but narrower and more industrial; “Forja Común” better preserves the civic workshop metaphor. This is a meaning decision, not a mechanical translation.

### Inclusive references to children

The copy generally uses “una niña o un niño” where the person matters and shorter neutral constructions where repetition would make the prose bureaucratic. This should be reviewed for the preferred Spanish register and audience.

### Source titles

Official publication titles remain in their source language on the Test ledger and are marked `lang="en"`. Claims and caveats are translated. This preserves traceability and avoids presenting an unofficial translation as the publication’s actual title.

## Gotchas found

1. User-facing copy exists inside HTML, JavaScript and evidence JSON. Translating only the page leaves share sheets, errors, live regions and dynamic cards in English.
2. Locale-neutral evidence and explanatory prose are currently mixed in the same JSON. The overlay pattern separates them without changing the published Run 1 record.
3. Clean URLs make ordinary relative links unsafe inside locale folders. Root-relative paths are the dependable rule.
4. Spanish expands headings and button labels. Overflow wrapping and hyphenation need explicit support, followed by real-device review.
5. Spanish dates, decimal commas and percentage spacing need locale-aware formatting rather than string replacement.
6. The project name and “Common Foundry” require editorial transcreation.
7. Social metadata, skip links, navigation labels, `aria-label` values and live-region messages are part of the translation surface.
8. A translated page can become stale even when the canonical evidence updates correctly. Automated coverage checks are necessary, but they cannot detect semantically outdated prose on their own.
9. Raw methodology and JSON downloads remain English. The interface should state this honestly until those documents are localised.
10. Relative `hreflang` links are suitable for a branch preview, but production should emit absolute canonical and alternate URLs once the production hostname and route policy are confirmed.

## Automated checks

Run:

```bash
node scripts/check-localisation.mjs
```

The check verifies:

- required Spanish files exist
- `lang` and `dir` are declared
- locale pages use root-relative paths
- language switchers are present
- every canonical dimension, callout, checkpoint, evidence entry and provider has a Spanish overlay
- removed canonical IDs do not leave stale Spanish content
- translated known-unknown counts remain aligned
- essential runtime messages are present in Spanish

The script deliberately does not claim translation quality. It catches wiring and coverage failures, not awkward prose.

## Review sequence

1. Desktop visual pass on `/es/` and `/es/test`.
2. Physical iPhone pass, including the navigation, language control, disclosures, long headings and share buttons.
3. Keyboard and screen-reader smoke test.
4. Native Spanish editorial review for meaning, register, terminology and rhythm.
5. Compare every translated evidence claim with its canonical source field.
6. Decide final treatment of the project name and Forja Común.
7. Decide whether the next implementation introduces generated static pages before adding the third language.
8. Add Spanish discovery to the English pages only after the Spanish experience is approved.
9. Replace relative alternate links with absolute production URLs.
10. Keep the pull request as a preview until all gates are explicitly accepted.

## Next language experiments

### Right-to-left

Use Modern Standard Arabic as the next stress test. It exercises:

- `dir="rtl"` and bidirectional content
- logical CSS properties
- mirrored navigation and directional icons
- numerals, percentages and dates
- source titles and URLs embedded within RTL text
- line-height and font fallback
- mixed Arabic and English technical terms

Before starting, remove remaining physical-direction CSS assumptions such as `left`, `right`, `margin-left` and direction-specific transforms from shared components.

### Japanese

Japanese should follow the RTL pass. It exercises:

- line breaking without spaces
- punctuation and quotation marks
- font fallback and glyph coverage
- shorter labels paired with denser paragraph rhythm
- technical terminology and transliteration
- metadata length and social previews
- avoiding English assumptions in word wrapping and emphasis

Together, Spanish, Arabic and Japanese should expose most of the structural traps before broader language rollout.

## Production boundary

This pilot is a translated and functioning preview, not publication-ready localisation. It must not be merged solely because the automated checks pass.
