import db from "../db.server";
import { handleDelete } from "./utils";


export function getUser(id:number) {
    return db.user.findUnique({
      where: {
        id,
      },
    });
  }

  export function getUserByUsername(username:string) {
    return db.user.findUnique({
      where: {
        username,
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

export function createUser(username:string,password:string,email:string,time:number=0){
   return db.user.create({
        data:{
            username,
            password,
            email,
            time,
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

