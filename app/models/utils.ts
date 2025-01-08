import { Prisma } from "@prisma/client";

export function handleDelete<T>(deleteFn:()=>T){
    try{
        const deleted=deleteFn;
        return deleted;
    }catch(error){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code==="P2025"){
                return error.message;
            }
            throw error;
        }
    }
}