import { LoaderFunction, redirect } from "@remix-run/node";
import { commitSession, destroySession, getSession } from "~/utils/session";

export const loader:LoaderFunction=async({request})=>{
    const cookieHeader=request.headers.get("cookie");
    const session=await getSession(cookieHeader);
    await destroySession(session);
    return redirect("/login",{
        headers:{
            "Set-Cookie": await commitSession(session)
        }
    }) 
} 