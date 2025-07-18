import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
// import { generateJSONGeminai } from './lib/aiProcess.js';

// import insertCategories from './lib/insertCategories.js';

// insertCategories()


const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/recipe', recipeRoutes);
app.use('/api/favorite', favoriteRoutes);

// generateJSONGeminai("Una receta de cocina rápida para un plato de pollo y vegetales")

export default app;