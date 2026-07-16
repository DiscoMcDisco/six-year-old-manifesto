# The Six-Year-Old Test

## Official Run 1

Official Run 1 was completed on 16 July 2026 and establishes the first published world snapshot.

The Test asks whether the present world can turn advanced intelligence into real capability for an ordinary six-year-old. The child is not being examined. The surrounding technical, economic, institutional and rights environment is.

## Core rule

**The AI researches. The code measures.**

The research step may locate and extract updated evidence. It may not redefine metrics, change weights, infer missing values, calculate scores or write an unconstrained report.

The application:

1. validates the returned payload;
2. compares it with the metric registry;
3. rejects unsupported or conflicting updates;
4. calculates the fixed scores;
5. renders the hardcoded infographic;
6. requires approval before a run becomes the safe published result.

## What the score means

The Measured Enabling Substrate is a composite of five dimensions for which global measures or explicit proxies currently exist:

- digital access;
- language and understanding;
- learning and knowledge;
- economic and physical capability;
- institutional bridging.

It is **not** an end-to-end probability that a child can change the world.

Three critical dimensions remain unscored:

- practical pathway quality;
- safety and rights implementation;
- agency and participation.

Their absence forces the world verdict to fail.

## Scoring rules

Within each scored dimension, the current Test uses the arithmetic mean of its scored metrics. The dimension scores are combined with the fixed official weights in `metric-registry.json`.

Confidence is displayed separately and does not silently reduce or inflate a score.

Unknown values remain unknown.

Proxy dimensions may contribute to the current index, but they cannot independently satisfy an official pass condition.

## Evidence rules

Every evidence item records:

- the exact metric identifier;
- value and unit;
- population and geography;
- observation period;
- publication date;
- source organisation and URL;
- measurement type;
- confidence;
- limitations.

Raw counts are not converted into percentages without a denominator from the same source definition.

Measures with different populations, years or denominators are never multiplied into a fake cohort funnel.

## Run counting and quarterly boundary

Official Run 1 sets `totalRuns` to 1.

Each later result increments the count exactly once, only after the 90-day boundary has passed, the Test is triggered, the evidence is validated and the result is approved for publication.

## Scheduled research run

A safe result is cached for at least 90 days.

Before the next eligible date, the website returns the current safe result and its completion date. After eligibility, the first accepted trigger starts one research run while all visitors continue to see the previous safe result.

A new result becomes public only after:

- schema validation;
- source and freshness checks;
- deterministic score calculation;
- conflict review;
- explicit publication approval.

## Cost control

The scheduled job should:

- query only approved primary-source families;
- check first for material newer than the previous run;
- return strict JSON;
- reuse unchanged evidence;
- provide at most one preferred and one corroborating source per metric;
- provide no long-form report;
- generate no charts or scores;
- propose no more than six short call-outs.

The expensive work belongs in the first full research run. Routine runs should be small evidence updates.
