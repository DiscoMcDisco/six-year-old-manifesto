# Semantic Evidence Language (SEL)

## Status

Version 0.1, proposed for first implementation by the Six-Year-Old Manifesto.

## Purpose

Semantic Evidence Language is a small visual vocabulary for communicating the state of a claim, capability or question.

It is designed to help readers distinguish between:

- what is evidenced
- what is achievable now
- what is plausible but incomplete
- what is unsupported or blocked
- what remains unknown

SEL is not a brand palette. It is a meaning system.

## Core rule

**Colour is evidence, not decoration.**

Every semantic colour must carry a defined meaning. Colour must never be the only carrier of that meaning.

## Canonical states

### Blue: evidenced

Meaning: **I can show you.**

Use blue for claims or artefacts supported by inspectable evidence, measurement, traceable sources or reproducible results.

Typical uses:

- evidence records
- citations and source trails
- measured results
- replicated findings
- documented observations
- methodology links

Blue does not automatically mean true forever. It means that evidence exists and can be inspected.

Recommended label: `Evidenced`

### Green: achievable now

Meaning: **You can do this today.**

Use green for capabilities, services, methods or routes that are demonstrably available and usable under the stated conditions.

Typical uses:

- deployed capability
- available public service
- proven implementation route
- currently accessible tool
- completed practical pathway

Green must not be used merely for optimism, improvement or a positive score.

Recommended label: `Available now`

### Amber: plausible or emerging

Meaning: **There is a reasonable basis, but the case is incomplete.**

Use amber where evidence is partial, capability is emerging, confidence is limited or further validation is needed.

Typical uses:

- early research
- partially evidenced claims
- promising prototypes
- conditional feasibility
- incomplete replication
- material assumptions

Amber is not failure. It is an invitation to inspect what is missing.

Recommended label: `Emerging`

### Red: unsupported, blocked or contradicted

Meaning: **We cannot honestly claim this yet.**

Use red for serious limitations, material contradictions, failed tests, ethical barriers or conditions that prevent the claim or route from being treated as viable.

Typical uses:

- failed threshold
- contradicted claim
- unavailable essential capability
- severe institutional barrier
- unacceptable harm or ethical constraint
- unsupported conclusion

Red should be used sparingly. It communicates a substantive problem, not ordinary emphasis or inconvenience.

Recommended label: `Blocked`

### Grey: unknown

Meaning: **We genuinely do not know.**

Use grey when the relevant question has not been answered, tested, measured or investigated sufficiently.

Typical uses:

- research gap
- missing dataset
- unresolved question
- untested assumption
- unavailable evidence
- out-of-scope result that must not be inferred

Grey is an explicit result, not an absence of design.

Recommended label: `Unknown`

## Neutral presentation

Most of the interface should remain neutral.

Paper, white, charcoal and neutral greys create the reading surface. They do not express evidential state. Headings, navigation, controls and ordinary body text should usually remain neutral unless their content itself carries an SEL state.

There is no canonical primary brand colour.

## Required redundancy

Every SEL state must be communicated through at least two channels.

Acceptable combinations include:

- colour plus a text label
- colour plus an icon and accessible name
- colour plus pattern or line treatment
- colour plus position within a clearly labelled scale

A coloured border or dot alone is insufficient.

## Application rules

### Claims

Apply SEL to the status of the claim, not to whether the claim sounds desirable.

A troubling fact supported by strong evidence is blue. A hopeful possibility with incomplete evidence is amber. A desirable capability available now is green.

### Cards and panels

Prefer a small labelled marker, header rule or status chip over flooding an entire surface with colour.

Large coloured backgrounds should be reserved for cases where the state itself is the main content and contrast requirements remain satisfied.

### Charts

Use SEL only when chart series represent SEL states.

Do not assign SEL colours to unrelated categories merely because the colours are available. When charts need categorical differentiation, use a separate accessible neutral or categorical system that cannot be mistaken for evidence status.

### Scores

Scores must not automatically map from low-to-red and high-to-green.

A high score may still be uncertain. A low measured score may be strongly evidenced. Score magnitude and evidence state are separate dimensions and should be shown separately.

### Citations

A citation may use blue when it leads to an inspectable source. Blue should not imply that every cited source is equally reliable. Source quality and confidence require their own explicit labels or metadata.

### Calls to action

Buttons should normally use neutral treatments.

Green must not become the default action colour. It may be used when the action itself specifically represents a currently available route and that meaning is clear from the accompanying label.

### Motion

SEL colours must not pulse, glow or animate merely to attract attention.

Motion may be used to reveal a change of state, but the resulting state must remain understandable after the motion stops and when motion is disabled.

## Multi-state and disputed cases

A single item may have more than one relevant dimension. For example, a capability may be available now but supported by weak evidence in a particular context.

Do not blend colours into a gradient or choose whichever state appears most favourable.

Show the dimensions separately, for example:

- `Availability: Available now`
- `Evidence confidence: Emerging`

Where credible sources disagree, label the disagreement and preserve the competing evidence rather than forcing a single colour verdict.

## Monochrome behaviour

SEL must survive monochrome rendering.

Recommended fallback vocabulary:

- Evidenced: solid rule or filled circle
- Available now: tick or completed route marker
- Emerging: diagonal hatch or half-filled marker
- Blocked: cross or stop marker
- Unknown: open circle or dotted rule

Exact symbols may vary by medium, but labels must remain present.

## Accessibility baseline

Implementations must:

- meet applicable text and non-text contrast requirements
- provide accessible names for icons and status markers
- preserve labels when colour is unavailable
- avoid relying on red-green discrimination
- remain legible under zoom and reflow
- expose status in document structure where assistive technology can reach it

## Suggested implementation tokens

Token names should describe meaning rather than hue:

```css
--sel-evidenced
--sel-available-now
--sel-emerging
--sel-blocked
--sel-unknown
--surface-paper
--surface-raised
--text-primary
--text-secondary
--border-neutral
```

Avoid canonical tokens such as `--brand-primary`, `--success-green` or `--warning-orange` where they blur meaning.

Exact colour values are implementation-level choices. They may change to improve contrast or suit a medium without changing the semantic state.

## Out of scope

SEL does not define:

- a complete visual identity
- typography
- page layout
- a general categorical chart palette
- organisational branding
- a substitute for written evidence
- an automated truth classification system

Human judgement, transparent methodology and inspectable sources remain necessary.

## Adoption test

An implementation conforms to SEL when:

1. each semantic colour has one stable meaning
2. meaning is never carried by colour alone
3. neutral interface elements remain neutral
4. evidence state is not confused with desirability or score
5. unknowns are represented explicitly
6. the same vocabulary can be translated into another medium

## Relationship to the Manifesto

The Six-Year-Old Manifesto is the first intended implementation of SEL, not its owner in perpetuity.

The language is deliberately small and portable so that reports, public institutions, research projects and other interfaces could adopt it without adopting the Manifesto's wider identity or argument.
