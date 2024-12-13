import db from "../db.server";

export function getAllArtists(){
    return db.user.findMany({
        orderBy:{
            id:"asc",
        }
    });
} 

export function getUserById(query:string|null){
    return db.user.findUnique({
        where:{
            username:{
                contains: query ?? null,
                mode: "insensitive",
            }
        }
    }
    );
}