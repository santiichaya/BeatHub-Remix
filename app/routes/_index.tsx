import { ActionFunction, LoaderFunction, LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {createUser} from "../models/user.server";

export const loader:LoaderFunction=async({request}:LoaderFunctionArgs)=>{
    const formData=await request.formData();

};

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const username = formData.get("username") as string;
    const email = formData.get("email") as string;
    
    // Llamar a la función createUser
    await createUser(username, email);
    
    console.log("Usuario creado:", username, email);
    return null; // Redirigir o devolver algún tipo de respuesta
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return new Response("Error al crear el usuario", { status: 500 });
  }
};



export default function Index() {
  const createUserFetcher=useFetcher();
  return(
    <createUserFetcher.Form method="post">
      <input type="text" name="username"/>
      <input type="email" name="email"/>
      <input type="submit"/>
    </createUserFetcher.Form>
  );
}
