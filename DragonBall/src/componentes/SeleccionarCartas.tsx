import { useState } from "react";
import { Carta } from "../util/interface";

type Props = {
    mazo:Carta[];
    loading: boolean;
}

function SeleccionarCarta({mazo, loading}: Props) 
{
    const [cartaSeleccionada1, setCartaSeleccionada1] = useState<Carta | null>(null);
    const [cartaSeleccionada2, setCartaSeleccionada2] = useState<Carta | null>(null);
    const [listoBatalla, setListoBatalla] = useState<boolean>(false);
    
    const handleSeleccionarCarta = (carta: Carta) => {
        const isSelected1 = cartaSeleccionada1 ?.idCarta == Carta.idCarta;
        const isSelected2 = cartaSeleccionada2 ?.idCarta == Carta.idCarta;

        if (isSelected1){
            setCartaSeleccionada1(null);
            setListoBatalla(false);
            return;
        }

        if (isSelected2){
            setCartaSeleccionada2(null);
            setListoBatalla(false);
            return;
        }

        if (!setCartaSeleccionada1) {
            setCartaSeleccionada1(carta);
            if (cartaSeleccionada2) setListoBatalla(true);
        }  else if (!cartaSeleccionada2){
            setCartaSeleccionada2(carta);
            setListoBatalla(true)
        }

        }

    <carta
        carta={carta}
        color={carta.attributes.color}
        ancho={260}
        alto={360}
        seleccionada={
            cartaSeleccionada1 ?.idCarta == carta.idCarta || cartaSeleccionada2 ?.idCarta == carta.idCarta
        }
        selectionMode={true}
        />
        </div>
    } 

    

