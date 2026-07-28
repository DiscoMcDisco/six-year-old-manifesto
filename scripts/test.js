const DATA_PATHS = {
  result: 'data/test/current-result.json',
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

const DIMENSION_QUESTIONS = {
  digital_access: 'Can I get online?',
  language_and_understanding: 'Can I understand?',
  learning_and_knowledge: 'Can I use what I learn?',
  economic_and_physical_capability: 'Do I have what I need to act?',
  institutional_bridging: 'Can someone help me take the next step?',
  practical_pathway_quality: 'Could I actually do it?',
  safety_and_rights: 'Is the route safe and fair?',
  agency_and_participation: 'Can I keep going and shape decisions?'
};

const dimensionEvidenceState = (dimension) => {
  if (dimension.score === null) return { className: 'unknown', label: 'Unknown' };
  if (String(dimension.status).includes('proxy')) return { className: 'emerging', label: 'Proxy evidence' };
  return { className: 'evidence', label: 'Measured evidence' };
};

function renderDimensions(dimensions) {
  const container = document.querySelector('[data-dimensions]');
  if (!container) return;

  container.innerHTML = dimensions.map((dimension, index) => {
    const unknown = dimension.score === null;
    const state = dimensionEvidenceState(dimension);
    const value = unknown
      ? '<span>Not measured</span>'
      : `<strong>${Number(dimension.score)}</strong><span>/ 100</span>`;

    return `
      <details class="dimension-row reveal ${state.className}">
        <summary>
          <span class="dimension-index">${String(index + 1).padStart(2, '0')}</span>
          <span class="dimension-title">
            <span class="dimension-question">${escapeHtml(DIMENSION_QUESTIONS[dimension.id] || dimension.label)}</span>
            <span class="dimension-label">${escapeHtml(dimension.label)}</span>
          </span>
          <span class="dimension-value">${value}</span>
        </summary>
        <div class="dimension-body">
          <span class="dimension-evidence-state">${escapeHtml(state.label)} · ${escapeHtml(confidenceLabel(dimension.confidence))}</span>
          <p>${escapeHtml(dimension.summary)}</p>
        </div>
      </details>`;
  }).join('');

  container.setAttribute('aria-busy', 'false');
  const status = document.querySelector('[data-load-status]');
  if (status) status.textContent = `Official Run 1 loaded. ${dimensions.length} measures are available to explore.`;
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
      <span class="callout-index">Finding ${String(index + 1).padStart(2, '0')}</span>
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
    toast.textContent = `Current official result · evidence checked ${formatDate(result.safeResearchCompleted)}`;
    toast.classList.add('visible');
    window.setTimeout(() => toast.classList.remove('visible'), 2200);
    window.setTimeout(() => banner.classList.remove('active'), 1800);
    document.querySelector('#child-path')?.scrollIntoView({ behavior: 'smooth' });
  });
}

function setupShare() {
  document.querySelectorAll('[data-share]').forEach((button) => {
    button.addEventListener('click', async () => {
      const shareData = {
        title: 'The Six-Year-Old Test · Official Run 1',
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

function setupContentsMenus() {
  document.querySelectorAll('.contents-menu').forEach((menu) => {
    menu.querySelectorAll('a, button').forEach((control) => {
      control.addEventListener('click', () => menu.removeAttribute('open'));
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
    document.querySelector('#verdict-title').textContent = result.verdict.headline;
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
    setupContentsMenus();
    activateRevealObserver();
  } catch (error) {
    console.error(error);
    document.body.classList.add('data-load-failed');
    const dimensions = document.querySelector('[data-dimensions]');
    dimensions?.setAttribute('aria-busy', 'false');
    const toast = document.querySelector('[data-run-toast]');
    if (toast) {
      toast.textContent = 'The Test data could not be loaded.';
      toast.classList.add('visible');
    }
    const status = document.querySelector('[data-load-status]');
    if (status) status.textContent = 'The Test data could not be loaded.';
    setupContentsMenus();
    activateRevealObserver();
  }
}

initialiseTest();
