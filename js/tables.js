//Configuracion de tablas dinamicas y obtencion del tiempo
`use strict`;
/**
 * Obtiene los datos del clima en base a latitud y longitud con la API Open-Meteo
 * Devuelve un JSON con una selección de datos filtrada a partir de la respuesta
 * @param {number} latitud - Latitud de la ubicación.
 * @param {number} longitud - Longitud de la ubicación.
 * @returns {Promise<Object>} - Objeto con datos del clima o un error.
 */
export async function obtenerDatosMeteorologicos(latitud, longitud) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitud}&longitude=${longitud}&hourly=temperature_2m,relativehumidity_2m,windspeed_10m,cloudcover,precipitation&daily=temperature_2m_max,temperature_2m_min&timezone=auto`;

  try {
    const respuesta = await fetch(url);
    const datos = await respuesta.json();

    if (!datos.daily || !datos.hourly) {
      throw new Error("Datos meteorológicos no disponibles.");
    }

    return {
      latitud: latitud,
      longitud: longitud,
      temperaturaMaxima: datos.daily.temperature_2m_max,
      temperaturaMinima: datos.daily.temperature_2m_min,
      humedad: datos.hourly.relativehumidity_2m.slice(0, 7),
      viento: datos.hourly.windspeed_10m.slice(0, 7),
      nubosidad: datos.hourly.cloudcover.slice(0, 7),
      precipitacion: datos.hourly.precipitation.slice(0, 7),
    };
  } catch (error) {
    console.error("Error al obtener los datos meteorológicos:", error);
    return null;
  }
}

export function mostrarDatosEnTabla(datosClima, coordinates) {
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  let fechaHoy = new Date();
  let indiceHoy = fechaHoy.getDay(); // 0 (Domingo) - 6 (Sábado)

  let diasOrdenados = [];
  for (let i = 0; i < 7; i++) {
    let indice = (indiceHoy + i) % 7;
    diasOrdenados.push({ nombre: diasSemana[indice], indice });
  }

  // Contenedor donde se insertará la tabla
  const contenedor = document.getElementById("resultado-clima");
  contenedor.innerHTML = ""; // Limpiar contenido anterior

  // Crear tabla con un ID para usar DataTables
  let tabla = `<h2 id='tituloPrevision'>Prevision Semanal</h2>
    <table id="tablaClima" class="display">
        <thead>
            <tr>
                <th>Día</th>
                <th>Estado</th>
                <th>Temperatura Máxima (°C)</th>
                <th>Temperatura Mínima (°C)</th>
                <th>Humedad (%)</th>
                <th>Viento (m/s)</th>
            </tr>
        </thead>
        <tbody>`;

  const iconosClima = {
    despejado: "🌞",
    nublado: "☁️",
    lluvia: "🌧️",
    tormenta: "⛈️",
    nieve: "❄️",
    niebla: "🌫️",
    viento: "💨",
  };

  diasOrdenados.forEach((dia, i) => {
    let estado = "Despejado";
    let icono = iconosClima.despejado;

    if (datosClima.precipitacion[i] > 5) {
      estado = "Tormenta";
      icono = iconosClima.tormenta;
    } else if (datosClima.precipitacion[i] > 0) {
      estado = "Lluvia";
      icono = iconosClima.lluvia;
    } else if (datosClima.nieve && datosClima.nieve[i] > 0) {
      estado = "Nieve";
      icono = iconosClima.nieve;
    } else if (datosClima.nubosidad[i] > 80) {
      estado = "Nublado";
      icono = iconosClima.nublado;
    } else if (datosClima.viento[i] > 10) {
      estado = "Viento fuerte";
      icono = iconosClima.viento;
    } else if (datosClima.humedad[i] > 90) {
      estado = "Niebla";
      icono = iconosClima.niebla;
    }

    tabla += `
            <tr>
                <td>${dia.nombre}</td>
                <td>${icono} ${estado}</td>
            <td>${datosClima.temperaturaMaxima[i]}°C</td>
            <td>${datosClima.temperaturaMinima[i]}°C</td>
            <td>${datosClima.humedad[i]}%</td>
            <td>${datosClima.viento[i]} m/s</td>
        </tr>`;
  });

  tabla += `</tbody></table>`;
  contenedor.innerHTML = tabla;

  $("#tablaClima").DataTable({
    paging: false, // Deshabilitar la paginación
    searching: true, // Mantener la búsqueda
    ordering: false, // Deshabilitar el ordenamiento manual
    info: false, // Ocultar el mensaje "Showing X of X entries"
    lengthChange: false, // Ocultar el selector de número de entradas
    responsive: true,
    columnDefs: [
      { responsivePriority: 1, targets: 0 },
      { responsivePriority: 2, targets: 1 },
      { responsivePriority: 3, targets: -1 },
      { responsivePriority: 4, targets: -1 },
      { responsivePriority: 5, targets: -1 },
      { responsivePriority: 6, targets: -2 },
    ],
    language: {
      url: "https://cdn.datatables.net/plug-ins/1.10.21/i18n/Spanish.json",
    },
  });
}

export async function mostrarTiempoHoy(latitud, longitud) {
  const datosClima = await obtenerDatosMeteorologicos(latitud, longitud);
  if (!datosClima) return;

  const hoy = new Date();
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];
  const nombreDia = diasSemana[hoy.getDay()];
  const fechaHoy = hoy.toLocaleDateString();

  // Mapa de iconos basado en el estado del clima
  const iconosClima = {
    despejado: "🌞",
    nublado: "☁️",
    lluvia: "🌧️",
    tormenta: "⛈️",
    nieve: "❄️",
    niebla: "🌫️",
    viento: "💨",
  };

  let estado = "Despejado";
  let icono = iconosClima.despejado;

  // Determinar el estado del tiempo
  if (datosClima.precipitacion[0] > 5) {
    estado = "Tormenta";
    icono = iconosClima.tormenta;
  } else if (datosClima.precipitacion[0] > 0) {
    estado = "Lluvia";
    icono = iconosClima.lluvia;
  } else if (datosClima.nieve && datosClima.nieve[0] > 0) {
    estado = "Nieve";
    icono = iconosClima.nieve;
  } else if (datosClima.nubosidad[0] > 80) {
    estado = "Nublado";
    icono = iconosClima.nublado;
  } else if (datosClima.viento[0] > 10) {
    estado = "Viento fuerte";
    icono = iconosClima.viento;
  } else if (datosClima.humedad[0] > 90) {
    estado = "Niebla";
    icono = iconosClima.niebla;
  }

  const tablaTiempo = `
        <h3>Tiempo actual</h3>
                <p class="dia" id="fecha-dia">${nombreDia}, ${fechaHoy}</p>
                ${icono} 
                <p class="temp">${datosClima.temperaturaMaxima[0]}°C</p>
            <p class="estado">${estado}</p>
            <p class="viento">Viento: ${datosClima.viento[0]} m/s</p>
            <p class="humedad">Humedad: ${datosClima.humedad[0]}%</p>
`;
  document.getElementById("tiempoDiv").innerHTML = tablaTiempo;
}
