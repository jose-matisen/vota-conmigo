"use client";

import { Button } from "@nextui-org/button";
import { Props } from "../interfaces/props.interface";
import { Input } from "@nextui-org/input";
import { useEffect, useMemo, useState } from "react";
import { validate, format } from "rut.js";
import { Calendar } from "@nextui-org/calendar";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";
import {
  CalendarDate,
  fromDate,
  getLocalTimeZone,
  parseAbsoluteToLocal,
  parseDate,
  parseZonedDateTime,
} from "@internationalized/date";
import { TimeInput } from "@nextui-org/date-input";
import {
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
} from "@nextui-org/autocomplete";
import { localidades } from "../data/localidades";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDateFormatter } from "@react-aria/i18n";
import { crearDoc } from "@/lib/firebase";
import { Ciudadano } from "@/interfaces/ciudadano.interface";
import ReactGoogleAutocomplete from "react-google-autocomplete";

const Formulario = ({ onNext, onPrevious }: Props) => {
  const [ciudadano, setCiudadano] = useState<Ciudadano>();
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [isRut, setisRut] = useState<string>("");
  const [dia, setDia] = useState(() => {
    return ciudadano?.fecha_encuentro
      ? fromDate(new Date(ciudadano.fecha_encuentro), getLocalTimeZone())
      : parseDate("2024-10-26");
  });
  const [hora, setHora] = useState(
    parseZonedDateTime("2024-10-18T11:00[America/Santiago]")
  );

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

  const schema = z
    .object({
      rut: z.string().min(8, { message: "El RUT es requerido" }),
      nombre_completo: z
        .string()
        .min(5, { message: "El nombre completo es requerido" })
        .max(100),
      email: z
        .string()
        .optional()
        .refine(
          (val) => {
            // Si el valor está vacío o undefined, pasa la validación
            if (!val) return true;
            // Si hay valor, valida que sea un correo válido
            return z.string().email().safeParse(val).success;
          },
          {
            message: "Formato de correo incorrecto",
          }
        ),
      telefono: z
        .string()
        .min(9, { message: "El numero de telefono es requerido, 9 digitos" })
        .max(9, {
          message:
            "El numero de telefono tiene que tener 9 digitos como maximo",
        }),
      sector: z.string().min(5, { message: "El Sector es requerido" }).max(100),
      calle: z.string().min(5, { message: "La Calle es requerida" }).max(150),
    })
    .strict();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      rut: ciudadano ? ciudadano.rut : "",
      nombre_completo: ciudadano ? ciudadano.nombre_completo : "",
      email: ciudadano ? ciudadano.email : "",
      telefono: ciudadano ? ciudadano.telefono : "",
      sector: ciudadano ? ciudadano.sector : "",
      calle: ciudadano ? ciudadano.calle : "",
    },
  });

  const {
    register,
    handleSubmit,
    formState,
    reset,
    setValue,
    setError,
    clearErrors,
  } = form;
  const { errors } = formState;

  let formatterHora = useDateFormatter({
    dateStyle: "short",
    timeStyle: "long",
  });

  const onSubmit = async (cuidadano: z.infer<typeof schema>) => {
    setisLoading(true);
    let sector = localidades.find((item) => item.value === cuidadano.sector);

    const data = {
      rut: format(cuidadano.rut),
      nombre_completo: cuidadano.nombre_completo,
      email: cuidadano.email,
      telefono: cuidadano.telefono,
      sector: cuidadano.sector,
      calle: cuidadano.calle,
      fecha_encuentro: dia.toDate(getLocalTimeZone()),
      hora_encuentro: hora.toDate(),
      latitud_sector: sector ? sector.latitud : 0,
      longitud_sector: sector ? sector.longitud : 0,
    };

    const toastId = toast.loading("Guardando...");
    const resultado = await crearDoc(data);

    if (resultado) {
      toast.success("Información Guardada", {
        id: toastId,
        duration: 2500,
      });
      sessionStorage.setItem("ciudadano", JSON.stringify(resultado));
      onNext();
      setisLoading(false);
    } else {
      toast.error("Error al guardar la información", {
        id: toastId,
        duration: 2500,
      });
      setisLoading(false);
    }
  };

  function obtenerInformacionCiudadano() {
    if (
      sessionStorage.getItem("ciudadano") &&
      sessionStorage.getItem("ciudadano") != ""
    ) {
      let ciudadanoSotrage = sessionStorage.getItem("ciudadano");
      const ciudadano = JSON.parse(ciudadanoSotrage as string);
      setCiudadano(ciudadano);
      const fechaRecuperada = fromDate(
        new Date(ciudadano.fecha_encuentro),
        getLocalTimeZone()
      );
      setDia(fechaRecuperada);

      const horaRecuperada = fromDate(
        new Date(ciudadano.hora_encuentro),
        getLocalTimeZone()
      );
      setHora(horaRecuperada);
      reset({
        rut: ciudadano.rut,
        nombre_completo: ciudadano.nombre_completo,
        email: ciudadano.email,
        telefono: ciudadano.telefono,
        sector: ciudadano.sector,
        calle: ciudadano.calle,
      });
    } else {
      console.log("No hay información guardada en sessionStorage");
    }
  }

  useEffect(() => {
    obtenerInformacionCiudadano();
    window.scrollTo(0, 0); // Mueve el scroll a la parte superior de la página
  }, []);
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col justify-center items-center">
        <div className="justify-center mt-6 flex">
          <Input
            type="text"
            label="Ingrese su RUT"
            isRequired
            size={"lg"}
            variant="flat"
            isInvalid={!!errors.rut || isInvalid}
            color={isInvalid ? "danger" : "default"}
            value={isRut}
            errorMessage={errors.rut?.message || "Rut Incorrecto"}
            onValueChange={(e) => setisRut(e)}
            {...register("rut", {
              onBlur: () => handleOnBlur(),
            })}
            className="w-80 lg:w-96"
            classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
          />
        </div>
        <div className="mt-1 flex justify-center">
          <Input
            type="text"
            label="Nombre Completo"
            isRequired
            size={"lg"}
            variant="flat"
            className="w-80 lg:w-96"
            isInvalid={!!errors.nombre_completo} // Cambiado a doble negación para asegurar que sea booleano
            errorMessage={errors.nombre_completo?.message}
            classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
            {...register("nombre_completo")}
          />
        </div>
        <div className="mt-3 flex justify-center">
          <Input
            type="text"
            label="Correo Electrónico"
            size={"lg"}
            variant="flat"
            className="w-80 lg:w-96"
            isInvalid={!!errors.email} // Cambiado a doble negación para asegurar que sea booleano
            errorMessage={errors.email?.message}
            classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
            {...register("email")}
          />
        </div>
        <div className="mt-3 flex justify-center">
          <Input
            type="text"
            label="Número de teléfono"
            size={"lg"}
            isRequired
            variant="flat"
            startContent={<p>+56</p>}
            className="w-80 lg:w-96"
            isInvalid={!!errors.telefono} // Cambiado a doble negación para asegurar que sea booleano
            errorMessage={errors.telefono?.message}
            classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
            {...register("telefono")}
          />
        </div>
        <div className="mt-3 flex justify-center">
          <Autocomplete
            label="Sector"
            size={"lg"}
            isRequired
            variant="flat"
            allowsCustomValue={true} // para que pueda escribir lo que sea en caso no se encuentre la localidad
            className="w-80 lg:w-96"
            classNames={{ base: "shadow-xl" }}
            {...register("sector")}
          >
            {localidades.map((localidad) => (
              <AutocompleteItem key={localidad.value} value={localidad.value}>
                {localidad.label}
              </AutocompleteItem>
            ))}
          </Autocomplete>
        </div>
        <div className="mt-3 flex justify-center">
          <Input
            type="text"
            isRequired
            label="Calle"
            size={"lg"}
            variant="flat"
            isInvalid={!!errors.calle} // Cambiado a doble negación para asegurar que sea booleano
            errorMessage={errors.calle?.message}
            className="w-80 lg:w-96 "
            classNames={{ inputWrapper: "shadow-xl", label: "text-center" }}
            {...register("calle")}
          />
        </div>
        {/*  <div>
          <ReactGoogleAutocomplete
            apiKey={"AIzaSyAk2TCBSgd5wkGy4KAXYhZiGEXXiR_Degk"}
            style={{ width: "90%" }}
            onPlaceSelected={(place) => {
              console.log(place);
            }}
            options={{
              types: ["establishment", "geocode"],
              componentRestrictions: { country: "cl" },
            }}
            {...register("calle")}
          />
        </div> */}
        <div className="mt-3 flex justify-center">
          <Calendar
            classNames={{ content: "bg-white text-xl ", title: "font-bold" }}
            aria-label="Date (Min Date Value)"
            defaultValue={parseDate("2024-10-26")}
            minValue={parseDate("2024-10-26")}
            maxValue={parseDate("2024-10-27")}
            onChange={setDia}
            value={dia}
          />
        </div>
        <div className="m-3">
          <TimeInput
            isRequired
            label="Ingrese la hora de encuentro"
            size="lg"
            granularity="minute"
            color="primary"
            hourCycle={24}
            className="w-64"
            onChange={setHora}
            value={hora}
            classNames={{
              input:
                "flex justify-center items-center mb-3 text-[24px] font-bold",
              label: "font-medium flex justify-center items-center text-[17px]",
            }}
            defaultValue={parseZonedDateTime(
              "2024-10-18T11:00[America/Santiago]"
            )}
          />
        </div>
        <div className="mt-7  mb-12 flex flex-wrap gap-2 justify-center items-center text-center">
          <Button
            type="button"
            className={`${
              isLoading ? "bg-slate-500/50" : "bg-slate-500/90"
            } shadow-xl  text-white w-32 text-xl`}
            onClick={onPrevious} // Avanza al siguiente paso
            size="lg"
            disabled={isLoading}
          >
            Atras
          </Button>
          <Button
            type="submit"
            className={` ${
              isLoading ? "bg-blue-500/50" : "bg-blue-500"
            } shadow-xl  text-white text-xl`}
            size="lg"
            disabled={isLoading}
          >
            Continuar
            {isLoading && (
              <LoaderCircle className="inline h-6 ml-2 animate-spin" />
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default Formulario;
