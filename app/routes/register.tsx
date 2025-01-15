import { ActionFunction } from "@remix-run/node";
import { NavLink, useFetcher } from "@remix-run/react";
import { useState } from "react";
import { CloseEyeIcon, OpenEyeIcon } from "~/components/icons";
import { createUser, getUserByUsername } from "~/models/user.server";
import { generate_hash } from "~/utils/hash";

export const action: ActionFunction = async ({ request }) => {
    try {
        const datosFormulario = await request.formData();
        const username = datosFormulario.get("username") as string;
        const user = await getUserByUsername("username");
        if (user != null) {
            const email = datosFormulario.get("email") as string;
            const password = datosFormulario.get("password") as string;
            const passwordHash = await generate_hash(password);
            console.log("Creado con éxito!!!!");
            console.log(username);
            console.log(password);
            console.log(email);
            await createUser(username, passwordHash, email);
        }else{
            return null;
        }

    } catch (error) {
        console.error("Error al crear el usuario:", error);
        return new Response("Error al crear el usuario", { status: 500 });
    }
};

export default function Register() {
    const fetcherRegister = useFetcher();
    const [inputype, setinputype] = useState<string>("password");
    return (
        <div className="h-full w-full">
            <fetcherRegister.Form>
                <label>Username:
                    <input type="text" name="username" />
                </label>
                <label>Email:
                    <input type="email" name="email" placeholder="ejemplo@gmail.com" pattern="[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$" />
                </label>
                <label>Password:
                    <input type={inputype} name="contraseña" />
                    <button type="button" onMouseDown={() => setinputype("text")} onMouseLeave={() => setinputype("password")} onMouseUp={() => setinputype("password")}>{inputype ? (<OpenEyeIcon />) : (<CloseEyeIcon />)}</button>
                </label>
                <button>Register</button>
            </fetcherRegister.Form>
            <p>¿Ya tienes cuenta? <NavLink to={"../login"}>Login</NavLink></p>
        </div>
    )
}