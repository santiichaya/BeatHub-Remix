import { ActionFunction } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import {createUser} from "../models/user.server";

export const action:ActionFunction=async({request})=>{
  const formData=await request.formData();
  const username=formData.get("username") as string;
  const email=formData.get("email") as string;
  return createUser(username,email);
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
