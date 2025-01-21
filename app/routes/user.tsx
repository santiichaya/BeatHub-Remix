import { Outlet } from "@remix-run/react";

export default function UserPage() {
  return (
    <>
        <h1>User page con texto largo</h1>
        <Outlet />
    </>
  )
}
