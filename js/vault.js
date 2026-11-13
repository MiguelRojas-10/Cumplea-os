/** Gift vault and confetti. */
document.addEventListener('DOMContentLoaded', () => {
  const AppState = window.AppState;

/* ========================================================================
     MÓDULO 6: SECCIÓN 4 - LA BÓVEDA DEL REGALO (ROBUX VAULT + CONFETI NEÓN)
     ======================================================================== */
  const VaultModule = (() => {
    const input = document.getElementById('birthday-input');
    const openBtn = document.getElementById('btn-open-vault');
    const errorMsg = document.getElementById('vault-error-msg');
    const vaultDoor = document.getElementById('vault-door');
    const safeLed = document.getElementById('safe-led');
    const lockScreen = document.getElementById('vault-lock-screen');
    const rewardScreen = document.getElementById('vault-reward-screen');
    const footerStatus = document.getElementById('vault-footer-status');

    const copyBtn = document.getElementById('btn-copy-code');
    const secretCodeEl = document.getElementById('robux-secret-code');
    const copyTooltip = document.getElementById('copy-tooltip');

    // Validación flexible para "25 de marzo" y sus variaciones naturales
    function isValidAnniversary(rawValue) {
      const cleaned = rawValue
        .toLowerCase()
        .trim()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Quita tildes si las hubiera
        .replace(/\s+/g, ' ');           // Normaliza espacios dobles

      const acceptedAnswers = [
        '25 de marzo',
        'el 25 de marzo',
        '25 marzo',
        '25/03',
        '25-03',
        '25/3',
        '25-3',
        '25.03'
      ];

      return acceptedAnswers.includes(cleaned);
    }

    // Lluvia de Confeti y Estrellas de Colores Neón en Canvas
    function launchNeonConfetti() {
      const cCanvas = document.getElementById('confetti-canvas');
      const ctx = cCanvas.getContext('2d');
      cCanvas.width = window.innerWidth;
      cCanvas.height = window.innerHeight;

      const palette = ['#ff007f', '#8b00ff', '#00f0ff', '#00ff9d', '#ffffff'];
      const pieces = Array.from({ length: 150 }, () => ({
        x: Math.random() * cCanvas.width,
        y: Math.random() * -cCanvas.height,
        size: Math.random() * 8 + 5,
        speedY: Math.random() * 4 + 2.5,
        speedX: (Math.random() - 0.5) * 3,
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.14,
        color: palette[Math.floor(Math.random() * palette.length)],
        isStar: Math.random() > 0.45
      }));

      let frames = 0;
      const maxFrames = 360;

      function drawStar(cx, cy, spikes, outerR, innerR) {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerR);
        for (let i = 0; i < spikes; i++) {
          x = cx + Math.cos(rot) * outerR;
          y = cy + Math.sin(rot) * outerR;
          ctx.lineTo(x, y);
          rot += step;

          x = cx + Math.cos(rot) * innerR;
          y = cy + Math.sin(rot) * innerR;
          ctx.lineTo(x, y);
          rot += step;
        }
        ctx.lineTo(cx, cy - outerR);
        ctx.closePath();
        ctx.fill();
      }

      function renderConfetti() {
        frames++;
        ctx.clearRect(0, 0, cCanvas.width, cCanvas.height);

        pieces.forEach((p) => {
          p.y += p.speedY;
          p.x += p.speedX;
          p.rotation += p.rotSpeed;

          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;

          if (p.isStar) {
            drawStar(0, 0, 5, p.size, p.size * 0.45);
          } else {
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.65);
          }
          ctx.restore();
        });

        if (frames < maxFrames) {
          requestAnimationFrame(renderConfetti);
        } else {
          ctx.clearRect(0, 0, cCanvas.width, cCanvas.height);
        }
      }

      requestAnimationFrame(renderConfetti);
    }

    function attemptUnlock() {
      const userAnswer = input.value;
      if (isValidAnniversary(userAnswer)) {
        errorMsg.textContent = '';
        vaultDoor.classList.add('unlocking');
        safeLed.textContent = 'ABRIENDO...';
        footerStatus.textContent = 'Estado: ¡BÓVEDA ABIERTA! 💎';

        launchNeonConfetti();

        setTimeout(() => {
          lockScreen.classList.add('hidden');
          rewardScreen.classList.remove('hidden');
        }, 1050);
      } else {
        errorMsg.textContent = '❌ Respuesta incorrecta. Pista: Es en el tercer mes del año... 🖤';
        input.classList.remove('shake');
        void input.offsetWidth;
        input.classList.add('shake');
      }
    }

    async function copyRobuxCode() {
      const code = secretCodeEl.textContent.trim();
      try {
        await navigator.clipboard.writeText(code);
      } catch {
        // Fallback clásico en caso de entorno sin permisos de portapapeles
        const tempArea = document.createElement('textarea');
        tempArea.value = code;
        document.body.appendChild(tempArea);
        tempArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempArea);
      }

      copyTooltip.classList.add('show-tooltip');
      setTimeout(() => {
        copyTooltip.classList.remove('show-tooltip');
      }, 2000);
    }

    function init() {
      openBtn.addEventListener('click', attemptUnlock);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') attemptUnlock();
      });
      copyBtn.addEventListener('click', copyRobuxCode);
    }

    return { init };
  })();

  VaultModule.init();
});
