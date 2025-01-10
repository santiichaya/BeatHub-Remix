import db from "../db.server";
import { handleDelete } from "./utils";


export function getUser(id:number) {
    return db.user.findUnique({
      where: {
        id,
      },
    });
  }

export function getAllUsers(){
    return db.user.findMany({
        orderBy:{
            id:"asc",
        }
    });
}

export function createUser(username:string,email:string,time:number=0,favoriteSongId:number|null=null){
   return db.user.create({
        data:{
            username,
            email,
            time,
            favoriteSongId,
        }
    })
}

export function deleteUser(id:number) {
    return handleDelete(async() =>{
        const user=await getUser(id);

        if(!user){
            return null;
        }

       return db.user.delete({
            where: {
              id: id,
            },
          });
    });
  }

