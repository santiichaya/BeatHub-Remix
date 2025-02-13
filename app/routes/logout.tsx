import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import Swal from "sweetalert2";
import { requiredLoggedInUser } from "~/utils/auth_server";
import { commitSession, getSession } from "~/utils/session";


export const loader: LoaderFunction = async ({ request }) => {
    await requiredLoggedInUser(request); //Se encarga de redirigir en caso de borrar la sesión.
    return null;
}

export const action: ActionFunction = async ({ request }) => {
    const datosFormulario = await request.formData();
    if (datosFormulario.get("action")=="logout") { //Destruye la sesión
        const cookie = request.headers.get("cookie");
        const session = await getSession(cookie);
        session.unset("userId"); //Borro el id del usuario
        session.unset("username"); //Borro el nombre del usuario
        return json("ok",
            {
                headers: { "Set-Cookie": await commitSession(session) },
            }
        )
    }
    return redirect("/"); //Reenvía al index en caso de cancelar
}

export default function Logout() {
    const fetcher = useFetcher();
    useEffect(() => {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: "btn btn-success",
                cancelButton: "btn btn-danger"
            },
            buttonsStyling: false
        });

        // Muestra la alerta de confirmación
        swalWithBootstrapButtons
            .fire({
                title: "Estás seguro?",
                text: "Te irás de BeatHub",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Sí, salir",
                cancelButtonText: "No, cancelar",
                reverseButtons: true
            })
            .then((result) => {
                if (result.isConfirmed) {
                    // Alerta de éxito si se confirma la salida
                    swalWithBootstrapButtons.fire({
                        title: "Saliendo...",
                        text: "Vuelva pronto, de parte del equipo de BeatHub.",
                        icon: "success",
                        confirmButtonText: "OK"
                    }).then(() => {
                        //Lanzo el formulario yo de forma manual con el fetcher
                        fetcher.submit(
                            { action: "logout" }, //Un campo action con valor logout para que el action sepa si tiene que borrar la sesión o no.
                            { method: "post", action: "/logout" }
                        )
                    });
                } else if (result.dismiss === Swal.DismissReason.cancel) {
                    // Alerta si se cancela la salida
                    swalWithBootstrapButtons.fire({
                        title: "Cancelado",
                        text: "Sigue disfrutando de BeatHub.",
                        icon: "error"
                    }).then(() => {
                        //Lanzo el formulario yo de forma manual con el fetcher
                        fetcher.submit(
                            { action: "login" }, //Un campo action con valor login para que el action sepa si tiene que borrar la sesión o no.
                            { method: "post", action: "/logout" }
                        )
                    });
                }
            });
    }, []);

    return null;

}