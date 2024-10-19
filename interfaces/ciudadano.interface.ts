import { DateValue } from "@nextui-org/calendar";
import { FieldValue, Timestamp } from "firebase/firestore";

export interface Ciudadano{
    rut: string;
    nombre_completo: string;
    email?: string;
    telefono: string;
    sector: string;
    calle: string;
    fecha_encuentro: Date;
    hora_encuentro: Date;
    latitud_sector?: number;
    longitud_sector?: number;
    latitud_mapa?: number;
    longitud_mapa?: number;
    created_at?: Timestamp | FieldValue;
    update_at?: Timestamp | FieldValue;
}