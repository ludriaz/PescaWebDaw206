"use strict";

const mobilenet = window.mobilenet;

let model = null;
/**
 * Función asíncrona para cargar el modelo MobileNet.
 * Si el modelo ya está cargado, lo retorna; de lo contrario, lo carga y lo almacena.
 */
async function loadModel() {
  if (!model) {
    model = await mobilenet.load();
    console.log("Modelo MobileNet cargado correctamente.");
  }
  return model;
}
/**
 * Objeto que agrupa diferentes familias de peces junto con sus especies.
 * Cada familia es una clave que contiene un arreglo de objetos, 
 * donde cada objeto representa una especie con su nombre y un arreglo de tipos.
 */
const fishFamilies = {
  "Peces de arrecife": [
    { name: "Pez payaso", types: ["clownfish"] },
    { name: "Pez ángel", types: ["angelfish"] },
    { name: "Pez damisela", types: ["damselfish"] },
    { name: "Gobi", types: ["goby"] },
    { name: "Pez cirujano", types: ["surgeonfish"] },
    { name: "Pez loro", types: ["parrotfish"] },
    { name: "Pez mariposa", types: ["butterflyfish"] },
    { name: "Labrión", types: ["wrasse"] },
    { name: "Pez gatillo", types: ["triggerfish"] },
    { name: "Blenny", types: ["blenny"] },
    { name: "Pargo", types: ["snapper"] },
  ],
  "Peces cartilaginosos": [
    { name: "Tiburón blanco", types: ["great white shark"] },
    { name: "Tiburón tigre", types: ["tiger shark"] },
    { name: "Tiburón martillo", types: ["hammerhead"] },
    { name: "Raya", types: ["stingray"] },
    { name: "Manta raya", types: ["manta ray"] },
    { name: "Raya eléctrica", types: ["electric ray"] },
    { name: "Raya de espinas", types: ["skate"] },
    { name: "Tiburón ángel", types: ["angel shark"] },
    { name: "Tiburón nodriza", types: ["nurse shark"] },
    { name: "Tiburón ballena", types: ["whale shark"] },
    { name: "Tiburón peregrino", types: ["basking shark"] },
  ],
  "Peces óseos": [
    { name: "Pez dorado", types: ["goldfish"] },
    { name: "Atún", types: ["tuna"] },
    { name: "Mero", types: ["grouper"] },
    { name: "Perche", types: ["bass"] },
    { name: "Trucha", types: ["trout"] },
    { name: "Lucio", types: ["pike"] },
    { name: "Pargo", types: ["snapper"] },
    { name: "Jurel", types: ["mackerel"] },
    { name: "Sardina", types: ["sardine"] },
    { name: "Anguila", types: ["eel"] },
    { name: "Piraña", types: ["piranha"] },
    { name: "Tilapia", types: ["tilapia"] },
  ],
  "Peces tropicales": [
    { name: "Peces mandarín", types: ["mandarin fish"] },
    { name: "Pez loro", types: ["parrotfish"] },
    { name: "Peces de arrecife", types: ["reef fish"] },
    { name: "Pez tropical", types: ["tropical fish"] },
    { name: "Pez ángel", types: ["angel fish"] },
    { name: "Pez cirujano", types: ["surgeonfish"] },
    { name: "Ídolo moro", types: ["moorish idol"] },
  ],
};

/**
 * Función asíncrona que clasifica una imagen utilizando el modelo MobileNet.
 * @param {HTMLElement} imgElement - El elemento de imagen a clasificar.
 */
export async function classifyImage(imgElement) {
  // Carga el modelo MobileNet (si no está cargado, se carga en este momento).
  const model = await loadModel();
  
  // Selecciona el elemento HTML donde se mostrará el resultado de la clasificación.
  const resultsDiv = document.getElementById("results");
  
  // Realiza la clasificación de la imagen y obtiene las predicciones.
  const predictions = await model.classify(imgElement);

  // Valor por defecto para indicar que no se pudo detectar ningún pez.
  let detectedFish = "No hay resultado posible para la imagen.";
 
  let result = false;

  // Recorre todas las predicciones obtenidas.
  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    // Si la probabilidad de la predicción es mayor a 0.8, se considera confiable.
    if (prediction.probability > 0.8) {
      // Itera sobre cada familia de peces y sus especies definidas en el objeto fishFamilies.
      for (const [family, species] of Object.entries(fishFamilies)) {
        for (const { name, types } of species) {
          // Comprueba si el nombre de la clase predicha incluye el tipo de pez (comparando en minúsculas).
          if (prediction.className.toLowerCase().includes(types[0])) {
            // Si se encuentra una coincidencia, se actualiza el mensaje indicando la familia y el nombre de la especie detectada.
            detectedFish = `🐟 ¡Pez detectado! Pertenece a la familia "${family}" y es un ${name}.`;
            result = true; // Se marca que se ha encontrado un resultado.
            break; // Sale del bucle de especies.
          }
        }
        if (result) {
          break; // Si ya se encontró un pez, sale del bucle de familias.
        }
      }

      // Si no se encontró una coincidencia confiable con ninguna familia, se actualiza el mensaje con la clase detectada.
      if (!result) {
        detectedFish = `🐟 ¡Pez no detectado! El sistema ha detectado '${prediction.className}'.`;
      }
    }
  }

  // Mostrar el resultado en el HTML
  resultsDiv.innerHTML = detectedFish;
  console.log("Predicciones:", predictions); // Mostrar las predicciones en la consola para depuración
}
