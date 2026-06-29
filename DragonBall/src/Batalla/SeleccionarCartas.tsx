import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Carta } from "../util/interface";
import TarjetaGuerrero from "../componentes/cartaProyecto";

type Props = {
  mazo: Carta[];
  loading: boolean;
};

function SeleccionarCartas({ mazo, loading }: Props) {
  const [cartaSeleccionada1, setCartaSeleccionada1] = useState<Carta | null>(null);
  const [cartaSeleccionada2, setCartaSeleccionada2] = useState<Carta | null>(null);
  const navigate = useNavigate();

  const handleSeleccionarCarta = (carta: Carta) => {
    if (cartaSeleccionada1?.Numero === carta.Numero) {
      setCartaSeleccionada1(null);
      return;
    }
    if (cartaSeleccionada2?.Numero === carta.Numero) {
      setCartaSeleccionada2(null);
      return;
    }
    if (!cartaSeleccionada1) {
      setCartaSeleccionada1(carta);
      return;
    }
    if (!cartaSeleccionada2) {
      setCartaSeleccionada2(carta);
    }
  };

  const listoBatalla = Boolean(cartaSeleccionada1 && cartaSeleccionada2);
  const limpiarSeleccion = () => {
    setCartaSeleccionada1(null);
    setCartaSeleccionada2(null);
  };

  return (
    <div className="seleccion-container">
      {/* Fondo animado con nubes y destellos */}
      <div className="dbz-bg-animation">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
        <div className="ki-sparkle sparkle1"></div>
        <div className="ki-sparkle sparkle2"></div>
        <div className="ki-sparkle sparkle3"></div>
      </div>

      <div className="contenido">
        <header className="seleccion-header">
          <h1>🐉 SELECCIONA TUS GUERREROS ⚡</h1>
          <p>Elige dos cartas para el combate definitivo</p>
        </header>

        {loading && (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Cargando cartas...</p>
          </div>
        )}

        {!loading && mazo.length === 0 && (
          <div className="empty-state">
            <p>⚠️ No hay cartas disponibles todavía.</p>
            <Link to="/crearCarta" className="btn-crear">
              ✨ Crear primera carta ✨
            </Link>
          </div>
        )}

        {!loading && mazo.length > 0 && (
          <>
            <div className="cartas-grid">
              {mazo.map((carta) => {
                const seleccionada =
                  cartaSeleccionada1?.Numero === carta.Numero || cartaSeleccionada2?.Numero === carta.Numero;

                return (
                  <div
                    key={carta.Numero}
                    className={`card-selector ${seleccionada ? "seleccionada" : ""}`}
                    onClick={() => handleSeleccionarCarta(carta)}
                    onKeyDown={(e) => e.key === "Enter" && handleSeleccionarCarta(carta)}
                    tabIndex={0}
                    role="button"
                  >
                    <TarjetaGuerrero
                      Nombre={carta.Nombre}
                      Tipo={carta.Tipo}
                      Ataque={carta.Ataque}
                      Defensa={carta.Defensa}
                      Descripcion={carta.Descripcion}
                      Imagen={carta.Imagen}
                      Debilidad={carta.Debilidad}
                      Rareza={carta.Rareza}
                      vida={Number(carta.vida || 0)}
                    />
                    {seleccionada && <div className="badge-seleccionado">⚡ SELECCIONADO ⚡</div>}
                  </div>
                );
              })}
            </div>

            <div className="panel-batalla">
              <div className="versus-panel">
                <div className="carta-info">
                  <span className="label">Carta 1</span>
                  <strong>{cartaSeleccionada1?.Nombre ?? "---"}</strong>
                  {cartaSeleccionada1 && (
                    <div className="stats-resumen">
                      ⚔️ {cartaSeleccionada1.Ataque} &nbsp; 🛡️ {cartaSeleccionada1.Defensa} &nbsp; ❤️ {cartaSeleccionada1.vida}
                    </div>
                  )}
                </div>
                <div className="vs-icon">VS</div>
                <div className="carta-info">
                  <span className="label">Carta 2</span>
                  <strong>{cartaSeleccionada2?.Nombre ?? "---"}</strong>
                  {cartaSeleccionada2 && (
                    <div className="stats-resumen">
                      ⚔️ {cartaSeleccionada2.Ataque} &nbsp; 🛡️ {cartaSeleccionada2.Defensa} &nbsp; ❤️ {cartaSeleccionada2.vida}
                    </div>
                  )}
                </div>
              </div>

              <div className="botones-accion">
                <button onClick={limpiarSeleccion} className="btn-limpiar">
                  🧹 Limpiar
                </button>
                <button
                  onClick={() => {
                    if (!listoBatalla || !cartaSeleccionada1 || !cartaSeleccionada2) return;
                    navigate(`/campo-de-batalla/${cartaSeleccionada1.Numero}/${cartaSeleccionada2.Numero}`);
                  }}
                  disabled={!listoBatalla}
                  className="btn-batalla"
                >
                  🐉 IR A BATALLA ⚡
                </button>
              </div>

              {!listoBatalla && (
                <div className="aviso">💡 Haz clic en una carta para seleccionarla. Vuelve a hacer clic para deseleccionar.</div>
              )}
            </div>
          </>
        )}
      </div>

      <style>{`
        .seleccion-container {
          min-height: 100vh;
          background: linear-gradient(145deg, #0a0c10 0%, #1a1f2e 100%);
          position: relative;
          overflow-x: hidden;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
        }

        .dbz-bg-animation {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }
        .cloud {
          position: absolute;
          background: rgba(255,255,240,0.15);
          border-radius: 80% 20% 70% 30% / 60% 50% 50% 40%;
          width: 200px;
          height: 120px;
          filter: blur(30px);
          animation: drift 20s linear infinite;
        }
        .cloud1 { top: 10%; left: -100px; animation-duration: 25s; }
        .cloud2 { top: 50%; left: 70%; width: 300px; height: 180px; animation-duration: 35s; animation-direction: reverse; }
        .cloud3 { bottom: 5%; left: -50px; width: 250px; height: 150px; animation-duration: 30s; }
        @keyframes drift {
          0% { transform: translateX(0) translateY(0); }
          100% { transform: translateX(calc(100vw + 200px)) translateY(-30px); }
        }
        .ki-sparkle {
          position: absolute;
          background: radial-gradient(circle, #facc15, #f97316);
          border-radius: 50%;
          opacity: 0.4;
          animation: pulse 3s infinite;
        }
        .sparkle1 { width: 8px; height: 8px; top: 20%; left: 15%; animation-delay: 0s; }
        .sparkle2 { width: 12px; height: 12px; bottom: 30%; right: 20%; animation-delay: 1s; }
        .sparkle3 { width: 6px; height: 6px; top: 70%; left: 80%; animation-delay: 2s; }
        @keyframes pulse {
          0% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.5); }
          100% { opacity: 0.2; transform: scale(1); }
        }

        .contenido {
          position: relative;
          z-index: 2;
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem 1.5rem;
        }

        .seleccion-header {
          text-align: center;
          margin-bottom: 2rem;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          border-radius: 60px;
          padding: 1rem;
          border-left: 6px solid #f97316;
          border-right: 6px solid #facc15;
        }
        .seleccion-header h1 {
          background: linear-gradient(135deg, #f97316, #facc15);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 2rem;
          margin: 0;
          letter-spacing: 2px;
        }
        .seleccion-header p {
          color: #ffd966;
          margin: 0.5rem 0 0;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 3rem;
          background: rgba(0,0,0,0.5);
          border-radius: 2rem;
          color: #facc15;
        }
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f97316;
          border-top-color: #facc15;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .btn-crear {
          display: inline-block;
          margin-top: 1rem;
          background: #f97316;
          padding: 0.7rem 1.5rem;
          border-radius: 40px;
          color: white;
          text-decoration: none;
          font-weight: bold;
        }

        /* Grid de cartas - ajustado para que las cartas tengan el tamaño natural */
        .cartas-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          justify-content: center;
          gap: 2rem;
          margin: 2rem 0;
        }
        .card-selector {
          cursor: pointer;
          transition: transform 0.2s, filter 0.2s;
          position: relative;
          border-radius: 1.5rem;
          justify-self: center; /* centra cada tarjeta en su celda */
          width: fit-content; /* para que el contenedor se ajuste al ancho de la carta */
        }
        .card-selector:hover {
          transform: translateY(-8px);
          filter: drop-shadow(0 15px 20px rgba(0,0,0,0.5));
        }
        .card-selector.seleccionada {
          outline: 4px solid #facc15;
          outline-offset: 4px;
          border-radius: 1.5rem;
          box-shadow: 0 0 0 2px #f97316, 0 0 0 6px rgba(250,204,21,0.3);
        }
        .badge-seleccionado {
          position: absolute;
          bottom: -15px;
          left: 50%;
          transform: translateX(-50%);
          background: #facc15;
          color: #1e293b;
          font-weight: bold;
          padding: 0.3rem 1rem;
          border-radius: 40px;
          font-size: 0.8rem;
          white-space: nowrap;
          z-index: 5;
          box-shadow: 0 2px 8px black;
        }

        /* Panel de batalla con estilo mejorado */
        .panel-batalla {
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(16px);
          border-radius: 2rem;
          padding: 1.5rem;
          margin-top: 2rem;
          border: 2px solid #facc15;
          box-shadow: 0 0 30px rgba(250,204,21,0.2);
        }
        .versus-panel {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 2rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .carta-info {
          background: #1e1f2c;
          padding: 1rem 1.5rem;
          border-radius: 1.5rem;
          text-align: center;
          min-width: 180px;
          border: 1px solid #facc15;
        }
        .carta-info .label {
          font-size: 0.8rem;
          color: #facc15;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .carta-info strong {
          display: block;
          font-size: 1.3rem;
          margin: 0.2rem 0;
          color: #fff;
        }
        .stats-resumen {
          font-size: 0.8rem;
          color: #cbd5e1;
        }
        .vs-icon {
          font-size: 2.5rem;
          font-weight: bold;
          background: linear-gradient(135deg, #f97316, #facc15);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          text-shadow: 0 0 15px rgba(249,115,22,0.6);
        }
        .botones-accion {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          flex-wrap: wrap;
        }
        .btn-limpiar, .btn-batalla {
          padding: 0.8rem 2rem;
          border-radius: 40px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          border: none;
          font-size: 1rem;
        }
        .btn-limpiar {
          background: #334155;
          color: white;
          border: 1px solid #facc15;
        }
        .btn-limpiar:hover {
          background: #475569;
          transform: translateY(-2px);
        }
        .btn-batalla {
          background: linear-gradient(95deg, #f97316, #ea580c);
          color: white;
          box-shadow: 0 4px 15px rgba(249,115,22,0.5);
          border: 1px solid #facc15;
        }
        .btn-batalla:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(249,115,22,0.7);
        }
        .btn-batalla:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .aviso {
          text-align: center;
          margin-top: 1rem;
          color: #ffd966;
          font-size: 0.85rem;
        }

        @media (max-width: 700px) {
          .cartas-grid {
            grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
            gap: 1rem;
          }
          .card-selector {
            justify-self: center;
          }
          .versus-panel {
            flex-direction: column;
            gap: 1rem;
          }
          .vs-icon {
            margin: 0.2rem 0;
          }
          .seleccion-header h1 {
            font-size: 1.5rem;
          }
          .carta-info {
            min-width: 140px;
          }
        }
      `}</style>
    </div>
  );
}

export default SeleccionarCartas;