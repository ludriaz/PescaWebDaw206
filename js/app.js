`use strict`;

//Importamos las funciones desde otros JS que necesitaremos en nuestras funciones
import { mostrarTiempoHoy } from "./tables.js";
import { iniciarMapa } from "./maps.js";
import { obtenerDatosMeteorologicos } from "./tables.js";
import { mostrarDatosEnTabla } from "./tables.js";
import { classifyImage } from "./tensorflow.js";
import { recuperarContrasena } from "./auth.js";
import { registrarUsuario } from "./auth.js";
import { iniciarSesion } from "./auth.js";
import { cerrarSesion } from "./auth.js";

// Lógica de aparición de formulario de recuperar contraseña.
document.addEventListener("DOMContentLoaded", () => {
  const recuperarButton = document.getElementById("recuperarButton");
  const recuperarForm = document.getElementById("recuperarContra");
  const loginForm = document.getElementById("loginForm");
  const registerButton = document.getElementById("registerButton");
  const logoutButton = document.getElementById("logoutButton");

  // Asigna la función al botón de registro
  if (registerButton) {
    registerButton.addEventListener("click", registrarUsuario);
  }
  // Asigna la función al evento submit del formulario
  if (loginForm) {
    loginForm.addEventListener("submit", iniciarSesion);
  }
  // Asigna la función al botón de cierre de sesión en caso de que exista el boton
  if (logoutButton) {
    logoutButton.addEventListener("click", cerrarSesion);
  }

  // Verificar si el botón de recuperar contraseña existe antes de agregar el evento
  if (recuperarButton) {
    recuperarButton.addEventListener("click", () => {
      if (loginForm && recuperarForm) {
        loginForm.style.display = "none";
        recuperarForm.style.display = "block";
        document.getElementById("recuperarButton").style.display = "none";
        document.getElementById("volverButton").style.display = "block";
      }
    });
  }
  //Verificar si el boton de volver existe antes de agregar el evento
  const btnVolver = document.getElementById("volverButton");
  if (btnVolver) {
    btnVolver.addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
  // Verificar si el botón de recuperar contraseña existe antes de agregar el evento de redirección
  const btnRecuperar = document.getElementById("btnRecuperar");
  if (btnRecuperar) {
    btnRecuperar.addEventListener("click", recuperarContrasena);
    btnRecuperar.addEventListener("click", () => {
      setTimeout(() => {
        window.location.href = "index.html";
      }, 15000); // Redirige después de 2 segundos
    });
  }

  //Añadimos el evento a todos los botones para realizar los cambios en el HTML y mostrar el contenedor clima
  document.querySelectorAll("#btnMostrarClima").forEach((boton) => {
    boton.addEventListener("click", crearContenedorClima);
  });

  //Añadimos el evento a todos los botones para realizar los cambios en el HTML y mostrar el contenedor de especies
  document.querySelectorAll("#btnIdentificarEpecies").forEach((boton) => {
    boton.addEventListener("click", crearContenedorEspecie);
  });

 document.querySelectorAll("#btnMostrarMapa").forEach((boton) => {
    boton.addEventListener("click", crearContenedorMapa);
  });


  //Funcion asincrona para crear el contenedor del clima
  async function crearContenedorClima() {
    const main = document.querySelector("main");
    main.innerHTML = "";

    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedor-clima");
    contenedor.id = "resultado-clima";
    main.appendChild(contenedor);

    try {
      // Obtener la ubicación del usuario
      const coordinates = await obtenerUbicacion();
      if (!coordinates) throw new Error("No se pudo obtener la ubicación.");

      // Obtener los datos meteorológicos
      const datosClima = await obtenerDatosMeteorologicos(
        coordinates.latitude,
        coordinates.longitude
      );
      if (!datosClima)
        throw new Error("Error al obtener la información del clima.");

      // Mostrar los datos en una tabla dentro del contenedor
      mostrarDatosEnTabla(datosClima, coordinates);
    } catch (error) {
      contenedor.textContent = error.message;
    }
  }

  //Funcion asincrona para realizar cambios en el HTML y crear el apartado relacionado con TENSORFLOW
  async function crearContenedorEspecie() {
    // Limpiar el contenido del contenedor 'main'
    const main = document.querySelector("main");
    main.innerHTML = "";

    // Crear el contenedor principal para la identificación
    const contenedorIdentificacion = document.createElement("div");
    contenedorIdentificacion.id = "contenedorIdentificacion";
    main.appendChild(contenedorIdentificacion);

    // Crear el div para mostrar los resultados (inicialmente mostrando "Esperando imagen...")
    const resultsDiv = document.createElement("div");
    resultsDiv.id = "results";
    resultsDiv.innerHTML = "Esperando imagen...";
    contenedorIdentificacion.appendChild(resultsDiv);

    // Crear el contenedor de la cámara y la sección de captura
    const contenedor = document.createElement("div");
    contenedor.classList.add("contenedor");
    contenedorIdentificacion.appendChild(contenedor);

    // Sección de captura con la cámara
    const seccionCaptura = document.createElement("div");
    seccionCaptura.classList.add("seccion-captura");
    contenedor.appendChild(seccionCaptura);

    // Título para la sección de captura
    const h3Captura = document.createElement("h3");
    h3Captura.textContent = "Captura con Cámara";
    seccionCaptura.appendChild(h3Captura);

    // Contenedor para la cámara y la imagen
    const contenedorCamara = document.createElement("div");
    contenedorCamara.classList.add("contenedor-camara");
    seccionCaptura.appendChild(contenedorCamara);

    // Imagen de captura estándar
    const imagenCaptura = document.createElement("img");
    imagenCaptura.src = "assets/images/foto.jpg";
    imagenCaptura.alt = "Imagen estándar";
    imagenCaptura.id = "imagen-captura";
    imagenCaptura.classList.add("imagen-estandar");
    contenedorCamara.appendChild(imagenCaptura);

    // Video para capturar la imagen en vivo desde la cámara
    const video = document.createElement("video");
    video.id = "video";
    video.autoplay = true;
    video.style.display = "none"; // Ocultar el video inicialmente
    contenedorCamara.appendChild(video);

    // Canvas para dibujar la imagen capturada
    const canvas = document.createElement("canvas");
    canvas.id = "canvas";
    canvas.style.display = "none"; // Ocultar el canvas inicialmente
    contenedorCamara.appendChild(canvas);
    const context = canvas.getContext("2d");

    // Botón para capturar la imagen desde la cámara
    const captureButton = document.createElement("button");
    captureButton.id = "capture";
    captureButton.textContent = "Capturar Imagen con tu dispositivo";
    contenedorCamara.appendChild(captureButton);

    // Botón para hacer la captura de la foto una vez que la cámara está activa
    const takePhotoButton = document.createElement("button");
    takePhotoButton.id = "takePhoto";
    takePhotoButton.textContent = "Capturar Foto";
    takePhotoButton.style.display = "none"; // Ocultar el botón hasta que la cámara esté activa
    contenedorCamara.appendChild(takePhotoButton);

    // Sección de subida de imágenes
    const seccionSubida = document.createElement("div");
    seccionSubida.classList.add("seccion-subida");
    contenedor.appendChild(seccionSubida);

    // Título para la sección de subida
    const h3Subida = document.createElement("h3");
    h3Subida.textContent = "Subir una imagen desde la galeria";
    seccionSubida.appendChild(h3Subida);

    // Contenedor para la imagen subida
    const contenedorSubida = document.createElement("div");
    contenedorSubida.classList.add("contenedor-subida");
    seccionSubida.appendChild(contenedorSubida);

    // Imagen de subida estándar
    const imagenSubida = document.createElement("img");
    imagenSubida.src = "assets/images/album.jpg";
    imagenSubida.alt = "Imagen estándar";
    imagenSubida.id = "imagen-subida";
    imagenSubida.classList.add("imagen-estandar");
    contenedorSubida.appendChild(imagenSubida);

    // Crear el input de tipo file (para seleccionar una imagen desde el dispositivo)
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.id = "fileInput";
    fileInput.accept = "image/*";
    fileInput.style.display = "none"; // Ocultar el input original

    // Crear el botón personalizado para seleccionar la imagen
    const uploadButton = document.createElement("button");
    uploadButton.textContent = "Seleccionar imagen";
    uploadButton.classList.add("custom-file-button");

    // Crear el texto que mostrará el nombre del archivo seleccionado
    const fileNameDisplay = document.createElement("span");
    fileNameDisplay.textContent = "Ningún archivo seleccionado";
    fileNameDisplay.classList.add("file-name-display");

    // Evento para abrir el selector de archivos al hacer clic en el botón
    uploadButton.addEventListener("click", () => {
      fileInput.click();
    });

    // Evento para actualizar el nombre del archivo seleccionado
    fileInput.addEventListener("change", () => {
      fileNameDisplay.textContent =
        fileInput.files.length > 0
          ? fileInput.files[0].name
          : "Ningún archivo seleccionado";
    });

    // Agregar los elementos al contenedor de subida
    contenedorSubida.appendChild(fileInput);
    contenedorSubida.appendChild(uploadButton);
    contenedorSubida.appendChild(fileNameDisplay);

    // Imagen para la previsualización de la imagen subida
    const preview = document.createElement("img");
    preview.id = "preview";
    preview.style.display = "none";
    preview.style.maxWidth = "100%";
    contenedorSubida.appendChild(preview);

    //Funcion para iniciar la camara del usuario
    function iniciarCamara(deviceId = null) {
      //Si el elemento video tiene alguna transmision la detiene
      if (video.srcObject) {
        video.srcObject.getTracks().forEach((track) => track.stop());
      }
      //Tratamos de acceder a una camara especifica
      const constraints = {
        video: deviceId ? { deviceId: { exact: deviceId } } : true,
      };
      //Se pide permiso para acceder a la cámara según las restricciones configuradas.
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          video.srcObject = stream;
          video.addEventListener("loadeddata", () => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
          });
          video.style.display = "block";
          imagenCaptura.style.display = "none";
          takePhotoButton.style.display = "inline";
        })
        .catch((err) => console.error("Error al acceder a la cámara:", err));
    }

    //FUNCION PARA OBTENER TODAS LAS CAMARAS POSIBLES
    function obtenerCamaras() {
      navigator.mediaDevices
        .getUserMedia({ video: true }) // Solicita permisos primero
        .then(() => {
          //Obtiene la lista de dispositivos multimedia disponibles
          return navigator.mediaDevices.enumerateDevices();
        })
        //Filtra solo los dispositivos de video (cámaras)
        .then((devices) => {
          const cameras = devices.filter(
            (device) => device.kind === "videoinput"
          );
          //Si hay más de una cámara, se crea un elemento <select> para que el usuario pueda elegir cuál usar.
          if (cameras.length > 1) {
            const selectCamera = document.createElement("select");
            selectCamera.id = "cameraSelect";
            //Se crea un escuchador para que cuando el usuario cambie el valor en el select llame a iniciar camara.
            selectCamera.addEventListener("change", (event) => {
              iniciarCamara(event.target.value);
            });
            //Opcion por defecto
            const defaultOption = document.createElement("option");
            defaultOption.text = "Selecciona una cámara";
            defaultOption.value = "";
            defaultOption.disabled = true;
            defaultOption.selected = true;
            selectCamera.appendChild(defaultOption);
            //Opcion para las diferentes camaras que se encuentren
            cameras.forEach((camera) => {
              const option = document.createElement("option");
              option.value = camera.deviceId;
              option.textContent =
                camera.label || `Cámara ${selectCamera.length + 1}`;
              selectCamera.appendChild(option);
            });

            contenedorCamara.appendChild(selectCamera);
          } else {
            //Si solo hay una camara
            iniciarCamara(cameras[0]?.deviceId || null);
          }
        })
        .catch((err) => console.log("Error al obtener cámaras:", err));
    }
    // Inicia el proceso de selección de cámara y prepara el área de captura.
    document.getElementById("capture").addEventListener("click", () => {
      obtenerCamaras();
      canvas.style.display = "block";
      captureButton.style.display = "none";
    });
    //Captura una foto desde la cámara y la procesa,  para reconocimiento.
    document.getElementById("takePhoto").addEventListener("click", () => {
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        console.error(
          "Dimensiones del video no disponibles. Asegúrate de que el video esté reproduciéndose."
        );
        return;
      }
      //Dibuja el fotograma actual del video en el <canvas>
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      resultsDiv.innerHTML = "Procesando imagen...";
      classifyImage(canvas);
    });

    // Evento para manejar la subida de una imagen desde el dispositivo
    document.getElementById("fileInput").addEventListener("change", (event) => {
      const file = event.target.files[0]; // Obtener el archivo de la imagen seleccionada
      if (file) {
        const reader = new FileReader(); // Crear un objeto FileReader para leer el archivo
        reader.onload = function (e) {
          const img = new Image(); // Crear una nueva imagen
          img.onload = function () {
            // Una vez que la imagen esté cargada, la clasificamos
            resultsDiv.innerHTML = "Procesando imagen...";
            classifyImage(img); // Llamar a la función para clasificar la imagen 
          };
          // Establecer la fuente de la imagen como la leída desde el archivo
          img.src = e.target.result;
          // Mostrar la previsualización de la imagen subida
          preview.src = img.src;
          preview.style.display = "block";
          imagenSubida.style.display = "none"; // Ocultar la imagen estándar
        };
        reader.readAsDataURL(file); // Leer el archivo como un Data URL (base64)
      }
    });
  }


