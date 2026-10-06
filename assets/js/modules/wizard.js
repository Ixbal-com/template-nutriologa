// Formulario por pasos: <form data-wizard> con un <fieldset data-wizard-step> por paso.
// Sin JavaScript todos los pasos se ven seguidos y los botones [data-wizard-nav] siguen
// ocultos. Con JavaScript:
//   - [data-wizard-next] y [data-wizard-back] avanzan y regresan; antes de avanzar se
//     validan los campos del paso (required, type="email"…),
//   - un paso con data-wizard-auto avanza solo al elegir una opción de radio,
//   - [data-wizard-progress] muestra "Paso {current} de {total}" (o su data-template)
//     y [data-wizard-bar] recibe la variable CSS --progress,
//   - Enter o "enviar" antes del último paso solo avanza.
// Recomendación (opcional): cada opción con data-points="plan-a plan-b" suma un punto a
// esos resultados. El paso con data-wizard-results muestra el [data-wizard-result="id"]
// con más puntos (empate: el primero en el HTML) y copia su data-result-name al campo
// [data-wizard-choice], para que llegue al mensaje de WhatsApp.
// Campos condicionales (opcional): un elemento con data-wizard-if="tipo=auto" solo se ve
// cuando el campo de name "tipo" vale "auto" (varios valores con "|": "tipo=vida|hogar").
// Mientras está oculto sus campos quedan desactivados: no se validan ni llegan al mensaje.
// Registra initWizard antes de initWhatsappForm: así el envío de un paso intermedio no
// abre WhatsApp.
export function initWizard() {
  for (const form of document.querySelectorAll("[data-wizard]")) {
    initConditions(form);
    const steps = [...form.querySelectorAll("[data-wizard-step]")];
    if (steps.length < 2) continue;

    const progress = form.querySelector("[data-wizard-progress]");
    const bar = form.querySelector("[data-wizard-bar]");
    const nextButtons = [...form.querySelectorAll("[data-wizard-next]")];
    const backButtons = [...form.querySelectorAll("[data-wizard-back]")];
    let current = 0;

    const show = (index, moveFocus) => {
      current = index;
      steps.forEach((step, position) => {
        step.hidden = position !== index;
      });
      if (progress) {
        progress.textContent = (progress.dataset.template ?? "Paso {current} de {total}")
          .replace("{current}", String(index + 1))
          .replace("{total}", String(steps.length));
      }
      bar?.style.setProperty("--progress", `${((index + 1) / steps.length) * 100}%`);
      // En el primer paso no hay "Atrás" y en el último el botón es el de enviar.
      for (const button of backButtons) button.style.visibility = index === 0 ? "hidden" : "";
      for (const button of nextButtons) button.hidden = index === steps.length - 1;
      if (steps[index].hasAttribute("data-wizard-results")) recommend(form, steps[index]);
      if (moveFocus) {
        steps[index].setAttribute("tabindex", "-1");
        steps[index].focus({ preventScroll: true });
        if (form.getBoundingClientRect().top < 0) form.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };

    const isValid = (step) => {
      for (const field of step.querySelectorAll("input, select, textarea")) {
        if (!field.checkValidity()) {
          field.reportValidity();
          return false;
        }
      }
      return true;
    };

    const next = () => {
      if (current < steps.length - 1 && isValid(steps[current])) show(current + 1, true);
    };

    for (const element of form.querySelectorAll("[data-wizard-nav]")) element.hidden = false;
    for (const button of nextButtons) button.addEventListener("click", next);
    for (const button of backButtons) {
      button.addEventListener("click", () => show(Math.max(0, current - 1), true));
    }
    for (const step of steps.filter((step) => step.hasAttribute("data-wizard-auto"))) {
      step.addEventListener("change", (event) => {
        if (event.target.type === "radio" && steps[current] === step) setTimeout(next, 250);
      });
    }

    form.addEventListener("submit", (event) => {
      if (current === steps.length - 1) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      next();
    });

    form.dataset.wizardReady = "";
    show(0, false);
  }
}

function recommend(form, step) {
  const results = [...step.querySelectorAll("[data-wizard-result]")];
  if (!results.length) return;

  const points = new Map(results.map((result) => [result.dataset.wizardResult, 0]));
  for (const input of form.querySelectorAll("[data-points]:checked")) {
    for (const id of input.dataset.points.split(/\s+/)) {
      if (points.has(id)) points.set(id, points.get(id) + 1);
    }
  }

  let winner = results[0];
  for (const result of results) {
    if (points.get(result.dataset.wizardResult) > points.get(winner.dataset.wizardResult)) winner = result;
  }
  for (const result of results) result.hidden = result !== winner;

  const choice = form.querySelector("[data-wizard-choice]");
  if (choice) choice.value = winner.dataset.resultName ?? winner.dataset.wizardResult;
}

function initConditions(form) {
  const conditionals = [...form.querySelectorAll("[data-wizard-if]")];
  if (!conditionals.length) return;

  const apply = () => {
    const data = new FormData(form);
    for (const element of conditionals) {
      const [name, values = ""] = element.dataset.wizardIf.split("=");
      const matches = values.split("|").includes(String(data.get(name.trim()) ?? ""));
      element.hidden = !matches;
      for (const field of element.querySelectorAll("input, select, textarea")) field.disabled = !matches;
    }
  };

  form.addEventListener("change", apply);
  apply();
}
