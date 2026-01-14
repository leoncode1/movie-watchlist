import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { getMovies, createMovie } from "../controllers/movieController.js";


const router = express.Router();

router.get('/all', requireAuth, getMovies);
router.post('/create', requireAuth, createMovie);

router.put("/", (req, res) => {
    res.json({httpMethod: "put"});
});

router.delete("/", (req, res) => {
    res.json({httpMethod: "delete"});
});

export default router;