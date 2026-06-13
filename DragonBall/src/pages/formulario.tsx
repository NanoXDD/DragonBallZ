import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import type { Carta } from "../util/interface";
import { useEffect, useState } from "react";

interface FormularioCartaProps {
  alEnviar: (cartaData: Carta, id?: number) => void | Promise<any>;
  creando?: boolean;
  esEdicion?: boolean;
}

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

// Componente de vista previa con estilo Dragon Ball
const VistaPreviaCarta = ({ carta, imagenProcesada, imagenValida, onImagenStatus }: { carta: Carta; imagenProcesada: string; imagenValida: boolean; onImagenStatus: (valid: boolean) => void }) => {
  // Calcular estrellas de rareza (del 1 al 5 según algún criterio, aquí usamos longitud del nombre o rareza personalizada)
  const starRating = () => {
    if (carta.Rareza) {
      if (carta.Rareza.toLowerCase().includes("ssj")) return 5;
      if (carta.Rareza.toLowerCase().includes("legendario")) return 5;
      if (carta.Rareza.toLowerCase().includes("épico")) return 4;
      if (carta.Rareza.toLowerCase().includes("raro")) return 3;
      return 2;
    }
    return 3;
  };
  const stars = starRating();
  
  return (
    <div className="w-80 relative group">
      {/* Fondo de carta con textura de dragón */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-800 to-orange-900 rounded-2xl opacity-20 blur-sm"></div>
      <div className="relative bg-gradient-to-br from-orange-50 to-yellow-100 rounded-2xl border-4 border-yellow-600 overflow-hidden shadow-2xl transform transition-all hover:scale-105 duration-300">
        
        {/* Borde decorativo estilo DBZ */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"></div>
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500"></div>
        
        {/* Cabecera con kanji */}
        <div className="bg-gradient-to-r from-red-700 to-orange-700 p-2 text-center relative">
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-white opacity-30 text-2xl font-black">⚡</div>
          <h3 className="text-yellow-300 font-bold text-sm tracking-wider">CARTA DE BATALLA</h3>
          <div className="absolute right-2 top-1/2 -translate-y-1/2 text-white opacity-30 text-2xl font-black">⚡</div>
        </div>
        
        {/* Estrellas de rareza */}
        <div className="flex justify-center gap-1 mt-2">
          {[...Array(stars)].map((_, i) => (
            <span key={i} className="text-yellow-500 text-xs">★</span>
          ))}
          {[...Array(5-stars)].map((_, i) => (
            <span key={i} className="text-gray-400 text-xs">☆</span>
          ))}
        </div>

        {/* Imagen del personaje */}
        <div className="p-4">
          <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl h-44 flex items-center justify-center border-2 border-yellow-600 shadow-inner">
            {carta.Imagen ? (
              imagenValida ? (
                <img
                  src={imagenProcesada || carta.Imagen}
                  alt={carta.Nombre}
                  className="h-full w-full object-contain rounded-lg"
                  onLoad={() => onImagenStatus(true)}
                  onError={() => onImagenStatus(false)}
                />
              ) : (
                <div className="text-center px-3">
                  <p className="text-white font-bold">Error cargando imagen</p>
                  <p className="text-red-400 text-xs mt-1">Verifica la URL</p>
                </div>
              )
            ) : (
              <div className="text-center">
                <div className="text-6xl mb-2">🐉</div>
                <p className="text-gray-400 text-sm">Sin imagen</p>
              </div>
            )}
            {/* Sello de ki */}
            <div className="absolute -top-2 -right-2 bg-red-600 rounded-full w-8 h-8 flex items-center justify-center border-2 border-yellow-400">
              <span className="text-white text-xs font-bold">気</span>
            </div>
          </div>
        </div>

        {/* Nombre y tipo */}
        <div className="text-center px-4">
          <h4 className="text-orange-900 font-extrabold text-xl mb-1 tracking-wide drop-shadow-sm">
            {carta.Nombre || "??? GUERRERO ???"}
          </h4>
          <p className="text-gray-700 text-sm font-semibold bg-orange-200 inline-block px-3 py-0.5 rounded-full">
            {carta.Tipo || "Desconocido"}
          </p>
        </div>

        {/* Stats tipo DBZ */}
        <div className="grid grid-cols-3 gap-2 p-4 mt-2">
          <div className="bg-red-100 rounded-lg p-2 text-center border border-red-300 shadow-md">
            <div className="text-red-700 text-xs font-bold">❤️ VIDA</div>
            <div className="text-red-800 font-black text-xl">{carta.vida}</div>
          </div>
          <div className="bg-orange-100 rounded-lg p-2 text-center border border-orange-300 shadow-md">
            <div className="text-orange-700 text-xs font-bold">⚡ ATAQUE</div>
            <div className="text-orange-800 font-black text-xl">{carta.Ataque}</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-2 text-center border border-blue-300 shadow-md">
            <div className="text-blue-700 text-xs font-bold">🛡️ DEFENSA</div>
            <div className="text-blue-800 font-black text-xl">{carta.Defensa}</div>
          </div>
        </div>

        {/* Descripción */}
        {carta.Descripcion && (
          <div className="mx-4 mb-4 bg-amber-50 p-2 rounded-lg border border-amber-300 shadow-inner">
            <p className="text-gray-700 text-xs italic text-center leading-relaxed">
              " {carta.Descripcion} "
            </p>
          </div>
        )}

        {/* Rareza / transformación */}
        {carta.Rareza && (
          <div className="text-center pb-4">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs px-4 py-1 rounded-full font-bold shadow-md">
              ⭐ TRANSFORMACIÓN: {carta.Rareza.toUpperCase()} ⭐
            </span>
          </div>
        )}

        {/* Pie de carta */}
        <div className="bg-gradient-to-r from-red-800 to-orange-800 p-1 text-center">
          <p className="text-yellow-300 text-[10px] font-mono">DRAGON BALL Z • PODER DE PELEA</p>
        </div>
      </div>
    </div>
  );
};

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-900 to-orange-900">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-yellow-500 border-t-red-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl">🐉</span>
            </div>
          </div>
          <p className="text-yellow-300 font-bold mt-4 text-xl">Cargando esferas del dragón...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-800 to-yellow-800 py-8 px-4 relative overflow-hidden">
      {/* Esferas del dragón flotantes de fondo */}
      <div className="absolute top-10 left-10 opacity-10 animate-pulse">
        <div className="text-8xl">⭐</div>
      </div>
      <div className="absolute bottom-20 right-20 opacity-10 animate-bounce">
        <div className="text-7xl">🐉</div>
      </div>
      <div className="absolute top-1/3 right-5 opacity-10 animate-spin-slow">
        <div className="text-6xl">★</div>
      </div>
      <div className="absolute bottom-10 left-1/4 opacity-5 text-9xl">⚡</div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <div className="flex justify-center items-center gap-3 mb-2">
              <span className="text-4xl drop-shadow-lg">🐉</span>
              <h1 className="text-5xl font-extrabold bg-gradient-to-r from-yellow-300 via-orange-400 to-red-600 bg-clip-text text-transparent inline-block tracking-wider">
                {esEdicion ? "EDITAR GUERRERO Z" : "CREAR GUERRERO Z"}
              </h1>
              <span className="text-4xl drop-shadow-lg">⭐</span>
            </div>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500 rounded-full"></div>
          </div>
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => navegar('/')}
              className="bg-gradient-to-r from-yellow-500 to-orange-600 text-black font-bold py-2 px-6 rounded-full hover:from-yellow-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 border-2 border-yellow-300"
            >
              <span>🐉</span>
              <span>VER CARTAS</span>
              <span>→</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-14 justify-center">
          {/* Formulario con estilo Dragón Ball */}
          <div className="w-full lg:w-96">
            <div className="bg-black/40 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-yellow-600 overflow-hidden">
              <div className="bg-gradient-to-r from-red-700 to-orange-700 p-4 text-center relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-yellow-300 text-xl">⚡</div>
                <h2 className="text-yellow-300 font-black text-xl tracking-wider">DATOS DE BATALLA</h2>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-yellow-300 text-xl">⚡</div>
              </div>
              
              <form onSubmit={manejarEnvio} className="p-6 space-y-5">
                <div>
                  <label className="block text-yellow-200 font-bold text-sm mb-2">🔥 NOMBRE DEL GUERRERO</label>
                  <input 
                    value={carta.Nombre} 
                    onChange={(e) => manejarCambio("Nombre", e.target.value)} 
                    placeholder="Ej. Goku, Vegeta, Piccolo" 
                    className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none transition-colors text-black font-semibold"
                  />
                  {errores.Nombre && <span className="text-red-300 text-xs mt-1 block">{errores.Nombre}</span>}
                </div>

                <div>
                  <label className="block text-yellow-200 font-bold text-sm mb-2">🌪️ TIPO / CLASE</label>
                  <input 
                    value={carta.Tipo} 
                    onChange={(e) => manejarCambio("Tipo", e.target.value)} 
                    placeholder="Ej. Saiyan, Namekusei, Tierra, Dios de la Destrucción" 
                    className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none transition-colors text-black"
                  />
                  {errores.Tipo && <span className="text-red-300 text-xs mt-1 block">{errores.Tipo}</span>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-yellow-200 font-bold text-sm mb-2">❤️ VIDA</label>
                    <input 
                      type="number"
                      min={0}
                      value={carta.vida} 
                      onChange={(e) => manejarCambio("vida", Number(e.target.value))} 
                      className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none text-black font-bold text-center"
                    />
                    {errores.vida && <span className="text-red-300 text-xs block">{errores.vida}</span>}
                  </div>
                  <div>
                    <label className="block text-yellow-200 font-bold text-sm mb-2">⚡ ATAQUE KI</label>
                    <input 
                      type="number" 
                      min={0} 
                      value={carta.Ataque} 
                      onChange={(e) => manejarCambio("Ataque", Number(e.target.value))} 
                      className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none text-black font-bold text-center"
                    />
                    {errores.Ataque && <span className="text-red-300 text-xs block">{errores.Ataque}</span>}
                  </div>
                  <div className="col-span-2">
                    <label className="block text-yellow-200 font-bold text-sm mb-2">🛡️ DEFENSA / RESISTENCIA</label>
                    <input 
                      type="number" 
                      min={0} 
                      value={carta.Defensa} 
                      onChange={(e) => manejarCambio("Defensa", Number(e.target.value))} 
                      className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none text-black font-bold text-center"
                    />
                    {errores.Defensa && <span className="text-red-300 text-xs block">{errores.Defensa}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-200 font-bold text-sm mb-2">📜 DESCRIPCIÓN ÉPICA</label>
                  <textarea 
                    value={carta.Descripcion} 
                    onChange={(e) => manejarCambio("Descripcion", e.target.value)} 
                    placeholder="Describe su técnica, historia o poder..." 
                    rows={3}
                    maxLength={1000}
                    className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none resize-none text-black"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${carta.Descripcion.length > 900 ? 'text-red-400 font-bold' : 'text-yellow-300'}`}>
                      {carta.Descripcion.length}/1000
                    </span>
                    {errores.Descripcion && <span className="text-red-300 text-xs">{errores.Descripcion}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-yellow-200 font-bold text-sm mb-2">🌟 TRANSFORMACIÓN / RAREZA</label>
                  <input 
                    value={carta.Rareza} 
                    onChange={(e) => manejarCambio("Rareza", e.target.value)} 
                    placeholder="Ej. Super Saiyan, Ultra Instinto, Legendario" 
                    className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none text-black"
                  />
                  <p className="text-yellow-300 text-xs mt-1">¡A mayor rareza, más estrellas brillarán en la carta!</p>
                </div>

                <div>
                  <label className="block text-yellow-200 font-bold text-sm mb-2">🖼️ URL DE LA IMAGEN (arte del guerrero)</label>
                  <input 
                    value={carta.Imagen} 
                    onChange={(e) => manejarCambio("Imagen", e.target.value)} 
                    placeholder="https://ejemplo.com/goku.jpg" 
                    className="w-full p-3 bg-orange-100 border-2 border-yellow-600 rounded-xl focus:border-red-600 focus:outline-none text-black"
                  />
                  <p className="text-yellow-300 text-xs mt-1">Debe ser una URL válida que muestre al personaje.</p>
                  {errores.Imagen && <span className="text-red-300 text-xs mt-1 block">{errores.Imagen}</span>}
                </div>

                <div className="flex gap-3 pt-6">
                  <button 
                    type="submit" 
                    disabled={Object.values(errores).some((v) => v && v.length > 0) || !carta.Imagen || carta.Imagen.trim().length === 0 || !imagenValida}
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-red-600 text-black font-extrabold py-3 rounded-xl hover:from-yellow-600 hover:to-red-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg border-2 border-yellow-300"
                  >
                    {esEdicion ? "⚡ ACTUALIZAR GUERRERO ⚡" : "🐉 CREAR CARTA 🐉"}
                  </button>
                  
                  <Link 
                    to='/' 
                    className="flex-1 bg-gray-800/80 text-yellow-300 font-bold py-3 rounded-xl hover:bg-gray-900 transition-all transform hover:scale-105 text-center border border-yellow-600"
                  >
                    CANCELAR
                  </Link>
                </div>
              </form>
            </div>
          </div>

          {/* Vista previa mejorada */}
          <div className="w-full lg:w-auto">
            <div className="sticky top-8">
              <div className="bg-black/30 backdrop-blur-sm rounded-3xl shadow-2xl border-2 border-yellow-600 overflow-hidden">
                <div className="bg-gradient-to-r from-red-700 to-orange-700 p-4 text-center">
                  <h2 className="text-yellow-300 font-black text-xl tracking-wider">✨ VISTA PREVIA DE LA CARTA ✨</h2>
                </div>
                <div className="p-6 flex justify-center">
                  <VistaPreviaCarta 
                    carta={carta} 
                    imagenProcesada={imagenProcesada} 
                    imagenValida={imagenValida} 
                    onImagenStatus={(valid) => setImagenValida(valid)} 
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormularioCarta;