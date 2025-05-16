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
    const scrollTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".section-hero",
        start: "top top",
        end: "bottom top",
        scrub: true,
        pin: true,
        anticipatePin: 1
      }
    });
  
    scrollTimeline
      // Zoom a la animación
      .to(".pov", {
        scale: 7.7,
        ease: "power2.inOut"
      }, 0)
  
      // Ocultar el texto scroll-hint
      .to(".scroll-hint", {
        opacity: 0
      }, 0)
  
    //   // Oscurecer la pantalla (blackout)
    //   .to(".blackout", {
    //     opacity: 1,
    //     duration: 1,
    //     ease: "power1.inOut"
    //   }, 0.7)
  
      // Ocultar toda la sección hero (opcional, si quieres que desaparezca)
      .to(".section-hero", {
        opacity: 0,
        duration: 0.5
      }, 0.9);
  }

  // Mostrar el header al hacer scroll más allá de la animación inicial
gsap.to(".site-header", {
    scrollTrigger: {
      trigger: ".section-about", // cuando empiece la segunda sección
      start: "top top",          // al llegar al top
      toggleActions: "play none none reverse"
    },
    y: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out"
  });
  
// Inicializar todo cuando la página esté cargada
window.addEventListener('load', () => {
  updateScale();
  setupScrollAnimations();
});

// Actualizar escala cuando se redimensione la ventana
window.addEventListener('resize', updateScale);