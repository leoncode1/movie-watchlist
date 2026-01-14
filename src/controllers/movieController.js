import { prisma } from "../config/db.js";

export const getMovies = async (req, res) => {
    try{
        const movies = await prisma.movie.findMany({
            orderBy: {createdAt: "desc"},
            include: {
                creator: {
                    select: {
                        id: true, 
                        name: true
                    },
                },
            },
        });

        res.json(movies);
    } catch(error){
        console.error("Get Movies Error", error);
        res.status(500).json({message: "Server error."});
    }
}

export const createMovie = async (req, res) => {
    
    try{
        const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body;

        if (!title || !releaseYear){
            return res.status(400).json({message: "Title and Release Year are required."});
        }

        const movie = await prisma.movie.create({
           data: {
            title, 
            overview,
            releaseYear,
            genres: genres ?? [],
            runtime, 
            posterUrl,
            createdBy: req.user.userId,
           },
        });

        res.status(201).json(movie);

    } catch(error){
        console.error("Create movie error:", error);
        res.status(500).json({message: "Server error"});
    }
};