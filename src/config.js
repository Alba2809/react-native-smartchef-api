import dotenv from "dotenv";

dotenv.config();

export const TOKEN_SECRET = process.env.TOKEN_SECRET || "something secret";

export const PORT = process.env.PORT || 4000;

export const MONGO_URL = process.env.MONGO_URL || "";

export const OPENAI_KEY = process.env.OPENAI_KEY || "";

export const GEMINAI_KEY = process.env.GEMINAI_KEY || "";

export const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || "";
export const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || "";
export const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || "";