type props = {
  Numero: number;
  Nombre: string;
  Tipo: string;
  Ataque: number;
  Defensa: number;
  Descripcion: string;
  Debilidad?: string;
  Imagen?: string;
  onClose?: () => void;
  onDelete?: (numero: number) => void;
};

function Modal({
  Ataque,
  Tipo,
  Defensa,
  Descripcion,
  Nombre,
  Numero,
  Debilidad = "",
  Imagen = "",
  onClose,
  onDelete,
}: props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => onClose && onClose()}
      />

      <div className="relative max-w-2xl w-full">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-600 rounded-2xl blur-md opacity-60"></div>
        
        <div className="relative bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500 rounded-xl border-3 border-yellow-300 p-0.5 shadow-2xl">
          <div className="relative bg-gradient-to-br from-orange-500 to-yellow-500 rounded-lg p-3">
            <div className="flex justify-between items-center mb-2 border-b border-yellow-300/50 pb-1">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black drop-shadow-[0_1px_1px_rgba(255,255,0,0.5)]">
                  {Nombre}
                </h3>
                <p className="text-xs text-black/70 font-semibold">
                  Nivel #{Numero}
                </p>
              </div>
              <button
                className="w-6 h-6 bg-black/50 rounded-full text-yellow-300 font-bold text-sm flex items-center justify-center border border-yellow-300 hover:bg-black/70 transition"
                onClick={() => onClose && onClose()}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-row gap-3">
              {Imagen && (
                <div className="relative w-1/4 min-w-[100px]">
                  <div className="relative bg-gradient-to-br from-orange-600 to-red-600 rounded-md p-0.5 border border-yellow-300">
                    <img 
                      src={Imagen} 
                      alt={Nombre} 
                      className="w-full h-24 object-contain rounded-md bg-black/30"
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-1 bg-black/30 rounded-md p-1.5 border border-yellow-300">
                  <span className="text-yellow-300 text-sm">⚡</span>
                  <span className="text-black text-xs font-bold">Tipo:</span>
                  <span className="ml-auto text-yellow-300 text-xs font-bold bg-black/50 px-2 py-0.5 rounded-full">
                    {Tipo}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-md p-1.5 border border-yellow-300 text-center">
                    <span className="text-yellow-300 text-[10px] block">ATAQUE</span>
                    <span className="text-white font-bold text-sm">{Ataque}</span>
                    <span className="text-yellow-300 text-[10px] ml-0.5">⚡</span>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-md p-1.5 border border-yellow-300 text-center">
                    <span className="text-yellow-300 text-[10px] block">DEFENSA</span>
                    <span className="text-white font-bold text-sm">{Defensa}</span>
                    <span className="text-yellow-300 text-[10px] ml-0.5">🛡️</span>
                  </div>
                </div>

                <div className="bg-black/30 rounded-md p-1.5 border border-yellow-300">
                  <p className="text-xs text-black font-semibold leading-relaxed line-clamp-2">
                    {Descripcion}
                  </p>
                </div>

             
                {Debilidad && (
                  <div className="bg-gradient-to-r from-red-900/50 to-red-700/50 rounded-md p-1.5 border border-red-400">
                    <div className="flex items-center gap-1">
                      <span className="text-red-300 text-sm">⚠️</span>
                      <span className="text-red-300 text-xs font-bold">Debilidad:</span>
                      <span className="ml-auto text-red-200 text-xs font-bold bg-black/30 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                        {Debilidad}
                      </span>
                    </div>
                  </div>
                )}

                {onDelete && (
                  <button
                    className="group relative w-full mt-2 overflow-hidden"
                    onClick={() => onDelete(Numero)}
                  >
                    <div className="relative bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-2 px-3 rounded-full border-2 border-yellow-300 text-sm">
                      <span className="flex items-center justify-center gap-1">
                        <span className="text-base">💥</span>
                        <span className="text-xs"> BORRAR!</span>
                        <span className="text-base">💥</span>
                      </span>
                    </div>
                  </button>
                )}
              </div>
            </div>

    
            <div className="mt-2 h-0.5 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-full opacity-70"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Modal;