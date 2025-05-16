// Funciones originales de animación
const n = 19;
const rots = [
  { ry: 290, a: 0.5 },
  { ry: 0, a: 0.85 },
  { ry: 90, a: 0.4 },
  { ry: 180, a: 0.0 }
];

// Registrar el plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Set up the cube faces rotation
gsap.set(".face", {
  z: 200,
  rotateY: i => rots[i].ry,
  transformOrigin: "50% 50% -510px"
});

// Clone and animate each die
for (let i = 0; i < n; i++) {
  let die = document.querySelector('.die');
  let cube = die.querySelector('.cube');

  if (i > 0) {
    let clone = die.cloneNode(true);
    document.querySelector('.tray').append(clone);
    cube = clone.querySelector('.cube');
  }

  gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'power3.inOut', duration: 1 } })
    .fromTo(cube, {
      rotateY: -90
    }, {
      rotateY: 90,
      ease: 'power1.inOut',
      duration: 2
    })
    .fromTo(cube.querySelectorAll('.face'), {
      color: (j) => 'hsl(' + (i / n * 75 + 270) + ', 67%,' + (100 * [rots[3].a, rots[0].a, rots[1].a][j]) + '%)'
    }, {
      color: (j) => 'hsl(' + (i / n * 75 + 270) + ', 67%,' + (100 * [rots[0].a, rots[1].a, rots[2].a][j]) + '%)'
    }, 0)
    .to(cube.querySelectorAll('.face'), {
      color: (j) => 'hsl(' + (i / n * 75 + 270) + ', 67%,' + (100 * [rots[1].a, rots[2].a, rots[3].a][j]) + '%)'
    }, 1)
    .progress(i / n);
}

// Global tray animation
const trayAnimation = gsap.timeline()
  .from('.tray', { yPercent: -3, duration: 2, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
  .fromTo('.tray', { rotate: -15 }, { rotate: 15, duration: 4, ease: 'power1.inOut', yoyo: true, repeat: -1 }, 0)
  .from('.die', { duration: 0.01, opacity: 0, stagger: { each: -0.05, ease: 'power1.in' } }, 0)
  .to('.tray', { scale: 1.2, duration: 2, ease: 'power3.inOut', yoyo: true, repeat: -1 }, 0);

// Responsive scaling for the original animation
function updateScale() {
  const h = n * 56;
  gsap.set('.tray', { height: h });
  gsap.set('.pov', { scale: innerHeight / h });
}

// Scroll animation - effect de zoom in y transición al header
function setupScrollAnimations() {
  // Crear un timeline para la animación de scroll
  const scrollTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "+=100%",
      scrub: true,
      pin: ".section-hero",
      anticipatePin: 1,
      toggleActions: "play none none reverse"
    }
  });

  // Zoom IN animation (la animación crece con el scroll hacia abajo)
  scrollTimeline
    // Escalar la animación hacia adentro (hacer más grande)
    .to(".pov", {
      scale: 7.7,
      ease: "power2.inOut",
      duration: 1
    }, 0)
    // Mostrar el header con la palabra MARTIN CORTES
    .to(".site-header", {
      translateY: "0%",
      opacity: 1,
      duration: 0.5
    }, 0.3)
    // Ajustar opacidad de la animación principal
    .to(".die", {
      opacity: function(index) {
        // Que los elementos más alejados del centro se vuelvan más transparentes
        return 1 - (index * 0.02);
      },
      duration: 0.8
    }, 0.2)
    // Ocultar el texto de scroll hint
    .to(".scroll-hint", {
      opacity: 0,
      duration: 0.3
    }, 0);
}

// Inicializar todo cuando la página esté cargada
window.addEventListener('load', () => {
  updateScale();
  setupScrollAnimations();
});

// Actualizar escala cuando se redimensione la ventana
window.addEventListener('resize', updateScale);