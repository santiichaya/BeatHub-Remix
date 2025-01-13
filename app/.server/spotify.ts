let token: string; 
//Almacena el token de autenticación actual. Si el token expira, se sobrescribe con uno nuevo.

let fechaUltima: Date; 
//Registra la fecha y hora en que se obtuvo el último token. Se utiliza para calcular si el token es válido.

export async function getSpotifyToken() {
    const haceMediaHora = new Date(); 
    //Instancia que representa el momento actual.

    haceMediaHora.setMinutes(haceMediaHora.getMinutes() - 30); 
    //Se ajusta el objeto de fecha restando 30 minutos, estableciendo un límite para considerar si el token está caducado.

    const tokenPedidoHaceMenosDeMediaHora = token && haceMediaHora < fechaUltima; 
    // Comprueba dos condiciones:
    // 1. Si ya existe un token almacenado.
    // 2. Si la última vez que se obtuvo el token fue dentro de los últimos 30 minutos.

    if (tokenPedidoHaceMenosDeMediaHora) {
        return token; 
        // Si el token es válido y fue obtenido hace menos de 30 minutos, lo reutiliza devolviéndolo.
        // Esto evita realizar una nueva solicitud a la API de Spotify.
    }

    const res = await fetch('https://accounts.spotify.com/api/token', { 
        //Solicitud HTTP `POST` al endpoint de autenticación de Spotify para obtener un nuevo token.
        method: 'POST', 
        body: new URLSearchParams({
            'grant_type': 'client_credentials', 
            // Proporciona el tipo de credenciales necesarias para obtener un token de cliente.
        }),
        headers: { 
            'Content-Type': 'application/x-www-form-urlencoded', 
            // Define el formato del cuerpo de la solicitud.
            'Authorization': 
                'Basic ' + (Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64')), 
            // Incluye en la cabecera el campo Authorization, codificado en Base64 con las credenciales de cliente.
        },
    });

    const jsonRes = await res.json(); 
    //Se convierte la respuesta de la API a formato JSON

    if ('access_token' in jsonRes) { 
        // Verifica si la respuesta JSON contiene un campo `access_token` con el token solicitado.

        fechaUltima = new Date(); 
        // Actualizamos `fechaUltima` con la fecha y hora actuales para registrar el momento de la renovación del token.

        token = jsonRes.access_token; 
        //Sobrescribe la variable global `token` con el nuevo token obtenido de la API, limpiando implícitamente el token antiguo.

        return token; 
        //Devuelve el token recién obtenido para que pueda ser utilizado en otras solicitudes.
    }

    return null; 
    // Si no se obtiene un token válido, devuelve `null`. Esto permite manejar errores en las solicitudes a la API de Spotify.
}
