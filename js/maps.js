`use strict`;

export function iniciarMapa(latitud, longitud) {
  try {
    // Crea un mapa en el elemento con id "map" y lo centra en las coordenadas (latitud, longitud) con un zoom de 14.
    const map = L.map("map").setView([latitud, longitud], 14);

    // Agrega una capa de mosaico de OpenStreetMap al mapa con la URL del servidor de tiles y la atribución correspondiente.
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Define un ícono personalizado (naranja) para el marcador.
    const orangeIcon = L.icon({
      // URL del ícono personalizado.
      iconUrl:
        "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
      // Tamaño del ícono.
      iconSize: [25, 41],
      // Punto del ícono que se ubicará en las coordenadas especificadas.
      iconAnchor: [12, 41],
      // Punto desde donde se mostrará el popup (si se llegara a usar).
      popupAnchor: [1, -34],
      // Tamaño de la sombra del ícono.
      shadowSize: [41, 41],
    });

    // Agrega un marcador en el mapa en las coordenadas (latitud, longitud) utilizando el ícono personalizado.
    L.marker([latitud, longitud], { icon: orangeIcon }).addTo(map);
  } catch (error) {
    // Si ocurre algún error durante la inicialización del mapa, se captura y se muestra en la consola.
    console.error("Error al iniciar el mapa:", error);
  }
}

