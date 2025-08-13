import { GoogleGenAI } from "@google/genai";
import { GEMINAI_KEY } from "../config.js";
import ollama from "ollama";
import Category from "../models/category.model.js";

export const generateJSONOllama = async (rawText) => {
  /* const response = await ollama.create({
    model: "deepseek-r1:8b",
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente que convierte recetas en texto plano a JSON estructurado para una app de cocina. Usando Español como lenguaje natural.",
      },
      {
        role: "user",
        content: `Convierte el siguiente texto en un JSON con: title, ingredients (name, amount, unit), steps (number, text, duration si se menciona), y totalTime si es posible.\n\nTexto:\n${rawText}`,
      },
    ],
  }); */

  const response = await ollama.chat({
    model: "deepseek-r1:8b",
    messages: [
      {
        role: "system",
        content:
          "Eres un asistente que convierte recetas en texto plano a JSON estructurado para una app de cocina. Usando Español como lenguaje natural.",
      },
      {
        role: "user",
        content: `Convierte el siguiente texto en un JSON con: title, ingredients (name, amount, unit), steps (number, text, duration si se menciona), y totalTime si es posible.\n\nTexto:\n${rawText}`,
      },
    ],
  });
};

const ai = new GoogleGenAI({
  apiKey: GEMINAI_KEY,
});

export const generateJSONGeminai = async (rawText) => {
  const categories = await Category.find();
  const categoriesString = categories
    .map((category) => category.name)
    .join(", ");

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction: `Eres un asistente que convierte recetas en texto plano a JSON estructurado para una app de cocina. Usando Español como lenguaje natural. Aquellos datos que no estén en el texto original, deberás llenarlos con valores que sean posibles respetando el formato JSON. El formato JSON debe ser el siguiente: 
        {
        title: ,
        ingredients: [
          {
            name: ,
            amount: ,
            unit: ,
          },
        ],
        steps: [
          {
            number: ,
            text: ,
            duration: , -> Si es posible
          },
        ],
        totalTime: , -> Deduce el tiempo total de la receta
        favoriteCount: , -> 0 por defecto
        categories: [ -> Elige una o más de las siguientes categorías que se refieran a la receta
          ${categoriesString}
        ],
        }
        `,
    },
    contents: `Convierte el siguiente texto en el formato JSON mencionado: \n${rawText}`,
  });

  return response.text;
};

export const generateJSONWithOCROption = async (
  imageBase64,
  imageType,
  categoriesString
) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction: `
        Eres un asistente que recibe una imagen de una receta y la transforma en un JSON estructurado para una aplicación de cocina.
        Debes realizar las siguientes tareas en orden:

        1. **Extraer el texto disponible en la imagen y usarlo para obtener información de la receta**.
        2. Corregir errores evidentes de ortografía, palabras cortadas o mal reconocidas.
        3. Eliminar cualquier texto irrelevante (marcas de agua, números de página, nombres de archivo, etc.).
        4. Reconstruir información faltante de forma coherente y realista, deduciendo datos cuando no estén explícitos en el texto, pero sin inventar elementos absurdos o imposibles.
        5. Unificar medidas e ingredientes cuando se repitan, manteniendo consistencia.
        6. Mantener todo en idioma Español.
        7. Identificar las categorías del platillo usando el listado de categorías proporcionado.

        IMPORTANTE:
        - Los ingredientes deben incluir una unidad usando SOLO una de las siguientes abreviaturas:
          "g", "kg", "ml", "l", "pz", "tz", "cda", "cdta", "reb", "dte", "hja", "ram", "pzc", "piz", "u", "ag"
        - Las categorías deben ser un array de _id, no nombres.
        
        El formato JSON debe ser estrictamente el siguiente:
        {
          "title": "",
          "description": "",
          "ingredients": [
            {
              "name": "",
              "amount": 0,
              "unit": ""
            }
          ],
          "steps": [
            {
              "number": 1,
              "text": "",
              "duration": 0 // Duración en minutos si es posible deducirla (si no se puede deducirlo, coloca 0)
            }
          ],
          "totalTime": 0, // Deduce el tiempo total en minutos (si no se puede deducirlo, coloca 0)
          "categories": [ // Uno o más _id de categorías del listado
            ${categoriesString}
          ]
        }
      `,
    },
    contents: [
      {
        inlineData: {
          data: imageBase64,
          mimeType: imageType,
        },
      },
    ],
  });

  return response.text;
};

