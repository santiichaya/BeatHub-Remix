import db from "../db.server";
import { handleDelete } from "./utils";

export function getAllUsers(){
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

export function createUser(username:string,email:string,time:number,favoriteSongId:number|null=null){
    db.user.create({
        data:{
            username,
            email,
            time,
            favoriteSongId,
        }

    })
}

export function deleteUser(id: number) {
    return handleDelete(() =>
      db.pantryShelf.delete({
        where: {
          id: id,
        },
      })
    );
  }
  
