import { ActionFunction } from '@remix-run/node';
import { redirect, useFetcher } from '@remix-run/react'
import {getUserByUsername } from '~/models/user.server';
import { userIdCookie } from '~/utils/cookies';
import {verifyPassword } from '~/utils/hash';


export const action : ActionFunction =async ({request})=>{
    const datosFormulario= await request.formData();
    const username=datosFormulario.get("username") as string;
    const password=datosFormulario.get("password") as string;
    const user=await getUserByUsername(username);
    if(user!=null){
        if(await verifyPassword(password, user.password)){
            return redirect("/", {
                headers: {
                  "Set-Cookie": await userIdCookie.serialize(user.id),
                },
              });
            }
        }
        return "Contraseña no es correcta"; 
    }

export default function Login() {
    const fetcherLogin=useFetcher();
  return (
    <>
        <fetcherLogin.Form method="post">
            <label>Username
                <input type="text" name="username"/>
            </label>
            <label>Password
                <input type="password" name="password"/>
            </label>
            <button>Log in</button>
        </fetcherLogin.Form>
    </>
  )
}
