import { useState } from "react";
import TarjetaGuerrero from "../componentes/cartaProyecto";
import { Link } from "react-router-dom";
import type { Carta } from "../util/interface";
import ModalGuerrero from "../componentes/modal";

function ListaCartas({ cartas, alEliminar }: { cartas: Carta[]; alEliminar: (id: number) => Promise<void> }) {
  const [seleccionado, setSeleccionado] = useState<Carta | null>(null);
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const abrirCarta = (carta: Carta) => setSeleccionado(carta);
  const cerrarModal = () => setSeleccionado(null);

  const cartasFiltradas = cartas.filter((carta) =>
    carta.Nombre.toLowerCase().includes(terminoBusqueda.toLowerCase())
  );

  return (
    <div className="dbz-container">
      {/* Modal de detalles */}
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

      {/* Encabezado con título y búsqueda */}
      <div className="dbz-header">
        <div className="title-section">
          <h1>DRAGON BALL Z</h1>
          <p>Galería de guerreros Z</p>
        </div>
        <div className="search-section">
          <input
            type="text"
            placeholder="🔍 Buscar guerrero..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Botones de acción */}
      <div className="dbz-buttons">
        <Link to="/crearCarta" className="btn btn-primary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Crear Nuevo Guerrero
        </Link>
        <Link to="/seleccionar-cartas" className="btn btn-secondary">
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          Ir a batalla
        </Link>
<Link to="/generar-carta-ia" className="btn btn-ia">
  <svg
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    width="20"
    height="20"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
    />
  </svg>
  🤖 Generar con IA
</Link>
      </div>

      {/* Contador y grid de cartas */}
      <div className="results-info">
        {cartasFiltradas.length} guerrero(s) encontrado(s)
      </div>

      <div className="dbz-card-grid">
        {cartasFiltradas.map((carta) => (
          <div key={carta.Numero} onClick={() => abrirCarta(carta)} className="card-wrapper">
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
            {/* Badge de rareza (estilizado para que combine) */}
            <div className="rarity-badge">
              {carta.Rareza === "Legendaria" && "⭐️⭐️⭐️"}
              {carta.Rareza === "Épica" && "⭐️⭐️"}
              {carta.Rareza === "Común" && "⭐️"}
            </div>
          </div>
        ))}
      </div>

      {cartasFiltradas.length === 0 && (
        <div className="no-results">
          <p>⚡ No hay guerreros que coincidan con la búsqueda. ¡Crea uno nuevo!</p>
        </div>
      )}

      <style>{`
        /* === FONDO PRINCIPAL (estilo cósmico) === */
        .dbz-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
          background: radial-gradient(circle at 20% 30%, #1e293b, #0a0c10 80%);
          font-family: 'Poppins', 'Segoe UI', 'Arial', sans-serif;
          color: #fff;
          min-height: 100vh;
        }

        /* === ENCABEZADO (con borde dorado y sombra) === */
        .dbz-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2.5rem;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          padding: 1.2rem 2rem;
          border-radius: 60px;
          border-left: 6px solid #fbbf24;
          border-right: 6px solid #f59e0b;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.2), inset 0 0 20px rgba(245, 158, 11, 0.05);
        }

        .title-section h1 {
          margin: 0;
          font-size: 2.5rem;
          letter-spacing: 4px;
          font-weight: 900;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 20px rgba(251, 191, 36, 0.3);
        }

        .title-section p {
          margin: 0;
          font-size: 0.95rem;
          color: #facc15;
          font-weight: 500;
          letter-spacing: 1px;
        }
        .btn-ia {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          color: white;
          border-color: #a78bfa;
          box-shadow: 0 4px 20px rgba(124, 58, 237, 0.5);
        }

        .btn-ia:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 10px 35px rgba(124, 58, 237, 0.7);
          background: linear-gradient(135deg, #8b5cf6, #6366f1);
        }
        .search-input {
          background: #1e1f2c;
          border: 2px solid #f59e0b;
          padding: 0.6rem 1.4rem;
          border-radius: 40px;
          color: white;
          font-size: 1rem;
          width: 260px;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.1);
        }

        .search-input:focus {
          outline: none;
          border-color: #fbbf24;
          box-shadow: 0 0 20px rgba(251, 191, 36, 0.4);
          background: #2a2c3e;
        }

        /* === BOTONES (con estilo saiyajin) === */
        .dbz-buttons {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          padding: 0.8rem 1.8rem;
          border-radius: 40px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
          backdrop-filter: blur(8px);
          border: 2px solid transparent;
          letter-spacing: 0.5px;
        }

        .btn-primary {
          background: linear-gradient(95deg, #f97316, #ea580c);
          color: white;
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.5);
          border-color: #fbbf24;
        }

        .btn-primary:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 10px 35px rgba(249, 115, 22, 0.7);
        }

        .btn-secondary {
          background: rgba(15, 23, 42, 0.8);
          color: #facc15;
          border-color: #fbbf24;
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          transform: translateY(-4px) scale(1.03);
          box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
          background: rgba(30, 41, 59, 0.9);
        }

        /* === CONTADOR === */
        .results-info {
          text-align: right;
          margin-bottom: 1.2rem;
          font-size: 0.9rem;
          color: #fbbf24;
          font-weight: 600;
          letter-spacing: 0.5px;
          border-bottom: 1px solid rgba(251, 191, 36, 0.2);
          padding-bottom: 0.5rem;
        }

        /* === GRID DE CARTAS === */
        .dbz-card-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 2rem;
          margin-top: 1rem;
        }

   

      

        /* === BADGE DE RAREZA (estilo sutil) === */
        .rarity-badge {
          position: absolute;
          bottom: -8px;
          right: 16px;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          padding: 0.2rem 0.8rem;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: bold;
          color: #facc15;
          border: 1px solid #fbbf24;
          z-index: 5;
          pointer-events: none;
          letter-spacing: 1px;
          box-shadow: 0 0 15px rgba(251, 191, 36, 0.15);
        }

        /* === SIN RESULTADOS === */
        .no-results {
          text-align: center;
          margin-top: 4rem;
          padding: 3rem 2rem;
          background: rgba(0, 0, 0, 0.6);
          border-radius: 2rem;
          border: 2px dashed #f59e0b;
          color: #cbd5e1;
          font-size: 1.1rem;
          backdrop-filter: blur(6px);
        }

        .no-results p {
          margin: 0;
        }

        /* === RESPONSIVE === */
        @media (max-width: 700px) {
          .dbz-header {
            flex-direction: column;
            border-radius: 2rem;
            text-align: center;
            border-left-width: 4px;
            border-right-width: 4px;
          }
          .title-section h1 {
            font-size: 1.8rem;
          }
          .search-input {
            width: 100%;
            max-width: 300px;
          }
          .dbz-buttons {
            gap: 1rem;
          }
          .btn {
            padding: 0.6rem 1.2rem;
            font-size: 0.85rem;
          }
          .dbz-card-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
            gap: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .dbz-container {
            padding: 1rem 0.8rem;
          }
          .dbz-header {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}

export default ListaCartas;