import { ActionFunction, LoaderFunction, redirect} from '@remix-run/node';
import {NavLink, useFetcher } from '@remix-run/react'
import { useState } from 'react';
import { CloseEyeIcon, OpenEyeIcon } from '~/components/icons';
import {getUserByUsername } from '~/models/user.server';
import {verifyPassword } from '~/utils/hash';
import { commitSession, getSession } from '~/utils/session';

export const loader:LoaderFunction=async ({request})=>{
    const cookieHeader=request.headers.get("cookie");
    const session=await getSession(cookieHeader);
    console.log("Session data:", session.data);
    return null;
}
export const action : ActionFunction =async ({request})=>{
    const cookieHeader= request.headers.get("cookie"); //Recojo la cookie asociada a la sesión.
    const session= await getSession(cookieHeader); //Obtengo la sesión.
    const datosFormulario= await request.formData();

    const username=datosFormulario.get("username") as string;
    const password=datosFormulario.get("password") as string;
    const user=await getUserByUsername(username);
    console.log(user!.id);
    console.log(user!.username);
    if(user!=null){
        if(await verifyPassword(password, user.password)){
            session.set("userId",user.id); //Añado con set datos a la sesión. Tengo que especificar clave valor.
            session.set("username",user.username); //Añado con set datos a la sesión. Tengo que especificar clave valor.
            return redirect("/",{
                headers: {
                  "Set-Cookie": await commitSession(session), //Con commitSession confirmo los cambios y modifico la sesión.
                },
              });
            }
        }
        return "Contraseña no es correcta"; 
    }

export default function Login() {
    const fetcherLogin=useFetcher();
    const [typetext,setInputType]=useState<string>('password');

  return (
    <div className='w-full h-full flex flex-col justify-center items-center gap-20'>
      <h1 className='text-4xl justify-self-start'>Inicia sesion!</h1>
        <fetcherLogin.Form method="post" className='bg-secondary w-fit h-fit flex flex-col p-10 rounded-2xl items-center text-xl'>
            <label className='mt-6 w-full flex justify-between'>Username:
                <input type="text" name="username" className='w-[60%] border-2 rounded border-slate-200 focus:outline-none'/>
            </label>
            <label className='mt-6 w-full flex justify-between relative'>Password:
                <input type={typetext} name="password" className='w-[60%] border-2 rounded focus:outline-none'/>
                <button type='button' className='absolute right-[10px] top-[2px]' onMouseDown={()=>setInputType('text')} onMouseUp={()=>setInputType('password')} onMouseLeave={()=>setInputType('password')}>{typetext==='text' ?(<OpenEyeIcon/>):(<CloseEyeIcon/>)}</button>
            </label>
            <button className='mt-12 border-4 p-1 w-fit rounded-lg bg-slate-200 text-black'>Log in</button>
        </fetcherLogin.Form>
        <p>¿No tienes cuenta? <NavLink to={'/register'} className='underline'>Registrate</NavLink></p>
    </div>
  )
}
