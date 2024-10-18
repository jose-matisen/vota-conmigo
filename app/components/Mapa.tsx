"use client";

// IMPORTANT: the order matters!
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css";
import "leaflet-defaulticon-compatibility";
import "leaflet.fullscreen";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import { LatLng, Map } from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Props } from "../interfaces/props.interface";
import { Button } from "@nextui-org/button";
import { Ciudadano } from "@/interfaces/ciudadano.interface";
import ReactGoogleAutocomplete from "react-google-autocomplete";

export default function Mapa({ onNext, onPrevious }: Props) {
  const [draggable, setDraggable] = useState(true);
  const [locationError, setLocationError] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLng>(
    new LatLng(-34.2911874, -71.081676)
  );
  const [obtenerUbucacion, setObtenerUbucacion] = useState(false);
  const [ciudadano, setCiudadano] = useState<Ciudadano>();

  const markerRef = useRef<any>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          setPosition(marker.getLatLng());
        }
      },
    }),
    []
  );
  const toggleDraggable = useCallback(() => {
    setDraggable((d) => !d);
  }, []);

  let map: Map;

  function LocationMarker() {
    map = useMapEvents({
      locationfound(e) {
        if (obtenerUbucacion) {
          if (position.lat != e.latlng.lat && position.lng != e.latlng.lng) {
            setPosition(e.latlng); // Establecer la posición solo si aún no ha sido definida
            map.flyTo(e.latlng, map.getZoom()); // Vuela a la ubicación del usuario una sola vez
          }
        }
        setLocationError(false); // Reinicia el estado de error si se encuentra la ubicación
      },
      locationerror() {
        setLocationError(true); // Maneja el caso donde la ubicación falla
      },
    });

    useEffect(() => {
      if (obtenerUbucacion) {
        map.locate({ setView: true, maxZoom: 15 }); // Solicita la ubicación al cargar el componente solo una vez
      }
    }, [map, obtenerUbucacion]);

    return position === null ? null : (
      <Marker
        position={position}
        draggable={draggable}
        eventHandlers={eventHandlers}
        ref={markerRef}
      >
        <Popup>¡Estás aquí!</Popup>
      </Marker>
    );
  }
  const obtenerCoordenadas = async (address: string) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
     
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;

        setPosition(new LatLng(lat, lng));
        map.flyTo(new LatLng(lat, lng), map.getZoom());
      } else {
        setPosition(new LatLng(-34.2911874, -71.081676));
        map.flyTo(new LatLng(-34.2911874, -71.081676), map.getZoom());
      }
    } catch (error) {
      console.error("Error al obtener las coordenadas:", error);
    }
  };
  function obtenerInformacionCiudadano() {
    if (
      sessionStorage.getItem("ciudadano") &&
      sessionStorage.getItem("ciudadano") != ""
    ) {
      let ciudadanoSotrage = sessionStorage.getItem("ciudadano");
      const ciudadano = JSON.parse(ciudadanoSotrage as string);
      console.log(ciudadano);
      setCiudadano(ciudadano);
      obtenerCoordenadas(encodeURIComponent(`${ciudadano.sector} ${ciudadano.calle}`));
    }
  }
  useEffect(() => {
    window.scrollTo(0, 0); // Mueve el scroll a la parte superior de la página
    obtenerInformacionCiudadano();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1
        className="mt-4 w-96 text-3xl font-bold  text-center text-white"
        style={{
          textShadow:
            " 3px 3px 0 #000, -1px -1px 0 #000, 2px -1px 0 #000, -1px 1px 0 #000, 2px 2px 2px #000",
        }}
      >
        De acuerdo con la dirección que nos proporcionaste, {"\n"}
        ¿es correcta esta ubicación?
      </h1>
      <MapContainer
        center={position} // Coordenadas por defecto si no se encuentra la ubicación
        zoom={15}
        scrollWheelZoom={true}
        className="mt-5"
        style={{ height: "50vh", width: "80%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      <div className="flex mt-4 w-52 flex-wrap gap-2 justify-center items-center text-center">
        <Button
          type="button"
          color={"danger"}
          className="shadow-xl text-lg"
          size="md"
          onClick={() => setObtenerUbucacion(true)}
        >
          Obtener Ubicación real
        </Button>
        <Button
          type="button"
          color={"primary"}
          className="shadow-xl text-lg"
          size="md"
          onClick={() => {
            setObtenerUbucacion(false);
            obtenerInformacionCiudadano();
          }}
        >
          Quitar Ubicación real
        </Button>
      </div>
      
      <div className="mt-10  mb-12 flex flex-wrap gap-2 justify-center items-center text-center">
        <Button
          type="button"
          className="shadow-xl bg-slate-500/90 text-white w-32 text-xl"
          onClick={onPrevious} // Avanza al siguiente paso
          size="lg"
        >
          Atras
        </Button>
        <Button
          type="submit"
          className="shadow-xl bg-green-600 text-white  text-xl"
          onClick={onNext} // Avanza al siguiente paso
          size="lg"
        >
          Continuar
        </Button>
      </div>
      {/* Mostrar mensaje de error si la ubicación falla */}
      {locationError && (
        <div style={{ padding: "10px", color: "red" }}>
          No pudimos obtener tu ubicación. Por favor habilite la ubicacion desde
          el navegador
        </div>
      )}
    </div>
  );
}
