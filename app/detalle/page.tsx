"use client";
import { useState } from "react";
import Detalle from "../components/Detalle";

const DetallePage = () => {
  const [step, setStep] = useState(0); // Inicializa el paso en 0 (Inicio)
  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1); // Avanza al siguiente paso
  };
  const handleNext = () => {
    setStep((prevStep) => prevStep + 1); // Avanza al siguiente paso
  };
  return <Detalle onPrevious={handlePrevious} onNext={handleNext} />;
};

export default DetallePage;
