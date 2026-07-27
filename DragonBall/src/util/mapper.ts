import type { Carta, CartaApi } from "./interface";

export const aApiCarta = (carta: Carta): CartaApi => ({
  idCard: carta.Numero,       
  name: carta.Nombre,
  description: carta.Descripcion,
  attack: carta.Ataque,
  defense: carta.Defensa,
  lifePoints: carta.vida,
  pictureUrl: carta.Imagen,
  attributes: { 
    debilidad: carta.Debilidad,
    rareza: carta.Rareza,
    tipo: carta.Tipo
  },
});

export const aApiCartaCrear = (carta: Carta): Omit<Omit<Omit<CartaApi, "idCard">, "createdAt">, "updatedAt"> => ({   
  name: carta.Nombre,
  description: carta.Descripcion.substring(0,1000),
  attack: carta.Ataque,
  defense: carta.Defensa,
  lifePoints: carta.vida || 1,
  pictureUrl: carta.Imagen,
  attributes: { 
    debilidad: carta.Debilidad,
    rareza: carta.Rareza,
    tipo: carta.Tipo
  },
});

export const aApiActualizarCarta = (carta: Carta): Omit<CartaApi, "idCard"> => ({
  name: carta.Nombre,
  description: carta.Descripcion.substring(0,1000),
  attack: carta.Ataque,
  defense: carta.Defensa,
  lifePoints: carta.vida || 1,
  pictureUrl: carta.Imagen,
  attributes: {
    rareza: carta.Rareza,
    debilidad: carta.Debilidad,
    tipo: carta.Tipo
  },
  userSecret: "Carl155892EZ",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});


// mapper.ts - modificar desdeApiCarta

export const desdeApiCarta = (a: CartaApi): Carta => ({
  Numero: a.idCard ?? 0,
  Nombre: a.name ?? 'Sin nombre',
  Tipo: a.attributes?.tipo ?? 'Desconocido',
  Ataque: a.attack ?? 0,
  Defensa: a.defense ?? 0,
  Descripcion: a.description ?? '',
  Debilidad: a.attributes?.debilidad ?? 'Ninguna',
  Rareza: a.attributes?.rareza ?? 'Común',
  Imagen: a.pictureUrl ?? '',
  vida: a.lifePoints ?? 0,
  idCard: a.idCard ?? undefined,
  attributes: a.attributes ?? undefined
});