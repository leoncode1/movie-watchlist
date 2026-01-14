// //In package.json, modified type to 'module'
// //to use this notation.
// import express from "express";
// import { config } from 'dotenv';
// import { connectDB, disconnectDB } from './config/db.js';

// // Import routes
// import movieRoutes from "./routes/movieRoutes.js";
// import authRoutes  from "./routes/auth/authRoutes.js";

// config();
// connectDB();

// const app = express();

// // API Routes
// app.use("/movies", movieRoutes);
// app.use("/auth", authRoutes);

// app.get('/hello', (req, res) => { //request, response
//     res.json({message: "Hello World!"});
// });

// const PORT = 5001;
// const server = app.listen(PORT, () =>{
//     console.log(`Hello, server running on Port ${PORT}.`);
// });

// // Handles unhandled promise rejections (e.g. DB connection errors)
//  process.on("unhandledRejection", (err) => {
//     console.error("Unhandled Rejection:", err);
//     server.close(async () => {
//         await disconnectDB();
//         process.exit(1);
//     });
//  });

//  // Handles uncaught exceptions
//  process.on("uncaughtException", async (err) => {
//     console.error("Uncaught Exception:", err);
//     await disconnectDB();
//     process.exit(1);
//  });

//  // Graceful shutdown
//  process.on("SIGTERM", async () => {
//     console.log("SIGTERM received, shutting down gracefully (:");
//     server.close(async () => {
//         await disconnectDB();
//         process.exit(0);
//     });
//  });
import express from "express";
import { config } from "dotenv";
import { prisma } from "./config/db.js";

// Import routes
import movieRoutes from "./routes/movieRoutes.js";
import authRoutes from "./routes/auth/authRoutes.js";
import watchlistRoutes from "./routes/watchlistRoutes.js";


config();

const app = express();

//Enables req.body
//Needed for POST endpoints (Middleware belongs at app level, NOT routes)
app.use(express.json());

// API Routes
app.use("/movies", movieRoutes);
app.use("/auth", authRoutes);
app.use("/watchlist", watchlistRoutes);


app.get("/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

const PORT = 5001;

const server = app.listen(PORT, () => {
  console.log(`Hello, server running on Port ${PORT}.`);
});

/* =========================
   Graceful Shutdown Handling
   ========================= */

// Prisma should only disconnect when process is ending.
// Connect Automatically / Disconnect Intentionally
const shutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully...`);
  await prisma.$disconnect();
  server.close(() => process.exit(0));
};

// Production platform trigger for shutdown
process.on("SIGTERM", shutdown);
// Ctrl + C trigger shutdown
process.on("SIGINT", shutdown);

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await prisma.$disconnect();
  process.exit(1);
});

process.on("unhandledRejection", async (err) => {
  console.error("Unhandled Rejection:", err);
  await prisma.$disconnect();
  process.exit(1);
});

