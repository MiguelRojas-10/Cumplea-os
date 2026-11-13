/** Tarot card interactions. */
document.addEventListener('DOMContentLoaded', () => {
  const AppState = window.AppState;

/* ========================================================================
     MÓDULO 5: SECCIÓN 3 - EL ORÁCULO DE TAROT GÓTICO (FLIP 3D)
     ======================================================================== */
  const TarotModule = (() => {
    const cardScenes = document.querySelectorAll('.tarot-card-scene');
    const counterMsg = document.getElementById('tarot-counter-msg');
    const unlockVaultBtn = document.getElementById('btn-unlock-phase-4');

    function init() {
      cardScenes.forEach((scene) => {
        scene.addEventListener('click', () => {
          const inner = scene.querySelector('.tarot-card-inner');
          if (inner.classList.contains('is-flipped')) return;

          inner.classList.add('is-flipped');
          AppState.tarotRevealedCount++;
          counterMsg.textContent = `Cartas reveladas: ${AppState.tarotRevealedCount} / 3`;

          if (AppState.tarotRevealedCount === 3) {
            counterMsg.textContent = '✧ ¡El destino ha hablado! Tu regalo final aguarda en la Bóveda ✧';
            unlockVaultBtn.classList.remove('hidden-btn');
          }
        });
      });
    }

    return { init };
  })();

  TarotModule.init();
});
