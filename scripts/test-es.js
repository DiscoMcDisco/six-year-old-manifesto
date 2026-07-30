const DATA_PATHS = {
  result: '/data/test/current-result.json',
  evidence: '/data/test/evidence-ledger.json',
  locale: '/data/test/es/content.json'
};

const LOCALE = 'es';

const formatDate = (isoDate) => new Intl.DateTimeFormat(LOCALE, {
  day: '2-digit',
  month: 'short',
  year: 'numeric'
}).format(new Date(`${isoDate}T12:00:00Z`));

const formatNumber = (value, options = {}) => Number(value).toLocaleString(LOCALE, options);

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const confidenceLabel = (value) => {
  const labels = {
    none: 'Sin medir',
    low: 'Confianza baja',
    medium: 'Confianza media',
    high: 'Confianza alta'
  };
  return labels[value] || `Confianza: ${value}`;
};

const dimensionEvidenceState = (dimension) => {
  if (dimension.score === null) return { className: 'unknown', label: 'Desconocido' };
  if (String(dimension.status).includes('proxy')) return { className: 'emerging', label: 'Evidencia indirecta' };
  return { className: 'evidence', label: 'Evidencia medida' };
};

function renderDimensions(dimensions, localeContent) {
  const container = document.querySelector('[data-dimensions]');
  if (!container) return;

  container.innerHTML = dimensions.map((dimension, index) => {
    const translated = localeContent.dimensions[dimension.id] || {};
    const unknown = dimension.score === null;
    const state = dimensionEvidenceState(dimension);
    const value = unknown
      ? '<span>Sin medir</span>'
      : `<strong>${formatNumber(dimension.score)}</strong><span>/ 100</span>`;

    return `
      <details class="dimension-row reveal ${state.className}">
        <summary>
          <span class="dimension-index">${String(index + 1).padStart(2, '0')}</span>
          <span class="dimension-title">
            <span class="dimension-question">${escapeHtml(translated.question || dimension.label)}</span>
            <span class="dimension-label">${escapeHtml(translated.label || dimension.label)}</span>
          </span>
          <span class="dimension-value">${value}</span>
        </summary>
        <div class="dimension-body">
          <span class="dimension-evidence-state">${escapeHtml(state.label)} · ${escapeHtml(confidenceLabel(dimension.confidence))}</span>
          <p>${escapeHtml(translated.summary || dimension.summary)}</p>
        </div>
      </details>`;
  }).join('');

  container.setAttribute('aria-busy', 'false');
  const status = document.querySelector('[data-load-status]');
  if (status) status.textContent = `Resultado oficial 1 cargado. Hay ${dimensions.length} medidas disponibles para explorar.`;
}

function renderCheckpoints(checkpoints, localeContent) {
  const container = document.querySelector('[data-checkpoints]');
  if (!container) return;

  container.innerHTML = checkpoints.map((checkpoint) => {
    const translated = localeContent.checkpoints[checkpoint.metricId] || {};
    return `
      <div class="checkpoint-row">
        <div class="checkpoint-label">
          <strong>${escapeHtml(translated.label || checkpoint.label)}</strong>
          <small>${escapeHtml(translated.population || checkpoint.population)}</small>
        </div>
        <div class="checkpoint-track" aria-hidden="true">
          <div class="checkpoint-fill" style="--value:${Number(checkpoint.value)}"></div>
        </div>
        <div class="checkpoint-value">${formatNumber(checkpoint.value, { maximumFractionDigits: 1 })}%</div>
      </div>`;
  }).join('');
}

function renderCallouts(callouts, localeContent) {
  const container = document.querySelector('[data-callouts]');
  if (!container) return;

  container.innerHTML = callouts.map((callout, index) => {
    const translated = localeContent.callouts[callout.id] || {};
    return `
      <article class="callout-card reveal">
        <span class="callout-index">Hallazgo ${String(index + 1).padStart(2, '0')}</span>
        <h3>${escapeHtml(translated.title || callout.title)}</h3>
        <p>${escapeHtml(translated.body || callout.body)}</p>
      </article>`;
  }).join('');
}

