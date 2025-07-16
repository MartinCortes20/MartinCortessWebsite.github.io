// ===== SECCIÓN INTRO (ABOUT ME) =====

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
    paragraph.classList.add('split-text');
    
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
  const textShuffleElement = document.querySelector('.text-shuffle');
  if (textShuffleElement) {
    const words = ["creativo", "apasionado", "innovador", "dedicado", "minucioso"];

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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupSection2Animations);