# ADR 0001: Adopt Semantic Evidence Language

- Status: Accepted for implementation
- Date: 25 July 2026
- Decision owners: Six-Year-Old Manifesto maintainers

## Context

The Public Handbook direction established a warmer, calmer and more readable presentation. Its restrained civic palette improved accessibility and public tone, but colour still operated partly as visual identity.

The Manifesto needs to remain visually distinct from associated professional work while expressing its deeper purpose: helping people distinguish evidence, current capability, emerging possibility, material barriers and genuine unknowns.

A conventional brand palette would make the site look different without resolving that underlying design problem.

## Decision

The Six-Year-Old Manifesto will not use a primary brand colour.

It will adopt Semantic Evidence Language (SEL), in which colour is reserved for a stable evidential or capability meaning:

- blue: evidenced
- green: achievable now
- amber: plausible or emerging
- red: unsupported, blocked or contradicted
- grey: unknown

Most interface surfaces and controls will remain neutral. Every semantic state will also be communicated without relying on colour alone.

The Design Constitution governs the philosophy. The SEL specification governs practical application.

## Consequences

### Positive

- The visual system expresses the project's reasoning rather than its branding.
- Evidence status becomes easier to scan and compare.
- Unknowns and limitations gain an explicit visual place.
- The system can travel into print, reports, presentations and future tools.
- The Manifesto becomes visually and philosophically distinct from the author's professional website.

### Costs and constraints

- Existing CSS and components must be audited for decorative colour.
- Buttons and positive outcomes can no longer default automatically to green.
- Charts need a separate categorical palette where series do not represent SEL states.
- Scores and evidence confidence must be modelled as separate dimensions.
- Accessibility labels, icons and monochrome fallbacks must be implemented alongside colour.

## Non-decisions

This ADR does not choose final hex values, redesign page layouts or classify existing claims. Those are implementation decisions to be made through the site update and evidence review.

## Supersession

A future decision may refine or replace SEL, but it must explain how the replacement preserves or improves semantic clarity, uncertainty, accessibility and portability.