export const generateJSONFromIdea = async (
  title,
  description,
  categoriesString
) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction: `
        Eres un asistente que crea recetas a partir de un título y una breve descripción.
        Tu tarea es:
        1. Inventar una receta completa y coherente basada en el título y la descripción proporcionados.
        2. Mantener el idioma Español.
        3. Usar ingredientes y cantidades realistas.
        4. Incluir pasos detallados y tiempos aproximados.
        5. No añadir explicaciones fuera del JSON.
        6. Identificar las categorías del platillo, usando el listado de categorías proporcionada.

        IMPORTANTE:
        - Los ingredientes deben incluir una unidad usando SOLO una de las siguientes abreviaturas: "g", "kg", "ml", "l", "pz", "tz", "cda", "cdta", "reb", "dte", "hja", "ram", "pzc", "piz", "u", "ag"
        - Las categorías deben ser un array de _id, no nombres.
        
        El formato JSON debe ser estrictamente el siguiente:
        {
          "title": "",
          "description": "",
          "ingredients": [
            {
              "name": "",
              "amount": 0,
              "unit": ""
            }
          ],
          "steps": [
            {
              "number": 1,
              "text": "",
              "duration": 0 // Duración en minutos si es posible deducirla (si no se puede deducirlo, coloca 0)
            }
          ],
          "totalTime": 0, // Tiempo total estimado en minutos (si no se puede deducirlo, coloca 0)
          "categories": [ // Uno o más _id de categorías del listado
            ${categoriesString}
          ]
        }
      `,
    },
    contents: `Título: ${title}\nDescripción: ${description}`,
  });

  return response.text;
};

export const generateRecipeFromImage = async (
  imageBase64,
  imageType,
  categoriesString
) => {
  const contents = [
    {
      inlineData: {
        data: imageBase64,
        mimeType: imageType,
      },
    },
  ];

  const context = `
Eres un asistente que observa una imagen de comida y deduce el platillo que contiene.
Tu tarea es:
1. Identificar el platillo en la imagen.
2. Identificar el nombre del platillo.
3. Identificar la descripción del platillo.
4. Identificar los ingredientes del platillo.
5. Identificar los pasos para preparar el platillo.
6. Identificar el tiempo total para preparar el platillo (se debe indicar en minutos).
7. Identificar las categorías del platillo, usando el listado de categorías proporcionada.
8. Si no puedes ver claramente algún dato, invéntalo de manera realista para que la receta sea funcional.

IMPORTANTE:
- Los ingredientes deben incluir una unidad usando SOLO una de las siguientes abreviaturas:
  "g", "kg", "ml", "l", "pz", "tz", "cda", "cdta", "reb", "dte", "hja", "ram", "pzc", "piz", "u", "ag"
- Las categorías deben ser un array de _id, no nombres.

Lista de categorías disponibles:
${categoriesString}

El formato JSON debe ser estrictamente el siguiente:
{
  "title": "Nombre del platillo deducido",
  "description": "Descripción del platillo deducido",
  "ingredients": [
    { "name": "", "amount": 0, "unit": "" }
  ],
  "steps": [
    { 
      "number": 1, 
      "text": "", 
      "duration": 0 // Duración en minutos si es posible deducirla (si no se puede deducirlo, coloca 0)
    }
  ],
  "totalTime": 0, // Tiempo total en minutos si es posible deducirla (si no se puede deducirlo, coloca 0)
  "categories": ["categoria_1", "categoria_2"]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction: context,
    },
    contents,
  });

  return response.text;
};
