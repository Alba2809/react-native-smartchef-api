import Category from "../models/category.model.js";
import User from "../models/user.model.js";
import Recipe from "../models/recipe.model.js";
import mongoose from "mongoose";

export const insertCategories = async () => {
  const count = await Category.countDocuments();
  if (count > 0) return;

  const categories = [
    "postre",
    "desayuno",
    "almuerzo",
    "cena",
    "vegano",
    "vegetariano",
    "rápido",
    "saludable",
  ];

  for (const category of categories) {
    const newCategory = new Category({
      name: category,
    });

    await newCategory.save();
  }

  console.log("Categories inserted successfully");
};

export const insertUsers = async () => {
  try {
    // get random avatar
    const avatar = (username) =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const users = [
      {
        username: "user1",
        password: "123456",
        email: "user1@example.com",
        name: "User 1",
        avatar: avatar("user1"),
      },
      {
        username: "user2",
        password: "123456",
        email: "user2@example.com",
        name: "User 2",
        avatar: avatar("user2"),
      },
      {
        username: "user3",
        password: "123456",
        email: "user3@example.com",
        name: "User 3",
        avatar: avatar("user3"),
      },
    ];

    Promise.all(users.map((user) => User.create(user)));

    console.log("Users inserted successfully");
  } catch (error) {
    console.error("Error inserting users:", error);
  }
};


