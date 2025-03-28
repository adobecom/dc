function showFallbackMessage(container) {
  container.innerHTML = `
    <div class="fallback-message">
      <h3>Something went wrong</h3>
    </div>
  `;
}

async function hydrateContent() {
  let container = document.getElementById('hydration-target');
  if (!container) {
    document.querySelector('.verb-widget').style.display = 'none';
    container = document.createElement('section');
    container.id = 'hydration-target';
    const mainElement = document.querySelector('main');
    if (mainElement) {
      if (mainElement.firstChild) {
        mainElement.insertBefore(container, mainElement.firstChild);
      } else {
        mainElement.appendChild(container);
      }
    }
  }
  const prerenderedScript = document.getElementById('prerendered-code');
  if (!prerenderedScript) {
    showFallbackMessage(container);
    return;
  }

  try {
    container.innerHTML = prerenderedScript.textContent;
    container.setAttribute('data-hydration-state', 'prerendered');
    const prerenderedWidget = container.querySelector('.prerendered-verb-widget');
    const verbWidget = document.querySelector('.verb-widget:not(.prerendered-verb-widget)');

    if (verbWidget) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'data-block-status') {
            const newValue = verbWidget.getAttribute('data-block-status');
            if (newValue === 'loaded') {
              if (prerenderedWidget) {
                prerenderedWidget.remove();
              }
              container.appendChild(verbWidget);
              verbWidget.style.display = '';
              container.setAttribute('data-hydration-state', 'hydrated');
            }
          }
        });
      });

      observer.observe(verbWidget, {
        attributes: true,
        attributeFilter: ['data-block-status'],
      });

      if (verbWidget.getAttribute('data-block-status') === 'loaded') {
        if (prerenderedWidget) {
          prerenderedWidget.remove();
        }
        container.appendChild(verbWidget);
        verbWidget.style.display = '';
        container.setAttribute('data-hydration-state', 'hydrated');
      }
    } else {
      container.setAttribute('data-hydration-state', 'failed-no-widget');
    }
  } catch (error) {
    window.lana.log(`Error hydrating content ${error}`, {
      sampleRate: 1,
      tags: 'DC_Milo,Frictionless',
    });
    container.innerHTML = prerenderedScript.textContent;
    container.setAttribute('data-hydration-state', 'failed');
  }
}

function runWhenDocumentIsReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback);
  } else {
    callback();
  }
}
runWhenDocumentIsReady(() => {
  window.dispatchEvent(new CustomEvent('hydrationStart', {
    detail: {
      hydration: 'start',
      element: '',
    },
  }));
  hydrateContent();
});
