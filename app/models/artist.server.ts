import { PrismaClient } from "@prisma/client";

const db = new PrismaClient()

export function getAllArtists() {
    return db.user.findMany({
        orderBy: {
            id: "asc",
        }
    });
}

// export function getUserById(query: string | null) {
//     return db.user.findUnique({
//         where: {
//             id: {
//                 contains: query ?? null,
//                 mode: "insensitive",
//             }
//         }
//     }
//     );
// }