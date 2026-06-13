import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { Carta } from "../util/interface";
import TarjetaGuerrero from "../componentes/cartaProyecto";

type Props = {
  cartas: Carta[];
};

type Jugador = "p1" | "p2";

type LogEntry = {
  turno: number;
  atacante: string;
  defensor: string;
  damage: number;
  vidaRestante: number;
};

function CampoDeBatalla({ cartas }: Props) {
  const { id1, id2 } = useParams<{ id1: string; id2: string }>();
  const navigate = useNavigate();
  const [carta1, setCarta1] = useState<Carta | null>(null);
  const [carta2, setCarta2] = useState<Carta | null>(null);
  const [turno, setTurno] = useState(1);
  const [cartaAtacando, setCartaAtacando] = useState<Jugador | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Jugador | null>(null);
  const [draw, setDraw] = useState(false);
  const [autoMode, setAutoMode] = useState(false);
  const [autoInterval, setAutoInterval] = useState(700);

  useEffect(() => {
    if (!id1 || !id2) return;

    const cartaUno = cartas.find((carta) => carta.Numero.toString() === id1);
    const cartaDos = cartas.find((carta) => carta.Numero.toString() === id2);

    if (!cartaUno || !cartaDos) {
      setCarta1(null);
      setCarta2(null);
      return;
    }

    setCarta1({ ...cartaUno });
    setCarta2({ ...cartaDos });
    setTurno(1);
    setCartaAtacando(null);
    setLogs([]);
    setGameOver(false);
    setWinner(null);
    setDraw(false);
  }, [id1, id2, cartas]);

  const checkStalemate = (c1: Carta, c2: Carta) => c1.Ataque <= c2.Defensa && c2.Ataque <= c1.Defensa;

  const calcularDaño = (atacante: Carta, defensor: Carta) => Math.max(0, atacante.Ataque - defensor.Defensa);

  const registrarLog = (turnoLog: number, atacante: Carta, defensor: Carta, damage: number, vidaRestante: number) => {
    setLogs((prev) => [
      ...prev,
      { turno: turnoLog, atacante: atacante.Nombre, defensor: defensor.Nombre, damage, vidaRestante },
    ]);
  };

  // Ejecuta un ataque indicando explícitamente qué jugador ataca
  const ejecutarAtaqueManual = (atacanteJugador: Jugador) => {
    if (!carta1 || !carta2 || gameOver || cartaAtacando || autoMode) return;

    const atacante = atacanteJugador === "p1" ? carta1 : carta2;
    const defensor = atacanteJugador === "p1" ? carta2 : carta1;
    const damage = calcularDaño(atacante, defensor);
    const vidaRestante = Math.max(0, defensor.vida - damage);

    if (atacanteJugador === "p1") setCarta2({ ...carta2, vida: vidaRestante });
    else setCarta1({ ...carta1, vida: vidaRestante });

    registrarLog(turno, atacante, defensor, damage, vidaRestante);
    setCartaAtacando(atacanteJugador);

    if (vidaRestante <= 0) {
      setGameOver(true);
      setWinner(atacanteJugador);
      setAutoMode(false);
      return;
    }

    const carta1Actualizada = atacanteJugador === "p1" ? carta1 : { ...carta1, vida: vidaRestante };
    const carta2Actualizada = atacanteJugador === "p1" ? { ...carta2, vida: vidaRestante } : carta2;

    if (checkStalemate(carta1Actualizada, carta2Actualizada)) {
      setDraw(true);
      setGameOver(true);
      setAutoMode(false);
      return;
    }
  };

  const ejecutarAtaque = () => {
    if (!carta1 || !carta2 || gameOver || cartaAtacando) return;
    const atacanteJugador = turno === 1 ? "p1" : "p2";
    ejecutarAtaqueManual(atacanteJugador);
  };

  const siguienteTurno = () => {
    if (!carta1 || !carta2 || cartaAtacando || gameOver) return;
    ejecutarAtaque();
  };

  const rendirse = () => {
    if (gameOver || !carta1 || !carta2) return;
    setGameOver(true);
    setWinner(turno === 1 ? "p2" : "p1");
    setAutoMode(false);
  };

  useEffect(() => {
    if (!cartaAtacando || gameOver) return;
    const animacion = window.setTimeout(() => {
      setCartaAtacando(null);
      setTurno((prev) => (prev === 1 ? 2 : 1));
    }, 700);

    return () => {
      window.clearTimeout(animacion);
    };
  }, [cartaAtacando, gameOver]);

  // Efecto para auto-batalla
  useEffect(() => {
    if (!autoMode || gameOver) return;
    const id = window.setInterval(() => {
      if (!cartaAtacando && !gameOver) {
        siguienteTurno();
      }
    }, autoInterval);

    return () => window.clearInterval(id);
  }, [autoMode, autoInterval, cartaAtacando, gameOver, carta1, carta2, turno]);

  if (!id1 || !id2 || !carta1 || !carta2) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 text-white">
        <div className="max-w-xl rounded-3xl bg-black/70 p-10 text-center shadow-2xl shadow-orange-900/40">
          <p className="text-lg font-semibold text-orange-200">No hay cartas válidas para la batalla.</p>
          <p className="mt-2 text-sm text-orange-100">Regresa a la selección y elige dos cartas diferentes.</p>
        </div>
      </div>
    );
  }

  if (gameOver) {
    const cartaGanadora = winner === "p1" ? carta1 : carta2;
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12 text-white">
        <div className="max-w-4xl rounded-[2.5rem] bg-gradient-to-br from-slate-900/90 via-black/80 to-orange-950/90 p-10 shadow-2xl shadow-yellow-900/35">
          <div className="space-y-6 text-center">
            <p className="text-xs uppercase tracking-[0.32em] text-orange-300/80">Batalla finalizada</p>
            <h1 className="text-4xl font-black text-yellow-300">{draw ? "Empate técnico" : `Victoria de ${winner === "p1" ? "Jugador 1" : "Jugador 2"}`}</h1>
            <p className="max-w-2xl mx-auto text-sm text-orange-100">{draw ? "Las cartas se neutralizaron y ningún guerrero pudo imponerse." : `${cartaGanadora.Nombre} ha vencido a su oponente con estilo.`}</p>
          </div>
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-200/90">Carta ganadora</p>
              <p className="mt-3 text-2xl font-bold text-yellow-300">{cartaGanadora.Nombre}</p>
              <p className="mt-2 text-sm text-orange-100">Vida restante: {cartaGanadora.vida}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-200/90">Último registro</p>
              {logs.length > 0 ? (
                <div className="mt-4 space-y-3 text-orange-100">
                  <p className="text-sm">Turno {logs[logs.length - 1].turno}</p>
                  <p>{logs[logs.length - 1].atacante} atacó a {logs[logs.length - 1].defensor}</p>
                  <p>Daño: {logs[logs.length - 1].damage}</p>
                </div>
              ) : (
                <p className="mt-4 text-orange-100">No se registró ningún ataque.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const atacanteActual = turno === 1 ? "Jugador 1" : "Jugador 2";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(249,115,22,0.18),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(234,179,8,0.16),_transparent_24%)] px-6 py-10 text-white">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.35em] text-orange-200/80">Campo de batalla</p>
          <div className="mt-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-4xl font-black text-yellow-300">{carta1.Nombre} vs {carta2.Nombre}</h1>
              <p className="mt-2 max-w-xl text-sm text-orange-100">Sigue el combate turno a turno en modo manual — haz click en una carta para atacar.</p>
            </div>
            <div className="rounded-3xl bg-black/50 px-5 py-4 text-center shadow-inner shadow-orange-900/20">
              <p className="text-xs uppercase tracking-[0.35em] text-orange-300/70">Turno actual</p>
              <p className="mt-2 text-xl font-bold text-yellow-300">{atacanteActual}</p>
            </div>
          </div>
        </header>

        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-8 rounded-[2rem] border border-white/10 bg-black/50 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="grid gap-6 lg:grid-cols-2">
                <div
                onClick={() => ejecutarAtaqueManual("p1")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && ejecutarAtaqueManual("p1")}
                className={`rounded-[1.8rem] border border-white/10 p-6 transition ${cartaAtacando === "p1" ? "ring-4 ring-yellow-300/60 bg-orange-950/70" : "bg-slate-950/80"}`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.2em] text-orange-200/80">Jugador 1</p>
                  <div className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-green-300">Vida {carta1.vida}</div>
                </div>
                <TarjetaGuerrero
                  Nombre={carta1.Nombre}
                  Tipo={carta1.Tipo}
                  Ataque={carta1.Ataque}
                  Defensa={carta1.Defensa}
                  Descripcion={carta1.Descripcion}
                  Imagen={carta1.Imagen}
                  Debilidad={carta1.Debilidad}
                  Rareza={carta1.Rareza}
                  vida={carta1.vida}
                />
              </div>

              <div
                onClick={() => ejecutarAtaqueManual("p2")}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && ejecutarAtaqueManual("p2")}
                className={`rounded-[1.8rem] border border-white/10 p-6 transition ${cartaAtacando === "p2" ? "ring-4 ring-yellow-300/60 bg-orange-950/70" : "bg-slate-950/80"}`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <p className="text-sm uppercase tracking-[0.2em] text-orange-200/80">Jugador 2</p>
                  <div className="rounded-full bg-slate-900/80 px-3 py-1 text-xs text-green-300">Vida {carta2.vida}</div>
                </div>
                <TarjetaGuerrero
                  Nombre={carta2.Nombre}
                  Tipo={carta2.Tipo}
                  Ataque={carta2.Ataque}
                  Defensa={carta2.Defensa}
                  Descripcion={carta2.Descripcion}
                  Imagen={carta2.Imagen}
                  Debilidad={carta2.Debilidad}
                  Rareza={carta2.Rareza}
                  vida={carta2.vida}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-200/80">Modo</p>
                  <p className="mt-3 text-lg font-semibold text-yellow-300">{autoMode ? "Auto" : "Manual"}</p>
                  <p className="mt-2 text-sm text-orange-100">{autoMode ? "La batalla avanza automáticamente hasta que termine." : "Haz click en una de las cartas para que ataque a su oponente."}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-orange-200/80">Último ataque</p>
                {logs.length > 0 ? (
                  <div className="mt-3 text-sm text-orange-100">
                    <p>{logs[logs.length - 1].atacante} atacó a {logs[logs.length - 1].defensor}</p>
                    <p className="mt-2">Daño: {logs[logs.length - 1].damage}</p>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-orange-100">Aún no se ha registrado ningún ataque.</p>
                )}
              </div>
            </div>
          </section>

          <aside className="space-y-8 rounded-[2rem] border border-white/10 bg-black/55 p-8 shadow-2xl shadow-black/40 backdrop-blur-xl">
            <div className="rounded-3xl bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-200/80">Controles</p>
              <div className="mt-4 flex flex-col gap-4">
                <button
                  type="button"
                  onClick={siguienteTurno}
                  disabled={Boolean(cartaAtacando) || gameOver || autoMode}
                  className="rounded-full bg-yellow-300 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black transition hover:bg-yellow-200 disabled:cursor-not-allowed disabled:bg-gray-700"
                >
                  {cartaAtacando ? "Golpe en curso..." : "Siguiente turno"}
                </button>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoMode((v) => !v)}
                    disabled={gameOver}
                    className="rounded-full bg-emerald-500 px-6 py-3 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:bg-gray-700"
                  >
                    {autoMode ? "Detener auto-batalla" : "Auto-batalla"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/seleccionar-cartas')}
                  className="rounded-full bg-blue-500 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-blue-400"
                >
                  Volver al mazo
                </button>

                <button
                  type="button"
                  onClick={rendirse}
                  className="rounded-full bg-red-600 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-gray-700"
                >
                  Rendirse
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-orange-200/80">Registro de batalla</p>
              <div className="mt-4 space-y-3 text-orange-100">
                {logs.length === 0 ? (
                  <p className="text-sm">No hay registros aún.</p>
                ) : (
                  logs.slice(-4).reverse().map((log, index) => (
                    <div key={`${log.turno}-${index}`} className="rounded-2xl border border-orange-300/10 bg-black/60 p-3">
                      <p className="text-sm font-semibold text-yellow-300">Turno {log.turno}</p>
                      <p className="text-sm">{log.atacante} atacó a {log.defensor}</p>
                      <p className="text-sm text-orange-200">Daño: {log.damage}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CampoDeBatalla;
 