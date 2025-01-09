import db from "../db.server";
import { handleDelete } from "./utils";


export function getUser(email: string) {
    return db.user.findUnique({
      where: {
        email,
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

export function deleteUser(email: string) {
    return handleDelete(async() =>{
        const user=await getUser(email);

        if(!user){
            return null;
        }

        db.user.delete({
            where: {
              email: email,
            },
          });
    });
  }

