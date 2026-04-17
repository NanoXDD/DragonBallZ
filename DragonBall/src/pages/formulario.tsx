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

const VistaPreviaCarta = ({ carta, imagenProcesada, imagenValida, onImagenStatus }: { carta: Carta; imagenProcesada: string; imagenValida: boolean; onImagenStatus: (valid: boolean) => void }) => {
  return (
    <div className="w-80 bg-linear-to-b from-orange-50 to-white rounded-2xl border-2 border-orange-400 overflow-hidden shadow-2xl">

      <div className="bg-linear-to-r from-orange-600 to-red-600 p-3 text-center">
        <h3 className="text-black font-bold text-lg tracking-wider">CARTA DE GUERRERO</h3>
      </div>

      <div className="p-6">
        <div className="mb-6 bg-gray-100 rounded-lg h-40 flex items-center justify-center border-2 border-orange-300">
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
                <p className="text-black font-bold">Error cargando imagen</p>
                <p className="text-red-500 text-xs mt-1">Verifica la URL y prueba con otra imagen.</p>
              </div>
            )
          ) : (
            <div className="text-center">
              <div className="text-5xl mb-2">⚡</div>
              <p className="text-black text-sm">Sin imagen</p>
            </div>
          )}
        </div>

     
        <div className="text-center mb-6">
          <h4 className="text-black font-bold text-xl mb-1">
            {carta.Nombre || "Nombre de la carta"}
          </h4>
          <p className="text-black text-sm font-semibold">
            {carta.Tipo || "Tipo de carta"}
          </p>
        </div>

       
        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center bg-red-50 p-2 rounded-lg border border-red-200">
            <span className="text-black font-bold text-sm">⚡ ATAQUE</span>
            <span className="text-black font-bold text-xl">{carta.Ataque}</span>
          </div>
          <div className="flex justify-between items-center bg-blue-50 p-2 rounded-lg border border-blue-200">
            <span className="text-black font-bold text-sm">🛡️ DEFENSA</span>
            <span className="text-black font-bold text-xl">{carta.Defensa}</span>
          </div>
          <div className="flex justify-between items-center bg-green-50 p-2 rounded-lg border border-green-200">
            <span className="text-black font-bold text-sm">❤️ VIDAS</span>
            <span className="text-black font-bold text-xl">{carta.vida}</span>
          </div>
        </div>

        {/* Descripción */}
        {carta.Descripcion && (
          <div className="bg-orange-50 p-2 rounded-lg border border-orange-200">
            <p className="text-black text-xs italic text-center">
              "{carta.Descripcion}"
            </p>
          </div>
        )}

        {/* Rareza */}
        {carta.Rareza && (
          <div className="mt-4 text-center">
            <span className="inline-block bg-linear-to-r from-yellow-400 to-orange-400 text-black text-xs px-3 py-1 rounded-full font-bold">
              ⭐ {carta.Rareza} ⭐
            </span>
          </div>
        )}
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
    vida: 0
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
      <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-orange-100 to-yellow-100">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-300 border-t-orange-600"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl">🐉</span>
            </div>
          </div>
          <p className="text-black font-bold mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-100 via-yellow-50 to-orange-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex-1"></div>
          <div className="text-center flex-1">
            <h1 className="text-4xl font-bold bg-linear-to-r from-orange-600 to-red-600 bg-clip-text text-transparent inline-block my-[3px]">
              {esEdicion ? "✏️ EDITAR CARTA" : "✨ CREAR CARTA"}
            </h1>
            <div className="flex justify-center gap-2 mt-2">
              <div className="w-12 h-5 "></div>
              <div className="w-6 h-5 "></div>
              <div className="w-12 h-5 "></div>
            </div>
          </div>
          
  
          <div className="flex-1 flex justify-end">
            <button
              onClick={() => navegar('/')}
              className="bg-linear-to-r from-orange-500 to-red-500 text-black font-bold py-2 px-6 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 group"
            >
              <span className="text-xl group-hover:rotate-9 transition-transform"></span>
              <span>VER CARTAS</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform p-5">→</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-14 justify-center">
        
          <div className="w-full lg:w-96">
            <div className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
              <div className="bg-linear-to-r from-orange-500 to-red-500 p-4">
                <h2 className="text-black font-bold text-center text-lg">INFORMACIÓN DE LA CARTA</h2>
              </div>
              
              <form onSubmit={manejarEnvio} className="p-6 space-y-6">
          
                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    NOMBRE
                  </label>
                  <input 
                    value={carta.Nombre} 
                    onChange={(e) => manejarCambio("Nombre", e.target.value)} 
                    placeholder="Ej. Goku" 
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-black"
                  />
                  {errores.Nombre && <span className="text-red-500 text-xs mt-1 block">{errores.Nombre}</span>}
                </div>

         
                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    TIPO
                  </label>
                  <input 
                    value={carta.Tipo} 
                    onChange={(e) => manejarCambio("Tipo", e.target.value)} 
                    placeholder="Ej. Guerrero Saiyan" 
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-black"
                  />
                  {errores.Tipo && <span className="text-red-500 text-xs mt-1 block">{errores.Tipo}</span>}
                </div>

                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    VIDA
                  </label>
                  <input 
                    type="number"
                    min={0}
                    value={carta.vida} 
                    onChange={(e) => manejarCambio("vida", Number(e.target.value))} 
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-black"
                  />
                  {errores.vida && <span className="text-red-500 text-xs mt-1 block">{errores.vida}</span>}
                </div>

                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    ATAQUE
                  </label>
                  <input 
                    type="number" 
                    min={0} 
                    value={carta.Ataque} 
                    onChange={(e) => manejarCambio("Ataque", Number(e.target.value))} 
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-black"
                  />
                  {errores.Ataque && <span className="text-red-500 text-xs mt-1 block">{errores.Ataque}</span>}
                </div>

            
                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    DEFENSA
                  </label>
                  <input 
                    type="number" 
                    min={0} 
                    value={carta.Defensa} 
                    onChange={(e) => manejarCambio("Defensa", Number(e.target.value))} 
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-black"
                  />
                  {errores.Defensa && <span className="text-red-500 text-xs mt-1 block">{errores.Defensa}</span>}
                </div>

            
                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    DESCRIPCIÓN
                  </label>
                  <textarea 
                    value={carta.Descripcion} 
                    onChange={(e) => manejarCambio("Descripcion", e.target.value)} 
                    placeholder="Descripción (mínimo 10 caracteres)" 
                    rows={3}
                    maxLength={1000}
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors resize-none text-black"
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span className={`text-xs ${carta.Descripcion.length > 900 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                      {carta.Descripcion.length}/1000 caracteres
                    </span>
                    {errores.Descripcion && <span className="text-red-500 text-xs">{errores.Descripcion}</span>}
                  </div>
                </div>

                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    TRANSFORMACIÓN (OPCIONAL)
                  </label>
                  <input 
                    value={carta.Rareza} 
                    onChange={(e) => manejarCambio("Rareza", e.target.value)} 
                    placeholder="Ej. Super Saiyan" 
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-black"
                  />
                </div>

           
                <div>
                  <label className="block text-black font-bold text-sm mb-2">
                    IMAGEN URL
                  </label>
                  <input 
                    value={carta.Imagen} 
                    onChange={(e) => manejarCambio("Imagen", e.target.value)} 
                    placeholder="https://ejemplo.com/imagen.jpg" 
                    className="w-full p-2 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors text-black"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Debes ingresar una URL de imagen válida para crear la carta.
                  </p>
                  {errores.Imagen && <span className="text-red-500 text-xs mt-1 block">{errores.Imagen}</span>}
                </div>

          
                <div className="flex gap-3 pt-4">
                  <button 
                    type="submit" 
                    disabled={Object.values(errores).some((v) => v && v.length > 0) || !carta.Imagen || carta.Imagen.trim().length === 0 || !imagenValida}
                    className="flex-1 bg-linear-to-r from-orange-500 to-red-500 text-black font-bold py-2 rounded-lg hover:from-orange-600 hover:to-red-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {esEdicion ? "ACTUALIZAR" : "CREAR"}
                  </button>
                  
                  <Link 
                    to='/' 
                    className="flex-1 bg-gray-300 text-black font-bold py-2 rounded-lg hover:bg-gray-400 transition-all transform hover:scale-105 text-center"
                  >
                    CANCELAR
                  </Link>
                </div>
              </form>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <div className="sticky top-8">
              <div className="bg-white rounded-2xl shadow-xl border border-orange-200 overflow-hidden">
                <div className="bg-linear-to-r from-orange-500 to-red-500 p-4">
                  <h2 className="text-black font-bold text-center text-lg">VISTA PREVIA</h2>
                </div>
                <div className="p-6 flex justify-center">
                  <VistaPreviaCarta carta={carta} imagenProcesada={imagenProcesada} imagenValida={imagenValida} onImagenStatus={(valid) => setImagenValida(valid)} />
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