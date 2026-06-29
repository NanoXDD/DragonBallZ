import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { Carta } from "../util/interface";
import { useEffect, useState } from "react";

interface FormularioCartaProps {
  alEnviar: (cartaData: Carta, id?: number) => void | Promise<any>;
  creando?: boolean;
  esEdicion?: boolean;
}

// ==================== VALIDACIONES ====================
const validarCampo = (campo: keyof Carta, valor: any): string => {
  switch (campo) {
    case "Nombre":
      if (!valor || String(valor).trim().length < 3) return "El nombre es obligatorio (mínimo 3 caracteres).";
      return "";
    case "Tipo":
      if (!valor || String(valor).trim().length === 0) return "El tipo es obligatorio.";
      return "";
    case "Ataque":
      if (valor === "" || valor === null || isNaN(Number(valor))) return "Ki de ataque debe ser un número.";
      if (Number(valor) < 0) return "Ki de ataque no puede ser negativo.";
      return "";
    case "Defensa":
      if (valor === "" || valor === null || isNaN(Number(valor))) return "Resistencia debe ser un número.";
      if (Number(valor) < 0) return "Resistencia no puede ser negativa.";
      return "";
    case "vida":
      if (valor === "" || valor === null || isNaN(Number(valor))) return "Salud debe ser un número.";
      if (Number(valor) < 0) return "Salud no puede ser negativa.";
      return "";
    case "Descripcion":
      if (!valor || String(valor).trim().length < 10) return "Descripción mínima 10 caracteres.";
      if (String(valor).length > 1000) return "Descripción no puede exceder 1000 caracteres.";
      return "";
    case "Imagen":
      if (!valor || String(valor).trim().length === 0) return "La imagen es obligatoria.";
      if (!/^https?:\/\//.test(String(valor))) return "La URL de imagen debe comenzar con http:// o https://";
      return "";
    default:
      return "";
  }
};

const validarTodo = (valores: Carta) => {
  const nuevosErrores: Partial<Record<keyof Carta, string>> = {};
  (Object.keys(valores) as Array<keyof Carta>).forEach((clave) => {
    const err = validarCampo(clave, valores[clave]);
    if (err) nuevosErrores[clave] = err;
  });
  return nuevosErrores;
};

const extraerUrlImagen = (url: string) => {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("google") && parsed.pathname.includes("imgres")) {
      const direct = parsed.searchParams.get("imgurl");
      if (direct) return direct;
    }
    if (parsed.hostname === "www.google.com" && parsed.pathname === "/url") {
      const direct = parsed.searchParams.get("imgurl");
      if (direct) return direct;
    }
    return url;
  } catch {
    return url;
  }
};

