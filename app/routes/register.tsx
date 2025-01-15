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
        } else {
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
        <div className="w-full h-full flex flex-col justify-center items-center gap-20">
            <h1 className='text-4xl justify-self-start'>Registrate!</h1>
            <fetcherRegister.Form className='bg-secondary w-fit h-fit flex flex-col p-10 rounded-2xl items-center text-xl'>
                <label className='mt-6 w-full flex justify-between'>Username:
                    <input type="text" name="username" className='w-[60%] border-2 rounded border-slate-200 focus:outline-none' />
                </label>
                <label className='mt-6 w-full flex justify-between'>Email:
                    <input type="email" name="email" placeholder="ejemplo@gmail.com" pattern="[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$" className='w-[60%] border-2 rounded border-slate-200 focus:outline-none' />
                </label>
                <label className='mt-6 w-full flex justify-between relative'>Password:
                    <input type={inputype} name="contraseña" className='w-[60%] border-2 rounded border-slate-200 focus:outline-none' />
                    <button type="button" className='absolute right-[10px] top-[4px]' onMouseDown={() => setinputype("text")} onMouseLeave={() => setinputype("password")} onMouseUp={() => setinputype("password")}>{inputype == "text" ? (<OpenEyeIcon />) : (<CloseEyeIcon />)}</button>
                </label>
                <button className='mt-12 border-4 p-1 w-fit rounded-lg bg-slate-200 text-black'>Register</button>
            </fetcherRegister.Form>
            <p>¿Ya tienes cuenta? <NavLink to={"../login"} className='underline'>Login</NavLink></p>
        </div>
    )
}