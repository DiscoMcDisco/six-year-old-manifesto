const FORMAL_MANIFESTO_TITLE = 'El manifiesto desde la mirada de una niña o un niño de seis años';

function setMetaContent(selector, content) {
  const element = document.querySelector(selector);
  if (element) element.setAttribute('content', content);
}

function applyManifestoEditorialPass() {
  document.title = FORMAL_MANIFESTO_TITLE;
  setMetaContent('meta[name="description"]', `${FORMAL_MANIFESTO_TITLE}: una prueba pública para saber si la inteligencia avanzada amplía la capacidad, la seguridad y la libertad humanas.`);
  setMetaContent('meta[property="og:title"]', FORMAL_MANIFESTO_TITLE);
  setMetaContent('meta[property="og:description"]', 'Una prueba pública que contempla el progreso desde la experiencia de una persona de seis años.');

  const brand = document.querySelector('.brand');
  if (brand) {
    brand.setAttribute('aria-label', 'Inicio de El Manifiesto');
    const label = brand.querySelector('span:last-child');
    if (label) label.textContent = 'El Manifiesto';
  }

  const eyebrow = document.querySelector('.hero .eyebrow');
  if (eyebrow) eyebrow.textContent = `${FORMAL_MANIFESTO_TITLE} · v0.1 · julio de 2026`;

  const runStatus = document.querySelector('.test-run-status');
  if (runStatus) {
    const marker = runStatus.querySelector('span');
    runStatus.textContent = ' Primera evaluación oficial · evidencia comprobada el 16 jul 2026 · próxima evaluación posible el 16 oct 2026';
    if (marker) runStatus.prepend(marker);
  }

  const foundryIntro = document.querySelector('#foundry .section-intro');
  if (foundryIntro) {
    foundryIntro.textContent = 'La Forja Común, una red pública y compartida para el descubrimiento, conectaría a científicas, científicos, laboratorios automatizados y talleres para trabajar en problemas públicos y publicar lo aprendido para que cualquiera pudiera utilizarlo.';
  }

  const footerTitle = document.querySelector('footer .footer-grid span:first-child');
  if (footerTitle) footerTitle.textContent = 'El Manifiesto · v0.1 · 16 de julio de 2026';
}

const revealElements = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add('visible'));
}

async function sharePage() {
  const shareData = {
    title: FORMAL_MANIFESTO_TITLE,
    text: 'Una prueba pública que contempla el progreso desde la experiencia de una persona de seis años.',
    url: window.location.href
  };

  const buttons = [...document.querySelectorAll('[data-share]')];

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      return;
    }

    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
      buttons.forEach((button) => {
        const originalText = button.textContent;
        button.textContent = 'Enlace copiado';
        window.setTimeout(() => { button.textContent = originalText; }, 1600);
      });
      return;
    }

    window.prompt('Copia este enlace:', window.location.href);
  } catch (error) {
    console.info('La acción de compartir se canceló o no está disponible.', error);
  }
}

function setupContentsMenus() {
  document.querySelectorAll('.contents-menu').forEach((menu) => {
    menu.querySelectorAll('a, button').forEach((control) => {
      control.addEventListener('click', () => menu.removeAttribute('open'));
    });
  });
}

applyManifestoEditorialPass();

document.querySelectorAll('[data-share]').forEach((button) => {
  button.addEventListener('click', sharePage);
});

setupContentsMenus();
