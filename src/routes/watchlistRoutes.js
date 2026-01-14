import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { addToWatchlist, getMyWatchlist, updateWatchlistItem } from "../controllers/watchlistController.js";

const router = express.Router();

router.post('/add-to-watchlist', requireAuth, addToWatchlist);
router.get('/my-watchlist', requireAuth, getMyWatchlist);

router.patch(
    "/:id",
    requireAuth,
    updateWatchlistItem
);

export default router;