const url = 'https://educapi-v2.onrender.com/card';

export const obtenerCartas = async () => {
  try {
    const respuesta = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'usersecretpasskey': 'Carl155892EZ'
      }
    });

    if (!respuesta.ok) {
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

    const resultado = await respuesta.json();

    console.log("--- Listado de Cartas ---");
    resultado.data.forEach(carta => {
      console.log(`Carta: ${carta.name} | ATK: ${carta.attack} | DEF: ${carta.defense}`);
    });
    console.log(resultado.data)

    console.log(`Total de cartas: ${resultado.total} | Página: ${resultado.page}`);

    return resultado.data;

  } catch (error) {
    console.error('Error al obtener los datos:', error);
  }
};

export const crearCarta = async (nuevaCarta) => {
  try {
    const respuesta = await fetch(url, {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
        'usersecretpasskey': 'Carl155892EZ'
      },
      body: JSON.stringify(nuevaCarta) 
    });

    const resultado = await respuesta.json();

    if (respuesta.ok) {
      console.log('✅ Carta creada con éxito:');
      console.log(resultado);
      return resultado;
    } else {
      console.error('❌ Error al crear la carta:', resultado);
      throw new Error(`Error HTTP: ${respuesta.status}`);
    }

  } catch (error) {
    console.error('Error de red o conexión:', error);
  }
};

export const actualizarCarta = async (carta, numero, personaje, obtenerCartasActualizadas, setCargando) => {
    setCargando(true); 
    try {
      await fetch(`${url}/${numero}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "usersecretpasskey": "Carl155892EZ"
        },
        body: JSON.stringify(mapearCartaAActualizar(personaje)),
      });
      await obtenerCartasActualizadas();
      console.log("Carta actualizada con éxito");
    } catch (e) {
      console.error("Error al actualizar la carta:", e);
    } finally {
      setCargando(false); 
    }
  };

obtenerCartas();