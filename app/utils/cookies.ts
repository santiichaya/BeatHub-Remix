import { createCookie } from "@remix-run/node";

if(!process.env.AUTH_COOKIE_SECRET){
    throw new Error("AUTH_COOKIE_SECRET is not set");
}
export const userIdCookie=createCookie("BeatHub_UserId",{
    secrets:[process.env.AUTH_COOKIE_SECRET],
    httpOnly:true,
    secure:true,
    maxAge:60*60*2 //Expira en 2 hora
});