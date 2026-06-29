import { useNavigate } from 'react-router-dom';

type props = {
  Numero: number;
  Nombre: string;
  Tipo: string;
  Ataque: number;
  Defensa: number;
  Descripcion: string;
  Debilidad?: string;
  Rareza?: string;
  Imagen?: string;
  alCerrar: () => void;
  alEliminar?: () => void;
};

function ModalGuerrero({
  Ataque,
  Tipo,
  Defensa,
  Descripcion,
  Nombre,
  Numero,
  Debilidad = "",
  Rareza = "",
  Imagen = "",
  alCerrar,
  alEliminar,
}: props) {
  const navegar = useNavigate();
  
  const obtenerColorRareza = (rareza: string) => {
    switch(rareza.toLowerCase()) {
      case "dios":
        return {
          borde: "border-red-400",
          bg: "from-red-800 to-red-600",
          texto: "text-red-300",
          brillo: "shadow-red-500/60"
        };
      case "ssj3":
        return {
          borde: "border-amber-400",
          bg: "from-amber-800 to-amber-600",
          texto: "text-amber-300",
          brillo: "shadow-amber-500/60"
        };
      case "super saiyan":
        return {
          borde: "border-yellow-400",
          bg: "from-yellow-800 to-yellow-600",
          texto: "text-yellow-300",
          brillo: "shadow-yellow-500/60"
        };
      case "saiyan":
        return {
          borde: "border-blue-400",
          bg: "from-blue-800 to-blue-600",
          texto: "text-blue-300",
          brillo: "shadow-blue-500/60"
        };
      default:
        return {
          borde: "border-orange-400",
          bg: "from-orange-800 to-orange-600",
          texto: "text-orange-300",
          brillo: "shadow-orange-500/60"
        };
    }
  };

  const manejarEdicion = () => {
    navegar(`/actualizar/${Numero}`, {
      state: {
        Numero,
        Nombre,
        Tipo,
        Ataque,
        Defensa,
        Descripcion,
        Debilidad,
        Rareza,
        Imagen,
      }
    });
    alCerrar();
  };

  const manejarEliminacion = () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${Nombre}?`)) {
      if (alEliminar) {
        alEliminar();
      }
      alCerrar();
    }
  };

  const estiloRareza = obtenerColorRareza(Rareza);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 p-4"
      onClick={alCerrar}
    >
      {/* Fondo con neón naranja y destellos */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-slate-900 to-black">
        {/* Luces de neón pulsantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_rgba(255,165,0,0.15)_0%,_transparent_70%)]"></div>
          
          {/* Rayos de luz naranja */}
          <div className="absolute top-1/4 left-0 w-1/2 h-1/2 bg-gradient-to-r from-orange-500/10 to-transparent rotate-12 blur-2xl"></div>
          <div className="absolute bottom-1/4 right-0 w-1/2 h-1/2 bg-gradient-to-l from-amber-500/10 to-transparent -rotate-12 blur-2xl"></div>
          
          {/* Partículas brillantes */}
          <div className="absolute top-10 left-10 w-3 h-3 bg-orange-400 rounded-full shadow-[0_0_20px_rgba(255,165,0,0.8)] animate-pulse"></div>
          <div className="absolute top-20 right-20 w-2 h-2 bg-amber-300 rounded-full shadow-[0_0_15px_rgba(255,200,0,0.6)] animate-pulse delay-500"></div>
          <div className="absolute bottom-20 left-1/4 w-4 h-4 bg-orange-500 rounded-full shadow-[0_0_25px_rgba(255,165,0,0.9)] animate-pulse delay-1000"></div>
          <div className="absolute bottom-10 right-1/3 w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(255,200,0,0.7)] animate-pulse delay-300"></div>
          <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-orange-300 rounded-full shadow-[0_0_20px_rgba(255,180,0,0.8)] animate-pulse delay-700"></div>
          
          {/* Estrellas estáticas */}
          <div className="absolute top-1/4 left-1/4 text-5xl opacity-20 select-none">✦</div>
          <div className="absolute bottom-1/3 right-1/4 text-4xl opacity-15 select-none">✦</div>
          <div className="absolute top-1/2 right-10 text-3xl opacity-10 select-none">✦</div>
        </div>

        {/* Texto de fondo DRAGON BALL Z con glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl font-black text-orange-500/5 rotate-12 select-none whitespace-nowrap shadow-[0_0_60px_rgba(255,165,0,0.1)]">
          DRAGON BALL Z
        </div>
        
        <div className="absolute bottom-10 right-10 text-7xl font-black text-orange-500/5 -rotate-12 select-none">
          🐉
        </div>
      </div>

      {/* Contenedor principal de la carta (con neón naranja intenso) */}
      <div
        className="
          relative w-96 max-w-full
          bg-gradient-to-b from-slate-900 to-black
          border-4 border-orange-400
          rounded-2xl
          shadow-[0_0_60px_rgba(255,165,0,0.6), inset_0_0_60px_rgba(255,165,0,0.1)]
          animate-[modalAppear_0.3s_ease-out]
          z-10
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Línea de energía superior (neón naranja) */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_20px_#ff8c00]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-400 to-transparent shadow-[0_0_20px_#ff8c00]"></div>

        {/* Esquinas decorativas con brillo neón */}
        <div className="absolute -top-4 -left-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-[0_0_30px_rgba(255,165,0,0.8)] border-2 border-orange-300 animate-pulse">
          武
        </div>
        <div className="absolute -top-4 -right-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-[0_0_30px_rgba(255,165,0,0.8)] border-2 border-orange-300 animate-pulse delay-300">
          闘
        </div>
        <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-[0_0_30px_rgba(255,165,0,0.8)] border-2 border-orange-300 animate-pulse delay-500">
          魂
        </div>
        <div className="absolute -bottom-4 -right-4 w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-[0_0_30px_rgba(255,165,0,0.8)] border-2 border-orange-300 animate-pulse delay-700">
          気
        </div>

        {/* Contenido interior con degradado oscuro y borde neón */}
        <div className="bg-gradient-to-br from-slate-800/95 via-black/95 to-slate-800/95 backdrop-blur-sm rounded-xl m-1 p-6 relative overflow-hidden border border-orange-400/30 shadow-inner shadow-orange-400/20">
          
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-orange-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -left-8 -bottom-8 w-32 h-32 bg-amber-500/20 rounded-full blur-3xl"></div>
          
          <div className="absolute -right-2 -top-2 text-7xl font-black text-orange-500/10 select-none font-mono">
            #{Numero}
          </div>

          {/* Encabezado con nombre y acciones */}
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-3xl animate-pulse">🐉</span>
                <h3 className="font-black text-2xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-orange-400 to-amber-500 drop-shadow-[0_0_20px_rgba(255,165,0,0.5)] tracking-wide">
                  {Nombre}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm flex-wrap">
                <span className="bg-orange-600/80 px-2 py-0.5 rounded-full text-yellow-300 font-mono text-xs border border-orange-400/50 shadow-[0_0_10px_rgba(255,165,0,0.3)]">
                  #{Numero}
                </span>
                <span className="bg-orange-600/80 px-2 py-0.5 rounded-full text-yellow-300 text-xs font-semibold border border-orange-400/50 shadow-[0_0_10px_rgba(255,165,0,0.3)]">
                  {Tipo}
                </span>
                {Rareza && (
                  <span className={`bg-gradient-to-r ${estiloRareza.bg} px-2 py-0.5 rounded-full text-yellow-300 text-xs font-bold border border-${estiloRareza.borde} shadow-[0_0_15px_rgba(255,165,0,0.4)]`}>
                    ⭐ {Rareza}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={alCerrar}
              className="w-8 h-8 rounded-full bg-red-700/90 border-2 border-orange-400
                text-orange-400 text-lg font-bold hover:bg-red-800 hover:border-orange-300
                transition-all duration-300 hover:rotate-90 hover:scale-110 hover:shadow-[0_0_25px_rgba(255,0,0,0.6)]
                flex items-center justify-center shadow-[0_0_15px_rgba(255,165,0,0.3)]"
            >
              ✕
            </button>
          </div>

          {/* Imagen con marco de neón naranja */}
          {Imagen && (
            <div className="relative mb-5 group">
              <div className="absolute -inset-4 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-400 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse shadow-[0_0_40px_rgba(255,165,0,0.4)]"></div>
              
              <div className="relative bg-black/80 rounded-xl p-1 border-2 border-orange-400 shadow-[0_0_30px_rgba(255,165,0,0.3)]">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-orange-400 rounded-tl-lg shadow-[0_0_10px_rgba(255,165,0,0.5)]"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-orange-400 rounded-tr-lg shadow-[0_0_10px_rgba(255,165,0,0.5)]"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-orange-400 rounded-bl-lg shadow-[0_0_10px_rgba(255,165,0,0.5)]"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-orange-400 rounded-br-lg shadow-[0_0_10px_rgba(255,165,0,0.5)]"></div>
                
                <img
                  src={Imagen}
                  alt={Nombre}
                  className="w-full h-56 object-contain rounded-lg bg-black/60"
                />
                
                <div className="absolute inset-0 rounded-xl border-2 border-orange-400/40 pointer-events-none shadow-inner shadow-orange-400/20"></div>
              </div>
            </div>
          )}

          {/* Estadísticas con brillo neón */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-black/70 rounded-xl p-3 border-2 border-red-500/70 shadow-[0_0_20px_rgba(255,0,0,0.2)] hover:shadow-[0_0_30px_rgba(255,0,0,0.4)] transition-shadow">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-400 text-lg">⚡</span>
                <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider">Ataque</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400 font-mono drop-shadow-[0_0_10px_rgba(255,200,0,0.3)]">{Ataque.toLocaleString()}</p>
              <div className="w-full h-2 bg-red-900/60 rounded-full mt-2 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-[0_0_15px_rgba(255,165,0,0.5)]" style={{width: `${Math.min(100, (Ataque/200)*100)}%`}}></div>
              </div>
            </div>
            
            <div className="bg-black/70 rounded-xl p-3 border-2 border-blue-500/70 shadow-[0_0_20px_rgba(0,100,255,0.2)] hover:shadow-[0_0_30px_rgba(0,100,255,0.4)] transition-shadow">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-blue-400 text-lg">🛡️</span>
                <p className="text-xs text-blue-400 font-bold uppercase tracking-wider">Defensa</p>
              </div>
              <p className="text-2xl font-bold text-blue-400 font-mono drop-shadow-[0_0_10px_rgba(0,150,255,0.3)]">{Defensa.toLocaleString()}</p>
              <div className="w-full h-2 bg-blue-900/60 rounded-full mt-2 overflow-hidden shadow-inner">
                <div className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-[0_0_15px_rgba(0,200,255,0.5)]" style={{width: `${Math.min(100, (Defensa/200)*100)}%`}}></div>
              </div>
            </div>
          </div>

          {/* Descripción con borde neón */}
          <div className="mb-4 p-3 bg-black/70 rounded-xl border-2 border-orange-400/40 shadow-[0_0_20px_rgba(255,165,0,0.1)] relative">
            <div className="absolute -top-2 left-4 px-2 bg-orange-600 text-yellow-300 text-xs font-bold rounded-full border border-orange-400/50 shadow-[0_0_15px_rgba(255,165,0,0.3)]">
              DESCRIPCIÓN
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mt-2 drop-shadow-[0_0_5px_rgba(0,0,0,0.5)]">
              "{Descripcion}"
            </p>
          </div>

          {/* Debilidad con estilo neón rojo */}
          {Debilidad && (
            <div className="flex items-center gap-2 p-3 bg-red-900/40 rounded-xl border border-red-500/50 shadow-[0_0_20px_rgba(255,0,0,0.2)] mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-yellow-400 text-lg shadow-[0_0_15px_rgba(255,0,0,0.4)] animate-pulse">
                ⚠️
              </div>
              <div>
                <p className="text-red-400 text-xs font-bold uppercase">Debilidad</p>
                <p className="text-gray-300 text-sm">{Debilidad}</p>
              </div>
            </div>
          )}

          {/* Botones con neón naranja */}
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={manejarEdicion}
              className="py-3 bg-gradient-to-r from-blue-700 to-blue-600 text-white font-bold uppercase tracking-wider text-sm
                rounded-xl border-2 border-orange-400 hover:border-orange-300 hover:from-blue-800 hover:to-blue-700
                transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,165,0,0.4)]
                flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,165,0,0.2)]"
            >
              🔨 Editar
            </button>

            <button
              onClick={manejarEliminacion}
              className="py-3 bg-gradient-to-r from-red-800 to-red-700 text-white font-bold uppercase tracking-wider text-sm
                rounded-xl border-2 border-orange-400 hover:border-orange-300 hover:from-red-900 hover:to-red-800
                transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,0,0,0.4)]
                flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,0,0,0.2)]"
            >
              ☠️ Eliminar
            </button>
          </div>

        </div>
      </div>

      <style>{`
        @keyframes modalAppear {
          0% { transform: scale(0.8) translateY(30px); opacity: 0; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-spin-slow {
          animation: spin 20s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .delay-300 { animation-delay: 0.3s; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}

export default ModalGuerrero;