import type { CartaApi } from './interface';

const URL_API = import.meta.env.VITE_API_URL;
const url = `${URL_API}/card`;
const SECRET_KEY = 'Carl155892EZ';

type CartaApiSinId = Omit<CartaApi, 'idCard' | 'createdAt' | 'updatedAt'>;
type CartaApiParaActualizar = Omit<CartaApi, 'idCard' | 'userSecret'>;

export const obtenerCartas = async (): Promise<CartaApi[]> => {
  try {
    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        usersecretpasskey: SECRET_KEY,
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const resultado = await respuesta.json();

    console.log("--- Listado de Guerreros Z ---");
    resultado.data.forEach((carta: CartaApi) => {
      console.log(`Guerrero: ${carta.name} | Ki: ${carta.attack} | Resistencia: ${carta.defense}`);
    });
    console.log(resultado.data)

    console.log(`Total de guerreros: ${resultado.total} | Página: ${resultado.page}`);

    return resultado.data;

  } catch (error) {
    console.error('Error al obtener los datos:', error);
    throw error;
  }
};

export const crearCarta = async (nuevaCarta: CartaApiSinId): Promise<CartaApi> => {
  try {
    const respuesta = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        usersecretpasskey: SECRET_KEY,
      },
      body: JSON.stringify(nuevaCarta),
    });

    const resultado = await respuesta.json();

    if (!respuesta.ok) {
      console.error('❌ Error al crear la carta:', resultado);
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    console.log('✅ Carta creada con éxito:', resultado);
    return resultado.data ?? resultado;
  } catch (error) {
    console.error('Error de red o conexión:', error);
    throw error;
  }
};

export const actualizarCarta = async (
  idCarta: number,
  datosActualizados: CartaApiParaActualizar
): Promise<CartaApi> => {
  try {
    console.log('Actualizando guerrero con datos:', datosActualizados);
    const respuesta = await fetch(`${url}/${idCarta}`, {
      method: 'PATCH', 
      headers: {
        'Content-Type': 'application/json',
        usersecretpasskey: SECRET_KEY,
      },
      body: JSON.stringify(datosActualizados)
    });
    console.log('Respuesta actualización status:', respuesta.status);
    if (respuesta.ok) {
      const resultado = await respuesta.json();
      console.log('Actualización exitosa:', resultado);
      return resultado.data ?? resultado;
    } else {
      const textoError = await respuesta.text();
      console.log('Error respuesta actualización:', textoError);
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }
  } catch (error) {
    console.log('Error red actualización:', error);
    throw error;
  }
};
export const eliminarCarta = async (idCarta: number): Promise<void> => {
  try {
    const respuesta = await fetch(`${url}/${idCarta}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        usersecretpasskey: SECRET_KEY,
      },
      body: JSON.stringify({ userSecret: SECRET_KEY }),
    });

    if (!respuesta.ok) {
      const textoError = await respuesta.text();
      console.error('❌ Error al eliminar la carta:', textoError);
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    console.log(`✅ Carta ${idCarta} eliminada con éxito`);
  } catch (error) {
    console.error('Error en la petición DELETE:', error);
    throw error;
  }
};