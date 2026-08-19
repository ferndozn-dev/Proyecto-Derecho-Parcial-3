/* Dirección visual: Aula Editorial — la interacción explica el siguiente paso, con estados claros y animación breve. */

const diagnosticForm = document.querySelector('#diagnostic-form');
const resultPanel = document.querySelector('#result-panel');
const formError = document.querySelector('#form-error');
const skillsInput = document.querySelector('#skills');
const skillsOutput = document.querySelector('#skills-output');
const resetButton = document.querySelector('#reset-diagnostic');
const userNameInput = document.querySelector('#user-name');
const resultTitle = document.querySelector('#result-title');
const resultDescription = document.querySelector('#result-description');
const resultAction = document.querySelector('#result-action');

// En GitHub Pages se usa la copia local dentro de assets; en la vista previa se conserva la URL del almacenamiento.
document.querySelectorAll('img[data-fallback]').forEach((image) => {
  image.addEventListener('error', () => {
    if (image.dataset.fallbackApplied) return;
    image.dataset.fallbackApplied = 'true';
    image.src = image.dataset.fallback;
  });
});
const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

const outcomes = {
  critical: {
    title: 'Brecha crítica: falta de hardware',
    description: 'No contar con una computadora o tableta impide acceder de forma constante a las actividades digitales.',
    action: 'Priorizar el acceso a un dispositivo funcional.',
    className: 'result-critical'
  },
  connectivity: {
    title: 'Brecha media: sin conectividad',
    description: 'Existe un dispositivo, pero una conexión inestable limita la consulta de recursos y la participación en línea.',
    action: 'Buscar una alternativa de conexión estable.',
    className: 'result-connectivity'
  },
  skills: {
    title: 'Brecha de uso: alfabetización necesaria',
    description: 'Las condiciones materiales están presentes; el siguiente paso es fortalecer las habilidades digitales.',
    action: 'Diseñar un acompañamiento de alfabetización digital.',
    className: 'result-skills'
  },
  included: {
    title: 'Inclusión digital satisfactoria',
    description: 'Hay dispositivo, conexión y un nivel de habilidades suficiente para participar en actividades de aprendizaje digital.',
    action: 'Mantener el acceso y compartir buenas prácticas.',
    className: 'result-included'
  }
};

function updateRange() {
  const value = Number(skillsInput.value);
  skillsOutput.value = value;
  skillsOutput.textContent = value;
  const progress = ((value - 1) / 9) * 100;
  skillsInput.style.background = `linear-gradient(to right, var(--coral) 0%, var(--coral) ${progress}%, #eaded2 ${progress}%, #eaded2 100%)`;
}

function getSelectedValue(name) {
  return diagnosticForm.querySelector(`input[name="${name}"]:checked`)?.value;
}

function classifyDiagnostic(hasDevice, hasInternet, skills) {
  if (hasDevice === 'no') return outcomes.critical;
  if (hasInternet === 'no') return outcomes.connectivity;
  if (skills < 5) return outcomes.skills;
  return outcomes.included;
}

function showResult(outcome) {
  const firstName = userNameInput.value.trim().split(/\s+/)[0];
  resultTitle.textContent = firstName ? `${firstName}, ${outcome.title}` : outcome.title;
  resultDescription.textContent = outcome.description;
  resultAction.textContent = outcome.action;
  resultPanel.className = `result-panel is-visible ${outcome.className}`;
  diagnosticForm.hidden = true;
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function resetDiagnostic() {
  diagnosticForm.reset();
  diagnosticForm.hidden = false;
  resultPanel.hidden = true;
  resultPanel.className = 'result-panel';
  formError.hidden = true;
  updateRange();
  document.querySelectorAll('.choice input').forEach((input) => { input.checked = false; });
}

skillsInput.addEventListener('input', updateRange);

 diagnosticForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const device = getSelectedValue('device');
  const internet = getSelectedValue('internet');

  if (!device || !internet) {
    formError.hidden = false;
    (!device ? diagnosticForm.querySelector('input[name="device"]') : diagnosticForm.querySelector('input[name="internet"]')).focus();
    return;
  }

  formError.hidden = true;
  const outcome = classifyDiagnostic(device, internet, Number(skillsInput.value));
  showResult(outcome);
});

resetButton.addEventListener('click', resetDiagnostic);

menuToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.textContent = isOpen ? 'Cerrar' : 'Menú';
  document.body.classList.toggle('menu-open', isOpen);
});

document.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    siteNav.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = 'Menú';
    document.body.classList.remove('menu-open');
  });
});

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

updateRange();
