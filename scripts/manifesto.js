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

function ensureSeoMetadata() {
  const canonicalUrl = 'https://syom.discomcdisco.com/';
  document.title = 'The Six-Year-Old Manifesto | A Test for AI Progress';

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.append(canonical);
  }
  canonical.href = canonicalUrl;

  let robots = document.querySelector('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement('meta');
    robots.name = 'robots';
    document.head.append(robots);
  }
  robots.content = 'index,follow,max-image-preview:large';

  const ogUrl = document.querySelector('meta[property="og:url"]') || document.createElement('meta');
  ogUrl.setAttribute('property', 'og:url');
  ogUrl.content = canonicalUrl;
  if (!ogUrl.parentNode) document.head.append(ogUrl);

  const schema = document.createElement('script');
  schema.type = 'application/ld+json';
  schema.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': 'https://discomcdisco.com/#publisher',
        name: 'DiscoMcDisco',
        url: 'https://discomcdisco.com/'
      },
      {
        '@type': 'CreativeWork',
        '@id': `${canonicalUrl}#test`,
        name: 'The Six-Year-Old Manifesto',
        alternateName: 'The Six-Year-Old Test',
        url: canonicalUrl,
        description: 'A public test for whether advanced intelligence expands human capability, security and freedom.',
        about: ['artificial intelligence', 'human capability', 'technology progress', 'public benefit', 'access to knowledge'],
        inLanguage: 'en-GB',
        isAccessibleForFree: true,
        publisher: { '@id': 'https://discomcdisco.com/#publisher' },
        isPartOf: { '@id': 'https://discomcdisco.com/#website' },
        keywords: [
          'test for whether AI progress helps ordinary people',
          'six year old test for technology progress',
          'AI capability security and freedom manifesto',
          'public benefit test for artificial intelligence',
          'Six-Year-Old Test DiscoMcDisco'
        ]
      }
    ]
  });
  document.head.append(schema);
}

ensureSeoMetadata();

async function sharePage() {
  const shareData = {
    title: 'The Six-Year-Old Manifesto',
    text: 'A public test for whether advanced intelligence expands human capability, security and freedom.',
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
        button.textContent = 'Link copied';
        window.setTimeout(() => { button.textContent = originalText; }, 1600);
      });
      return;
    }

    window.prompt('Copy this link:', window.location.href);
  } catch (error) {
    console.info('Share cancelled or unavailable.', error);
  }
}

function setupContentsMenus() {
  document.querySelectorAll('.contents-menu').forEach((menu) => {
    menu.querySelectorAll('a, button').forEach((control) => {
      control.addEventListener('click', () => menu.removeAttribute('open'));
    });
  });
}

document.querySelectorAll('[data-share]').forEach((button) => {
  button.addEventListener('click', sharePage);
});

setupContentsMenus();
