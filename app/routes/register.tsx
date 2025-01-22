import { ActionFunction, json, redirect } from "@remix-run/node";
import { NavLink, useActionData, useFetcher } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { AcceptedIcon, CloseEyeIcon, OpenEyeIcon, RejectedIcon } from "~/components/icons";
import { createUser, getUserByUsername } from "~/models/user.server";
import { generate_hash } from "~/utils/hash";
import { commitSession, getSession } from "~/utils/session";
import { validateForm } from "~/utils/validateform";

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
    const datosFormulario = await request.formData();
    return validateForm(
        datosFormulario,
        RegisterSchema,
        async ({ username, email, password }) => { //Aquí puedo sacar directamente los name del formulario porque el validateForm devuelve en caso de éxito la función exitosa teniendo como párametro el objeto que le pasaste a zod ya validado y ajustado según el schema.
            let user = await getUserByUsername(username);
            if (user === null) {
                const passwordHash = await generate_hash(password);
                await createUser(username, passwordHash, email);
                user = await getUserByUsername(username);
                const cookieHeader = request.headers.get("cookie"); //Recojo la cookie asociada a la sesión.
                const session = await getSession(cookieHeader); //Obtengo la sesión.
                session.set("userId", user!.id);
                session.set("username", user!.username);
                return redirect("/", {
                    headers: {
                        "Set-Cookie": await commitSession(session) //Confirmar cambios
                    }
                });
            }else{
                return new Response(JSON.stringify({ error:"Este usuario ya está registrado"}), 
                {
                    status: 500,
                    headers: { 'Content-Type': 'application/json' },
                  });
            }
        },
        (errors) => {
            const username = datosFormulario.get("username") || "";
            const email = datosFormulario.get("email") || "";
            const password = datosFormulario.get("password") || "";
            return json(
                {
                  errors,
                  u: username,
                  e: email,
                  pass: password,
                },
                {
                  status: 400,
                }
              );
        }
    );
};

export default function Register() {
    const passwordValidations = [
        "Debe tener al menos 8 caracteres",
        "No debe sobrepasar los 16 caracteres",
        "Debe tener al menos una mayúscula",
        "Debe tener al menos un número",
        "No debe contener espacios",
        "La contraseña es demasiado común",
        "No utilices palabras malsonantes",
    ];
    const actionData = useActionData<typeof action>();
    const fetcherRegister = useFetcher();
    const [password, setPassword] = useState<string>("");
    const [inputType, setInputType] = useState<string>("password");
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [passwordErrors, setPasswordErrors] = useState<Array<string>>([
        "Debe tener al menos 8 caracteres",
        "Debe tener al menos una mayúscula",
        "Debe tener al menos un número",
    ]);

    function validatePassword(event: React.ChangeEvent<HTMLInputElement>) {
        const validation = passwordSchema.safeParse(event.target.value);
        if (!validation.success) {
            const erroresdeZod = validation.error.issues.map((er) => er.message);
            //Extraigo solo los mensajes de error para saber cuales son y los meto en el estado. validation.error es un objeto error que tiene una propiedad errors que es un array de objetos que contiene todos los errores, donde cada objeto representa un error de zod y por último, lo que hago es un map de errors para poder sacar cada mensaje de error de cada objeto.
            setPasswordErrors(erroresdeZod);
        } else {
            setPasswordErrors([]);
        }
        setPassword(event.target.value);
    }

    useEffect(() => {
        console.log("Entreeeee", actionData);
    }, [actionData]);

    return (
        <div className="w-full h-full flex flex-col justify-center items-center gap-20">
            <h1 className="text-4xl">¡Regístrate!</h1>
            <fetcherRegister.Form
                className="bg-secondary w-fit h-fit flex flex-col p-10 rounded-2xl items-center text-2xl"
                method="post"
            >
                <label className="mt-6 w-full flex justify-between border-b border-black pb-4 items-center">
                    Usuario:
                    <input
                        type="text"
                        name="username"
                        className="w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1 h-12"
                        defaultValue={actionData?.username || ""}
                    />
                    {actionData?.errors?.username && (<p>{actionData.errors.username}</p>)}
                </label>
                <label className="mt-6 w-full flex justify-between border-b border-black pb-4 items-center">
                    Email:
                    <input
                        type="email"
                        name="email"
                        placeholder="ejemplo@gmail.com"
                        className="w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1 h-12"
                        defaultValue={actionData?.email || ""}
                    />
                    {actionData?.errors?.email && (<p>{actionData.errors.email}</p>)}
                </label>
                <label className="mt-6 w-full flex flex-col relative border-b border-black pb-4">
                    <span className="flex justify-between items-center">
                        Contraseña:
                        <div className="relative w-[60%]">
                            <input
                                type={inputType}
                                name="password"
                                value={password}
                                onChange={validatePassword}
                                onFocus={() => setIsFocused(true)}
                                onBlur={() => setIsFocused(false)}
                                className={`w-full border-2 rounded focus:outline-none p-1 h-11 ${inputType === "text" ? "text-2xl" : "text-2xl"}`}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                onMouseDown={() => setInputType("text")}
                                onMouseUp={() => setInputType("password")}
                                onMouseLeave={() => setInputType("password")}
                            >
                                {inputType === "text" ? <OpenEyeIcon /> : <CloseEyeIcon />}
                            </button>
                        </div>
                        {actionData?.errors?.password && (<p>{actionData.errors.password}</p>)}
                    </span>
                    {isFocused && (
                        <div className="absolute top-[110%] left-0 w-full bg-gray-100 border border-gray-300 rounded-lg p-2 shadow-lg">
                            <ul className="text-sm text-gray-700 space-y-1">
                                {passwordValidations.map((validation, index) => (
                                    <li key={index} className="flex justify-between items-center">
                                        <span>{validation}</span>
                                        {passwordErrors.includes(validation) ? (
                                            <RejectedIcon />
                                        ) : (
                                            <AcceptedIcon />
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </label>
                <button className="mt-12 border-4 p-1 rounded-lg bg-slate-200 text-black w-[12rem]">
                    Registrarme
                </button>
            </fetcherRegister.Form>
            <p>
                ¿Ya tienes cuenta?{" "}
                <NavLink to={"../login"} className="underline">
                    Iniciar sesión
                </NavLink>
            </p>
        </div>
    );
}
