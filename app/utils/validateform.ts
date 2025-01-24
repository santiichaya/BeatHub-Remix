import { z } from "zod";

type FieldErrors = {
  [key: string]: string;
};
export function validateForm<T>(
  formData: FormData,
  zodSchema: z.Schema<T>,
  succesFn: (data: T) => unknown,
  errorsFn: (errors: FieldErrors) => unknown
) {
  const fields = Object.fromEntries(formData.entries()); //Primero convertimos el formData que no es un objeto normal de Javascript en un iterable para poder pasarselo a Object.fromEntries y así poder hacer un objeto de Javascript con las propiedades de formData y pasarselas de esa manera a nuestro schema de zod que recibe un objeto.
  const result = zodSchema.safeParse(fields);
  if (!result.success) {
    const errors: FieldErrors = {};
    result.error.issues.forEach((issue) => {
      //Va recorriendo cada objeto error que se ha producido para poder obtener su path y su message.
      const path = issue.path.join("."); //Convierte el path que es un array en cadena de texto.
      if (!errors[path]) {
        errors[path] = issue.message; //Guarda la ruta de error como clave y valor el mensaje.
      }
    });
    return errorsFn(errors);
  }
  return succesFn(result.data);
}
