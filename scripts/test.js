const DATA_PATHS = {
  result: 'data/test/calibration-run-0.json',
  evidence: 'data/test/evidence-ledger.json'
};

const formatDate = (isoDate) => new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
}).format(new Date(`${isoDate}T12:00:00Z`));

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const confidenceLabel = (value) => value === 'none' ? 'Unmeasured' : `${value} confidence`;

function renderDimensions(dimensions) {
  const container = document.querySelector('[data-dimensions]');
  if (!container) return;

  container.innerHTML = dimensions.map((dimension, index) => {
    const unknown = dimension.score === null;
    const score = unknown ? '?' : dimension.score;
    return `
      <article class="dimension-card reveal ${unknown ? 'unknown' : ''}" style="--dimension-score:${unknown ? 0 : dimension.score}">
        <div class="dimension-meta">
          <span class="dimension-number">${String(index + 1).padStart(2, '0')}</span>
          <span class="dimension-confidence">${escapeHtml(confidenceLabel(dimension.confidence))}</span>
        </div>
        <div class="dimension-score">${score}</div>
        <h3>${escapeHtml(dimension.label)}</h3>
        <p>${escapeHtml(dimension.summary)}</p>
      </article>`;
  }).join('');
}

function renderCheckpoints(checkpoints) {
  const container = document.querySelector('[data-checkpoints]');
  if (!container) return;

  container.innerHTML = checkpoints.map((checkpoint) => `
    <div class="checkpoint-row">
      <div class="checkpoint-label">
        <strong>${escapeHtml(checkpoint.label)}</strong>
        <small>${escapeHtml(checkpoint.population)}</small>
      </div>
      <div class="checkpoint-track" aria-hidden="true">
        <div class="checkpoint-fill" style="--value:${Number(checkpoint.value)}"></div>
      </div>
      <div class="checkpoint-value">${Number(checkpoint.value).toLocaleString('en-GB', { maximumFractionDigits: 1 })}%</div>
    </div>`).join('');
}

function renderCallouts(callouts) {
  const container = document.querySelector('[data-callouts]');
  if (!container) return;

  container.innerHTML = callouts.map((callout, index) => `
    <article class="callout-card reveal">
      <span class="callout-index">FINDING ${String(index + 1).padStart(2, '0')}</span>
      <h3>${escapeHtml(callout.title)}</h3>
      <p>${escapeHtml(callout.body)}</p>
    </article>`).join('');
}

function renderProviderGates(providers) {
  const container = document.querySelector('[data-provider-gates]');
  if (!container) return;

  const labels = {
    adult_mediated_for_under_13_education: 'Adult-mediated',
    consumer_service_18_plus: '18+',
    '13_plus_subject_to_region': '13+',
    supervised_under_13_partial_geographic_availability: 'Partial supervised access'
  };

  container.innerHTML = providers.map((provider) => `
    <div class="provider-row">
      <div>
        <strong>${escapeHtml(provider.provider)}</strong>
        <span>${escapeHtml(provider.claim)}</span>
      </div>
      <span class="provider-status">${escapeHtml(labels[provider.status] || provider.status)}</span>
    </div>`).join('');
}

function renderUnknowns(unknowns) {
  const container = document.querySelector('[data-unknowns]');
  if (!container) return;
  container.innerHTML = unknowns.map((unknown) => `<article class="unknown-card reveal"><p>${escapeHtml(unknown)}</p></article>`).join('');
}

function renderSources(entries) {
  const container = document.querySelector('[data-source-ledger]');
  if (!container) return;

  container.innerHTML = entries.map((entry) => `
    <div class="source-row">
      <div>
        <strong>${escapeHtml(entry.organisation)}</strong>
        <span>${escapeHtml(entry.title)}</span>
      </div>
      <div>
        <p>${escapeHtml(entry.claim)}</p>
        ${entry.caveat ? `<div class="source-note">Caveat: ${escapeHtml(entry.caveat)}</div>` : ''}
      </div>
      <a href="${escapeHtml(entry.url)}" target="_blank" rel="noreferrer">Source ↗</a>
    </div>`).join('');
}

function activateRevealObserver() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      activeObserver.unobserve(entry.target);
    });
  }, { threshold: 0.07 });

  elements.forEach((element) => observer.observe(element));
}

function setupRunButton(result) {
  const button = document.querySelector('[data-run-test]');
  const banner = document.querySelector('[data-safe-run-banner]');
  const toast = document.querySelector('[data-run-toast]');
  if (!button || !banner || !toast) return;

  button.addEventListener('click', () => {
    banner.classList.add('active');
    banner.focus({ preventScroll: true });
    toast.textContent = `Current safe result loaded · ${formatDate(result.safeResearchCompleted)}`;
    toast.classList.add('visible');
    window.setTimeout(() => toast.classList.remove('visible'), 2200);
    window.setTimeout(() => banner.classList.remove('active'), 1800);
    document.querySelector('#dimensions')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function setupShare() {
  document.querySelectorAll('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const shareData = {
        title: 'The Six-Year-Old Test · Calibration Run 0',
        text: 'Can today’s world turn advanced intelligence into real capability for an ordinary child?',
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          const original = button.textContent;
          button.textContent = 'Link copied';
          window.setTimeout(() => { button.textContent = original; }, 1600);
        } else {
          window.prompt('Copy this link:', window.location.href);
        }
      } catch (error) {
        console.info('Share cancelled or unavailable.', error);
      }
    });
  });
}

async function initialiseTest() {
  try {
    const [resultResponse, evidenceResponse] = await Promise.all([
      fetch(DATA_PATHS.result),
      fetch(DATA_PATHS.evidence)
    ]);

    if (!resultResponse.ok || !evidenceResponse.ok) {
      throw new Error('The static test data could not be loaded.');
    }

    const [result, evidence] = await Promise.all([
      resultResponse.json(),
      evidenceResponse.json()
    ]);

    document.querySelector('[data-overall-score]').textContent = result.measuredSubstrate.score;
    document.querySelector('[data-score-orb]').style.setProperty('--score', result.measuredSubstrate.score);
    document.querySelector('#verdict-title').textContent = result.verdict.headline;
    document.querySelector('#verdict-summary').textContent = result.verdict.summary;
    document.querySelector('[data-safe-date]').textContent = formatDate(result.safeResearchCompleted);
    document.querySelector('[data-next-date]').textContent = formatDate(result.nextRefreshEligible);
    document.querySelector('[data-pathway-warning]').textContent = result.pathwayWarning;

    renderDimensions(result.dimensions);
    renderCheckpoints(result.pathwayCheckpoints);
    renderCallouts(result.headlineCallouts);
    renderProviderGates(evidence.providerAccessGate);
    renderUnknowns(result.knownUnknowns);
    renderSources(evidence.entries);
    setupRunButton(result);
    setupShare();
    activateRevealObserver();
  } catch (error) {
    console.error(error);
    document.body.classList.add('data-load-failed');
    const toast = document.querySelector('[data-run-toast]');
    if (toast) {
      toast.textContent = 'The calibration data could not be loaded.';
      toast.classList.add('visible');
    }
    activateRevealObserver();
  }
}

initialiseTest();
