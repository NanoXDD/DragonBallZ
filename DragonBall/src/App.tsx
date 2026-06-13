import { useEffect, useState } from "react";
import "./App.css";
import FormularioCarta from "./pages/formulario";
import ListaCartas from "./pages/lista";
import { Route, Routes } from "react-router-dom";
import type { Carta } from "./util/interface";
import { desdeApiCarta, aApiCartaCrear, aApiActualizarCarta } from "./util/mapper";
import {
  obtenerCartas as apiObtenerCartas,
  crearCarta as apiCrearCarta,
  actualizarCarta as apiActualizarCarta,
  eliminarCarta as apiEliminarCarta,
} from "./util/api";
import SeleccionarCartas from "./Batalla/SeleccionarCartas";
import CampoDeBatalla from "./Batalla/CampoDeBatalla";

function App() {
  const [cartas, setCartas] = useState<Carta[]>([]);
  const [creando, setCreando] = useState(false);
  const [loading, setLoading] = useState(true);

  const obtenerCartas = async () => {
    setLoading(true);
    try {
      const cartasApi = await apiObtenerCartas();
      setCartas(cartasApi.map((carta) => desdeApiCarta(carta)));
    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void obtenerCartas();
  }, []);

  const crearCarta = async (nuevaCartaData: Carta) => {
    setCreando(true);
    try {
      await apiCrearCarta(aApiCartaCrear(nuevaCartaData));
      await obtenerCartas();
    } catch (error) {
      console.error("Error al crear la carta:", error);
      alert("No se pudo crear la carta. Revisa la consola.");
    } finally {
      setCreando(false);
    }
  };

  const actualizarCarta = async (cartaData: Carta, id?: number) => {
    if (!id) return;
    setCreando(true);
    try {
      await apiActualizarCarta(id, aApiActualizarCarta(cartaData));
      await obtenerCartas();
    } catch (error) {
      console.error("Error al actualizar la carta:", error);
      alert("No se pudo actualizar la carta. Revisa la consola.");
    } finally {
      setCreando(false);
    }
  };

  const eliminarCarta = async (id: number) => {
    setCreando(true);
    try {
      await apiEliminarCarta(id);
      setCartas((prevCartas) => prevCartas.filter((carta) => carta.Numero !== id));
    } catch (error) {
      console.error("Error al eliminar la carta:", error);
      alert("No se pudo eliminar la carta. Revisa la consola.");
    } finally {
      setCreando(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-950 via-orange-900 to-red-950 text-white font-['Inter'] relative overflow-x-hidden p-4">
      <Routes>
        <Route path="/" element={<ListaCartas cartas={cartas} alEliminar={eliminarCarta} />} />
        <Route
          path="/crearCarta"
          element={<FormularioCarta alEnviar={crearCarta} creando={creando} esEdicion={false} />}
        />
        <Route
          path="/actualizar/:id"
          element={<FormularioCarta alEnviar={actualizarCarta} creando={creando} esEdicion={true} />}
        />
        <Route path="/seleccionar-cartas" element={<SeleccionarCartas mazo={cartas} loading={loading} />} />
        <Route path="/campo-de-batalla/:id1/:id2" element={<CampoDeBatalla cartas={cartas} />} />
      </Routes>
    </div>
  );
}

export default App;