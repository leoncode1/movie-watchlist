import { PrismaClient } from "@prisma/client";
// "./client/extension"

export const prisma = new PrismaClient();

// const prisma = new PrismaClient({
//     log: 
//         process.env.NODE_ENV === "development"
//             ? ["query", "error", "warn"]
//             : ["error"], 
// });

// const connectDB = async () => {
//     try {
//         await prisma.$connect();
//         console.log("DB connected via Prisma");
//     } catch(error){
//         console.error(`Database Connection Error: $${error.message}`);
//         process.exit(1);
//     }
// };

// const disconnectDB = async () => {
//     await prisma.$disconnect();
// };

// export { prisma, connectDB, disconnectDB };
