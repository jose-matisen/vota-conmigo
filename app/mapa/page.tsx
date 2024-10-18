"use client";
import dynamic from "next/dynamic";
import { useState } from "react";

const LazyMap = dynamic(() => import("../components/Mapa"), {
  ssr: false,
  loading: () => <p>Loading...</p>,
});
const Mapa = () => {
  const [step, setStep] = useState(0); // Inicializa el paso en 0 (Inicio)

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1); // Avanza al siguiente paso
  };
  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1); // Avanza al siguiente paso
  };
  return <LazyMap onNext={handleNext} onPrevious={handlePrevious} />;
};

export default Mapa;
