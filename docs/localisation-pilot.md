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

The second preview pass applies a small runtime editorial overlay to the Spanish pages so naming and public-language decisions can be reviewed without rewriting the pilot architecture. Accepted wording must be baked into generated static output before production.

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
- the second-pass formal and compact naming model

### Routes and assets

All Spanish page links and assets use root-relative paths. This is required because Vercel has `cleanUrls` enabled: a relative link such as `test.html` can resolve differently when the visible URL is `/es` rather than `/es/`.

## Editorial model accepted for the second preview

### Full semantic title

The formal Spanish title is:

**El manifiesto desde la mirada de una niña o un niño de seis años**

The formal Test title is:

**La prueba desde la perspectiva de una niña o un niño de seis años**

These longer forms preserve the intended camera angle. The child is not presented as the author of the manifesto; the experience of a person aged six is the viewpoint through which progress is judged.

### Compact interface names

Long semantic titles must not be repeated in every control. Approved compact labels are:

- **El Manifiesto**
- **La Prueba**

The full title belongs in the opening frame, metadata, share text and formal references. Navigation, buttons and footers use compact names.

This becomes a reusable localisation rule: each locale may define a formal semantic title and a shorter approved interface name.

### Public run language

Internal data may continue to use `runNumber` and `Official Run 1`. Public Spanish copy uses:

**Primera evaluación oficial**

The result is phrased as:

**El mundo todavía no supera la prueba.**

`Todavía` is intentional. It preserves the dated, revisable nature of the Test and avoids presenting the result as permanent.

### The child’s route

**El camino infantil** is rejected because it can imply a childish or child-designed route.

The compact navigation label is:

**De la pregunta a la acción**

Longer explanatory headings may use:

**El recorrido desde una pregunta hasta la capacidad de actuar**

### Common Foundry

The pilot translates “Common Foundry” as **Forja Común**. “Fundición Común” is more literal but narrower and more industrial; “Forja Común” better preserves the civic workshop metaphor.

At first use, the copy expands the term as:

**La Forja Común, una red pública y compartida para el descubrimiento**

Later references may use **la Forja**.

### Inclusive references to children

Use the full phrase **una niña o un niño de seis años** where the viewpoint is introduced or needs emphasis.

Elsewhere, prefer natural variation:

- omit the subject where Spanish allows it
- use **una persona de seis años** when referring to one person
- use **la infancia** when discussing children collectively
- repeat **una niña o un niño** only where it improves meaning

Inclusive wording must not make every sentence sound contractual.

### Spanish register

The target is neutral international Spanish rather than Spain-only or Latin-America-only copy.

`<html lang="es">` remains the canonical language declaration. Open Graph requires a territory-qualified locale, so the appropriate production value remains an explicit release decision rather than evidence that the prose should adopt one regional register.

### Concept glossary

The Spanish glossary begins with:

| English concept | Preferred Spanish treatment |
| --- | --- |
| capability | capacidad |
| agency | capacidad de actuar or capacidad de decisión, according to context |
| evidence | evidencia in technical contexts; datos y fuentes where clearer for the public |
| Test | La Prueba for the named system; evaluación for an individual run |
| Common Foundry | Forja Común; la Forja after first use |

The glossary is a semantic contract. Translators may adapt grammar and rhythm, but these distinctions should not drift silently between pages.

### Source titles

Official publication titles remain in their source language on the Test ledger and are marked `lang="en"`. Claims and caveats are translated. This preserves traceability and avoids presenting an unofficial translation as the publication’s actual title.

## Gotchas found

1. User-facing copy exists inside HTML, JavaScript and evidence JSON. Translating only the page leaves share sheets, errors, live regions and dynamic cards in English.
2. Locale-neutral evidence and explanatory prose are currently mixed in the same JSON. The overlay pattern separates them without changing the published Run 1 record.
3. Clean URLs make ordinary relative links unsafe inside locale folders. Root-relative paths are the dependable rule.
4. Spanish expands headings and button labels. Overflow wrapping and hyphenation need explicit support, followed by real-device review.
5. Spanish dates, decimal commas and percentage spacing need locale-aware formatting rather than string replacement.
6. Project names and programme concepts require editorial transcreation.
7. Social metadata, skip links, navigation labels, `aria-label` values and live-region messages are part of the translation surface.
8. A translated page can become stale even when the canonical evidence updates correctly. Automated coverage checks are necessary, but they cannot detect semantically outdated prose on their own.
9. Raw methodology and JSON downloads remain English. The interface should state this honestly until those documents are localised.
10. Relative `hreflang` links are suitable for a branch preview, but production should emit absolute canonical and alternate URLs once the production hostname and route policy are confirmed.
11. Formal titles, compact UI labels and internal identifiers are three different language surfaces and should be modelled separately.
12. A grammatically inclusive phrase can become repetitive enough to damage tone. Localisation requires controlled variation, not blind consistency.

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
- the accepted formal and compact names are present
- rejected first-pass public labels do not remain in the Spanish runtime

The script deliberately does not claim translation quality. It catches wiring and coverage failures, not awkward prose.

## Review sequence

1. Desktop visual pass on `/es/` and `/es/test`.
2. Physical iPhone pass, including the expanded opening titles, navigation, language control, disclosures and share buttons.
3. Keyboard and screen-reader smoke test.
4. Native Spanish editorial review for meaning, register, terminology and rhythm.
5. Compare every translated evidence claim with its canonical source field.
6. Confirm the formal title, compact names, Primera evaluación oficial and Forja Común treatment.
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
