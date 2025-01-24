import { ActionFunction, json, redirect } from '@remix-run/node';
import { Form, NavLink, useActionData} from '@remix-run/react'
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { CloseEyeIcon, OpenEyeIcon } from '~/components/icons';
import { getUserByUsername } from '~/models/user.server';
import { verifyPassword } from '~/utils/hash';
import { commitSession, getSession } from '~/utils/session';
import { validateForm } from '~/utils/validateform';

const LoginSchema = z.object({
  username: z.string().min(1, "No puede estar vacío el username"),
  password: z.string().min(1, "No puedes dejar vacío el password")
});

export const action: ActionFunction = async ({ request }) => {
  const datosFormulario = await request.formData();
  return validateForm(
    datosFormulario,
    LoginSchema,
    async ({ username, password }) => {
      const user = await getUserByUsername(username);
      if (user != null) {
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

  useEffect(()=>{
    if(actionData?.password!=null){
      setPassword(actionData.password);
    }
  },[actionData])

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-20'>
      <h1 className='text-4xl justify-self-start'>Inicia sesion!</h1>

      <Form
        method="post"
        className='bg-secondary w-[45%] h-[60%] flex flex-col p-10 rounded-2xl items-center justify-evenly text-2xl'>
        <label className='mt-6 w-full flex justify-between border-b border-black pb-4 items-center'>
          Username:
          <input
            type="text"
            name="username"
            className='w-[60%] border-2 rounded border-slate-200 focus:outline-none p-1' 
            defaultValue={actionData?.username}/>
        </label>
        {actionData?.errors?.username && (<p>{actionData.errors.username}</p>)}
        <label className='mt-6 w-full flex justify-between relative border-b border-black pb-4 items-center'>Password:
          <input type={inputType} name="password" value={password} onChange={validatePassword} className={`w-[60%] border-2 rounded focus:outline-none p-1 ${inputType === "text" ? "text-xl h-11" : "text-3xl h-11"}`} />
          <button type='button' className='absolute right-[10px] top-[10px]' onMouseDown={() => setInputType('text')} onMouseUp={() => setInputType('password')} onMouseLeave={() => setInputType('password')}>{inputType === 'text' ? (<OpenEyeIcon />) : (<CloseEyeIcon />)}</button>
        </label>
        {actionData?.errors?.password && (<p>{actionData.errors.password}</p>)}
        <button className='mt-12 border-4 p-1 rounded-lg bg-slate-200 text-black w-[20rem]'>Log in</button>
      </Form>
      <p>¿No tienes cuenta? <NavLink to={'/register'} className='underline'>Registrate</NavLink></p>
    </div>
  )
}
