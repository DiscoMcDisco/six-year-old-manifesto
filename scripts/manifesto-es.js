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
    title: 'El Manifiesto de los Seis Años',
    text: 'Una prueba pública para saber si la inteligencia avanzada amplía la capacidad, la seguridad y la libertad humanas.',
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

document.querySelectorAll('[data-share]').forEach((button) => {
  button.addEventListener('click', sharePage);
});

setupContentsMenus();
