export function random_colour(): string {
    // Genera un número aleatorio entre 0 y 16777215 (0xFFFFFF en hexadecimal)
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    // Asegura que el color tenga 6 dígitos, rellenando con ceros si es necesario
    return `#${randomColor.padStart(6, '0')}`;
}
