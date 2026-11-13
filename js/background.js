/** Animated background effects. */
document.addEventListener('DOMContentLoaded', () => {
  const AppState = window.AppState;

/* ========================================================================
     MÓDULO 1: FONDO ANIMADO MULTICAPA EN CANVAS (ESTRELLAS + CORAZONES PIXEL)
     ======================================================================== */
  const BackgroundFX = (() => {
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const colors = ['#ff007f', '#8b00ff', '#00f0ff', '#ffffff'];

    // Matriz 7x7 de corazón pixel art con destellos laterales ("espinado")
    const pixelHeartMatrix = [
      [0, 1, 1, 0, 1, 1, 0],
      [1, 2, 2, 1, 2, 2, 1],
      [1, 2, 2, 2, 2, 2, 1],
      [0, 1, 2, 2, 2, 1, 0],
      [1, 0, 1, 2, 1, 0, 1],
      [0, 0, 0, 1, 0, 0, 0]
    ];

    const sparkles = Array.from({ length: 55 }, () => createSparkle());
    const pixelHearts = Array.from({ length: 16 }, () => createPixelHeart());
    const shootingStars = [];

    function createSparkle() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.5 + 1,
        speedY: Math.random() * 0.45 + 0.15,
        alpha: Math.random(),
        alphaSpeed: Math.random() * 0.02 + 0.008,
        color: colors[Math.floor(Math.random() * colors.length)]
      };
    }

    function createPixelHeart() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        scale: Math.random() > 0.5 ? 3 : 2,
        speedY: Math.random() * 0.55 + 0.25,
        swayOffset: Math.random() * Math.PI * 2,
        mainColor: Math.random() > 0.4 ? '#ff007f' : '#8b00ff'
      };
    }

    function spawnShootingStar() {
      if (shootingStars.length < 3 && Math.random() < 0.025) {
        shootingStars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 0.45),
          len: Math.random() * 75 + 45,
          speed: Math.random() * 6 + 5,
          color: Math.random() > 0.5 ? '#00f0ff' : '#ff007f',
          life: 1
        });
      }
    }

    function drawPixelHeart(h, time) {
      const swayX = h.x + Math.sin(time * 0.0015 + h.swayOffset) * 14;
      for (let r = 0; r < pixelHeartMatrix.length; r++) {
        for (let c = 0; c < pixelHeartMatrix[r].length; c++) {
          const val = pixelHeartMatrix[r][c];
          if (val === 0) continue;
          ctx.fillStyle = val === 1 ? '#00f0ff' : h.mainColor;
          ctx.globalAlpha = 0.42;
          ctx.fillRect(swayX + c * h.scale, h.y + r * h.scale, h.scale, h.scale);
        }
      }
      ctx.globalAlpha = 1;
    }

    function animate(time = 0) {
      ctx.clearRect(0, 0, width, height);

      // Destellos Neón
      sparkles.forEach((s) => {
        s.y += s.speedY;
        s.alpha += s.alphaSpeed;
        if (s.y > height) s.y = -5;
        const glowAlpha = (Math.sin(s.alpha) + 1) * 0.45 + 0.1;

        ctx.save();
        ctx.globalAlpha = glowAlpha;
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.fillRect(s.x, s.y, s.size, s.size);
        ctx.restore();
      });

      // Corazones Espinados en Pixel Art
      pixelHearts.forEach((h) => {
        h.y += h.speedY;
        if (h.y > height + 20) {
          h.y = -25;
          h.x = Math.random() * width;
        }
        drawPixelHeart(h, time);
      });

      // Estrellas Fugaces
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const st = shootingStars[i];
        st.x += st.speed;
        st.y += st.speed * 0.55;
        st.life -= 0.018;

        if (st.life <= 0 || st.x > width + 100 || st.y > height + 100) {
          shootingStars.splice(i, 1);
          continue;
        }

        ctx.save();
        const grad = ctx.createLinearGradient(
          st.x,
          st.y,
          st.x - st.len,
          st.y - st.len * 0.55
        );
        grad.addColorStop(0, st.color);
        grad.addColorStop(1, 'transparent');
        ctx.strokeStyle = grad;
        ctx.lineWidth = 2;
        ctx.globalAlpha = st.life;
        ctx.beginPath();
        ctx.moveTo(st.x, st.y);
        ctx.lineTo(st.x - st.len, st.y - st.len * 0.55);
        ctx.stroke();
        ctx.restore();
      }

      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    return { init: () => requestAnimationFrame(animate) };
  })();

  BackgroundFX.init();
});
