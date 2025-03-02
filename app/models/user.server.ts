import db from "../db.server";
import { handleDelete } from "./utils";


export function getUserById(id:string) {
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

  export function getUserByEmail(email:string){
    return db.user.findUnique({
      where:{
        email,
      },
    })
  }


export function getAllUsers(){
    return db.user.findMany({
        orderBy:{
            id:"asc",
        }
    });
}

export function createUser(username:string,password:string,email:string){
   return db.user.create({
        data:{
            username,
            password,
            email,
        }
    })
}

export function deleteUser(id:string) {
    return handleDelete(async() =>{
        const user=await getUserById(id);

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

  
