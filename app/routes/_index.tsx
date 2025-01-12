import { ActionFunction, LoaderFunction } from "@remix-run/node";
import {useFetcher, useLoaderData } from "@remix-run/react";
import {createUser, deleteUser, getAllUsers, } from "../models/user.server";
import React from "react";
import { User } from "@prisma/client";
import { DeleteIcon } from "~/components/icons";
import { generate_hash } from "~/utils/hash";


export const loader:LoaderFunction=async()=>{
  try {
    const usuarios= await getAllUsers();
    return usuarios;
  } catch (error) {
      console.log(error);
  }
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const datosFormulario = await request.formData();
    switch(datosFormulario.get("_action")){
      case "crear":{
        const username=datosFormulario.get("username") as string;
        const email=datosFormulario.get("email") as string;
        const password=datosFormulario.get("password") as string;
        const passwordHash= await generate_hash(password);
        console.log("Creado con éxito!!!!");
        console.log(username);
        console.log(password);
        console.log(email);
        return createUser(username,passwordHash,email);
      }
      case "eliminar":{
        const id=Number(datosFormulario.get("id_usuario"));
        console.log("Borrado con éxito!!!!");
        console.log(id);
        return deleteUser(id);
      }
      default:{
        return null;
      }
    }
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    return new Response("Error al crear el usuario", { status: 500 });
  }
};



export default function Index() {
  const usuarios=useLoaderData<typeof loader>();
  const createUserFetcher=useFetcher();
  return(
    <React.Fragment>
       <createUserFetcher.Form method="post">
          <input type="text" name="username"/>
          <input type="password" name="password"/>
          <input type="email" name="email"/>
          <input type="submit" name="_action" value="crear"/>
      </createUserFetcher.Form>
      <div>
          <h2>El usuario que tenemos ahora mismo es:</h2>
          {usuarios.map((usuario:User)=>{
            return(
              <React.Fragment key={usuario.id}>
                <ul>
                  <li>Username: {usuario.username}</li>
                  <li>Email: {usuario.email}</li>
                  <li>Fecha de registro: {new Date(usuario.createdAt).toLocaleDateString()}</li>
                  <li>Tiempo en la aplicación: {usuario.time}</li>
                  <li>Canción favorita: {usuario.favoriteSongId}</li>
                </ul>
                <createUserFetcher.Form method="post">
                <button type="submit" name="_action" value="eliminar">
                  <DeleteIcon/>
                </button>
                <input type="hidden" name="id_usuario" value={usuario.id}/>
                </createUserFetcher.Form>
              </React.Fragment>
            );
          })}   
      </div>
    </React.Fragment>
  );
}