// ==================== VISTA PREVIA ====================
const VistaPreviaCarta = ({ carta, imagenProcesada, imagenValida, onImagenStatus }: { carta: Carta; imagenProcesada: string; imagenValida: boolean; onImagenStatus: (valid: boolean) => void }) => {
  const starRating = () => {
    if (carta.Rareza) {
      const r = carta.Rareza.toLowerCase();
      if (r.includes("ssj") || r.includes("legendario")) return 5;
      if (r.includes("épico") || r.includes("ultra")) return 4;
      if (r.includes("raro")) return 3;
      return 2;
    }
    return 3;
  };
  const stars = starRating();
  const vidaPorcentaje = Math.min(100, Math.max(0, carta.vida || 0));
  const colorVida = vidaPorcentaje > 60 ? "#22c55e" : vidaPorcentaje > 30 ? "#eab308" : "#ef4444";

  return (
    <div className="vista-previa">
      <div className="carta-preview">
        <div className="preview-header">
          <span>⚡</span>
          <h3>CARTA DE BATALLA</h3>
          <span>⚡</span>
        </div>
        <div className="preview-stars">
          {[...Array(stars)].map((_, i) => <span key={i}>★</span>)}
          {[...Array(5 - stars)].map((_, i) => <span key={i}>☆</span>)}
        </div>
        <div className="preview-imagen">
          {carta.Imagen ? (
            imagenValida ? (
              <img src={imagenProcesada || carta.Imagen} alt={carta.Nombre} onError={() => onImagenStatus(false)} onLoad={() => onImagenStatus(true)} />
            ) : (
              <div className="error-imagen">Error cargando imagen</div>
            )
          ) : (
            <div className="sin-imagen">🐉</div>
          )}
          <div className="ki-seal">気</div>
        </div>
        <div className="preview-nombre">
          <h4>{carta.Nombre || "??? GUERRERO ???"}</h4>
          <p>{carta.Tipo || "Desconocido"}</p>
        </div>
        <div className="preview-stats">
          <div className="stat"><span>❤️ VIDA</span><span>{carta.vida}</span></div>
          <div className="stat"><span>⚡ ATAQUE</span><span>{carta.Ataque}</span></div>
          <div className="stat"><span>🛡️ DEFENSA</span><span>{carta.Defensa}</span></div>
        </div>
        <div className="preview-vida-barra">
          <div className="barra-fondo"><div className="barra-lleno" style={{ width: `${vidaPorcentaje}%`, backgroundColor: colorVida }}></div></div>
        </div>
        {carta.Descripcion && <div className="preview-descripcion">“ {carta.Descripcion} ”</div>}
        {carta.Rareza && <div className="preview-rareza">⭐ TRANSFORMACIÓN: {carta.Rareza.toUpperCase()} ⭐</div>}
        <div className="preview-footer">DRAGON BALL Z • PODER DE PELEA</div>
      </div>
      <style>{`
        .vista-previa { display: flex; justify-content: center; }
        .carta-preview {
          background: linear-gradient(145deg, #2d1f0c, #1a1206);
          border-radius: 1.5rem;
          padding: 1rem;
          width: 280px;
          border: 1px solid #facc15;
          box-shadow: 0 10px 20px rgba(0,0,0,0.5);
          font-family: 'Poppins', sans-serif;
        }
        .preview-header { display: flex; justify-content: space-between; color: #facc15; font-weight: bold; }
        .preview-stars { text-align: center; color: #facc15; letter-spacing: 4px; margin: 0.3rem 0; }
        .preview-imagen { position: relative; background: #00000066; border-radius: 1rem; margin: 0.5rem 0; aspect-ratio: 1; overflow: hidden; }
        .preview-imagen img { width: 100%; height: 100%; object-fit: cover; }
        .ki-seal { position: absolute; bottom: 5px; right: 8px; background: #ff8c00; color: #fff; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 0.8rem; }
        .error-imagen, .sin-imagen { display: flex; align-items: center; justify-content: center; height: 100%; background: #1e1a2f; color: #facc15; }
        .preview-nombre { text-align: center; }
        .preview-nombre h4 { color: #facc15; margin: 0.2rem 0; font-size: 1.2rem; }
        .preview-nombre p { color: #ffd966; font-size: 0.7rem; }
        .preview-stats { display: flex; justify-content: space-between; margin: 0.8rem 0; background: #00000055; border-radius: 20px; padding: 0.3rem; }
        .stat { flex:1; text-align: center; font-size: 0.7rem; color: #fff; }
        .stat span:first-child { display: block; color: #cbd5e1; }
        .stat span:last-child { font-weight: bold; color: #facc15; }
        .preview-vida-barra { margin: 0.3rem 0; }
        .barra-fondo { background: #1e1a2f; border-radius: 8px; height: 6px; overflow: hidden; }
        .barra-lleno { height: 100%; transition: width 0.2s; }
        .preview-descripcion { font-size: 0.7rem; color: #ddd; text-align: center; margin: 0.5rem 0; font-style: italic; }
        .preview-rareza { font-size: 0.65rem; text-align: center; background: #00000066; border-radius: 20px; padding: 0.2rem; margin: 0.5rem 0; color: #facc15; }
        .preview-footer { text-align: center; font-size: 0.55rem; color: #aaa; border-top: 1px solid #facc1533; padding-top: 0.5rem; margin-top: 0.5rem; }
      `}</style>
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
const FormularioCarta = ({ alEnviar, creando = false, esEdicion = false }: FormularioCartaProps) => {
  const ubicacion = useLocation();
  const navegar = useNavigate();
  const { id } = useParams();

  const obtenerEstadoInicialCarta = (): Carta => ({
    Numero: 0,
    Nombre: "",
    Tipo: "",
    Ataque: 0,
    Defensa: 0,
    Descripcion: "",
    Debilidad: "",
    Rareza: "",
    Imagen: "",
    vida: 0,
    idCard: undefined,
    attributes: undefined
  });

  const [carta, setCarta] = useState<Carta>(obtenerEstadoInicialCarta());
  const [errores, setErrores] = useState<Partial<Record<keyof Carta, string>>>({});
  const [imagenValida, setImagenValida] = useState(true);
  const [imagenProcesada, setImagenProcesada] = useState("");

  useEffect(() => {
    if (esEdicion && ubicacion.state) {
      setCarta(ubicacion.state as Carta);
    }
  }, [esEdicion, ubicacion.state]);

  useEffect(() => {
    if (carta.Imagen) {
      const urlProcesada = extraerUrlImagen(carta.Imagen);
      setImagenProcesada(urlProcesada);
      setImagenValida(/^https?:\/\//.test(urlProcesada));
    } else {
      setImagenProcesada("");
      setImagenValida(true);
    }
  }, [carta.Imagen]);

  const manejarCambio = <K extends keyof Carta>(campo: K, valor: Carta[K]) => {
    const siguienteValor = campo === "Imagen" ? String(valor).trim() : valor;
    setCarta((prev) => ({ ...prev, [campo]: siguienteValor }));

    if (campo === "Imagen") {
      const urlProcesada = extraerUrlImagen(String(siguienteValor));
      setImagenProcesada(urlProcesada);
      setImagenValida(/^https?:\/\//.test(urlProcesada));
    }

    const err = validarCampo(campo, siguienteValor);
    setErrores((prev) => ({ ...prev, [campo]: err }));
  };

  const manejarEnvio = async (e: React.FormEvent) => {
    e.preventDefault();
    const validacion = validarTodo(carta);
    const tieneErrores = Object.values(validacion).some((v) => v && v.length > 0);
    if (tieneErrores) {
      setErrores(validacion);
      return;
    }

    const cartaFinal = carta.Imagen ? { ...carta, Imagen: imagenProcesada || carta.Imagen } : carta;

    if (esEdicion && id) {
      await alEnviar(cartaFinal, parseInt(id));
    } else {
      await alEnviar(cartaFinal);
    }
    navegar('/');
  };

  if (creando) {
    return (
      <div className="dbz-loading">
        <div className="esfera-cargando">🐉</div>
        <p>Cargando esferas del dragón...</p>
        <style>{`
          .dbz-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 60vh; background: linear-gradient(135deg, #0a0c10, #1a1f2e); color: #facc15; }
          .esfera-cargando { font-size: 4rem; animation: spin 1s infinite; }
          @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="formulario-dbz">
      {/* Elementos decorativos */}
      <div className="deco estrella">⭐</div>
      <div className="deco nube">🐉</div>
      <div className="deco rayo">⚡</div>

      <div className="contenedor-principal">
        {/* Header */}
        <div className="header-form">
          <div className="logo-titulo">
            <span>🐉</span>
            <h1>{esEdicion ? "EDITAR GUERRERO Z" : "CREAR GUERRERO Z"}</h1>
            <span>⭐</span>
          </div>
          <Link to="/" className="boton-ver-cartas">
            <span>🐉</span> VER CARTAS <span>→</span>
          </Link>
        </div>

        <div className="grid-form-vista">
          {/* Formulario */}
          <div className="formulario">
            <div className="card-form">
              <div className="card-header">
                <span>⚡</span>
                <h2>DATOS DE BATALLA</h2>
                <span>⚡</span>
              </div>
              <form onSubmit={manejarEnvio}>
                <div className="campo">
                  <label>🔥 NOMBRE DEL GUERRERO</label>
                  <input value={carta.Nombre} onChange={(e) => manejarCambio("Nombre", e.target.value)} placeholder="Ej. Goku, Vegeta, Piccolo" />
                  {errores.Nombre && <span className="error">{errores.Nombre}</span>}
                </div>
                <div className="campo">
                  <label>🌪️ TIPO / CLASE</label>
                  <input value={carta.Tipo} onChange={(e) => manejarCambio("Tipo", e.target.value)} placeholder="Ej. Saiyan, Namekusei, Dios de la Destrucción" />
                  {errores.Tipo && <span className="error">{errores.Tipo}</span>}
                </div>
                <div className="campo-grupo">
                  <div className="campo">
                    <label>❤️ VIDA</label>
                    <input type="number" min={0} value={carta.vida} onChange={(e) => manejarCambio("vida", Number(e.target.value))} />
                    {errores.vida && <span className="error">{errores.vida}</span>}
                  </div>
                  <div className="campo">
                    <label>⚡ ATAQUE KI</label>
                    <input type="number" min={0} value={carta.Ataque} onChange={(e) => manejarCambio("Ataque", Number(e.target.value))} />
                    {errores.Ataque && <span className="error">{errores.Ataque}</span>}
                  </div>
                  <div className="campo">
                    <label>🛡️ DEFENSA</label>
                    <input type="number" min={0} value={carta.Defensa} onChange={(e) => manejarCambio("Defensa", Number(e.target.value))} />
                    {errores.Defensa && <span className="error">{errores.Defensa}</span>}
                  </div>
                </div>
                <div className="campo">
                  <label>📜 DESCRIPCIÓN ÉPICA</label>
                  <textarea value={carta.Descripcion} onChange={(e) => manejarCambio("Descripcion", e.target.value)} placeholder="Describe su técnica, historia o poder..." rows={3} maxLength={1000} />
                  <div className="contador">{carta.Descripcion.length}/1000</div>
                  {errores.Descripcion && <span className="error">{errores.Descripcion}</span>}
                </div>
                <div className="campo">
                  <label>🌟 TRANSFORMACIÓN / RAREZA</label>
                  <input value={carta.Rareza} onChange={(e) => manejarCambio("Rareza", e.target.value)} placeholder="Ej. Super Saiyan, Ultra Instinto, Legendario" />
                  <p className="ayuda">¡A mayor rareza, más estrellas brillarán en la carta!</p>
                </div>
                <div className="campo">
                  <label>🖼️ URL DE LA IMAGEN (arte del guerrero)</label>
                  <input value={carta.Imagen} onChange={(e) => manejarCambio("Imagen", e.target.value)} placeholder="https://ejemplo.com/goku.jpg" />
                  <p className="ayuda">Debe ser una URL válida que muestre al personaje.</p>
                  {errores.Imagen && <span className="error">{errores.Imagen}</span>}
                </div>
                <div className="acciones">
                  <button type="submit" disabled={Object.values(errores).some(v => v && v.length > 0) || !carta.Imagen || !imagenValida} className="boton-principal">
                    {esEdicion ? "⚡ ACTUALIZAR GUERRERO ⚡" : "🐉 CREAR CARTA 🐉"}
                  </button>
                  <Link to="/" className="boton-cancelar">CANCELAR</Link>
                </div>
              </form>
            </div>
          </div>

          {/* Vista previa */}
          <div className="vista-previa-container">
            <div className="card-preview">
              <h2>✨ VISTA PREVIA DE LA CARTA ✨</h2>
              <VistaPreviaCarta carta={carta} imagenProcesada={imagenProcesada} imagenValida={imagenValida} onImagenStatus={setImagenValida} />
            </div>
          </div>
        </div>
      </div>

      {/* Estilos globales del formulario */}
      <style>{`
        .formulario-dbz {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0c10 0%, #1a1f2e 100%);
          padding: 2rem 1.5rem;
          position: relative;
          font-family: 'Poppins', 'Segoe UI', sans-serif;
          color: #fff;
        }
        .deco {
          position: fixed;
          font-size: 3rem;
          opacity: 0.1;
          pointer-events: none;
          z-index: 0;
        }
        .estrella { top: 10%; left: 5%; animation: flotar 6s infinite; }
        .nube { bottom: 15%; right: 5%; animation: flotar 8s infinite reverse; }
        .rayo { top: 30%; right: 10%; animation: flotar 4s infinite; }
        @keyframes flotar {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .contenedor-principal {
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }
        .header-form {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 2rem;
          background: rgba(0,0,0,0.6);
          backdrop-filter: blur(8px);
          padding: 0.8rem 2rem;
          border-radius: 60px;
          border-left: 5px solid #f97316;
        }
        .logo-titulo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .logo-titulo h1 {
          background: linear-gradient(135deg, #f97316, #facc15);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          font-size: 1.8rem;
          margin: 0;
        }
        .boton-ver-cartas {
          background: #1e293b;
          padding: 0.5rem 1.2rem;
          border-radius: 40px;
          color: #facc15;
          text-decoration: none;
          font-weight: bold;
          transition: all 0.2s;
          border: 1px solid #facc15;
        }
        .boton-ver-cartas:hover {
          background: #facc15;
          color: #1e293b;
          transform: translateY(-2px);
        }
        .grid-form-vista {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }
        .card-form, .card-preview {
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(8px);
          border-radius: 2rem;
          padding: 1.5rem;
          border: 1px solid rgba(250,204,21,0.3);
          box-shadow: 0 8px 20px rgba(0,0,0,0.4);
        }
        .card-header {
          display: flex;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          color: #facc15;
        }
        .card-header h2 {
          margin: 0;
          font-size: 1.3rem;
          color: #ffd966;
        }
        .campo {
          margin-bottom: 1.2rem;
        }
        .campo label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.4rem;
          color: #facc15;
        }
        .campo input, .campo textarea {
          width: 100%;
          background: #1e1f2c;
          border: 1px solid #f97316;
          padding: 0.7rem 1rem;
          border-radius: 1rem;
          color: white;
          font-size: 0.9rem;
          transition: all 0.2s;
        }
        .campo input:focus, .campo textarea:focus {
          outline: none;
          border-color: #facc15;
          box-shadow: 0 0 8px rgba(250,204,21,0.5);
        }
        .campo-grupo {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 1rem;
        }
        .error {
          color: #ef4444;
          font-size: 0.7rem;
          margin-top: 0.3rem;
          display: block;
        }
        .ayuda {
          font-size: 0.7rem;
          color: #9ca3af;
          margin-top: 0.2rem;
        }
        .contador {
          text-align: right;
          font-size: 0.7rem;
          color: #9ca3af;
        }
        .acciones {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          flex-wrap: wrap;
        }
        .boton-principal {
          background: linear-gradient(95deg, #f97316, #ea580c);
          border: none;
          padding: 0.8rem 1.5rem;
          border-radius: 40px;
          font-weight: bold;
          color: white;
          cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          flex: 1;
        }
        .boton-principal:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(249,115,22,0.5);
        }
        .boton-principal:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .boton-cancelar {
          background: #334155;
          padding: 0.8rem 1.5rem;
          border-radius: 40px;
          text-decoration: none;
          color: white;
          text-align: center;
          transition: background 0.2s;
        }
        .boton-cancelar:hover {
          background: #475569;
        }
        .vista-previa-container h2 {
          text-align: center;
          color: #facc15;
          font-size: 1.2rem;
          margin-bottom: 1.5rem;
        }
        @media (max-width: 900px) {
          .grid-form-vista { grid-template-columns: 1fr; }
          .campo-grupo { grid-template-columns: 1fr; gap: 0.8rem; }
          .header-form { flex-direction: column; text-align: center; }
          .logo-titulo { justify-content: center; }
        }
      `}</style>
    </div>
  );
};

export default FormularioCarta;