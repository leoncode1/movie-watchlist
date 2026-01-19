import { prisma } from "../config/db.js";

export const addToWatchlist = async (req, res) => {
    try{
        const { movieId } = req.body;

        if (!movieId) {
            return res.status(400).json({message: "movieId is required."});
        }


        const watchlistItem = await prisma.watchlistItem.create({
            data: {
                userId: req.user.userId, // userId is extracted from req
                movieId,
            }
        });

        res.status(201).json(watchlistItem);

    } catch(error){
        // Duplicate entry
        if (error.code === "P2002"){
            return res.status(409).json({message: "Movie already in watchlist."});
        }

        console.error("Add to Watchlist error:", error);
        res.status(500).json({message: "Server error."});
    }
};

export const getMyWatchlist = async (req, res) => {
    try{
        const watchList = await prisma.watchlistItem.findMany({
            where: {
                userId: req.user.userId,
            },
            include: {
                movie: true,
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        res.json(watchList);
    } catch(error){
        console.error("Get Watchlist Error:", error);
        res.status(500).json({message: "Server error"});
    }
};

export const updateWatchlistItem = async(req, res) => {
    try{
        //Sets id equal to request params
        const { id } = req.params;
        //Sets the input from Client into the fields
        const { status, rating, notes} = req.body;

        // Find watchlist item & verify ownership
        const watchListItem = await prisma.watchlistItem.findFirst({
            where: {
                id,
                userId: req.user.userId,
            },
        });

        if (!watchListItem) {
            return res.status(404).json({message: "Watchlist item NOT found."});
        }

        // Update fields provided
        const updated = await prisma.watchlistItem.update({
            where: { id },
            data: {
                status,
                rating, 
                notes,
            },
        });

        res.json(updated);

    }catch(error){
        console.error("Update Watchlist Error:", error);
        res.status(500).json({message: "Server error"});
    }
};

export const deleteWatchlistItem = async (req, res) => {
    try{
        const { id } = req.params;

        const watchlistItem = await prisma.watchlistItem.findFirst({
            where: {
                id, 
                userId: req.user.userId,
            },
        });

        if(!watchlistItem){
            return res.status(404).json({message:"Watchlist item not found."})
        }

        await prisma.watchlistItem.delete({
            where: {id},
        });

        res.json({message: "Removed from watchlist"});

    } catch(error){
        console.error(500).json({message: "Server error"});
    }
}