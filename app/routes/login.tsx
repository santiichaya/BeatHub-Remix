import { ActionFunction, LoaderFunction, redirect} from '@remix-run/node';
import {useFetcher } from '@remix-run/react'
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
  return (
    <>
        <fetcherLogin.Form method="post">
            <label>Username
                <input type="text" name="username"/>
            </label>
            <label>Password
                <input type="password" name="password"/>
            </label>
            <button type="submit">Log in</button>
        </fetcherLogin.Form>
    </>
  )
}
