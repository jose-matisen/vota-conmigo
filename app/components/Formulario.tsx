"use client";

import { Button } from "@nextui-org/button";
import { Props } from "../interfaces/props.interface";
import { Input } from "@nextui-org/input";
import { useMemo, useState } from "react";
import { validate, format } from "rut.js";
import { Calendar } from "@nextui-org/calendar";
import {
  parseDate,
  parseZonedDateTime,
} from "@internationalized/date";
import { TimeInput } from "@nextui-org/date-input";


const Formulario = ({ onNext, onPrevious }: Props) => {
  //const [isLoading, setisLoading] = useState<boolean>(false);
  const [isRut, setisRut] = useState<string>("");

  const isInvalid = useMemo(() => {
    if (isRut === "") return false;

    return validate(isRut) ? false : true;
  }, [isRut]);

  const handleOnBlur = () => {
    if (validate(isRut)) {
      console.log(format(isRut));
      setisRut(format(isRut));
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="justify-center mt-6 flex">
        <Input
          type="text"
          label="Ingrese su RUT"
          size={"lg"}
          variant="flat"
          isInvalid={isInvalid}
          color={isInvalid ? "danger" : "default"}
          value={isRut}
          errorMessage="Rut Incorrecto"
          onValueChange={(e) => setisRut(format(e))}
          onBlur={handleOnBlur}
          className="w-96"
          classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
        />
      </div>
      <div className="mt-1 flex justify-center">
        <Input
          type="text"
          label="Nombre Completo"
          size={"lg"}
          variant="flat"
          className="w-96"
          classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
        />
      </div>
      <div className="mt-3 flex justify-center">
        <Input
          type="text"
          label="Correo Electronico"
          size={"lg"}
          variant="flat"
          className="w-96"
          classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
        />
      </div>
      <div className="mt-3 flex justify-center">
        <Input
          type="text"
          label="Numero de telefono"
          size={"lg"}
          variant="flat"
          className="w-96"
          classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
        />
      </div>
      <div className="mt-3 flex justify-center">
        <Input
          type="text"
          label="Sector"
          size={"lg"}
          variant="flat"
          className="w-96"
          classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
        />
      </div>
      <div className="mt-3 flex justify-center">
        <Input
          type="text"
          label="Calle"
          size={"lg"}
          variant="flat"
          className="w-96"
          classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
        />
      </div>
      <div className="mt-3 flex justify-center">
        <Calendar
                  classNames={{content: "bg-white"}}
          aria-label="Date (Min Date Value)"
          defaultValue={parseDate("2024-10-26")}
          minValue={parseDate("2024-10-26")}
          maxValue={parseDate("2024-10-27")}
        />
      </div>
      <div className="m-3">
        <TimeInput
          label="Ingrese Hora"
          size="lg"
          granularity="minute"
          hourCycle={24}
          className="w-40"
          classNames={{input: "flex justify-center items-center text-[20px]", label: "flex justify-center items-center text-[17px]"}}
          defaultValue={parseZonedDateTime(
            "2024-10-18T11:45[America/Santiago]"
          )}
        />
      </div>
      <div className="mt-7  mb-12 flex flex-wrap gap-2 justify-center items-center text-center">
        <Button
          type="submit"
          className="shadow-xl bg-slate-500/90 text-white w-32"
          onClick={onPrevious} // Avanza al siguiente paso
          size="lg"
        >
          Atras
        </Button>
        <Button
          type="submit"
          className="shadow-xl bg-blue-500 text-white w-32"
          onClick={onNext} // Avanza al siguiente paso
          size="lg"
          isDisabled={isInvalid}
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default Formulario;