//Funcion para obtener la ubicación.
 function obtenerUbicacion() {
  return new Promise((resolve, reject) => {
    //Verificamos si el navegador lo soporta
    if (navigator.geolocation) {
      //Pedimos la ubicacion del usuario
      navigator.geolocation.getCurrentPosition(
        (posicion) => {
          resolve({
            //En caso de exito extraemos las coordenadas
            latitude: posicion.coords.latitude,
            longitude: posicion.coords.longitude,
          });
        },
        (error) => {
          console.error("Error al obtener la ubicación:", error);
          reject(error);
        },
        //Opciones de geolocalizacion
        //enableHighAccuracy: true → Intenta obtener la ubicación con la mayor precisión posible (usando GPS si está disponible).
        //timeout: 10000 → Si no obtiene la ubicación en 10 segundos, se genera un error.
        //maximumAge: 0 → No usa datos de ubicación en caché; siempre obtiene una nueva medición
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      reject("Tu navegador no soporta la geolocalización.");
    }
  });
}
//Funcion para crear el contenedor del mapa y del tiempo actual
function crearContenedorMapa() {
  const main = document.querySelector("main");
  main.innerHTML = "";

  const contenedor = document.createElement("div");
  contenedor.classList.add("contenedor-mapa");

  const mapaDiv = document.createElement("div");
  mapaDiv.id = "map";
  mapaDiv.style.width = "100%";

  const tiempoDiv = document.createElement("div");
  tiempoDiv.id = "tiempoDiv";
  tiempoDiv.classList.add("tiempo-actual");
  contenedor.appendChild(mapaDiv);
  contenedor.appendChild(tiempoDiv);
  main.appendChild(contenedor);
  
//Obtenemos la ubicacion y mandamos los resultados a nuestras funciones de iniciar mapa y mostrarTiempoHoy
  obtenerUbicacion()
    .then((coords) => {
      iniciarMapa(coords.latitude, coords.longitude);
      mostrarTiempoHoy(coords.latitude, coords.longitude);
    })
    .catch((error) => {
      console.error("No se pudo obtener la ubicación:", error);
    });
}
});