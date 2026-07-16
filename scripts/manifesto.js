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

document.querySelectorAll('[data-share]').forEach((button) => {
  button.addEventListener('click', sharePage);
});
