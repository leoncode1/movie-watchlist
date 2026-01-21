import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getMovies, createMovie, updateMovie, deleteMovie } from "../controllers/movieController.js";


const router = express.Router();

router.get('/all', requireAuth, getMovies);
router.post('/create', requireAuth, createMovie);

router.put("/:id", requireAuth, updateMovie); 
router.delete("/:id", requireAuth, deleteMovie);

export default router;