// Objetos con los diagnósticos y recomendaciones según la evaluación
const outcomes = {
    critical: {
        title: "Brecha Crítica: Falta de Hardware",
        desc: "El estudiante no cuenta con un dispositivo de cómputo básico en el hogar, lo que genera una barrera insuperable para el aprendizaje digital.",
        action: "Siguiente Paso Sugerido: Priorizar la asignación o entrega de un equipo de cómputo básico o tableta funcional."
    },
    connectivity: {
        title: "Brecha Media: Sin Conectividad",
        desc: "El estudiante posee un dispositivo, pero carece de acceso o infraestructura estable de red para consultar contenidos en línea.",
        action: "Siguiente Paso Sugerido: Gestionar alternativas de acceso a redes institucionales o descarga de paquetes de estudio offline."
    },
    skills: {
        title: "Brecha de Uso: Alfabetización Necesaria",
        desc: "El estudiante cuenta con equipo e internet, pero autoevalúa sus habilidades digitales por debajo del umbral mínimo (menor a 5/10).",
        action: "Siguiente Paso Sugerido: Implementar talleres de acompañamiento y capacitación en alfabetización digital autónoma."
    },
    included: {
        title: "Inclusión Digital Satisfactoria",
        desc: "El estudiante dispone de infraestructura completa (dispositivo e internet) y reporta un nivel adecuado de competencias técnicas.",
        action: "Siguiente Paso Sugerido: Mantener el acceso tecnológico y fomentar prácticas avanzadas de aprendizaje en línea."
    }
};

// Función principal de clasificación condicional jerárquica
function classifyDiagnostic(hasDevice, hasInternet, skills) {
    // 1. Evaluación de Hardware (Prioridad 1)
    if (hasDevice === 'no') return outcomes.critical;

    // 2. Evaluación de Conectividad (Prioridad 2)
    if (hasInternet === 'no') return outcomes.connectivity;

    // 3. Evaluación de Competencias Técnicas (Prioridad 3)
    if (skills < 5) return outcomes.skills;

    // 4. Inclusión Satisfactoria
    return outcomes.included;
}

// Evento principal al cargar el documento
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("diagnostic-form");
    const resultCard = document.getElementById("result-card");
    const alertMsg = document.getElementById("alert-msg");
    const btnReset = document.getElementById("btn-reset");

    // Manejo del envío del formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        // Captura de entradas del DOM
        const deviceInput = form.querySelector('input[name="device"]:checked');
        const internetInput = form.querySelector('input[name="internet"]:checked');
        const skillsValue = document.getElementById("skills").value;

        // Validación de campos requeridos
        if (!deviceInput || !internetInput) {
            alertMsg.classList.remove("hidden");
            return;
        }

        alertMsg.classList.add("hidden");

        // Conversión explícita a tipo numérico y clasificación
        const hasDevice = deviceInput.value;
        const hasInternet = internetInput.value;
        const skills = Number(skillsValue); // Conversión crítica a Number()

        const result = classifyDiagnostic(hasDevice, hasInternet, skills);

        // Despliegue de resultados en el DOM
        document.getElementById("result-title").textContent = result.title;
        document.getElementById("result-desc").textContent = result.desc;
        document.getElementById("result-action").textContent = result.action;

        // Control de vista CSS
        form.classList.add("hidden");
        resultCard.classList.remove("hidden");
    });

    // Botón de reinicio para reejecutar la prueba
    btnReset.addEventListener("click", () => {
        form.reset();
        document.querySelector("output").textContent = "5"; // Resetea la etiqueta del range
        resultCard.classList.add("hidden");
        form.classList.remove("hidden");
    });
});
