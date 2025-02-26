import { ActionFunction, json, LoaderFunction, redirect } from '@remix-run/node';
import { Form, NavLink, useActionData} from '@remix-run/react'
import { useState } from 'react';
import { z } from 'zod';
import { CloseEyeIcon, OpenEyeIcon } from '~/components/icons';
import { getUserByUsername } from '~/models/user.server';
import { requiredLoggedOutUser } from '~/utils/auth_server';
import {verifyPassword } from '~/utils/hash';
import { commitSession, getSession } from '~/utils/session';
import { validateForm } from '~/utils/validateform';

const LoginSchema = z.object({
  username: z.string().min(1, "No puede estar vacío el username"),
  password: z.string().min(1, "No puedes dejar vacío el password")
});

export const loader:LoaderFunction=async({request})=>{
  await requiredLoggedOutUser(request);
  return null;
}

export const action: ActionFunction = async ({ request }) => {
  await requiredLoggedOutUser(request);
  const datosFormulario = await request.formData();
  return validateForm(
    datosFormulario,
    LoginSchema,
    async ({ username, password }) => {
      const user = await getUserByUsername(username);
      if (user !== null) {
        if (await verifyPassword(password, user.password)) {
          const cookieHeader = request.headers.get("cookie"); //Recojo la cookie asociada a la sesión.
          const session = await getSession(cookieHeader); //Obtengo la sesión.
          session.set("userId", user.id); //Añado con set datos a la sesión. Tengo que especificar clave valor.
          session.set("username", user.username); //Añado con set datos a la sesión. Tengo que especificar clave valor.
          return redirect("/", {
            headers: {
              "Set-Cookie": await commitSession(session), //Con commitSession confirmo los cambios y modifico la sesión.
            },
          });
        }
        return json({
          errors:{
            password:"No coincide la contraseña con el usuario"
          } 
        },
          {status:400});
      }
        return json({
          errors:{
              username:"No se encuentra el usuario. Pruebe otra vez"
          }
        },
        {status:400})
    },
    (errors)=>
      json({
        errors,
        username:datosFormulario.get("username"),
        password:datosFormulario.get("password")
      },
      {status:400})
  )
}

export default function Login() {
  const actionData=useActionData<typeof action>();
  const [password, setPassword] = useState<string>("");
  const [inputType, setInputType] = useState<string>('password');

  function validatePassword(event: React.ChangeEvent<HTMLInputElement>) {
    setPassword(event.target.value);
  }

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-20'>
      <h1 className='text-4xl justify-self-start mt-12'>¡Inicia sesión!</h1>

      <Form
        method="post"
        className='bg-secondary w-[20rem] md:w-[45%] h-[60%] flex flex-col p-4 rounded-2xl items-center justify-evenly text-lg md:text-2xl text-text-primary'>
          <div className="m-0 p-0 w-full border-b border-black">
        <label className='mt-6 w-full flex justify-between pb-4 items-center'>
          Username:
          <input
            type="text"
            name="username"
            className='w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1 h-12 text-black text-sm md:text-2xl'
            defaultValue={actionData?.username}/>
        </label>
        {actionData?.errors?.username && (<p className='w-full text-red-500'>{actionData.errors.username}</p>)}
        </div>
        <div className="m-0 p-0 w-full border-b border-black">
        <label className='mt-6 w-full flex justify-between relative pb-4 items-center'>Password:
          <input type={inputType} name="password" value={password} onChange={validatePassword} className={`w-[60%] border-2 rounded focus:outline-none p-1 text-black ${inputType === "text" ? "sm:text-sm md:text-xl h-11" : "text-3xl h-11"}`} />
          <button type='button' className='absolute right-[10px] top-[10px] text-black' onMouseDown={() => setInputType('text')} onMouseUp={() => setInputType('password')} onMouseLeave={() => setInputType('password')}>{inputType === 'text' ? (<OpenEyeIcon />) : (<CloseEyeIcon />)}</button>
        </label>
        {actionData?.errors?.password && (<p className='text-red-500'>{actionData.errors.password}</p>)}
        </div>
        
        <button className='mt-12 border-4 p-1 rounded-lg bg-slate-200 text-black w-[12rem]'>Log in</button>
      </Form>
      <p>¿No tienes cuenta? <NavLink to={'/register'} className='underline'>Registrate</NavLink></p>
    </div>
  )
}