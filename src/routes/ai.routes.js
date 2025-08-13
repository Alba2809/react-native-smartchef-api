import express from "express";
import {
  processWithOCR,
  processWithNewIdea,
  processWithImage,
} from "../controllers/ai.controller.js";
import protectRoute from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/ocr", protectRoute, processWithOCR);
router.post("/newidea", protectRoute, processWithNewIdea);
router.post("/withimage", protectRoute, processWithImage);

export default router;
