#🐟🐟🐟 PescaWebDaw206 🐟🐟🐟

# 🐟 Aplicación de Clasificación de Peces y Visualización de Mapas 🐟

Esta aplicación permite capturar o subir imágenes para clasificar especies de peces utilizando el modelo MobileNet de TensorFlow.js y, además, muestra un mapa interactivo con la ubicación actual y el clima. Se emplea la librería Leaflet para la visualización del mapa con datos de OpenStreetMap u Datatables para mostrar los datos del clima obtenidos a traves de la App de Open-Meteo

## Características

- **Captura y Subida de Imágenes**  
  Permite capturar imágenes a través de la cámara del dispositivo (frontal  o trasera) o subir imágenes desde la galería.

- **Clasificación de Peces**  
  Utiliza MobileNet para analizar la imagen y detectar si se trata de un pez, identificando la familia y especie (según las definiciones preestablecidas).

- **Visualización de Mapas y Clima**  
  Muestra un mapa interactivo centrado en la ubicación del usuario y actualiza la información del clima en tiempo real.

## Tecnologías Utilizadas

- **HTML, CSS y JavaScript (ES6+)**  
- **TensorFlow.js / MobileNet**  
  ([MobileNet en TensorFlow.js](https://www.tensorflow.org/js/models?hl=es))

- **Leaflet**  
  ([Sitio oficial de Leaflet](https://leafletjs.com/))

- **OpenStreetMap**  
  Provee los mosaicos para la visualización del mapa.

- **DataTables**  
  Plugin de jQuery para la creación de tablas interactivas y con funcionalidades avanzadas.  
  ([Sitio oficial de DataTables](https://datatables.net/))

- **Open-Meteo**  
  API gratuita para obtener datos meteorológicos y previsiones del tiempo.  
  ([Sitio oficial de Open-Meteo](https://open-meteo.com/))

## Ejemplo de Flujo de Uso

1. **Inicio de la Aplicación**  
   Al abrir la aplicación, se solicitarán permisos para acceder a la cámara y a la ubicación del dispositivo. Estos permisos son esenciales para el correcto funcionamiento de las funcionalidades de captura de imágenes y localización geográfica.

2. **Interfaz de Usuario**  
   Una vez concedidos los permisos, la interfaz principal ofrecerá opciones para:
   - **Capturar una Imagen:** Utilizando la cámara del dispositivo.
   - **Subir una Imagen:** Seleccionando una imagen almacenada en la galería del dispositivo.

3. **Clasificación de la Imagen**  
   Después de capturar o subir una imagen:
   - La función `classifyImage` procesará la imagen utilizando el modelo MobileNet.
   - Si se detecta un pez en la imagen, se mostrará un mensaje indicando la familia y especie del pez identificado.
   - Si no se detecta un pez, se informará al usuario que la imagen no contiene un pez reconocible.

4. **Mapa Interactivo y Información Climática**  
   En una sección aparte de la aplicación:
   - Se mostrará un mapa interactivo centrado en la ubicación actual del usuario, implementado con la librería Leaflet y utilizando mosaicos de OpenStreetMap.
   - Se presentará información climática en tiempo real correspondiente a la ubicación del usuario, obtenida a través de la API de Open-Meteo.



