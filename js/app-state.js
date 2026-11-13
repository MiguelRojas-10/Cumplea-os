/** Shared state for the phase-based application. */
window.AppState = {
    currentPhase: 1,
    highestUnlockedPhase: 1,
    totalPhases: 4,
    arcadeCompleted: {
      a: false, // Gothic Memory
      b: false, // Cazador de Rosas
      c: false, // Quiz de Pareja
      d: false  // Acertijo PIN
    },
    tarotRevealedCount: 0
  };
