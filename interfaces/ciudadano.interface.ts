export interface Ciudadano{
    rut: string;
    nombre_completo: string;
    email?: string;
    telefono: string;
    sector: string;
    calle: string;
    fecha_encuentro: Date;
    hora_encuentro: string;
    latitud?: string;
    longitud?: string;
}