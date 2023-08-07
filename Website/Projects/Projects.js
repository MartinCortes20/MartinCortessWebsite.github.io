document.addEventListener('DOMContentLoaded', function () {
  const clickableElements = document.querySelectorAll('.clickable');

  clickableElements.forEach(function (clickableElement) {
    clickableElement.addEventListener('click', function (event) {
      const targetElement = event.target;

      // Si se hizo clic en el texto h1 dentro del proyecto, mostrar overlay-text2
      if (targetElement.tagName === 'H1') {
        const overlayText = clickableElement.querySelector('.overlay-text2');
        if (overlayText) {
          overlayText.style.display = 'block';
        }
      }

      // Si se hizo clic en la imagen o enlace, redirigir al enlace del proyecto
      if (targetElement.tagName === 'IMG' || targetElement.tagName === 'A') {
        const linkElement = clickableElement.querySelector('a');
        if (linkElement) {
          linkElement.click();
        }
      }
    });
  });
});
