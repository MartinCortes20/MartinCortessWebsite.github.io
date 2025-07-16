// ===== SECCIÓN CONTACTO =====

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

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', setupSection4Animations);