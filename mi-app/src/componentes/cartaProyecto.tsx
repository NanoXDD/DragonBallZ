type Props = {
    Numero: number;
    Nombre: string;
    Tipo: string;
    Ataque: number;
    Defensa: number;
    Descripcion: string;
    Rareza?: string;
    Imagen?: string;
    Debilidad?: string;
    onOpen?: () => void;
    className?: string;
}

function CardDetail({
    Ataque,
    Defensa,
    Imagen,
    Nombre,
    Numero,
    Tipo,
    Rareza,
    onOpen,
    className = "",
}: Props) {
    const getRarityColor = () => {
        if (Rareza?.toLowerCase().includes('legendario') || Rareza?.toLowerCase().includes('legendaria')) {
            return 'from-yellow-400 to-orange-600 border-yellow-300';
        }
        if (Rareza?.toLowerCase().includes('épica') || Rareza?.toLowerCase().includes('epica')) {
            return 'from-purple-500 to-pink-600 border-purple-300';
        }
        if (Rareza?.toLowerCase().includes('rara')) {
            return 'from-blue-500 to-cyan-500 border-blue-300';
        }
        return 'from-green-500 to-emerald-600 border-green-300';
    };



    return (
        
        <div 
            className={`
                relative group cursor-pointer
                ${className}
            `} 
            onClick={() => onOpen && onOpen()}
        >
            <div className={`
                absolute -inset-0.5 bg-gradient-to-r ${getRarityColor()} 
                rounded-2xl blur opacity-30
            `}></div>
            
            <div className={`
                relative bg-gradient-to-br from-orange-400 via-yellow-400 to-orange-500
                rounded-2xl border-4 border-yellow-300 p-4 w-72
                shadow-2xl overflow-hidden
            `}>
                <div className="absolute top-2 left-2 text-yellow-300 text-xs">⭐</div>
                <div className="absolute bottom-2 right-2 text-yellow-300 text-xs">⭐</div>
                <div className="absolute top-1/2 left-1 text-yellow-300 text-xs">⭐</div>

                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-20 h-10 bg-white rounded-full blur-md transform -rotate-12"></div>
                    <div className="absolute bottom-0 right-0 w-24 h-12 bg-white rounded-full blur-md transform rotate-12"></div>
                </div>

                {Rareza && (
                    <div className="absolute -top-2 -right-2 z-20">
                        <div className={`
                            w-12 h-12 rounded-full bg-gradient-to-br ${getRarityColor()}
                            border-3 border-yellow-300 shadow-lg flex items-center justify-center
                            rotate-12
                        `}>
                            <span className="text-white font-bold text-xs text-center leading-tight px-1">
                                {Rareza.substring(0, 3)}
                            </span>
                        </div>
                    </div>
                )}

                <div className="absolute top-2 left-2 z-10">
                    <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 border border-yellow-300">
                        <span className="text-yellow-300 font-bold text-sm">#{Numero}</span>
                    </div>
                </div>
                <div className="relative mt-6 mb-3">
                    <div className={`
                        absolute -inset-2 bg-gradient-to-r ${getRarityColor()} 
                        rounded-full blur-md opacity-30
                    `}></div>
                    
                    <div className="relative bg-gradient-to-br from-orange-600 to-red-600 rounded-xl p-1 border-2 border-yellow-300">
                        <img 
                            src={Imagen || "https://via.placeholder.com/200x200?text=DBZ+Card"} 
                            alt={Nombre} 
                            className="w-full h-48 object-cover rounded-lg border-2 border-yellow-200"
                        />
                    </div>

                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 z-20">
                        <span className="bg-black/70 backdrop-blur-sm text-yellow-300 px-4 py-1 rounded-full text-sm font-bold border border-yellow-400 whitespace-nowrap">
                            ⚡ {Tipo} ⚡
                        </span>
                    </div>
                </div>

                <h3 className="text-center font-bold text-xl mt-4 mb-2 text-black drop-shadow-[0_2px_2px_rgba(255,255,0,0.5)]">
                    {Nombre}
                </h3>

                <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-lg p-2 border border-yellow-300">
                        <div className="text-center">
                            <span className="text-yellow-300 text-xs block">PODER</span>
                            <span className="text-white font-bold text-lg">{Ataque}</span>
                            <span className="text-yellow-300 text-xs ml-1">⚡</span>
                        </div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg p-2 border border-yellow-300">
                        <div className="text-center">
                            <span className="text-yellow-300 text-xs block">DEFENSA</span>
                            <span className="text-white font-bold text-lg">{Defensa}</span>
                            <span className="text-yellow-300 text-xs ml-1">🛡️</span>
                        </div>
                    </div>
                </div>

                <div className="mt-3 h-1 bg-gradient-to-r from-red-500 via-yellow-400 to-blue-500 rounded-full"></div>
            </div>
        </div>
    );
    
}

export default CardDetail;