import { ActionFunction, redirect } from "@remix-run/node";
import { NavLink, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { CloseEyeIcon, OpenEyeIcon } from "~/components/icons";
import { createUser, getUserByUsername } from "~/models/user.server";
import { generate_hash } from "~/utils/hash";
import { commitSession, getSession } from "~/utils/session";


export const action: ActionFunction = async ({ request }) => {
        const cookieHeader= request.headers.get("cookie"); //Recojo la cookie asociada a la sesión.
        const session= await getSession(cookieHeader); //Obtengo la sesión.
        console.log(session);
    try {
        const datosFormulario = await request.formData();
        const username = datosFormulario.get("username") as string;
        let user = await getUserByUsername(username);
        if (user === null) {
            const email = datosFormulario.get("email") as string;
            console.log(email);
            const password = datosFormulario.get("password") as string;
            console.log(password);
            const passwordHash = await generate_hash(password);
            await createUser(username, passwordHash, email);
            console.log("Antes de obtenerlo:", user);
            user=await getUserByUsername(username);
            console.log(user);
            session.set("userId",user!.id);
            session.set("username",user!.username);
            return redirect("/",{
                headers:{
                    "Set-Cookie": await commitSession(session) //Confirmar cambios
                }
            }); 
        }
        return null

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return new Response("Error al crear el usuario", { status: 500 });
    }
};

export default function Register() {
    const fetcherRegister = useFetcher();
    const [inputype, setinputype] = useState<string>("password");
    return (
        <>
            <fetcherRegister.Form method="post">
                <label>Username:
                    <input type="text" name="username"/>
                </label>
                <label>Email:
                    <input type="email" name="email" placeholder="jorgemodric8@gmail.com" pattern="[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$" />
                </label>
                <label>Password:
                    <input type={inputype} name="password"/>
                    <button type="button" onMouseDown={() => setinputype("text")} onMouseLeave={() => setinputype("password")} onMouseUp={() => setinputype("password")}>{inputype=="text" ? (<OpenEyeIcon />):(<CloseEyeIcon/>)}</button>
                </label>
                <input type="submit" value="Register"/>
            </fetcherRegister.Form>
            <div>
                <p>¿Ya tienes cuenta?</p>
                <NavLink to={"../login"}>Login</NavLink>
            </div>
        </>
    )
}