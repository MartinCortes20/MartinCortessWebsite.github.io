// ===== SECCIÓN CONTACTO MEJORADA =====

function setupSection4Animations() {
  // Crear partículas de fondo
  createParticles();

  // Animación para el título con efecto de letras
  const title = document.querySelector('.section-contact h2');
  if (title) {
    const titleText = title.textContent;
    title.innerHTML = '';
    
    titleText.split('').forEach((letter) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.textContent = letter === ' ' ? '\u00A0' : letter;
      title.appendChild(span);
    });

    gsap.from('.section-contact h2 span', {
      scrollTrigger: {
        trigger: '.section-contact',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 50,
      rotateX: -90,
      stagger: 0.05,
      duration: 0.8,
      ease: 'back.out'
    });
  }

  // Animación del párrafo
  gsap.from('.contact-container p', {
    scrollTrigger: {
      trigger: '.section-contact',
      start: 'top 70%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 30,
    duration: 0.8,
    delay: 0.3,
    ease: 'power2.out'
  });

  // Animación de los íconos con efecto de caída suave
  const contactIcons = document.querySelectorAll('.contact-icon');
  
  contactIcons.forEach((icon, index) => {
    gsap.from(icon, {
      scrollTrigger: {
        trigger: '.section-contact',
        start: 'top 60%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: -100,
      rotation: Math.random() * 360,
      duration: 0.8,
      delay: 0.1 * index,
      ease: 'bounce.out'
    });
  });

  // Efectos de hover mejorados
  contactIcons.forEach(icon => {
    const inner = icon.querySelector('.contact-icon-inner');
    
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
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

function createParticles() {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;
  
  const particleCount = 20;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (8 + Math.random() * 4) + 's';
    particlesContainer.appendChild(particle);
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupSection4Animations);