`use strict`;
import { crearContenedorMapa } from "./app.js";

document.addEventListener("DOMContentLoaded", function () {
  function initMap() {
    if (typeof L === "undefined") {
      setTimeout(initMap, 100);
      return;
    }

    crearContenedorMapa();
  }

  document.querySelectorAll("#btnMostrarMapa").forEach((boton) => {
    boton.addEventListener("click", initMap);
  });
});

export function iniciarMapa(latitud, longitud) {
  const map = L.map("map").setView([latitud, longitud], 14);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  }).addTo(map);

  const orangeIcon = L.icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png",
    shadowUrl: "https://www.openstreetmap.org/assets/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  L.marker([latitud, longitud], { icon: orangeIcon }).addTo(map);
}
