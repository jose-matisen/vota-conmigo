"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet.fullscreen";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { LatLng } from "leaflet";
import { useEffect, useState } from "react";
import { Props } from "../interfaces/props.interface";
import { Button } from "@nextui-org/button";

export default function Map({ onNext, onPrevious }: Props) {
  const [locationError, setLocationError] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLng>(
    new LatLng(-34.2911874, -71.081676)
  );
  

  function LocationMarker() {
    const map = useMapEvents({
      locationfound(e) {
        if (position.lat != e.latlng.lat && position.lng != e.latlng.lng) {
          setPosition(e.latlng); // Establecer la posición solo si aún no ha sido definida
          map.flyTo(e.latlng, map.getZoom()); // Vuela a la ubicación del usuario una sola vez
        }
        setLocationError(false); // Reinicia el estado de error si se encuentra la ubicación
      },
      locationerror() {
        setLocationError(true); // Maneja el caso donde la ubicación falla
      },
    });

    useEffect(() => {
      map.locate({ setView: true, maxZoom: 15 }); // Solicita la ubicación al cargar el componente solo una vez
    }, [map]);

    return position === null ? null : (
      <Marker position={position}>
        <Popup>¡Estás aquí!</Popup>
      </Marker>
    );
  }

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <MapContainer
        center={[-34.2911874, -71.081676]} // Coordenadas por defecto si no se encuentra la ubicación
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: "600px", width: "90%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      <div className="mt-10 flex flex-wrap gap-2 justify-center items-center text-center">
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
        >
          Continuar
        </Button>
      </div>
      {/* Mostrar mensaje de error si la ubicación falla */}
      {locationError && (
        <div style={{ padding: "10px", color: "red" }}>
          No pudimos obtener tu ubicación.
          <button
            
          >
            Intentar de nuevo
          </button>
        </div>
      )}
    </div>
  );
}
