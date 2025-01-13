import bcrypt from "bcryptjs";

export async function generate_hash(password:string){
        return bcrypt.hash(password,10);
}

export async function verifyPassword(plainPassword :string,hashedPassword: string){
    return bcrypt.compare(plainPassword,hashedPassword);
}