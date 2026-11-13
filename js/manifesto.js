/** Birthday letter typewriter. */
document.addEventListener('DOMContentLoaded', () => {
  const AppState = window.AppState;

/* ========================================================================
     MÓDULO 3: SECCIÓN 1 - EL MANIFIESTO (TYPEWRITER ROMÁNTICO)
     ======================================================================== */
  const ManifestoModule = (() => {
    const textEl = document.getElementById('typewriter-text');
    const skipBtn = document.getElementById('btn-skip-typewriter');
    const unlockBtn = document.getElementById('btn-unlock-phase-2');

    const romanticLetter = `Hola, mi amor... 🖤

Hoy es un dia muy importante porque hace 18 años naciste tú y eres la persona más importante de mi vida.

Quise hacer esta pagina para ti, para demostrarte lo mucho que te amo y lo mucho que me importas, tambien para darte una sorpresa por tu cumpleaños.

Preparé unos jueguitos, acertijos y sorpresas para ti, con un regalo al final. ¿Estás lista para desbloquear todo lo que hice para ti?

Feliz cumpleaños, mi niña hermosa. Te amo muchisimo mi amorcito.`;

    let charIndex = 0;
    let timerId = null;
    let isCompleted = false;

    function finishTyping() {
      if (isCompleted) return;
      isCompleted = true;
      clearTimeout(timerId);
      textEl.textContent = romanticLetter;
      skipBtn.classList.add('hidden-btn');
      unlockBtn.classList.remove('hidden-btn');
    }

    function typeNextChar() {
      if (charIndex < romanticLetter.length) {
        textEl.textContent += romanticLetter.charAt(charIndex);
        charIndex++;
        const delay = romanticLetter.charAt(charIndex - 1) === '\n' ? 180 : 28;
        timerId = setTimeout(typeNextChar, delay);
      } else {
        finishTyping();
      }
    }

    return {
      init: () => {
        skipBtn.addEventListener('click', finishTyping);
        typeNextChar();
      }
    };
  })();

  ManifestoModule.init();
});
