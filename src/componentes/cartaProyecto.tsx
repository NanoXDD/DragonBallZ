type Props = {
    Nombre: string;
    Tipo: string;
    Ataque: number;
    Defensa: number;
    Descripcion: string;
    Imagen: string;
    Debilidad?: string;
    Rareza?: string;
    vida?: number;
    alAbrir?: () => void;
    className?: string;
}

function TarjetaGuerrero({
    Ataque,
    Defensa,
    Imagen,
    Nombre,
    Tipo,
    Rareza = "",
    vida = 0,
    alAbrir,
    className = "",
}: Props) {

    const obtenerColorRareza = (rareza: string) => {
        switch(rareza.toLowerCase()) {
            case "dios":
                return "bg-gradient-to-r from-red-600 to-amber-500";
            case "ssj3":
                return "bg-gradient-to-r from-yellow-600 to-amber-500";
            case "super saiyan":
                return "bg-gradient-to-r from-yellow-500 to-orange-500";
            case "saiyan":
                return "bg-gradient-to-r from-blue-600 to-blue-400";
            default:
                return "bg-orange-600";
        }
    };

    const obtenerColorTipo = (tipo: string) => {
        const tipoLower = tipo.toLowerCase();
        if (tipoLower.includes("guerrero z")) return "from-orange-800 to-orange-600";
        if (tipoLower.includes("namekusei")) return "from-green-800 to-green-600";
        if (tipoLower.includes("androide")) return "from-gray-800 to-gray-600";
        if (tipoLower.includes("kaio-shin")) return "from-purple-800 to-purple-600";
        if (tipoLower.includes("fusión")) return "from-pink-800 to-pink-600";
        if (tipoLower.includes("majin")) return "from-red-900 to-red-700";
        if (tipoLower.includes("dios de la destrucción")) return "from-indigo-900 to-indigo-700";
        return "from-orange-800 to-orange-600";
    };

    return (
        <div 
            className={`
                relative w-80 rounded-xl overflow-hidden cursor-pointer
                bg-linear-to-br ${obtenerColorTipo(Tipo)}
                border-2 border-yellow-500 shadow-[0_0_20px_rgba(255,165,0,0.3)]
                ${className}
            `} 
            onClick={() => alAbrir && alAbrir()}
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>
            
            {Rareza && (
                <span className={`
                    absolute top-3 right-3 z-20
                    ${obtenerColorRareza(Rareza)} text-white 
                    px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
                    shadow-lg border border-white/30
                `}>
                    {Rareza}
                </span>
            )}

            <div className="absolute top-3 left-3 z-20 text-4xl font-black text-white/20 select-none">
                ⚡
            </div>

            <div className="relative m-4 mb-2">
                <div className="absolute -inset-2 bg-linear-to-r from-yellow-600 to-orange-500 rounded-lg blur-sm opacity-50"></div>
                <div className="absolute -inset-1 bg-black rounded-lg transform scale-[1.02]"></div>
                
                <div className="relative z-10 p-1.5 bg-linear-to-br from-orange-700 to-amber-600 rounded-lg shadow-xl">
                    <div className="absolute inset-0 rounded-lg border-2 border-yellow-400/30 pointer-events-none"></div>
                    
                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-400 rounded-tl-lg"></div>
                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-400 rounded-tr-lg"></div>
                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-400 rounded-bl-lg"></div>
                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-400 rounded-br-lg"></div>
                    

                    <img 
                        src={Imagen} 
                        alt={Nombre} 
                        className="relative z-10 w-full h-56 object-contain rounded-md bg-black/40"
                    />
          
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                        <div className="absolute top-1 left-1 w-2 h-2 bg-yellow-400/30 rounded-full blur-sm"></div>
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-orange-500/30 rounded-full blur-md"></div>
                    </div>
                </div>
            </div>

            <div className="p-4 pt-2 relative">
                <h3 className="text-white font-['Black_Ops_One',cursive] text-xl mb-1 text-center 
                    drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] tracking-wider my-[3px]">
                    {Nombre}
                </h3>

                <p className="text-center text-sm text-gray-300 mb-3 italic border-b border-orange-600/50 pb-2">
                    {Tipo}
                </p>

                <div className="grid grid-cols-3 gap-2 mb-3">
                    <div className="bg-black/60 rounded-lg p-2 border border-orange-600/50">
                        <span className="block text-xs text-gray-400 uppercase">Ataque</span>
                        <span className="text-lg font-bold text-yellow-500">{Ataque}</span>
                    </div>
                    <div className="bg-black/60 rounded-lg p-2 border border-blue-600/50">
                        <span className="block text-xs text-gray-400 uppercase">Defensa</span>
                        <span className="text-lg font-bold text-blue-500">{Defensa}</span>
                    </div>
                    <div className="bg-black/60 rounded-lg p-2 border border-green-600/50">
                        <span className="block text-xs text-gray-400 uppercase">Vida</span>
                        <span className="text-lg font-bold text-green-500">{vida}</span>
                    </div>
                </div>
                <div className="absolute bottom-2 right-2 text-yellow-500 opacity-80">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            <div className="absolute bottom-0 right-0 w-12 h-12 bg-linear-to-r from-black/50 to-transparent transform rotate-45 translate-x-6 translate-y-6"></div>
        </div>
    );
}

export default TarjetaGuerrero;