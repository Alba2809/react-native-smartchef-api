import ollama from "ollama";
import { GoogleGenAI } from "@google/genai";
import { GEMINAI_KEY } from "../config.js";
import Category from "../models/category.model.js";

export const generateJSONOllama = async (rawText) => {
  console.log("Generando respuesta...");
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

  console.log(response.message.content);
};

const ai = new GoogleGenAI({
  apiKey: GEMINAI_KEY,
});

export const generateJSONGeminai = async (rawText) => {
  const categories = await Category.find();
  const categoriesString = categories.map((category) => category.name).join(", ");

  console.log("generando json con ai...")
  
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    config: {
      systemInstruction:
        `Eres un asistente que convierte recetas en texto plano a JSON estructurado para una app de cocina. Usando Español como lenguaje natural. Aquellos datos que no estén en el texto original, deberás llenarlos con valores que sean posibles respetando el formato JSON. El formato JSON debe ser el siguiente: 
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
