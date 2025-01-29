import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Form, NavLink, useActionData } from "@remix-run/react";
import React, { useEffect, useState } from "react";
import { z } from "zod";
import { AcceptedIcon, CloseEyeIcon, OpenEyeIcon, RejectedIcon } from "~/components/icons";
import { createUser, getUserByEmail, getUserByUsername } from "~/models/user.server";
import { requiredLoggedOutUser } from "~/utils/auth_server";
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
    .refine((password) => {
        const transformpassword = removeAccents(password.toLowerCase());
        return !badWords.some((word: string) => transformpassword.includes(word))
    },
        { message: "No utilices palabras malsonantes" });

const RegisterSchema = z.object({
    username: z.string().min(1, "No puede estar vacío el username"),
    email: z.string().min(1, "No puedes dejar vacío el email").email("El email no es válido"),
    password: passwordSchema,
});

export const loader: LoaderFunction = async ({ request }) => {
    await requiredLoggedOutUser(request);
    return null;
}


export const action: ActionFunction = async ({ request }) => {
    await requiredLoggedOutUser(request);
    const datosFormulario = await request.formData();
    return validateForm(
        datosFormulario,
        RegisterSchema,
        async ({ username, email, password }) => { //Aquí puedo sacar directamente los name del formulario porque el validateForm devuelve en caso de éxito la función exitosa teniendo como párametro el objeto que le pasaste a zod ya validado y ajustado según el schema.
            let user = await getUserByUsername(username);
            if (user === null) {
                user = await getUserByEmail(email);
                if (user == null) {
                    const passwordHash = await generate_hash(password);
                    console.log(passwordHash);
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
                }
                return json({
                    errors: {
                        email: "El email no está disponible",
                    }
                },
                    { status: 400 });
            }
            return json({
                errors: {
                    username: "El nombre de usuario no está disponible. Pruebe otro"
                }
            },
                { status: 400 }
            );
        },
        (errors) => {
            return json(
                {
                    errors,
                    username: datosFormulario.get("username"),
                    email: datosFormulario.get("email"),
                    password: datosFormulario.get("password")
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
        if (actionData?.password != null) {
            setPassword(actionData.password);
        }
    }, [actionData]);

    return (
        <div className="h-full flex flex-col justify-center items-center">
            <h1 className="text-3xl md:text-4xl mb-12 mt-12">¡Regístrate!</h1>
            <Form
                className="bg-secondary w-[20rem] md:w-[60%] max-w-[40rem] h-fit flex flex-col p-5 rounded-xl items-center text-lg md:text-2xl mb-12"
                method="post"
                encType="multipart/form-data"
            >
                <div className="m-0 p-0 w-full border-b border-black">
                <label className="mt-6 w-full flex justify-between pb-2 items-center">
                    Usuario:
                    <input
                        type="text"
                        name="username"
                        className="w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1 h-12 text-black text-sm md:text-2xl"
                        defaultValue={actionData?.username || ""}
                    />
                    
                </label>
                {actionData?.errors?.username && (<p className="w-[100%] text-red-500">{actionData.errors.username}</p>)}
                </div>
                <div className="m-0 p-0 w-full border-b border-black">
                <label className="mt-6 w-full flex justify-between pb-2 items-center">
                    Email:
                    <input
                        type="email"
                        name="email"
                        placeholder="ejemplo@gmail.com"
                        className="w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1 h-12 text-black text-sm md:text-2xl"
                        defaultValue={actionData?.email || ""}
                    />
                    
                </label>
                {actionData?.errors?.email && (<p className="w-[100%] text-red-500">{actionData.errors.email}</p>)}
                </div>
                <div className="m-0 p-0 w-full border-b border-black">
                <label className="mt-6 w-full flex flex-col relative pb-2">
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
                                className={`w-full border-2 rounded focus:outline-none p-1 h-11 text-black ${inputType === "text" ? "text-sm md:text-md xl:text-xl" : "text-2xl"}`}
                            />
                            <button
                                type="button"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-black"
                                onMouseDown={() => setInputType("text")}
                                onMouseUp={() => setInputType("password")}
                                onMouseLeave={() => setInputType("password")}
                            >
                                {inputType === "text" ? <OpenEyeIcon /> : <CloseEyeIcon />}
                            </button>
                        </div>
                    </span>
                    {actionData?.errors?.password && (<p className="w-[100%] text-red-500">{actionData.errors.password}</p>)}
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
                </div>
                <button className="mt-12 border-4 p-1 rounded-lg bg-slate-200 text-black w-[12rem]">
                    Registrarme
                </button>
            </Form>
            <p>
                ¿Ya tienes cuenta?{" "}
                <NavLink to={"/login"} className="underline">
                    Iniciar sesión
                </NavLink>
            </p>
        </div>
    );
}