function renderProviderGates(providers, localeContent) {
  const container = document.querySelector('[data-provider-gates]');
  if (!container) return;

  const labels = {
    adult_mediated_for_under_13_education: 'Con mediación adulta',
    consumer_service_18_plus: '18+',
    '13_plus_subject_to_region': '13+',
    supervised_under_13_partial_geographic_availability: 'Acceso supervisado parcial'
  };

  container.innerHTML = providers.map((provider) => {
    const translated = localeContent.providers[provider.provider] || {};
    return `
      <div class="provider-row">
        <div>
          <strong>${escapeHtml(provider.provider)}</strong>
          <span>${escapeHtml(translated.claim || provider.claim)}</span>
        </div>
        <span class="provider-status">${escapeHtml(labels[provider.status] || provider.status)}</span>
      </div>`;
  }).join('');
}

function renderUnknowns(localeContent) {
  const container = document.querySelector('[data-unknowns]');
  if (!container) return;
  container.innerHTML = localeContent.knownUnknowns
    .map((unknown) => `<article class="unknown-card reveal"><p>${escapeHtml(unknown)}</p></article>`)
    .join('');
}

function renderSources(entries, localeContent) {
  const container = document.querySelector('[data-source-ledger]');
  if (!container) return;

  container.innerHTML = entries.map((entry) => {
    const translated = localeContent.evidence[entry.metricId] || {};
    const claim = translated.claim || entry.claim;
    const caveat = translated.caveat || entry.caveat;
    return `
      <div class="source-row">
        <div>
          <strong>${escapeHtml(entry.organisation)}</strong>
          <span lang="en">${escapeHtml(entry.title)}</span>
        </div>
        <div>
          <p>${escapeHtml(claim)}</p>
          ${caveat ? `<div class="source-note">Matiz: ${escapeHtml(caveat)}</div>` : ''}
        </div>
        <a href="${escapeHtml(entry.url)}" target="_blank" rel="noreferrer">Fuente ↗</a>
      </div>`;
  }).join('');
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
    toast.textContent = `Resultado oficial actual · evidencia comprobada el ${formatDate(result.safeResearchCompleted)}`;
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
        title: 'La Prueba de los Seis Años · Resultado oficial 1',
        text: '¿Puede el mundo actual convertir la inteligencia avanzada en capacidad real para una niña o un niño corriente?',
        url: window.location.href
      };

      try {
        if (navigator.share) {
          await navigator.share(shareData);
        } else if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(window.location.href);
          const original = button.textContent;
          button.textContent = 'Enlace copiado';
          window.setTimeout(() => { button.textContent = original; }, 1600);
        } else {
          window.prompt('Copia este enlace:', window.location.href);
        }
      } catch (error) {
        console.info('La acción de compartir se canceló o no está disponible.', error);
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
    const [resultResponse, evidenceResponse, localeResponse] = await Promise.all([
      fetch(DATA_PATHS.result),
      fetch(DATA_PATHS.evidence),
      fetch(DATA_PATHS.locale)
    ]);

    if (!resultResponse.ok || !evidenceResponse.ok || !localeResponse.ok) {
      throw new Error('No se pudieron cargar los datos estáticos de la Prueba.');
    }

    const [result, evidence, localeContent] = await Promise.all([
      resultResponse.json(),
      evidenceResponse.json(),
      localeResponse.json()
    ]);

    document.querySelector('[data-overall-score]').textContent = formatNumber(result.measuredSubstrate.score);
    document.querySelector('#verdict-title').textContent = localeContent.verdict.headline;
    document.querySelector('[data-safe-date]').textContent = formatDate(result.safeResearchCompleted);
    document.querySelector('[data-next-date]').textContent = formatDate(result.nextRefreshEligible);
    document.querySelector('[data-pathway-warning]').textContent = localeContent.pathwayWarning;

    renderDimensions(result.dimensions, localeContent);
    renderCheckpoints(result.pathwayCheckpoints, localeContent);
    renderCallouts(result.headlineCallouts, localeContent);
    renderProviderGates(evidence.providerAccessGate, localeContent);
    renderUnknowns(localeContent);
    renderSources(evidence.entries, localeContent);
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
      toast.textContent = 'No se pudieron cargar los datos de la Prueba.';
      toast.classList.add('visible');
    }
    const status = document.querySelector('[data-load-status]');
    if (status) status.textContent = 'No se pudieron cargar los datos de la Prueba.';
    setupContentsMenus();
    activateRevealObserver();
  }
}

initialiseTest();
