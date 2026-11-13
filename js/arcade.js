/** Arcade games and challenges. */
document.addEventListener('DOMContentLoaded', () => {
  const AppState = window.AppState;

/* ========================================================================
     MÓDULO 4: SECCIÓN 2 - LA ARENA DE JUEGOS (CONTROLADOR + 4 MINIJUEGOS)
     ======================================================================== */
  const ArcadeHub = (() => {
    const badges = document.querySelectorAll('.arcade-badge');
    const panels = {
      a: document.getElementById('game-panel-a'),
      b: document.getElementById('game-panel-b'),
      c: document.getElementById('game-panel-c'),
      d: document.getElementById('game-panel-d')
    };
    const globalStatus = document.getElementById('arcade-global-status');
    const unlockPhase3Btn = document.getElementById('btn-unlock-phase-3');

    function switchSubpanel(gameKey) {
      badges.forEach((b) => {
        b.classList.toggle('active-game', b.dataset.game === gameKey);
      });
      Object.keys(panels).forEach((k) => {
        panels[k].classList.toggle('active-subpanel', k === gameKey);
      });
    }

    function markGameCompleted(gameKey) {
      if (AppState.arcadeCompleted[gameKey]) return;
      AppState.arcadeCompleted[gameKey] = true;

      const badge = document.getElementById(`badge-game-${gameKey}`);
      badge.classList.add('completed-game');
      badge.querySelector('.badge-state').textContent = 'COMPLETADO ✔';

      const completedCount = Object.values(AppState.arcadeCompleted).filter(Boolean).length;
      globalStatus.textContent = `Juegos completados: ${completedCount} / 4`;

      if (completedCount === 4) {
        unlockPhase3Btn.classList.remove('hidden-btn');
      } else {
        // Avanzar automáticamente al siguiente juego pendiente tras breve pausa
        const nextPending = ['a', 'b', 'c', 'd'].find((k) => !AppState.arcadeCompleted[k]);
        if (nextPending) {
          setTimeout(() => switchSubpanel(nextPending), 1200);
        }
      }
    }

    /* ----------------------------------------------------
       MINIJUEGO A: GOTHIC MEMORY (12 CARTAS)
       ---------------------------------------------------- */
    function initMemoryGame() {
      const emojis = ['🖤', '🦇', '🥀', '🕷️', '🌙', '⚡'];
      const board = document.getElementById('memory-board');
      const pairsEl = document.getElementById('memory-pairs');
      const movesEl = document.getElementById('memory-moves');
      const winMsg = document.getElementById('memory-win-msg');
      const resetBtn = document.getElementById('btn-reset-memory');

      let deck = [];
      let flippedCards = [];
      let matchedPairs = 0;
      let moves = 0;
      let lockBoard = false;

      function shuffle(arr) {
        const copy = [...arr];
        for (let i = copy.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [copy[i], copy[j]] = [copy[j], copy[i]];
        }
        return copy;
      }

      function setupBoard() {
        board.innerHTML = '';
        deck = shuffle([...emojis, ...emojis]);
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        lockBoard = false;
        pairsEl.textContent = '0/6';
        movesEl.textContent = '0';

        deck.forEach((symbol) => {
          const card = document.createElement('div');
          card.className = 'memory-card';
          card.dataset.symbol = symbol;
          card.innerHTML = `
            <div class="memory-card-inner">
              <div class="memory-face memory-front">✧?✧</div>
              <div class="memory-face memory-back">${symbol}</div>
            </div>
          `;
          card.addEventListener('click', () => handleFlip(card));
          board.appendChild(card);
        });
      }

      function handleFlip(card) {
        if (lockBoard || card.classList.contains('flipped') || card.classList.contains('matched')) {
          return;
        }

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
          moves++;
          movesEl.textContent = String(moves);
          checkMatch();
        }
      }

      function checkMatch() {
        const [c1, c2] = flippedCards;
        const isMatch = c1.dataset.symbol === c2.dataset.symbol;

        if (isMatch) {
          c1.classList.add('matched');
          c2.classList.add('matched');
          flippedCards = [];
          matchedPairs++;
          pairsEl.textContent = `${matchedPairs}/6`;

          if (matchedPairs === 6) {
            winMsg.classList.remove('hidden');
            markGameCompleted('a');
          }
        } else {
          lockBoard = true;
          setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            flippedCards = [];
            lockBoard = false;
          }, 750);
        }
      }

      resetBtn.addEventListener('click', setupBoard);
      setupBoard();
    }

    /* ----------------------------------------------------
       MINIJUEGO B: CAZADOR DE ROSAS (CANVAS 2D)
       ---------------------------------------------------- */
    function initRosesCatcher() {
      const canvas = document.getElementById('roses-canvas');
      const ctx = canvas.getContext('2d');
      const scoreEl = document.getElementById('roses-score');
      const livesEl = document.getElementById('roses-lives');
      const startBtn = document.getElementById('btn-start-roses');
      const overlay = document.getElementById('roses-overlay');
      const overlayText = document.getElementById('roses-overlay-text');

      let running = false;
      let score = 0;
      let lives = 3;
      let items = [];
      let spawnTimer = 0;
      let animId = null;

      const player = {
        x: canvas.width / 2 - 36,
        y: canvas.height - 38,
        w: 72,
        h: 22,
        speed: 6.5,
        moveLeft: false,
        moveRight: false
      };

      function updateHUD() {
        scoreEl.textContent = `${score} / 10`;
        livesEl.textContent = '🖤'.repeat(Math.max(0, lives)) || '💀';
      }

      function startGame() {
        cancelAnimationFrame(animId);
        running = true;
        score = 0;
        lives = 3;
        items = [];
        spawnTimer = 0;
        player.x = canvas.width / 2 - player.w / 2;
        overlay.classList.add('hidden');
        updateHUD();
        loop();
      }

      function endGame(won) {
        running = false;
        cancelAnimationFrame(animId);
        overlay.classList.remove('hidden');
        if (won) {
          overlayText.innerHTML = '🥀 ¡10 ROSAS RECOLECTADAS! Desafío completado 🖤';
          startBtn.textContent = '✔ COMPLETADO';
          markGameCompleted('b');
        } else {
          overlayText.innerHTML = '💥 ¡Las espinas te alcanzaron! Presiona "REINTENTAR"';
          startBtn.textContent = '↻ REINTENTAR';
        }
      }

      function spawnItem() {
        const isRose = Math.random() < 0.65;
        items.push({
          x: Math.random() * (canvas.width - 32) + 16,
          y: -20,
          radius: 14,
          speed: Math.random() * 2.1 + 2.2,
          type: isRose ? 'rose' : 'thorn'
        });
      }

      function loop() {
        if (!running) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fondo sutil de rejilla arcade
        ctx.strokeStyle = 'rgba(139, 0, 255, 0.16)';
        ctx.lineWidth = 1;
        for (let gx = 0; gx < canvas.width; gx += 40) {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, canvas.height);
          ctx.stroke();
        }

        // Movimiento por teclado
        if (player.moveLeft) player.x -= player.speed;
        if (player.moveRight) player.x += player.speed;
        player.x = Math.max(0, Math.min(canvas.width - player.w, player.x));

        // Dibujar canasta neón del jugador
        ctx.save();
        ctx.fillStyle = '#ff007f';
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#ff007f';
        ctx.fillRect(player.x, player.y, player.w, player.h);
        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(player.x, player.y, player.w, player.h);
        ctx.restore();

        // Generar rosas y espinas
        spawnTimer++;
        if (spawnTimer % 34 === 0) spawnItem();

        ctx.font = '24px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          it.y += it.speed;

          ctx.fillText(it.type === 'rose' ? '🥀' : '⚡', it.x, it.y);

          // Colisión con canasta
          const hitX = it.x >= player.x - 10 && it.x <= player.x + player.w + 10;
          const hitY = it.y + it.radius >= player.y && it.y - it.radius <= player.y + player.h;

          if (hitX && hitY) {
            items.splice(i, 1);
            if (it.type === 'rose') {
              score++;
              updateHUD();
              if (score >= 10) {
                endGame(true);
                return;
              }
            } else {
              lives--;
              updateHUD();
              if (lives <= 0) {
                endGame(false);
                return;
              }
            }
            continue;
          }

          if (it.y > canvas.height + 25) {
            items.splice(i, 1);
          }
        }

        animId = requestAnimationFrame(loop);
      }

      // Controles Mouse / Touch / Teclado
      function updatePointerPosition(clientX) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const relX = (clientX - rect.left) * scaleX;
        player.x = Math.max(0, Math.min(canvas.width - player.w, relX - player.w / 2));
      }

      canvas.addEventListener('mousemove', (e) => {
        if (running) updatePointerPosition(e.clientX);
      });

      canvas.addEventListener(
        'touchmove',
        (e) => {
          if (!running) return;
          e.preventDefault();
          updatePointerPosition(e.touches[0].clientX);
        },
        { passive: false }
      );

      window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') player.moveLeft = true;
        if (e.key === 'ArrowRight') player.moveRight = true;
      });

      window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft') player.moveLeft = false;
        if (e.key === 'ArrowRight') player.moveRight = false;
      });

      startBtn.addEventListener('click', startGame);
    }

    /* ----------------------------------------------------
       MINIJUEGO C: QUIZ DE PAREJA (3 PREGUNTAS)
       ---------------------------------------------------- */
    function initCoupleQuiz() {
      const questions = [
        {
          q: '1. ¿Por que empezamos a hablar?',
          options: ['Porque eras muy linda', 'Porque teniamos gustos en comun', 'Porque nos toco en un grupo para una tarea', 'Porque teniamos amigos en comun'],
          correct: 2
        },
        {
          q: '2. ¿Quién cumple años hoy y es la novia más increíble, hermosa y especial del universo?',
          options: [
            '¡Obviamente Nezita!',
            'Miisito',
            'Nuestro gatito bebe'
          ],
          correct: 0
        },
        {
          q: '3. ¿Cuánto tiempo planeo seguir queriéndote, cuidándote y jugando contigo?',
          options: [
            'Mañana lo dejare de hacer',
            'Hasta que cierre Roblox',
            'Por siempre y para siempre, estando vivos y muertos',
          ],
          correct: 2
        }
      ];

      const progressLabel = document.getElementById('quiz-progress-label');
      const questionEl = document.getElementById('quiz-question');
      const optionsEl = document.getElementById('quiz-options');
      const feedbackEl = document.getElementById('quiz-feedback');

      let currentIdx = 0;

      function renderQuestion() {
        const item = questions[currentIdx];
        progressLabel.textContent = `Pregunta ${currentIdx + 1} de ${questions.length}`;
        questionEl.textContent = item.q;
        optionsEl.innerHTML = '';

        item.options.forEach((optText, idx) => {
          const btn = document.createElement('button');
          btn.className = 'quiz-option-btn';
          btn.textContent = optText;
          btn.addEventListener('click', () => handleAnswer(idx));
          optionsEl.appendChild(btn);
        });
      }

      function handleAnswer(selectedIdx) {
        const item = questions[currentIdx];
        if (selectedIdx === item.correct) {
          feedbackEl.style.color = '#00ff9d';
          feedbackEl.textContent = '✨ ¡Respuesta correcta! Conexión al 100% ✨';
          currentIdx++;

          if (currentIdx < questions.length) {
            setTimeout(() => {
              feedbackEl.textContent = '';
              renderQuestion();
            }, 700);
          } else {
            progressLabel.textContent = 'TRIVIA COMPLETADA ✔';
            questionEl.textContent = '¡Superaste las 3 preguntas del corazón! 🖤';
            optionsEl.innerHTML = '';
            markGameCompleted('c');
          }
        } else {
          feedbackEl.style.color = '#ff2a55';
          feedbackEl.textContent = '❌ ¡Casi! Intenta con otra opción, mi amor.';
        }
      }

      renderQuestion();
    }

    /* ----------------------------------------------------
       MINIJUEGO D: ACERTIJO PIN (1308 -> 13 de agosto)
       ---------------------------------------------------- */
    function initPinRiddle() {
      const SECRET_PIN = '1308';
      const display = document.getElementById('pin-display');
      const feedback = document.getElementById('pin-feedback');
      const keys = document.querySelectorAll('.pin-key');

      let inputBuffer = '';
      let solved = false;

      function updateScreen() {
        const padded = inputBuffer.padEnd(4, '_').split('').join(' ');
        display.textContent = padded;
      }

      function verifyPin() {
        if (solved) return;
        if (inputBuffer === SECRET_PIN) {
          solved = true;
          feedback.style.color = '#00ff9d';
          feedback.textContent = '🔓 ¡PIN 1308 CORRECTO! Portal desbloqueado.';
          display.style.borderColor = '#00ff9d';
          display.style.color = '#00ff9d';
          markGameCompleted('d');
        } else {
          feedback.style.color = '#ff2a55';
          feedback.textContent = '❌ PIN incorrecto. Pista: Día (2 dígitos) + Mes (2 dígitos).';
          display.classList.remove('shake');
          void display.offsetWidth;
          display.classList.add('shake');
          inputBuffer = '';
          updateScreen();
        }
      }

      keys.forEach((key) => {
        key.addEventListener('click', () => {
          if (solved) return;
          const digit = key.dataset.digit;
          const action = key.dataset.action;

          if (digit !== undefined && inputBuffer.length < 4) {
            inputBuffer += digit;
            feedback.textContent = '';
            updateScreen();
            if (inputBuffer.length === 4) {
              setTimeout(verifyPin, 220);
            }
          } else if (action === 'clear') {
            inputBuffer = '';
            feedback.textContent = '';
            updateScreen();
          } else if (action === 'enter') {
            verifyPin();
          }
        });
      });

      updateScreen();
    }

    return {
      init: () => {
        badges.forEach((b) => {
          b.addEventListener('click', () => switchSubpanel(b.dataset.game));
        });
        initMemoryGame();
        initRosesCatcher();
        initCoupleQuiz();
        initPinRiddle();
      }
    };
  })();

  ArcadeHub.init();
});
