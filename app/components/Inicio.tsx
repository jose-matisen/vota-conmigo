"use client";
import { Button } from "@nextui-org/button";

import { Props } from "../interfaces/props.interface";

const Inicio = ({ onNext }: Props) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="mt-5 ">
        <h1
          className="text-4xl font-bold  text-center text-white"
          style={{
            textShadow:
              " 3px 3px 0 #000, -1px -1px 0 #000, 2px -1px 0 #000, -1px 1px 0 #000, 2px 2px 2px #000",
          }}
        >
          VOTA CONMIGO
        </h1>
        <div className="bg-slate-100 mt-2 border-black rounded-xl shadow-lg w-80 lg:w-96">
          <p className="text-[22px] text-center p-3.5 mt-5 mb-11 text-balance">
            Esta página está diseñada para ayudar a las personas que tienen
            dificultades para trasladarse a los lugares de votación. Si
            necesitas ayuda para llegar a votar el <span className="underline underline-offset-2 decoration-2 decoration-red-500 font-medium">26</span> y <span className="underline underline-offset-2 decoration-2 decoration-red-500 font-medium">27</span> de este mes,
            simplemente completa tu información personal y tu ubicación aquí.
            Durante esos días, un equipo de voluntarios estará disponible para
            recoger a quienes lo necesiten y llevarlos a su respectivo lugar de
            votación. Tu voz es importante, y estamos aquí para asegurarnos de
            que puedas ejercer tu derecho a voto sin problemas.
          </p>
        </div>
      </div>

      <div className="mt-2 mb-12 text-center">
        <Button
          type="submit"
          size="lg"
          className="shadow-xl bg-blue-500 text-white w-32 text-xl"
          onClick={onNext} // Avanza al siguiente paso
        >
          Continuar
        </Button>
      </div>
    </div>
  );
};

export default Inicio;