export const insertRecipes = async () => {
  try {
    // Exclude the user with the id "685b748cac596ad514d6b146"
    const users = await User.find(
      { _id: { $ne: new mongoose.Types.ObjectId("685b748cac596ad514d6b146") } },
      "_id"
    );

    if (!users.length) {
      console.error("No hay usuarios en la base de datos.");
      return;
    }

    const userIds = users.map((user) => user._id);

    const categoriesMap = {
      postre: new mongoose.Types.ObjectId("6871c82905995719894e9052"),
      desayuno: new mongoose.Types.ObjectId("6871c82905995719894e9054"),
      almuerzo: new mongoose.Types.ObjectId("6871c82905995719894e9056"),
      cena: new mongoose.Types.ObjectId("6871c82905995719894e9058"),
      vegano: new mongoose.Types.ObjectId("6871c82905995719894e905b"),
      vegetariano: new mongoose.Types.ObjectId("6871c82905995719894e905d"),
      rapido: new mongoose.Types.ObjectId("6871c82905995719894e905f"),
      saludable: new mongoose.Types.ObjectId("6871c82905995719894e9061"),
    };

    const recipes = [
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/TacosPollo_bin6z4.jpg",
        title: "Tacos de Pollo",
        description:
          "Tacos de pollo sazonado con guarnición de cebolla y cilantro.",
        ingredients: [
          { name: "Pechuga de pollo", amount: 500, unit: "g" },
          { name: "Tortillas", amount: 8, unit: "pz" },
          { name: "Cebolla", amount: 1, unit: "pz" },
          { name: "Cilantro", amount: 50, unit: "g" },
        ],
        steps: [
          {
            number: 1,
            text: "Cocina la pechuga de pollo en agua con sal hasta que esté bien cocida.",
            duration: 20,
          },
          {
            number: 2,
            text: "Deshebra el pollo y saltéalo con un poco de aceite y especias.",
            duration: 5,
          },
          { number: 3, text: "Calienta las tortillas en un sartén o comal." },
          {
            number: 4,
            text: "Sirve el pollo en las tortillas y agrega cebolla y cilantro picado.",
          },
        ],
        totalTime: 30,
        categories: [categoriesMap.almuerzo, categoriesMap.rapido],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155753/EnsaladaCesar_qxkegv.jpg",
        title: "Ensalada César Vegana",
        description: "Una versión vegana de la clásica ensalada César.",
        ingredients: [
          { name: "Lechuga romana", amount: 1, unit: "pz" },
          { name: "Pan tostado", amount: 1, unit: "taza" },
          { name: "Salsa césar vegana", amount: 0.25, unit: "taza" },
        ],
        steps: [
          { number: 1, text: "Lava y corta la lechuga romana." },
          {
            number: 2,
            text: "Mezcla con crutones de pan tostado y aderezo vegano al gusto.",
          },
        ],
        totalTime: 10,
        categories: [categoriesMap.vegano, categoriesMap.saludable],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/HotcakesAvena_yvktgo.webp",
        title: "Hotcakes de Avena",
        description: "Hotcakes saludables hechos con avena y plátano.",
        ingredients: [
          { name: "Avena", amount: 1, unit: "taza" },
          { name: "Plátano", amount: 1, unit: "pz" },
          { name: "Huevo", amount: 1, unit: "pz" },
          { name: "Leche", amount: 0.5, unit: "taza" },
        ],
        steps: [
          {
            number: 1,
            text: "Tritura el plátano y mézclalo con los demás ingredientes.",
          },
          {
            number: 2,
            text: "Cocina en sartén caliente antiadherente por ambos lados hasta que doren.",
          },
        ],
        totalTime: 15,
        categories: [
          categoriesMap.desayuno,
          categoriesMap.rapido,
          categoriesMap.saludable,
        ],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155753/EspaguetiBolo%C3%B1esa_bxbgx2.jpg",
        title: "Espagueti a la Boloñesa",
        description: "Clásico platillo italiano con salsa de carne.",
        ingredients: [
          { name: "Espagueti", amount: 250, unit: "g" },
          { name: "Carne molida", amount: 300, unit: "g" },
          { name: "Salsa de tomate", amount: 1, unit: "taza" },
          { name: "Cebolla", amount: 1, unit: "pz" },
        ],
        steps: [
          {
            number: 1,
            text: "Cuece el espagueti según las instrucciones del paquete.",
            duration: 10,
          },
          {
            number: 2,
            text: "Sofríe la carne molida con cebolla y agrega la salsa de tomate.",
            duration: 15,
          },
          { number: 3, text: "Mezcla la salsa con la pasta y sirve caliente." },
        ],
        totalTime: 30,
        categories: [categoriesMap.almuerzo, categoriesMap.cena],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155753/SmoothieVerde_eqtwsb.webp",
        title: "Smoothie Verde",
        description: "Bebida saludable y energética con espinaca y frutas.",
        ingredients: [
          { name: "Espinaca", amount: 1, unit: "taza" },
          { name: "Plátano", amount: 1, unit: "pz" },
          { name: "Manzana", amount: 1, unit: "pz" },
          { name: "Agua", amount: 1, unit: "taza" },
        ],
        steps: [
          {
            number: 1,
            text: "Coloca todos los ingredientes en la licuadora y procesa hasta obtener una mezcla homogénea.",
          },
        ],
        totalTime: 5,
        categories: [
          categoriesMap.vegano,
          categoriesMap.saludable,
          categoriesMap.rapido,
        ],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155753/EnsaladaCesar_qxkegv.jpg",
        title: "Chilaquiles Verdes",
        description:
          "Los chilaquiles verdes son un desayuno tradicional mexicano hecho con totopos bañados en salsa verde. Son crujientes por fuera, suaves por dentro y están llenos de sabor. Perfectos para comenzar el día con energía.",
        ingredients: [
          { name: "Totopos", amount: 3, unit: "tazas" },
          { name: "Salsa verde", amount: 1, unit: "taza" },
          { name: "Crema", amount: 0.25, unit: "taza" },
          { name: "Queso fresco", amount: 100, unit: "g" },
          { name: "Cebolla", amount: 0.5, unit: "pz" },
        ],
        steps: [
          {
            number: 1,
            text: "Calienta la salsa verde en una sartén hasta que comience a hervir.",
            duration: 5,
          },
          {
            number: 2,
            text: "Agrega los totopos y mezcla suavemente para que se cubran completamente sin que se deshagan.",
            duration: 3,
          },
          {
            number: 3,
            text: "Sirve con crema, queso fresco desmoronado y cebolla fileteada por encima.",
          },
        ],
        totalTime: 15,
        categories: [categoriesMap.desayuno, categoriesMap.rapido],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155753/TartaManzana_fqwlvd.jpg",
        title: "Tarta de Manzana Casera",
        description:
          "Una deliciosa tarta con relleno de manzanas dulces y un toque de canela, horneada hasta obtener una costra crujiente y dorada. Ideal como postre o acompañamiento para una tarde de café.",
        ingredients: [
          { name: "Manzanas", amount: 4, unit: "pz" },
          { name: "Azúcar", amount: 0.5, unit: "taza" },
          { name: "Canela", amount: 1, unit: "cdta" },
          { name: "Masa para tarta", amount: 1, unit: "pz" },
          { name: "Mantequilla", amount: 2, unit: "cda" },
        ],
        steps: [
          {
            number: 1,
            text: "Pela y corta las manzanas en rebanadas finas. Mezcla con azúcar y canela.",
            duration: 10,
          },
          {
            number: 2,
            text: "Extiende la masa en un molde para tarta y coloca el relleno de manzana. Agrega trozos de mantequilla encima.",
            duration: 10,
          },
          {
            number: 3,
            text: "Hornea a 180°C durante 40-45 minutos o hasta que la masa esté dorada y las manzanas suaves.",
            duration: 45,
          },
        ],
        totalTime: 65,
        categories: [categoriesMap.postre],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/WrapVege_nztqbz.jpg",
        title: "Wrap Vegetariano",
        description:
          "Wrap lleno de vegetales frescos, hummus y aderezo de yogur griego, ideal para una comida ligera pero satisfactoria.",
        ingredients: [
          { name: "Tortilla integral", amount: 1, unit: "pz" },
          { name: "Lechuga", amount: 1, unit: "hoja" },
          { name: "Zanahoria rallada", amount: 0.5, unit: "taza" },
          { name: "Pepino", amount: 0.5, unit: "pz" },
          { name: "Hummus", amount: 2, unit: "cda" },
        ],
        steps: [
          {
            number: 1,
            text: "Unta hummus sobre la tortilla. Agrega las verduras distribuidas de forma uniforme.",
          },
          {
            number: 2,
            text: "Enrolla firmemente y corta a la mitad si deseas servir en porciones más pequeñas.",
          },
        ],
        totalTime: 10,
        categories: [categoriesMap.vegetariano, categoriesMap.saludable],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/SopaLentejas_vgrvla.jpg",
        title: "Sopa de Lentejas",
        description:
          "Una sopa reconfortante y rica en proteínas, hecha con lentejas, verduras y especias que le dan un sabor profundo y hogareño. Perfecta para los días fríos.",
        ingredients: [
          { name: "Lentejas", amount: 1, unit: "taza" },
          { name: "Zanahoria", amount: 1, unit: "pz" },
          { name: "Papa", amount: 1, unit: "pz" },
          { name: "Cebolla", amount: 0.5, unit: "pz" },
          { name: "Caldo de verduras", amount: 4, unit: "tazas" },
        ],
        steps: [
          {
            number: 1,
            text: "Enjuaga las lentejas. Sofríe la cebolla y zanahoria en una olla con un poco de aceite hasta que estén suaves.",
            duration: 10,
          },
          {
            number: 2,
            text: "Agrega las lentejas, papa en cubos y el caldo. Cocina a fuego medio por 30 minutos o hasta que todo esté tierno.",
            duration: 30,
          },
          {
            number: 3,
            text: "Corrige la sazón con sal y pimienta antes de servir caliente.",
          },
        ],
        totalTime: 45,
        categories: [categoriesMap.vegano, categoriesMap.saludable],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/PizzaVege_ejdyqk.webp",
        title: "Pizza Casera con Vegetales",
        description:
          "Pizza hecha en casa con una base crujiente, salsa de tomate natural y cubierta con vegetales frescos como pimientos, champiñones y cebolla.",
        ingredients: [
          { name: "Masa para pizza", amount: 1, unit: "pz" },
          { name: "Salsa de tomate", amount: 0.5, unit: "taza" },
          { name: "Champiñones", amount: 100, unit: "g" },
          { name: "Pimiento", amount: 1, unit: "pz" },
          { name: "Cebolla", amount: 0.5, unit: "pz" },
        ],
        steps: [
          {
            number: 1,
            text: "Extiende la masa de pizza y cubre con salsa de tomate.",
          },
          {
            number: 2,
            text: "Agrega los vegetales cortados y hornea a 200°C por 15-20 minutos.",
            duration: 20,
          },
        ],
        totalTime: 30,
        categories: [categoriesMap.vegetariano, categoriesMap.cena],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/GalletasAvenaPlatano_zutdeq.jpg",
        title: "Galletas de Avena y Plátano",
        description:
          "Galletas suaves y saludables hechas solo con avena y plátano. Ideales para un snack rápido y nutritivo.",
        ingredients: [
          { name: "Plátano", amount: 2, unit: "pz" },
          { name: "Avena", amount: 1, unit: "taza" },
          { name: "Canela", amount: 0.5, unit: "cdta" },
        ],
        steps: [
          {
            number: 1,
            text: "Tritura los plátanos en un tazón grande y mezcla con la avena y la canela hasta formar una masa.",
          },
          {
            number: 2,
            text: "Coloca cucharadas de mezcla sobre una bandeja para hornear y aplana ligeramente.",
          },
          {
            number: 3,
            text: "Hornea a 180°C por 15-18 minutos o hasta que estén doradas.",
            duration: 18,
          },
        ],
        totalTime: 25,
        categories: [categoriesMap.rapido, categoriesMap.saludable],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/PanFrances_ng3fdl.jpg",
        title: "Pan Francés",
        description:
          "Rebanadas de pan remojadas en una mezcla de huevo y leche, doradas en sartén hasta quedar crujientes por fuera y suaves por dentro. Acompañado con frutas o miel.",
        ingredients: [
          { name: "Pan de caja", amount: 4, unit: "rebanadas" },
          { name: "Huevo", amount: 2, unit: "pz" },
          { name: "Leche", amount: 0.5, unit: "taza" },
          { name: "Canela", amount: 0.5, unit: "cdta" },
        ],
        steps: [
          {
            number: 1,
            text: "Mezcla el huevo, leche y canela en un tazón.",
          },
          {
            number: 2,
            text: "Remoja las rebanadas de pan y cocínalas en una sartén con mantequilla hasta dorar ambos lados.",
            duration: 8,
          },
        ],
        totalTime: 15,
        categories: [categoriesMap.desayuno, categoriesMap.rapido],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155752/BowlQuinoa_zlq3er.jpg",
        title: "Bowl de Quinoa y Verduras",
        description:
          "Un bowl nutritivo y colorido con base de quinoa, acompañado de vegetales al vapor, aguacate y aderezo de limón.",
        ingredients: [
          { name: "Quinoa cocida", amount: 1, unit: "taza" },
          { name: "Brócoli", amount: 0.5, unit: "taza" },
          { name: "Zanahoria", amount: 0.5, unit: "taza" },
          { name: "Aguacate", amount: 0.5, unit: "pz" },
          { name: "Limón", amount: 1, unit: "pz" },
        ],
        steps: [
          {
            number: 1,
            text: "Coloca la quinoa cocida en un bowl. Agrega encima las verduras cocidas al vapor y rodajas de aguacate.",
          },
          {
            number: 2,
            text: "Exprime limón por encima y añade sal al gusto.",
          },
        ],
        totalTime: 15,
        categories: [categoriesMap.vegano, categoriesMap.saludable],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155753/PolloPapas_dtglxo.jpg",
        title: "Pollo al Horno con Papas",
        description:
          "Jugoso pollo horneado con papas, sazonado con hierbas aromáticas y un toque de limón, perfecto para la cena.",
        ingredients: [
          { name: "Muslos de pollo", amount: 4, unit: "pz" },
          { name: "Papas", amount: 3, unit: "pz" },
          { name: "Limón", amount: 1, unit: "pz" },
          { name: "Romero", amount: 1, unit: "cda" },
          { name: "Ajo", amount: 2, unit: "dientes" },
        ],
        steps: [
          {
            number: 1,
            text: "Coloca el pollo y las papas en una bandeja para horno. Agrega ajo picado, jugo de limón, sal, pimienta y romero.",
          },
          {
            number: 2,
            text: "Hornea a 200°C por 45 minutos o hasta que el pollo esté dorado y las papas tiernas.",
            duration: 45,
          },
        ],
        totalTime: 60,
        categories: [categoriesMap.cena],
      },
      {
        image:
          "https://res.cloudinary.com/ddduzotbb/image/upload/v1753155753/PudinFrutas_axeock.jpg",
        title: "Pudín de Chía con Frutas",
        description:
          "Un desayuno o postre saludable y refrescante preparado con semillas de chía remojadas en leche vegetal y acompañadas con frutas frescas.",
        ingredients: [
          { name: "Semillas de chía", amount: 3, unit: "cda" },
          { name: "Leche de almendra", amount: 1, unit: "taza" },
          { name: "Fresas", amount: 5, unit: "pz" },
          { name: "Miel", amount: 1, unit: "cda" },
        ],
        steps: [
          {
            number: 1,
            text: "Mezcla las semillas de chía con la leche vegetal y deja reposar en el refrigerador por al menos 2 horas o toda la noche.",
            duration: 120,
          },
          {
            number: 2,
            text: "Sirve frío con fresas picadas y miel por encima.",
          },
        ],
        totalTime: 130,
        categories: [categoriesMap.postre, categoriesMap.saludable],
      },
    ];

    // Agrega image y user aleatorio
    const recipesWithExtra = recipes.map((recipe) => ({
      ...recipe,
      user: userIds[Math.floor(Math.random() * userIds.length)],
    }));

    await Recipe.insertMany(recipesWithExtra);

    console.log("Recetas insertadas correctamente.");
  } catch (error) {
    console.error("Error al insertar recetas:", error);
  }
};
