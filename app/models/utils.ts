import { Prisma } from "@prisma/client";

export async function handleDelete<T>(deleteFn:()=>Promise<T>): Promise<string|boolean>{
    try{
        await deleteFn();
        return true;
    }catch(error){
        if(error instanceof Prisma.PrismaClientKnownRequestError){
            if(error.code==="P2025"){
                return error.message;
            }
        }
        throw error;
    }
}