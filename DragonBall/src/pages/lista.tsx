import { useState } from "react";
import TarjetaGuerrero from "../componentes/cartaProyecto";  
import { Link } from "react-router-dom";
import type { Carta } from "../util/interface";
import ModalGuerrero from "../componentes/modal";  

function ListaCartas({cartas, alEliminar}: {cartas: Carta[], alEliminar: (id: number) => Promise<void>}) {
  const [seleccionado, setSeleccionado] = useState<Carta | null>(null);
  const [terminoBusqueda] = useState("");

  const abrirCarta = (carta: Carta) => setSeleccionado(carta);
  const cerrarModal = () => setSeleccionado(null);

  const cartasFiltradas = cartas.filter((carta: { Nombre: string; }) =>
    carta.Nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <>
      {seleccionado && (
        <ModalGuerrero 
          Numero={seleccionado.Numero} 
          Nombre={seleccionado.Nombre} 
          Tipo={seleccionado.Tipo} 
          Ataque={seleccionado.Ataque} 
          Defensa={seleccionado.Defensa} 
          Descripcion={seleccionado.Descripcion} 
          Imagen={seleccionado.Imagen} 
          Debilidad={seleccionado.Debilidad} 
          Rareza={seleccionado.Rareza} 
          alCerrar={cerrarModal} 
          alEliminar={() => alEliminar(seleccionado.Numero)} 
        />
      )}
    <div className="flex justify-center mb-20 px-4">
        <Link 
          to='/crearCarta' 
          className="group relative inline-flex items-center justify-center px-8 py-4 
            bg-linear-to-r from-orange-800 via-yellow-700 to-red-900 
            text-white font-bold text-lg rounded-xl
            shadow-2xl shadow-orange-950/40
            transform transition-all duration-300 
            hover:scale-105 hover:from-orange-900 hover:to-red-950
            focus:outline-none focus:ring-4 focus:ring-orange-400/40
            overflow-hidden"
        >
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 
            transition-opacity duration-300"></span>
          <span className="relative flex items-center gap-2">
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 4v16m8-8H4" 
              />
            </svg>
            Crear Nuevo Guerrero
          </span>
        </Link>
      </div>
     
      <div className="text-center mb-20 px-5">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-linear-to-r from-orange-300 via-yellow-300 to-red-400 drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]">
          Dragon Ball Z
        </h1>
        <p className="mt-3 text-sm uppercase tracking-[0.35em] text-orange-200/90">
          Galería de guerreros
        </p>
      </div>

      

      <div className="flex flex-wrap justify-center gap-16 mt-16 px-4">
        {cartasFiltradas.map((carta) => (
          <div 
            key={carta.Numero} 
            className="transform transition-all duration-300 hover:-translate-y-2 hover:scale-105 cursor-pointer"
          >
            <TarjetaGuerrero
              Nombre={carta.Nombre}
              Ataque={carta.Ataque}
              Defensa={carta.Defensa}
              Descripcion={carta.Descripcion}
              Imagen={carta.Imagen!}
              Tipo={carta.Tipo}
              Debilidad={carta.Debilidad}
              vida={carta.vida}
              alAbrir={() => abrirCarta(carta)}
            />
          </div>
        ))}
      </div>
    </>
  );
}

export default ListaCartas;