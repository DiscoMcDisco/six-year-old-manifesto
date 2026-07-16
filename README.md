# The Six-Year-Old Manifesto

A public test for whether advanced intelligence expands human capability, security and freedom.

This repository contains the public-facing single-page manifesto, its evidence ledger, the transition architecture and the Common Foundry proposal.

## Project structure

- `index.html` - Manifesto landing page and metadata
- `test.html` - Six-Year-Old Test calibration dashboard
- `styles/manifesto.css` - shared visual design and responsive layout
- `styles/test.css` - infographic dashboard design
- `scripts/manifesto.js` - landing-page reveal animation and sharing behaviour
- `scripts/test.js` - deterministic dashboard rendering from static JSON
- `data/test/` - metric registry, evidence ledger, calibration result and quarterly payload schema
- `docs/six-year-old-test-methodology.md` - scoring, evidence and cost-control rules
- `vercel.json` - static hosting configuration

## Local preview

Open `index.html` directly in a browser, or serve the directory with any simple static server.

## Deployment

The site is designed for zero-build static deployment on Vercel. The production branch is `main`.

## Current status

Version 0.1, dated 16 July 2026. Calibration Run 0 of the Six-Year-Old Test is implemented on a working branch and remains subject to review before publication.
