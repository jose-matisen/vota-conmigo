"use client"
import dynamic from "next/dynamic";
import Inicio from "./components/Inicio";
import { useState } from "react";
import Formulario from "./components/Formulario";
import Detalle from "./components/Detalle";
const LazyMap = dynamic(() => import("./components/Mapa"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
export default function Home() {
  const [step, setStep] = useState(0); // Inicializa el paso en 0 (Inicio)

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1); // Avanza al siguiente paso
  };
  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1); // Avanza al siguiente paso
  };
  const handleSubmit = (data: any) => {
    // Aquí puedes manejar la lógica de envío de datos a tu base de datos
    console.log("Datos a enviar:", data);
    // Luego puedes redirigir o mostrar un mensaje de éxito
  };

  return (
    <div className="">
      {step === 0 && <Inicio onNext={handleNext}  />}
      {step === 1 && <Formulario onNext={handleNext} onPrevious={handlePrevious} />}
      {step === 2 && <LazyMap onNext={handleNext} onPrevious={handlePrevious}/>}
      {step === 3 && <Detalle onSubmit={handleSubmit} onPrevious={handlePrevious}/>}
    </div>
  );
}
