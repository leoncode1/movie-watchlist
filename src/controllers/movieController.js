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

export const updateMovie = async (req, res) => {
    try{
        const { id } = req.params;
        const { title, overview, releaseYear } = req.body;

        //Find movie & verify ownership
        const movie = await prisma.movie.findFirst({
            where: {
                id, 
                createdBy: req.user.userId,
            },
        });

        if(!movie){
            return res.status(404).json({message:"Movie not found or unauthorized."});
        }

        const updated = await prisma.movie.update({
            where: { id },
            data: {
                title, 
                overview,
                releaseYear,
            },
        });

        res.json(updated);

    }catch(error){
        console.error("Update movie error:", error);
        res.status(500).json({message: "Server error."});
    };
};

export const deleteMovie = async (req, res) => {
    
    try{
        const { id } = req.params;

        const movie = await prisma.movie.findFirst({
            where: {
                id,
                createdBy: req.user.userId,
            },
        });

        if (!movie){
            return res.status(404).json({message: "Movie not found or unauthorized."});
        }

        await prisma.movie.delete({
            where: {id}
        });

        res.status(204).send();

    }catch(error){
        console.error("Delete movie error:", error);
        res.status(500).json({message: "Server error."});
    }

};