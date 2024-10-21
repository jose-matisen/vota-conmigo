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
  useMap,
  useMapEvents,
} from "react-leaflet";
import { LatLng, Map } from "leaflet";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Props } from "../interfaces/props.interface";
import { Button } from "@nextui-org/button";
import { Ciudadano } from "@/interfaces/ciudadano.interface";
import ReactGoogleAutocomplete from "react-google-autocomplete";
import toast from "react-hot-toast";
import { crearDoc } from "@/lib/firebase";
import { LoaderCircle } from "lucide-react";

export default function Mapa({ onNext, onPrevious }: Props) {
  const [draggable, setDraggable] = useState(true);
  const [locationError, setLocationError] = useState<boolean>(false);
  const [isLoading, setisLoading] = useState<boolean>(false);
  const [position, setPosition] = useState<LatLng>(
    new LatLng(-34.2911874, -71.081676)
  );

  const [obtenerUbicacion, setObtenerUbicacion] = useState(false);
  const [ciudadano, setCiudadano] = useState<Ciudadano>();
  const [title, setTitle] = useState(
    "De acuerdo con la dirección que nos proporcionaste, ¿es correcta esta ubicación?"
  );
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
        if (obtenerUbicacion) {
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
      if (obtenerUbicacion) {
        map.locate({ setView: true, maxZoom: 15 }); // Solicita la ubicación al cargar el componente solo una vez
      } else {
        map.flyTo(position, map.getZoom());
      }
    }, [map, obtenerUbicacion]);

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
  const handleObtenerUbicacion = async (event: any) => {
    event.preventDefault();
    setisLoading(true);
    const data = {
      ...ciudadano,
      latitud_mapa: position.lat,
      longitud_mapa: position.lng,
    };
    const toastId = toast.loading("Guardando...");
    const resultado = await crearDoc(data as Ciudadano);

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
  const obtenerCoordenadas = async (address: string, ciudadano?: Ciudadano) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        const { long_name } = data.results[0].address_components[0];
        if (long_name == "Coltauco") {
          if (ciudadano && ciudadano.latitud_mapa && ciudadano.longitud_mapa) {
            setPosition(
              new LatLng(ciudadano.latitud_mapa, ciudadano.longitud_mapa)
            );
          } else if (
            ciudadano &&
            ciudadano.latitud_sector &&
            ciudadano.longitud_sector
          ) {
            setPosition(
              new LatLng(ciudadano.latitud_sector, ciudadano.longitud_sector)
            );
          }
        } else {
          setPosition(new LatLng(lat, lng));
        }
      } else {
        setTitle(
          "No pudimos encontrar tu ubicación exacta, ¿nos ayudas a encontrarla?"
        );
        if (ciudadano && ciudadano.latitud_mapa && ciudadano.longitud_mapa) {
          setPosition(
            new LatLng(ciudadano.latitud_mapa, ciudadano.longitud_mapa)
          );
        } else if (
          ciudadano &&
          ciudadano.latitud_sector &&
          ciudadano.longitud_sector
        ) {
          setPosition(
            new LatLng(ciudadano.latitud_sector, ciudadano.longitud_sector)
          );
        }
      }
    } catch (error) {
      console.error("Error al obtener las coordenadas:", error);

      setTitle(
        "No pudimos encontrar tu ubicación exacta, ¿nos ayudas a encontrarla?"
      );
      if (ciudadano && ciudadano.latitud_mapa && ciudadano.longitud_mapa) {
        setPosition(
          new LatLng(ciudadano.latitud_mapa, ciudadano.longitud_mapa)
        );
      } else if (
        ciudadano &&
        ciudadano.latitud_sector &&
        ciudadano.longitud_sector
      ) {
        setPosition(
          new LatLng(ciudadano.latitud_sector, ciudadano.longitud_sector)
        );
      }
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
      obtenerCoordenadas(
        encodeURIComponent(`${ciudadano.sector} Coltauco`),
        ciudadano
      );
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
        {title}
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
          className={`${
            obtenerUbicacion ? " bg-amber-500" : "bg-red-600"
          } shadow-xl text-white text-lg`}
          size="lg"
          onClick={() => {
            if (obtenerUbicacion) {
              console.log("pase");
              obtenerInformacionCiudadano();
            }
            setObtenerUbicacion(!obtenerUbicacion);
          }}
        >
          {!obtenerUbicacion
            ? "Obtener Ubicación Actual"
            : "Quitar Ubicación Actual"}
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
          className={` ${
            isLoading ? "bg-blue-500/50" : "bg-blue-500"
          } shadow-xl  text-white text-xl`}
          size="lg"
          disabled={isLoading}
          onClick={handleObtenerUbicacion} // Avanza al siguiente paso
        >
          Continuar
          {isLoading && (
            <LoaderCircle className="inline h-6 ml-2 animate-spin" />
          )}
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
