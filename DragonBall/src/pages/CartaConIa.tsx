import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generarCartaIA } from '../util/api';
import { desdeApiCarta } from '../util/mapper';
import TarjetaGuerrero from '../componentes/cartaProyecto';
import type { Carta } from '../util/interface';

type Props = {
  onGuardar: (carta: Carta) => Promise<void>;
  creando?: boolean;
};

function GenerarCartaIA({ onGuardar, creando = false }: Props) {
  const [prompt, setPrompt] = useState('');
  const [cartaGenerada, setCartaGenerada] = useState<Carta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Contexto global fijo para todas las generaciones
  const GLOBAL_CONTEXT =
    'Dragon Ball Z, estilo ilustración para juego de cartas, Hearthstone, épico, 4k';

  const generarConPrompt = async (textoPrompt: string) => {
    setLoading(true);
    setError(null);
    setCartaGenerada(null);

    try {
      // Llamada a la API siguiendo la documentación
      const apiCarta = await generarCartaIA(textoPrompt, GLOBAL_CONTEXT);

      // Validación de la respuesta
      if (!apiCarta || !apiCarta.name) {
        throw new Error('La IA no devolvió una carta válida. Intenta con otro prompt.');
      }

      // Mapeo de la respuesta de la API al formato interno
      const carta = desdeApiCarta(apiCarta);
      setCartaGenerada(carta);
    } catch (err) {
      console.error('Error al generar carta:', err);
      setError(err instanceof Error ? err.message : 'Error desconocido al generar la carta.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerar = () => {
    // Si el usuario escribió algo, lo usa; si no, usa un prompt genérico por defecto
    const promptFinal =
      prompt.trim() || 'Crea una carta aleatoria de Dragon Ball Z, ilustración épica, estilo anime';
    generarConPrompt(promptFinal);
  };

  const handleGuardar = async () => {
    if (!cartaGenerada) return;
    try {
      await onGuardar(cartaGenerada);
      navigate('/');
    } catch (err) {
      setError('No se pudo guardar la carta. Revisa la consola.');
    }
  };

  return (
    <div className="generar-ia-container">
      {/* Encabezado */}
      <div className="header-ia">
        <div className="logo-titulo">
          <span>🐉</span>
          <h1>Generar Carta con IA</h1>
          <span>⭐</span>
        </div>
        <button onClick={() => navigate('/seleccionar-cartas')} className="btn-volver">
          ← Volver
        </button>
      </div>

      <div className="grid-ia">
        {/* Panel de entrada */}
        <div className="panel-input">
          <div className="campo">
            <label>🔮 Descripción de la carta (opcional)</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Deja vacío para generar una carta aleatoria, o describe lo que quieras..."
              rows={6}
            />
            <p className="ayuda">
              Describe al personaje, su pose, estilo, colores, fondo, etc. Si no escribes nada, la IA
              creará algo aleatorio.
            </p>
          </div>

          <button onClick={handleGenerar} disabled={loading} className="btn-generar">
            {loading ? '⚡ Generando...' : '⚡ Generar Carta'}
          </button>

          {error && <div className="error-msg">❌ {error}</div>}
        </div>

        {/* Panel de resultado */}
        <div className="panel-resultado">
          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>La IA está dibujando tu carta...</p>
            </div>
          )}

          {cartaGenerada && !loading && (
            <div className="carta-generada">
              <h2>✨ Carta generada</h2>
              <TarjetaGuerrero
                Nombre={cartaGenerada.Nombre}
                Tipo={cartaGenerada.Tipo}
                Ataque={cartaGenerada.Ataque}
                Defensa={cartaGenerada.Defensa}
                Descripcion={cartaGenerada.Descripcion}
                Imagen={cartaGenerada.Imagen}
                Debilidad={cartaGenerada.Debilidad}
                Rareza={cartaGenerada.Rareza}
                vida={cartaGenerada.vida}
              />
              <div className="acciones">
                <button onClick={handleGuardar} disabled={creando} className="btn-guardar">
                  {creando ? 'Guardando...' : '💾 Guardar carta'}
                </button>
                <button onClick={() => setCartaGenerada(null)} className="btn-descartar">
                  Descartar
                </button>
              </div>
            </div>
          )}

          {!cartaGenerada && !loading && (
            <div className="placeholder">
              <p>🐉 La carta generada aparecerá aquí.</p>
              <p>Haz clic en "Generar Carta" para empezar.</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        .generar-ia-container {
          min-height: 100vh;
          background: radial-gradient(circle at 20% 30%, #1e293b, #0a0c10 80%);
          padding: 2rem 1.5rem;
          color: #fff;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
        }

        .header-ia {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          background: rgba(0, 0, 0, 0.65);
          backdrop-filter: blur(6px);
          padding: 1rem 2rem;
          border-radius: 60px;
          border-left: 6px solid #fbbf24;
          border-right: 6px solid #f59e0b;
          box-shadow: 0 0 30px rgba(245, 158, 11, 0.2);
        }

        .logo-titulo {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }
        .logo-titulo h1 {
          font-size: 2rem;
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          margin: 0;
        }
        .btn-volver {
          background: #1e293b;
          padding: 0.5rem 1.2rem;
          border-radius: 40px;
          color: #facc15;
          text-decoration: none;
          border: 1px solid #facc15;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-volver:hover {
          background: #facc15;
          color: #1e293b;
        }

        .grid-ia {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .panel-input,
        .panel-resultado {
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(8px);
          border-radius: 2rem;
          padding: 2rem;
          border: 1px solid rgba(250, 204, 21, 0.3);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        }

        .campo {
          margin-bottom: 1.5rem;
        }
        .campo label {
          display: block;
          font-weight: 600;
          color: #facc15;
          margin-bottom: 0.4rem;
        }
        .campo textarea {
          width: 100%;
          background: #1e1f2c;
          border: 1px solid #f97316;
          padding: 0.8rem 1rem;
          border-radius: 1rem;
          color: white;
          font-size: 0.9rem;
          font-family: inherit;
          resize: vertical;
          transition: all 0.2s;
        }
        .campo textarea:focus {
          outline: none;
          border-color: #facc15;
          box-shadow: 0 0 8px rgba(250, 204, 21, 0.5);
        }
        .ayuda {
          font-size: 0.7rem;
          color: #9ca3af;
          margin-top: 0.2rem;
        }

        .btn-generar {
          background: linear-gradient(95deg, #f97316, #ea580c);
          border: none;
          padding: 0.8rem 2rem;
          border-radius: 40px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          width: 100%;
          font-size: 1.1rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .btn-generar:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249, 115, 22, 0.5);
        }
        .btn-generar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .error-msg {
          margin-top: 1rem;
          color: #ef4444;
          background: rgba(239, 68, 68, 0.1);
          padding: 0.8rem;
          border-radius: 1rem;
          border: 1px solid #ef4444;
        }

        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 1rem;
        }
        .spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #f97316;
          border-top-color: #facc15;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        .carta-generada {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }
        .carta-generada h2 {
          color: #facc15;
          margin: 0;
          font-size: 1.5rem;
        }

        .acciones {
          display: flex;
          gap: 1rem;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-guardar {
          background: #22c55e;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 40px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .btn-guardar:hover:not(:disabled) {
          transform: translateY(-2px);
        }
        .btn-guardar:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .btn-descartar {
          background: #ef4444;
          border: none;
          padding: 0.6rem 1.5rem;
          border-radius: 40px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .btn-descartar:hover {
          transform: translateY(-2px);
        }

        .placeholder {
          text-align: center;
          color: #9ca3af;
          margin-top: 4rem;
        }
        .placeholder p {
          margin: 0.5rem 0;
        }

        @media (max-width: 900px) {
          .grid-ia {
            grid-template-columns: 1fr;
          }
          .header-ia {
            flex-direction: column;
            text-align: center;
            gap: 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}

export default GenerarCartaIA;