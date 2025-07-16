// ===== SECCIÓN TRABAJOS =====

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

  // Animación de entrada para las tarjetas de trabajos
  gsap.from('.job-card', {
    scrollTrigger: {
      trigger: '.section-jobs',
      start: 'top 60%',
      toggleActions: 'play none none none'
    },
    opacity: 0,
    y: 50,
    stagger: 0.15,
    duration: 0.8,
    ease: 'back.out'
  });

  // Efecto wobble al hover (diferente al de proyectos)
  function addWobbleEffect() {
    const jobs = document.querySelectorAll('.job-card');
    jobs.forEach(job => {
      job.addEventListener('mouseenter', () => {
        gsap.to(job, {
          keyframes: [
            { rotate: -3, duration: 0.15 },
            { rotate: 3, duration: 0.15 },
            { rotate: -2, duration: 0.1 },
            { rotate: 1, duration: 0.1 },
            { rotate: 0, duration: 0.1 }
          ],
          ease: 'power1.inOut'
        });
      });
    });
  }

  // Inicializar efecto después de cargar la página
  setTimeout(addWobbleEffect, 500);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupSection5Animations);