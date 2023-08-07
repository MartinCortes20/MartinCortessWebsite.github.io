// Función para actualizar la posición de la imagen
function updateImagePosition() {
    var windowHeight = window.innerHeight;
    var sharkImage = document.querySelector(".imgShark");
    var sharkImageHeight = sharkImage.clientHeight;
    var newBottomPosition = windowHeight - sharkImageHeight;
    sharkImage.style.top = newBottomPosition + "px"; //  "top" para irse abajo 
  }
  
  // Llamar a la función al cargar la página y cuando se cambia el tamaño de la ventana
  window.addEventListener("load", updateImagePosition);
  window.addEventListener("resize", updateImagePosition);