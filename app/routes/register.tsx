import { ActionFunction, redirect } from "@remix-run/node";
import { NavLink, useFetcher } from "@remix-run/react";
import React, { useState } from "react";
import { z } from "zod";
import { AcceptedIcon, CheckedIcon, CloseEyeIcon, OpenEyeIcon, RejectedIcon } from "~/components/icons";
import { createUser, getUserByUsername } from "~/models/user.server";
import { generate_hash } from "~/utils/hash";
import { commitSession, getSession } from "~/utils/session";

const badWords = [
    "polla", "coño", "puta", "gilipollas", "cabrón", "mierda",
    "zorra", "maricón", "puto", "imbécil", "estúpido", "culo",
    "cojones", "follar"];

//Función para eliminar tildes
const removeAccents = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, ""); //Normalize con el valor NFD lo que hace es tratar a las tildes 
};


const passwordSchema = z.string().min(8, { message: "Debe tener al menos 8 caracteres" })
    .max(16, { message: "No debe sobrepasar los 16 caracteres" })
    .refine((password) => /[A-Z]/.test(password), { message: "Debe tener al menos una mayúscula" })
    .refine((password) => /\d/.test(password), { message: "Debe tener al menos un número" })
    .refine((password) => !/\s/.test(password), { message: "No debe contener espacios" })
    .refine((password) => !["123456", "password", "qwerty"].includes(password), { message: "La contraseña es demasiado común" })
    .transform((password) => removeAccents(password.toLowerCase()))
    .refine((password) => !badWords.some((word: string) => password.includes(word)), { message: "No utilices palabras malsonantes" });

const RegisterSchema = z.object({
    username: z.string().min(1, "No puede estar vacío el campo"),
    email: z.string().min(1, "No puedes dejar vacío el email").email(),
    password: passwordSchema,
});



export const action: ActionFunction = async ({ request }) => {
    const cookieHeader = request.headers.get("cookie"); //Recojo la cookie asociada a la sesión.
    const session = await getSession(cookieHeader); //Obtengo la sesión.
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
            user = await getUserByUsername(username);
            console.log(user);
            session.set("userId", user!.id);
            session.set("username", user!.username);
            return redirect("/", {
                headers: {
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
    //Quiero hacer un array con todas las validaciones del passwordSchema
    const passwordValidations = [
        "Debe tener al menos 8 caracteres",
        "No debe sobrepasar los 16 caracteres",
        "Debe tener al menos una mayúscula",
        "Debe tener al menos un número",
        "No debe contener espacios",
        "La contraseña es demasiado común",
        "No utilices palabras malsonantes",
    ];
    const fetcherRegister = useFetcher();
    const [password, setPassword] = useState<string>("");
    const [inputType, setInputType] = useState<string>('password');
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [passwordErrors,setPasswordErrors]=useState<Array<string>>(["Debe tener al menos 8 caracteres","Debe tener al menos una mayúscula","Debe tener al menos un número"]);

    function validatePassword(event: React.ChangeEvent<HTMLInputElement>) {
        const validation = passwordSchema.safeParse(event.target.value);
        if(!validation.success){
            const erroresdeZod=validation.error?.errors.map(er=>er.message); //Extraigo solo los mensajes de error para saber cuales son y los meto en el estado. validation.error es un objeto error que tiene una propiedad errors que es un array de objetos que contiene todos los errores, donde cada objeto representa un error de zod y por último, lo que hago es un map de errors para poder sacar cada mensaje de error de cada objeto.
            setPasswordErrors(erroresdeZod);
        }else{
            setPasswordErrors([]);
        }
        setPassword(event.target.value);
    }
    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-20">
            <h1 className='text-4xl justify-self-start'>Registrate!</h1>
            <fetcherRegister.Form className='bg-secondary w-fit h-fit flex flex-col p-10 rounded-2xl items-center text-xl' method="post">
                <label className='mt-6 w-full flex justify-between border-b border-black pb-4 items-center'>Usuario:
                    <input type="text" name="username" className='w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1 h-12' />
                </label>
                <label className='mt-6 w-full flex justify-between border-b border-black pb-4 items-center'>Email:
                    <input type="email" name="email" placeholder="ejemplo@gmail.com" pattern="[a-z0-9._%+-]+@[a-z0-9-]+\.[a-z]{2,}$" className='w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1 h-12' />
                </label>
                <label className='mt-6 w-full flex justify-between relative border-b border-black pb-4 items-center'>Contraseña:
                    <div className="relative w-[60%]">
                        <input type={inputType} name="password" value={password} onChange={validatePassword} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="w-full border-2 rounded border-slate-200 focus:outline-none p-1 h-12" />
                        <button type="button" className="absolute right-2 top-1/2 transform -translate-y-1/2"
                            onMouseDown={() => setInputType("text")} onMouseLeave={() => setInputType("password")} onMouseUp={() => setInputType("password")}>{inputType == "text" ? (<OpenEyeIcon />) : (<CloseEyeIcon />)}
                        </button>
                        {isFocused && (
                            <div className="absolute top-[110%] left-0 w-full bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg">
                                <ul className="text-[0.6rem] text-gray-700">
                                    {passwordValidations.map((validation, index) => (
                                            <li key={index} className="flex flex-col gap-2">{validation}
                                            {passwordErrors.includes(validation)?(<RejectedIcon/>):(<AcceptedIcon />)}
                                            </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </label>
                <button className='mt-12 border-4 p-1 rounded-lg bg-slate-200 text-black w-[12rem]'>Registrarme</button>
            </fetcherRegister.Form>
            <p>¿Ya tienes cuenta? <NavLink to={"../login"} className='underline'>Iniciar sesion</NavLink></p>
        </div>
    )
}