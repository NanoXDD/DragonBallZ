export type CartaApi = {
  idCard: number;
  name: string;
  description: string;
  attack: number;
  defense: number;
  lifePoints: number;
  pictureUrl: string;
  attributes: { 
    rareza: string;
    debilidad: string;
    tipo: string;
  };
  userSecret?: string;
  createdAt?: string;
  updatedAt?: string | null;
};

export type Carta = {
  Numero: number;
  Nombre: string;
  Tipo: string;
  Ataque: number;
  Defensa: number;
  Descripcion: string;
  Debilidad: string;
  Rareza: string;
  Imagen: string;
  vida: number;
};

export const aApiActualizarCarta = (carta: Carta): Omit<CartaApi, "idCard" | "userSecret" | "createdAt" | "updatedAt"> => ({
  name: carta.Nombre,
  description: carta.Descripcion,
  attack: carta.Ataque,
  defense: carta.Defensa,
  lifePoints: carta.vida,
  pictureUrl: carta.Imagen,
  attributes: {
    rareza: carta.Rareza,
    debilidad: carta.Debilidad,
    tipo: carta.Tipo
  },
});