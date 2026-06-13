import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { Carta } from "../util/interface";
import TarjetaGuerrero from "../componentes/cartaProyecto";
import "./SeleccionarCartas.css";

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
    <div className="sc-container">
      <div className="sc-inner">
        <header className="sc-header">
          <h1 className="sc-title">Selecciona tus guerreros</h1>
          <p className="sc-sub">Elige dos cartas para el combate definitivo</p>
        </header>

        {loading && (
          <div className="sc-loading">
            <div className="sc-spinner" />
            <p className="sc-loading-text">Cargando cartas...</p>
          </div>
        )}

        {!loading && mazo.length === 0 && (
          <div className="sc-empty">
            <p>No hay cartas disponibles todavía.</p>
            <Link to="/crear-carta" className="sc-cta">
              ✨ Crear primera carta ✨
            </Link>
          </div>
        )}

        {!loading && mazo.length > 0 && (
          <>
            <div className="sc-grid" aria-live="polite">
              {mazo.map((carta) => {
                const seleccionada =
                  cartaSeleccionada1?.Numero === carta.Numero || cartaSeleccionada2?.Numero === carta.Numero;

                return (
                  <div key={carta.Numero} className="sc-card-wrapper">
                    <div
                      tabIndex={0}
                      role="button"
                      onKeyDown={(e) => e.key === "Enter" && handleSeleccionarCarta(carta)}
                      onClick={() => handleSeleccionarCarta(carta)}
                      className={`sc-card ${seleccionada ? "sc-card-selected" : ""}`}
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
                      {seleccionada && <div className="sc-badge">⚡ SELECCIONADO ⚡</div>}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="sc-panel">
              <div className="sc-panel-cards">
                <div className="sc-panel-item">
                  <div className="sc-panel-label">Carta 1</div>
                  <div className="sc-panel-value">{cartaSeleccionada1?.Nombre ?? "---"}</div>
                  {cartaSeleccionada1 && (
                    <div className="sc-panel-stats">⚔️ {cartaSeleccionada1.Ataque} &nbsp; 🛡️ {cartaSeleccionada1.Defensa} &nbsp; ❤️ {cartaSeleccionada1.vida}</div>
                  )}
                </div>

                <div className="sc-vs">VS</div>

                <div className="sc-panel-item">
                  <div className="sc-panel-label">Carta 2</div>
                  <div className="sc-panel-value">{cartaSeleccionada2?.Nombre ?? "---"}</div>
                  {cartaSeleccionada2 && (
                    <div className="sc-panel-stats">⚔️ {cartaSeleccionada2.Ataque} &nbsp; 🛡️ {cartaSeleccionada2.Defensa} &nbsp; ❤️ {cartaSeleccionada2.vida}</div>
                  )}
                </div>
              </div>

              <div className="sc-panel-actions">
                <button onClick={limpiarSeleccion} className="sc-button">
                  Limpiar
                </button>

                <button
                  onClick={() => {
                    if (!listoBatalla || !cartaSeleccionada1 || !cartaSeleccionada2) return;
                    navigate(`/campo-de-batalla/${cartaSeleccionada1.Numero}/${cartaSeleccionada2.Numero}`);
                  }}
                  className={`sc-button sc-button-primary ${!listoBatalla ? "sc-button-disabled" : ""}`}
                  disabled={!listoBatalla}
                >
                  🐉 IR A BATALLA ⚡
                </button>
              </div>

              {!listoBatalla && <div className="sc-hint">Haz clic en una carta para seleccionarla. Vuelve a hacer clic para deseleccionar.</div>}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SeleccionarCartas;
