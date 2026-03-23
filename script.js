// =====================
// Música
// =====================
const musica = document.getElementById("musica");

// =====================
// Botones
// =====================
const btnSi = document.getElementById("btnSi");
const btnNo = document.getElementById("btnNo");

// Botón "Sí"
btnSi.addEventListener("click", function () {
  // Reproducir música
  musica.play().catch(err => console.log("Autoplay bloqueado", err));

  // Mensaje SweetAlert
  Swal.fire({
    position: "top-center",
    title: "Soy el hombre más feliz del mundo, gracias por la oportunidad, no te decepcionaré🥰",
    showConfirmButton: false,
    timer: 1500,
  });

  // Cambiar texto y ocultar botón No
  const parrafo = document.querySelector("#cuadroDialogo p");
  parrafo.textContent = "El inicio de una hermosa historia ha comenzado...";
  btnNo.style.display = "none";

  // Iniciar animación de corazones
  initHearts();
});

// Botón "No" que se mueve
btnNo.style.transition = "transform 0.2s ease-in-out";
btnNo.addEventListener("mouseover", function () {
  const nuevaX = Math.random() * 450 - 225;
  const nuevaY = Math.random() * -300 - 50;
  this.style.transform = `translate(${nuevaX}px, ${nuevaY}px)`;
});

// Opcional: click en "No" muestra meme
btnNo.addEventListener("click", function () {
  Swal.fire({
    imageUrl: "https://trneodavo.000webhostapp.com/meme/meme%20salvador.png",
    imageHeight: 350,
    imageAlt: "Meme divertido",
  });
});

// =====================
// Animación de corazones
// =====================
function initHearts() {
  const canvas = document.getElementById("heart");
  const ctx = canvas.getContext("2d");

  // Ajuste para móvil
  const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
    (navigator.userAgent || navigator.vendor || window.opera).toLowerCase()
  );
  const koef = isMobile ? 0.5 : 1;

  // Tamaño del canvas
  let width = canvas.width = koef * window.innerWidth;
  let height = canvas.height = koef * window.innerHeight;

  window.addEventListener("resize", function () {
    width = canvas.width = koef * window.innerWidth;
    height = canvas.height = koef * window.innerHeight;
  });

  // Función para puntos del corazón
  function heartPosition(rad) {
    return [
      Math.pow(Math.sin(rad), 3),
      -(15 * Math.cos(rad) - 5 * Math.cos(2 * rad) - 2 * Math.cos(3 * rad) - Math.cos(4 * rad))
    ];
  }

  function scaleAndTranslate(pos, sx, sy, dx, dy) {
    return [dx + pos[0] * sx, dy + pos[1] * sy];
  }

  const pointsOrigin = [];
  const dr = isMobile ? 0.3 : 0.1;
  for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 210, 13, 0, 0));
  for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 150, 9, 0, 0));
  for (let i = 0; i < Math.PI * 2; i += dr) pointsOrigin.push(scaleAndTranslate(heartPosition(i), 90, 5, 0, 0));
  const heartPointsCount = pointsOrigin.length;

  const targetPoints = [];
  function pulse(kx, ky) {
    for (let i = 0; i < pointsOrigin.length; i++) {
      targetPoints[i] = [];
      targetPoints[i][0] = kx * pointsOrigin[i][0] + width / 2;
      targetPoints[i][1] = ky * pointsOrigin[i][1] + height / 2;
    }
  }

  // Partículas
  const e = [];
  const traceCount = isMobile ? 20 : 50;
  const rand = Math.random;
  for (let i = 0; i < heartPointsCount; i++) {
    const x = rand() * width;
    const y = rand() * height;
    e[i] = {
      vx: 0,
      vy: 0,
      R: 2,
      speed: rand() + 5,
      q: ~~(rand() * heartPointsCount),
      D: 2 * (i % 2) - 1,
      force: 0.2 * rand() + 0.7,
      f: `hsla(0,${~~(40 * rand() + 60)}%,${~~(60 * rand() + 20)}%,.3)`,
      trace: [],
    };
    for (let k = 0; k < traceCount; k++) e[i].trace[k] = { x: x, y: y };
  }

  const config = { traceK: 0.4, timeDelta: 0.01 };
  let time = 0;

  function loop() {
    const n = -Math.cos(time);
    pulse((1 + n) * 0.5, (1 + n) * 0.5);
    time += (Math.sin(time) < 0 ? 9 : n > 0.8 ? 0.2 : 1) * config.timeDelta;

    ctx.fillStyle = "rgba(0,0,0,.1)";
    ctx.fillRect(0, 0, width, height);

    for (let i = e.length; i--;) {
      const u = e[i];
      const q = targetPoints[u.q];
      let dx = u.trace[0].x - q[0];
      let dy = u.trace[0].y - q[1];
      let length = Math.sqrt(dx * dx + dy * dy);

      if (length < 10) {
        if (rand() > 0.95) u.q = ~~(rand() * heartPointsCount);
        else {
          if (rand() > 0.99) u.D *= -1;
          u.q += u.D;
          u.q %= heartPointsCount;
          if (u.q < 0) u.q += heartPointsCount;
        }
      }

      u.vx += (-dx / length) * u.speed;
      u.vy += (-dy / length) * u.speed;
      u.trace[0].x += u.vx;
      u.trace[0].y += u.vy;
      u.vx *= u.force;
      u.vy *= u.force;

      for (let k = 0; k < u.trace.length - 1;) {
        let T = u.trace[k];
        let N = u.trace[++k];
        N.x -= config.traceK * (N.x - T.x);
        N.y -= config.traceK * (N.y - T.y);
      }

      ctx.fillStyle = u.f;
      for (let k = 0; k < u.trace.length; k++) {
        ctx.fillRect(u.trace[k].x, u.trace[k].y, 1, 1);
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}
