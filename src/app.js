import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.routes.js';
import recipeRoutes from './routes/recipe.routes.js';
import favoriteRoutes from './routes/favorite.routes.js';
import aiRoutes from './routes/ai.routes.js';
// import { generateJSONGeminai } from './lib/aiProcess.js';

// import { insertRecipes } from './lib/testData.js';

// insertRecipes()


const app = express();

app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/category', categoryRoutes);
app.use('/api/recipe', recipeRoutes);
app.use('/api/favorite', favoriteRoutes);
app.use('/api/ai', aiRoutes);

// generateJSONGeminai("Una receta de cocina rápida para un plato de pollo y vegetales")

export default app;