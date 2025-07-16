// ===== SECCIÓN INTRO (ABOUT ME) MINIMALISTA =====

function setupSection2Animations() {
  // Animación del título
  const aboutTitle = document.querySelector('.section-about h2');
  if (!aboutTitle) return;
  
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

  // Animación del subtítulo
  gsap.from('.subtitle', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out'
  });

  // Animación del texto
  gsap.from('.about-text p:not(.subtitle)', {
    scrollTrigger: {
      trigger: '.section-about',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.2,
    delay: 0.5,
    ease: 'power2.out'
  });

  // Animación de la imagen
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
    delay: 0.7
  });

  // Animación de las habilidades
  gsap.from('.skill-tag', {
    scrollTrigger: {
      trigger: '.skills-highlight',
      start: 'top 80%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 20,
    duration: 0.6,
    stagger: 0.1,
    delay: 0.8,
    ease: 'power2.out'
  });

  // Efecto de texto shuffling para palabras cambiantes
  const textShuffleElement = document.querySelector('.text-shuffle');
  if (textShuffleElement) {
    const words = ["apasionado", "creativo", "innovador", "dedicado", "autodidacta"];

    const textShuffle = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
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
        delay: index > 0 ? 2 : 0
      });
    });
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupSection2Animations);