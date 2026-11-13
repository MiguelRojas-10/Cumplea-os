/** Phase navigation and progress. */
document.addEventListener('DOMContentLoaded', () => {
  const AppState = window.AppState;

/* ========================================================================
     MÓDULO 2: NAVEGACIÓN SPA Y BARRA DE PROGRESO SECUENCIAL
     ======================================================================== */
  const Navigation = (() => {
    const navPills = document.querySelectorAll('.nav-pill');
    const sections = document.querySelectorAll('.phase-section');
    const progressFill = document.getElementById('progress-fill');
    const progressText = document.getElementById('progress-text');

    function updateProgressBar() {
      const percent = Math.round((AppState.highestUnlockedPhase / AppState.totalPhases) * 100);
      progressFill.style.width = `${percent}%`;
      progressText.textContent = `FASE ${AppState.currentPhase} / ${AppState.totalPhases} (${percent}%)`;
    }

    function goToPhase(phaseNumber) {
      if (phaseNumber > AppState.highestUnlockedPhase) return;

      AppState.currentPhase = phaseNumber;

      sections.forEach((sec, idx) => {
        sec.classList.toggle('active-section', idx + 1 === phaseNumber);
      });

      navPills.forEach((pill) => {
        const target = Number(pill.dataset.target);
        pill.classList.remove('active');
        if (target <= AppState.highestUnlockedPhase) {
          pill.disabled = false;
          pill.classList.remove('locked');
          pill.classList.add('unlocked');
          pill.textContent = `0${target}`;
        }
        if (target === phaseNumber) {
          pill.classList.add('active');
        }
      });

      updateProgressBar();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function unlockAndAdvance(nextPhase) {
      if (nextPhase > AppState.highestUnlockedPhase) {
        AppState.highestUnlockedPhase = nextPhase;
      }
      goToPhase(nextPhase);
    }

    function bindEvents() {
      navPills.forEach((pill) => {
        pill.addEventListener('click', () => {
          const target = Number(pill.dataset.target);
          goToPhase(target);
        });
      });

      document.getElementById('btn-unlock-phase-2').addEventListener('click', () => {
        unlockAndAdvance(2);
      });

      document.getElementById('btn-unlock-phase-3').addEventListener('click', () => {
        unlockAndAdvance(3);
      });

      document.getElementById('btn-unlock-phase-4').addEventListener('click', () => {
        unlockAndAdvance(4);
      });

    }

    return {
      init: () => {
        bindEvents();
        goToPhase(1);
      }
    };
  })();

  Navigation.init();
});
