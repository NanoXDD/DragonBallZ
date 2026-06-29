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


    return (
        <div 
            className={`
                relative w-56 max-w-xs rounded-2xl overflow-hidden cursor-pointer
                bg-gradient-to-b from-slate-900 to-black
                shadow-[0_0_30px_rgba(245,158,11,0.5)]
                flex flex-col
                ${className}
            `} 
            onClick={() => alAbrir && alAbrir()}
        >
            {/* Línea de energía superior */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-80"></div>

            {/* Badge de rareza */}
            {Rareza && (
                <span className={`
                    absolute top-2 right-2 z-20
                    ${obtenerColorRareza(Rareza)} text-white 
                    px-2 py-0.5 rounded-full text-[0.6rem] font-bold uppercase tracking-wider
                    shadow-lg border border-white/30
                `}>
                    {Rareza}
                </span>
            )}

            {/* Icono de energía */}
            <div className="absolute top-2 left-2 z-20 text-lg font-black text-white/20 select-none">
                ⚡
            </div>

            {/* Nombre con degradado */}
            <div className="px-3 pt-3 pb-1 text-center">
                <h3 className="
                    font-black uppercase text-transparent bg-clip-text 
                    bg-gradient-to-r from-yellow-400 to-orange-500
                    text-base tracking-wider drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]
                    font-['Black_Ops_One',cursive]
                ">
                    {Nombre}
                </h3>
            </div>

            {/* Contenedor de imagen con borde cian */}
            <div className="relative mx-3 mb-1">
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg blur-sm opacity-30"></div>
                <div className="relative p-1 bg-black rounded-lg border-2 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.3)]">
                    <img 
                        src={Imagen} 
                        alt={Nombre} 
                        className="w-full h-40 object-contain rounded-md bg-black/60"
                    />
                    {/* Esquinas decorativas en cian */}
                    <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg opacity-60"></div>
                    <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg opacity-60"></div>
                    <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg opacity-60"></div>
                    <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-cyan-400 rounded-br-lg opacity-60"></div>
                </div>
            </div>

            {/* Tipo y estadísticas */}
            <div className="flex-1 px-3 pb-3 pt-1 flex flex-col">
                <p className="text-center text-[0.6rem] text-gray-300 mb-1.5 italic border-b border-orange-600/50 pb-1">
                    {Tipo}
                </p>

                {/* Estadísticas con etiquetas completas */}
                <div className="grid grid-cols-3 gap-1 mb-1">
                    <div className="bg-red-950/50 rounded-md p-1 border border-red-600/50 text-center">
                        <span className="block text-[0.5rem] text-gray-400 uppercase">Ataque</span>
                        <span className="text-sm font-bold text-red-500">{Ataque}</span>
                    </div>
                    <div className="bg-blue-950/50 rounded-md p-1 border border-blue-600/50 text-center">
                        <span className="block text-[0.5rem] text-gray-400 uppercase">Defensa</span>
                        <span className="text-sm font-bold text-blue-500">{Defensa}</span>
                    </div>
                    <div className="bg-green-950/50 rounded-md p-1 border border-green-600/50 text-center">
                        <span className="block text-[0.5rem] text-gray-400 uppercase">Vida</span>
                        <span className="text-sm font-bold text-green-500">{vida}</span>
                    </div>
                </div>

                {/* Flecha decorativa */}
                <div className="absolute bottom-2 right-2 text-yellow-500 opacity-80">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </div>
            </div>

            {/* Sello de energía inferior */}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-linear-to-r from-black/50 to-transparent transform rotate-45 translate-x-4 translate-y-4"></div>
        </div>
    );
}

export default TarjetaGuerrero;