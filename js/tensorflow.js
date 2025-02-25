"use strict";

const mobilenet = window.mobilenet;

let model = null;

async function loadModel() {
  if (!model) {
    model = await mobilenet.load();
    console.log("Modelo MobileNet cargado correctamente.");
  }
  return model;
}

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

export async function classifyImage(imgElement) {
  // Cargar el modelo MobileNet y obtener las predicciones
  const model = await loadModel();
  const resultsDiv = document.getElementById("results");
  const predictions = await model.classify(imgElement); // Clasificación de la imagen con MobileNet

  let detectedFish = "No hay resultado posible para la imagen."; // Valor por defecto si no se detecta un pez
  let result = false;

  for (let i = 0; i < predictions.length; i++) {
    const prediction = predictions[i];
    if (prediction.probability > 0.8) {
      for (const [family, species] of Object.entries(fishFamilies)) {
        for (const { name, types } of species) {
          if (prediction.className.toLowerCase().includes(types[0])) {
            detectedFish = `🐟 ¡Pez detectado! Pertenece a la familia "${family}" y es un ${name}.`;
            result = true;
            break; // Si encontramos una coincidencia, salimos del bucle
          }
        }
        if (result) {
          break;
        }
      }

      if (!result) {
        detectedFish = `🐟 ¡Pez no detectado!  El sistema ha detectado '${prediction.className}'.`;
      }
    }
  }

  // Mostrar el resultado en el HTML
  resultsDiv.innerHTML = detectedFish;
  console.log("Predicciones:", predictions); // Mostrar las predicciones en la consola para depuración
}
