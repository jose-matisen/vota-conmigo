"use client";
import { Button } from "@nextui-org/button";
import Image from "next/image";
import { useEffect } from "react";

const Felicidades = () => {
  useEffect(() => {
    window.scrollTo(0, 0); // Mueve el scroll a la parte superior de la página
  }, []);
  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <div className="bg-slate-100 mt-2 border-black rounded-xl shadow-lg w-80 lg:w-96">
          <p className="text-[22px] text-center p-3.5 mt-5 mb-11 text-balance">
            ¡Felicidades! {"\n"} en el día seleccionado, uno de nuestros
            voluntarios se pondrá en contacto contigo para facilitarte el
            traslado a tu lugar de votación. Queremos asegurarnos de que llegues
            sin inconvenientes, así que no dudes en hacer cualquier pregunta que
            tengas al siguiente correo:{" "}
            <a
              href="mailto:mesadeayuda@matisen.cl"
              className="text-blue-600 underline"
            >
              mesadeayuda@matisen.cl
            </a>
          </p>
          <p className="text-[18px] text-center mt-5 text-balance">
            Desarrollado por
          </p>
          <div className="flex justify-center mb-5 bg-slate-950 rounded-xl">
            <Image
              src="/logo-matisen-3.png"
              alt="logo matisen"
              width={200}
              height={200}
            />
          </div>
        </div>
      </div>
      <div className="mt-10  mb-12 flex flex-wrap gap-2 justify-center items-center text-center">
        <Button
          type="submit"
          size="lg"
          className="shadow-xl bg-green-600 text-white text-xl"
          onClick={() => {
            sessionStorage.removeItem("ciudadano");
            window.location.reload();
          }}
        >
          Volver al inicio
        </Button>
      </div>
    </div>
  );
};

export default Felicidades;
