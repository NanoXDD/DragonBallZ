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
          borde: "border-red-600",
          bg: "from-red-900 to-red-700",
          texto: "text-red-400",
          brillo: "shadow-red-600/50"
        };
      case "ssj3":
        return {
          borde: "border-amber-600",
          bg: "from-amber-900 to-amber-700",
          texto: "text-amber-400",
          brillo: "shadow-amber-600/50"
        };
      case "super saiyan":
        return {
          borde: "border-yellow-600",
          bg: "from-yellow-900 to-yellow-700",
          texto: "text-yellow-400",
          brillo: "shadow-yellow-600/50"
        };
      case "saiyan":
        return {
          borde: "border-blue-600",
          bg: "from-blue-900 to-blue-700",
          texto: "text-blue-400",
          brillo: "shadow-blue-600/50"
        };
      default:
        return {
          borde: "border-orange-600",
          bg: "from-orange-900 to-orange-700",
          texto: "text-orange-400",
          brillo: "shadow-orange-600/50"
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
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${Nombre} }}?`)) {
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
      <div className="absolute inset-0 bg-linear-to-b from-sky-400 to-orange-300">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-20 bg-white/40 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute top-32 right-20 w-40 h-24 bg-white/30 rounded-full blur-xl animate-pulse delay-700"></div>
          <div className="absolute bottom-20 left-1/4 w-36 h-20 bg-white/30 rounded-full blur-xl animate-pulse delay-300"></div>
          <div className="absolute bottom-40 right-1/3 w-28 h-16 bg-white/40 rounded-full blur-xl animate-pulse delay-1000"></div>
        </div>

        <div className="absolute top-1/4 left-1/4 text-7xl animate-spin-slow opacity-20">⭐</div>
        <div className="absolute bottom-1/3 right-1/4 text-6xl animate-spin-slow delay-500 opacity-20">⭐</div>
        <div className="absolute top-1/2 right-10 text-5xl animate-spin-slow delay-1000 opacity-15">⭐</div>


        <div className="absolute top-5 right-5 w-16 h-16 rounded-full bg-orange-500/20 blur-md animate-pulse"></div>
        <div className="absolute bottom-5 left-5 w-12 h-12 rounded-full bg-orange-500/20 blur-md animate-pulse delay-500"></div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-7xl font-black text-black/10 rotate-12 select-none whitespace-nowrap">
          DRAGON BALL Z
        </div>
        
        <div className="absolute bottom-10 right-10 text-6xl font-black text-black/10 -rotate-12 select-none">
          🐉
        </div>
      </div>

      <div
        className="
          relative w-96 max-w-full
  from-orange-500 via-red-600 to-orange-700
          border-4 border-orange-600
          rounded-2xl
          shadow-[0_0_30px_rgba(255,215,0,0.6)]
          animate-[modalAppear_0.3s_ease-out]
          z-10
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute -top-3 -left-3 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg">
          武
        </div>
        <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg">
          闘
        </div>
        <div className="absolute -bottom-3 -left-3 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg">
          魂
        </div>
        <div className="absolute -bottom-3 -right-3 w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg">
          気
        </div>

<div className="bg-linear-to-br from-orange-900/95 via-red-900/95 to-orange-900/95 backdrop-blur-sm rounded-xl m-1 p-6 relative overflow-hidden border border-orange-500/50">
          
          <div className="absolute -right-8 -top-8 w-24 h-24 bg-orange-500/20 rounded-full blur-2xl"></div>
          
          <div className="absolute -right-2 -top-2 text-7xl font-black text-orange-500/20 select-none font-mono">
            #{Numero}
          </div>

          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">🐉</span>
                <h3 className="font-bold text-xl text-yellow-400 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wide">
                  {Nombre}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="bg-red-600/80 px-2 py-0.5 rounded-full text-yellow-300 font-mono text-xs">
                  #{Numero}
                </span>
                <span className="bg-orange-600/80 px-2 py-0.5 rounded-full text-yellow-300 text-xs font-semibold">
                  {Tipo}
                </span>
                {Rareza && (
                  <span className={`bg-linear-to-r ${estiloRareza.bg} px-2 py-0.5 rounded-full text-yellow-300 text-xs font-bold`}>
                    ⭐ {Rareza}
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={alCerrar}
              className="w-8 h-8 rounded-full bg-red-600/80 border-2 border-yellow-500
                text-yellow-400 text-lg font-bold hover:bg-red-700 hover:border-yellow-400
                transition-all duration-300 hover:rotate-90 hover:scale-110
                flex items-center justify-center shadow-lg"
            >
              ✕
            </button>
          </div>

          {Imagen && (
            <div className="relative mb-6 group">
              <div className="absolute -inset-3 bg-linear-to-r from-yellow-400 via-orange-500 to-red-600 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity animate-pulse"></div>
              
              <div className="relative bg-black/60 rounded-xl p-1 border-2 border-yellow-500 shadow-lg">
                <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg"></div>
                <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg"></div>
                <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-yellow-400 rounded-br-lg"></div>
                
                <img
                  src={Imagen}
                  alt={Nombre}
                  className="w-full h-48 object-contain rounded-lg bg-linear-to-br from-orange-900/50 to-red-900/50"
                />
                
                
                <div className="absolute inset-0 rounded-xl border-2 border-yellow-500/30 pointer-events-none"></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-black/60 rounded-xl p-4 border-2 border-red-600/50 shadow-lg">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-yellow-500 text-lg">⚡</span>
                <p className="text-xs text-yellow-400 font-semibold uppercase tracking-wider">Poder de Ataque</p>
              </div>
              <p className="text-2xl font-bold text-yellow-400 font-mono">{Ataque.toLocaleString()}</p>
              <div className="w-full h-1.5 bg-red-900/50 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-linear-to-r from-yellow-500 to-orange-500 rounded-full" style={{width: `${(Ataque/200)*100}%`}}></div>
              </div>
            </div>
            
            <div className="bg-black/60 rounded-xl p-4 border-2 border-blue-600/50 shadow-lg">
              <div className="flex items-center gap-1 mb-1">
                <span className="text-blue-400 text-lg">🛡️</span>
                <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Poder de Defensa</p>
              </div>
              <p className="text-2xl font-bold text-blue-400 font-mono">{Defensa.toLocaleString()}</p>
              <div className="w-full h-1.5 bg-blue-900/50 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-linear-to-r from-blue-500 to-cyan-500 rounded-full" style={{width: `${(Defensa/200)*100}%`}}></div>
              </div>
            </div>
          </div>

          <div className="mb-6 p-4 bg-black/50 rounded-xl border-2 border-yellow-500/30 relative">
            <div className="absolute -top-2 left-4 px-2 bg-red-600 text-yellow-400 text-xs font-bold rounded-full">
              DESCRIPCIÓN
            </div>
            <p className="text-gray-200 text-sm leading-relaxed mt-2">
              "{Descripcion}"
            </p>
          </div>

          {Debilidad && (
            <div className="flex items-center gap-2 p-3 bg-red-900/40 rounded-xl border border-red-600/50 mb-6">
              <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-yellow-400 text-lg">
                ⚠️
              </div>
              <div>
                <p className="text-red-400 text-xs font-bold uppercase">Debilidad</p>
                <p className="text-gray-200 text-sm">{Debilidad}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={manejarEdicion}
              className="py-3 bg-linear-to-r from-blue-700 to-blue-600 text-white font-bold uppercase tracking-wider text-sm
                rounded-xl border-2 border-yellow-500 hover:border-yellow-400 hover:from-blue-800 hover:to-blue-700
                transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                flex items-center justify-center gap-2"
            >
              🔨 Editar
            </button>

            <button
              onClick={manejarEliminacion}
              className="py-3 bg-linear-to-r from-red-800 to-red-700 text-white font-bold uppercase tracking-wider text-sm
                rounded-xl border-2 border-yellow-500 hover:border-yellow-400 hover:from-red-900 hover:to-red-800
                transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg
                flex items-center justify-center gap-2"
            >
              ☠️ Eliminar
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}

export default ModalGuerrero;