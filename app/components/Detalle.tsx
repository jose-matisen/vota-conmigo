"use client";

import { Button } from "@nextui-org/button";

interface DetalleProps {
  onPrevious?: () => void;
  onSubmit: (data: any) => void; // Prop para manejar el envío de datos
}

const Detalle = ({ onPrevious, onSubmit }: DetalleProps) => {
 /*  const handleSubmit = () => {
    // Lógica para recolectar datos a enviar
    const data = {
     
    };
    onSubmit(data); // Llama a la función de envío
  }; */

  return (
    <div className="flex flex-col  justify-center items-center">
      <div>
        <h1
          className="text-4xl font-bold  text-center text-white"
          style={{
            textShadow:
              " 3px 3px 0 #000, -1px -1px 0 #000, 2px -1px 0 #000, -1px 1px 0 #000, 2px 2px 2px #000",
          }}
        >
          VOTA CONMIGO
        </h1>
      </div>
      <div className="mt-4">
       <p>Aquí iria el detalle</p>
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
          className="shadow-xl bg-green-600 text-white w-32 text-xl"
        >
          Confirmar
        </Button>
      </div>
    </div>
  );
};

export default Detalle;
