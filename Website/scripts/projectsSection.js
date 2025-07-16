// ===== SECCIÓN PROYECTOS =====

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

  // Animación de entrada para las tarjetas de proyectos
  gsap.from('.project-card', {
    scrollTrigger: {
      trigger: '.section-projects',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    stagger: 0.2,
    duration: 0.8,
    ease: 'back.out'
  });

  // Efecto de vibración al hover
  function addShakeEffect() {
    const projects = document.querySelectorAll('.project-card');
    projects.forEach(project => {
      project.addEventListener('mouseenter', () => {
        gsap.to(project, {
          keyframes: [
            { x: -2, duration: 0.1 },
            { x: 2, duration: 0.1 },
            { x: -1, duration: 0.1 },
            { x: 1, duration: 0.1 },
            { x: 0, duration: 0.1 }
          ],
          ease: 'power1.inOut'
        });
      });
    });
  }

  // Inicializar vibración después de cargar la página
  setTimeout(addShakeEffect, 500);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupSection3Animations);