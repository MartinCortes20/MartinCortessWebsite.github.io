// Funciones originales de animación
const n = 19;
const rots = [
  { ry: 290, a: 0.5 },
  { ry: 0, a: 0.85 },
  { ry: 90, a: 0.4 },
  { ry: 180, a: 0.0 }
];

// Registrar el plugin ScrollTrigger y SplitText
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

// Sección 2 - Animación de texto y foto
function setupSection2Animations() {
  // Animación del título
  const aboutTitle = document.querySelector('.section-about h2');
  const titleText = aboutTitle.textContent;
  aboutTitle.innerHTML = '';
  
  // Crear span para cada letra del título
  titleText.split('').forEach((letter) => {
    const span = document.createElement('span');
    span.className = 'char';
    span.textContent = letter === ' ' ? '\u00A0' : letter;
    aboutTitle.appendChild(span);
  });

  // Animación de letras del título
  gsap.from('.section-about .char', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 40,
    rotateX: -90,
    stagger: 0.05,
    duration: 0.8,
    ease: 'back.out'
  });

  // Animación del texto y la foto
  gsap.from('.about-text', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: -50,
    duration: 1,
    ease: 'power2.out'
  });

  gsap.from('.about-image', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    x: 50,
    duration: 1,
    ease: 'power2.out',
    delay: 0.3
  });

  // Efecto de texto shuffling para párrafos
  const aboutParagraphs = document.querySelectorAll('.about-text p');
  aboutParagraphs.forEach((paragraph, index) => {
    // Agregar clase para identificarlo
    paragraph.classList.add('split-text');
    
    // Animación de entrada
    gsap.from(paragraph, {
      scrollTrigger: {
        trigger: paragraph,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      delay: 0.2 * index,
      ease: 'power2.out'
    });
  });

  // TextEffect - cambiar palabras
  if (document.querySelector('.text-shuffle')) {
    const words = ["creativo", "apasionado", "innovador", "dedicado", "minucioso"];
    let currentWord = 0;

    const textShuffle = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      scrollTrigger: {
        trigger: '.section-about',
        start: 'top 80%'
      }
    });

    words.forEach((word, index) => {
      textShuffle.to('.text-shuffle', {
        duration: 0.5,
        text: word,
        ease: "power2.out",
        delay: index > 0 ? 1 : 0
      });
    });
  }
}



// Sección 3 - Carrusel de proyectos horizontal con scroll
function setupSection3Animations() {
  // Animación para el título
  gsap.from('.section-projects h2', {
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'back.out'
  });

  // Configuración del ScrollTrigger para el carrusel horizontal
  gsap.to('.projects-container', {
    x: () => -(document.querySelector('.projects-container').scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'top top',
      end: () => `+=${document.querySelector('.projects-container').scrollWidth}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1
    }
  });

  // Vibración al hover
  function addShakeEffect() {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
      project.addEventListener('mouseenter', () => {
        gsap.to(project, {
          x: 0,
          duration: 0.1,
          ease: 'power1.inOut',
          onComplete: function() {
            gsap.to(project, {
              keyframes: [
                { x: -3, duration: 0.1 },
                { x: 3, duration: 0.1 },
                { x: -2, duration: 0.1 },
                { x: 2, duration: 0.1 },
                { x: 0, duration: 0.1 }
              ],
              ease: 'power1.inOut'
            });
          }
        });
      });
    });
  }

  // Aplicar efecto de zoom entre secciones
  gsap.timeline({
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'bottom bottom+=100',
      end: 'bottom center',
      scrub: true
    }
  })
  .to('.section-projects', {
    scale: 1.1,
    opacity: 0.8,
    duration: 1
  });

  // Inicializar vibración después de cargar la página
  setTimeout(addShakeEffect, 500);
}

// Sección 4 - Animación de caída de iconos de contacto
function setupSection4Animations() {
  // Animación para el título
  gsap.from('.section-contact h2', {
    scrollTrigger: {
      trigger: '.section-contact',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'back.out'
  });

  // Animación de caída para cada ícono de contacto
  const contactIcons = document.querySelectorAll('.contact-icon');
  
  contactIcons.forEach((icon, index) => {
    // Posición aleatoria horizontal
    const randomX = -20 + Math.random() * 40;
    
    // Animación de caída
    gsap.to(icon, {
      scrollTrigger: {
        trigger: '.section-contact',
        start: 'top 40%',
        toggleActions: 'play none none reset'
      },
      y: '100vh',
      x: randomX,
      duration: 1.5 + Math.random() * 1,
      delay: 0.2 * index,
      ease: 'bounce.out',
      rotation: -10 + Math.random() * 20
    });
  });

  // Efecto de rebote para cada ícono
  contactIcons.forEach(icon => {
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        scale: 1.2,
        duration: 0.3,
        ease: 'back.out'
      });
    });
    
    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.3,
        ease: 'power2.out'
      });
    });
  });
}

// Sección 5 - Jobs (similar a Projects pero con efecto diferente)
function setupSection5Animations() {
  // Animación para el título
  gsap.from('.section-jobs h2', {
    scrollTrigger: {
      trigger: '.section-jobs',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'back.out'
  });

  // Configuración del ScrollTrigger para el carrusel horizontal
  gsap.to('.jobs-container', {
    scrollTrigger: {
      trigger: '.section-jobs',
      start: 'top top',
      end: 'bottom top-=4000', // Ajustar según la cantidad de trabajos
      pin: true,
      scrub: 1
    },
    x: () => -(document.querySelector('.jobs-container').offsetWidth - window.innerWidth),
    ease: 'none'
  });

  // Vibración al hover (un poco diferente a la de proyectos)
  function addWobbleEffect() {
    const jobs = document.querySelectorAll('.job-card');
    jobs.forEach(job => {
      job.addEventListener('mouseenter', () => {
        gsap.to(job, {
          keyframes: [
            { rotate: -20, duration: 0.9 },
            { rotate: 20, duration: 0.6 },
            { rotate: -10, duration: 0.5 },
            { rotate: 2, duration: 0.4 },
            { rotate: 0, duration: 0.2 }
          ],
          ease: 'power1.inOut'
        });
      });
    });
  }

  // Inicializar efecto después de cargar la página
  setTimeout(addWobbleEffect, 500);
}

// Inicializar todo cuando la página esté cargada
window.addEventListener('load', () => {
  updateScale();
  setupScrollAnimations();
  
  // Inicializar animaciones de todas las secciones
  setupSection2Animations();
  setupSection3Animations();
  setupSection4Animations();
  setupSection5Animations();
});

// Actualizar escala cuando se redimensione la ventana
window.addEventListener('resize', updateScale);

