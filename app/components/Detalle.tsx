"use client";

import { Ciudadano } from "@/interfaces/ciudadano.interface";
import { Button } from "@nextui-org/button";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@nextui-org/table";
import { useEffect, useState } from "react";
import { useDateFormatter } from "@react-aria/i18n";
import { Props } from "../interfaces/props.interface";
import toast from "react-hot-toast";

const Detalle = ({ onPrevious, onNext }: Props) => {
  const [ciudadano, setCiudadano] = useState<Ciudadano>();
  const [isLoading, setIsLoading] = useState(false);

  function obtenerInformacionCiudadano() {
    setIsLoading(true);
    if (
      sessionStorage.getItem("ciudadano") &&
      sessionStorage.getItem("ciudadano") != ""
    ) {
      let ciudadanoSotrage = sessionStorage.getItem("ciudadano");
      const ciudadano = JSON.parse(ciudadanoSotrage as string);
      setCiudadano(ciudadano);
    }
    setIsLoading(false);
  }
  const loadingState = isLoading ? "loading" : "idle";
  useEffect(() => {
    window.scrollTo(0, 0); // Mueve el scroll a la parte superior de la página
    obtenerInformacionCiudadano();
  }, []);
  let formatter = useDateFormatter({
    day: "2-digit", // Asegura que los días tengan dos dígitos
    month: "2-digit", // Asegura que los meses tengan dos dígitos
    year: "numeric", // Asegura que el año tenga cuatro dígitos
  });
  const timeFormatter = useDateFormatter({
    hour: "2-digit",
    minute: "2-digit",

    hour12: false, // Cambia a true si prefieres el formato de 12 horas
  });
  return (
    <div className="flex flex-col  justify-center items-center">
      <div>
        <h1
          className="mt-4 text-4xl font-bold  text-center text-white"
          style={{
            textShadow:
              " 3px 3px 0 #000, -1px -1px 0 #000, 2px -1px 0 #000, -1px 1px 0 #000, 2px 2px 2px #000",
          }}
        >
          VOTA CONMIGO
        </h1>
      </div>
      <div className="mt-10">
        {ciudadano ? (
          <Table
            isStriped
            classNames={{
              td: "text-xl text-center max-w-10 overflow-hidden break-words whitespace-normal",
              th: "text-lg text-center",
            }}
            className="w-96"
            aria-label="Example static collection table"
          >
            <TableHeader>
              <TableColumn>Campos</TableColumn>
              <TableColumn>Datos ingresados</TableColumn>
            </TableHeader>
            <TableBody>
              <TableRow key={ciudadano.rut}>
                <TableCell>Rut</TableCell>
                <TableCell>{ciudadano.rut}</TableCell>
              </TableRow>
              <TableRow key={ciudadano.nombre_completo}>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>{ciudadano.nombre_completo}</TableCell>
              </TableRow>
              <TableRow
                key={ciudadano.email != "" ? ciudadano.email : Math.random()}
              >
                <TableCell>Correo Electrónico</TableCell>
                <TableCell>{ciudadano.email}</TableCell>
              </TableRow>
              <TableRow key={ciudadano.telefono}>
                <TableCell>Número de teléfono</TableCell>
                <TableCell>{ciudadano.telefono}</TableCell>
              </TableRow>
              <TableRow key={ciudadano.sector}>
                <TableCell>Sector</TableCell>
                <TableCell>{ciudadano.sector}</TableCell>
              </TableRow>
              <TableRow key={ciudadano.calle}>
                <TableCell>Calle</TableCell>
                <TableCell>{ciudadano.calle}</TableCell>
              </TableRow>
              <TableRow key={ciudadano.fecha_encuentro.toString()}>
                <TableCell>Día elegido</TableCell>
                <TableCell>
                  {formatter.format(new Date(ciudadano.fecha_encuentro))}
                </TableCell>
              </TableRow>
              <TableRow key={ciudadano.hora_encuentro.toString()}>
                <TableCell>Hora de encuentro</TableCell>
                <TableCell>
                  {timeFormatter.format(new Date(ciudadano.hora_encuentro))}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          ""
        )}
      </div>
      <div className="mt-10  mb-12 flex flex-wrap gap-2 justify-center items-center text-center">
        <Button
          type="submit"
          className="shadow-xl bg-slate-500/90 text-white w-32 text-xl"
          onClick={onPrevious} // Avanza al siguiente paso
          size="lg"
        >
          Atras
        </Button>
        <Button
          type="submit"
          size="lg"
          className="shadow-xl bg-green-600 text-white text-xl"
          onClick={() => {
            toast.success("Excelente", { duration: 1500 });
            onNext();
          }}
        >
          Confirmar y Finalizar
        </Button>
      </div>
    </div>
  );
};

export default Detalle;
