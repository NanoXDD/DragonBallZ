import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [turno, setTurno] = useState<Jugador>("p1");
  const [cartaAtacando, setCartaAtacando] = useState<Jugador | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState<Jugador | null>(null);
  const [draw, setDraw] = useState(false);
  const [autoBattle, setAutoBattle] = useState(false);
  const timeoutRef = useRef<number | null>(null);
  const [shakingCard, setShakingCard] = useState<Jugador | null>(null);

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
    setTurno("p1");
    setCartaAtacando(null);
    setLogs([]);
    setGameOver(false);
    setWinner(null);
    setDraw(false);
    setAutoBattle(false);
    setShakingCard(null);
  }, [cartas, id1, id2]);

  const calcularDaño = (atacante: Carta, defensor: Carta) => {
    const daño = atacante.Ataque - defensor.Defensa;
    return daño > 0 ? daño : 1;
  };

  const isStalemate = (c1: Carta, c2: Carta) =>
    c1.Ataque <= c2.Defensa && c2.Ataque <= c1.Defensa;

  const registrarLog = (
    atacante: Carta,
    defensor: Carta,
    damage: number,
    vidaRestante: number
  ) => {
    setLogs((prev) => [
      ...prev,
      {
        turno: prev.length + 1,
        atacante: atacante.Nombre,
        defensor: defensor.Nombre,
        damage,
        vidaRestante,
      },
    ]);
  };

  const getDamageClass = (vida: number) => {
    if (vida <= 0) return "carta-destruida";
    if (vida <= 25) return "carta-rota";
    if (vida <= 75) return "carta-daniada";
    return "carta-sana";
  };

  const finalizarAnimacionGolpe = () => {
    setCartaAtacando(null);
    setTurno((prev) => (prev === "p1" ? "p2" : "p1"));
  };

  const ejecutarAtaque = (atacanteJugador: Jugador) => {
    if (!carta1 || !carta2 || gameOver || cartaAtacando) return;

    const atacante = atacanteJugador === "p1" ? carta1 : carta2;
    const defensor = atacanteJugador === "p1" ? carta2 : carta1;
    const damage = calcularDaño(atacante, defensor);
    const vidaRestante = Math.max(0, defensor.vida - damage);

    setCartaAtacando(atacanteJugador);
    setShakingCard(atacanteJugador === "p1" ? "p2" : "p1");
    window.setTimeout(() => setShakingCard(null), 360);

    if (atacanteJugador === "p1") {
      setCarta2((prev) => (prev ? { ...prev, vida: vidaRestante } : prev));
    } else {
      setCarta1((prev) => (prev ? { ...prev, vida: vidaRestante } : prev));
    }

    registrarLog(atacante, defensor, damage, vidaRestante);

    if (vidaRestante <= 0) {
      setGameOver(true);
      setWinner(atacanteJugador);
      setAutoBattle(false);
    }
  };

  const ejecutarAtaqueManual = () => {
    if (!carta1 || !carta2 || gameOver || cartaAtacando || autoBattle) return;
    if (isStalemate(carta1, carta2)) {
      setDraw(true);
      setGameOver(true);
      setAutoBattle(false);
      return;
    }
    ejecutarAtaque(turno);
  };

  const ejecutarAtaqueAutomatico = () => {
    if (!carta1 || !carta2 || gameOver || cartaAtacando || !autoBattle) return;
    if (isStalemate(carta1, carta2)) {
      setDraw(true);
      setGameOver(true);
      setAutoBattle(false);
      return;
    }
    ejecutarAtaque(turno);
  };

  const siguienteTurno = () => {
    if (!carta1 || !carta2 || cartaAtacando || gameOver) return;
    if (autoBattle) {
      ejecutarAtaqueAutomatico();
      return;
    }
    ejecutarAtaque(turno);
  };

  const rendirse = () => {
    if (!carta1 || !carta2 || gameOver) return;
    setGameOver(true);
    setWinner(turno === "p1" ? "p2" : "p1");
    setAutoBattle(false);
  };

  useEffect(() => {
    if (!cartaAtacando) return;
    const timer = window.setTimeout(finalizarAnimacionGolpe, 700);
    return () => window.clearTimeout(timer);
  }, [cartaAtacando, gameOver]);

  useEffect(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!autoBattle || gameOver || cartaAtacando) return;
    timeoutRef.current = window.setTimeout(() => {
      if (!gameOver && !cartaAtacando) ejecutarAtaqueAutomatico();
    }, 700);
    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [autoBattle, cartaAtacando, gameOver, turno, carta1, carta2]);

  const resultadoBatalla = gameOver
    ? draw
      ? "Empate épico"
      : winner === "p1"
      ? `${carta1?.Nombre ?? "Jugador 1"} gana!`
      : `${carta2?.Nombre ?? "Jugador 2"} gana!`
    : `${turno === "p1" ? "Jugador 1" : "Jugador 2"} ataca`;

  const turnoLabel = turno === "p1" ? "Jugador 1" : "Jugador 2";
  const ventajaActual =
    carta1 && carta2
      ? carta1.vida === carta2.vida
        ? "Empate momentáneo"
        : carta1.vida > carta2.vida
        ? "Jugador 1 lidera"
        : "Jugador 2 lidera"
      : "Preparando batalla...";

  const deshabilitarSiguiente = Boolean(cartaAtacando) || gameOver || autoBattle;

  if (!id1 || !id2 || !carta1 || !carta2) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0a0c10",
          color: "#fff",
          display: "grid",
          placeItems: "center",
          padding: "2rem",
        }}
      >
        <div
          style={{
            background: "#141923",
            borderRadius: "1.5rem",
            padding: "2rem",
            border: "1px solid #ff8c00",
            maxWidth: "540px",
            textAlign: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#ffca08" }}>Ruta inválida</h2>
          <p style={{ margin: "1rem 0", color: "#cbd5e1" }}>
            Selecciona dos cartas válidas para iniciar la batalla.
          </p>
          <button
            style={{
              padding: "0.9rem 1.3rem",
              borderRadius: "999px",
              border: "none",
              background: "#f97316",
              color: "#fff",
              cursor: "pointer",
            }}
            onClick={() => navigate("/seleccionar-cartas")}
          >
            Volver a selección
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0a0c10 0%, #1a1f2e 100%)",
        color: "#fff",
        padding: "24px",
      }}
    >
      <style>{`
        .shake-card { animation: shakeCard 0.4s ease-in-out 0s 1; }
        @keyframes shakeCard { 0% { transform: translate(0,0); } 20% { transform: translate(-4px,0); } 40% { transform: translate(4px,0); } 60% { transform: translate(-2px,0); } 80% { transform: translate(2px,0); } 100% { transform: translate(0,0); } }
        .carta-sana { filter: none; }
        .carta-daniada { filter: saturate(0.8) brightness(0.95); }
        .carta-rota { filter: grayscale(0.4) brightness(0.75); }
        .carta-destruida { filter: grayscale(1) brightness(0.6); }
        .tarjeta-activa { box-shadow: 0 0 24px rgba(255,255,255,0.35) !important; }
      `}</style>

      <div style={{ maxWidth: "1240px", margin: "0 auto" }}>
        <header style={{ textAlign: "center", marginBottom: "28px" }}>
          <p
            style={{
              margin: 0,
              letterSpacing: "4px",
              color: "#94a3b8",
              textTransform: "uppercase",
            }}
          >
            Torneo de Poder
          </p>
          <h1
            style={{
              margin: "12px 0",
              fontSize: "2.8rem",
              color: "#ffca08",
            }}
          >
            {carta1.Nombre} <span style={{ color: "#fff" }}>VS</span>{" "}
            {carta2.Nombre}
          </h1>
          <div
            style={{
              display: "inline-flex",
              gap: "12px",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: "10px",
            }}
          >
            <span
              style={{
                background: "#1f2937",
                padding: "10px 18px",
                borderRadius: "999px",
                border: "1px solid #334155",
              }}
            >
              Turno: {turnoLabel}
            </span>
            <span
              style={{
                background: "#111827",
                padding: "10px 18px",
                borderRadius: "999px",
                border: "1px solid #334155",
              }}
            >
              {resultadoBatalla}
            </span>
          </div>
        </header>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 340px",
            gap: "28px",
          }}
        >
          <section
            style={{
              background: "rgba(15,23,42,0.78)",
              borderRadius: "1.5rem",
              padding: "24px",
              border: "1px solid rgba(148,163,184,0.12)",
            }}
          >
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "space-between",
              }}
            >
              {/* Jugador 1 */}
              <div
                onClick={ejecutarAtaqueManual}
                className={shakingCard === "p1" ? "shake-card" : ""}
                style={{
                  flex: "1 1 320px",
                  minWidth: "300px",
                  background: "rgba(255,97,0,0.12)",
                  borderRadius: "1.5rem",
                  padding: "18px",
                  cursor:
                    gameOver || autoBattle || cartaAtacando
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: gameOver
                    ? winner === "p1"
                      ? "0 0 28px rgba(34,197,94,0.3)"
                      : "0 0 20px rgba(239,68,68,0.25)"
                    : cartaAtacando === "p1"
                    ? "0 0 24px rgba(255,202,8,0.4)"
                    : "0 12px 28px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#f97316" }}>
                    Jugador 1
                  </span>
                  <span>❤️ {carta1.vida} HP</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "14px",
                    borderRadius: "999px",
                    overflow: "hidden",
                    background: "#0f172a",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, carta1.vida))}%`,
                      height: "100%",
                      background:
                        carta1.vida > 50
                          ? "#22c55e"
                          : carta1.vida > 25
                          ? "#fbbf24"
                          : "#ef4444",
                      transition: "width 0.4s ease",
                    }}
                  />
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
                  className={`${getDamageClass(carta1.vida)} ${
                    cartaAtacando === "p1" ? "tarjeta-activa" : ""
                  }`}
                />
              </div>

              {/* Jugador 2 */}
              <div
                onClick={ejecutarAtaqueManual}
                className={shakingCard === "p2" ? "shake-card" : ""}
                style={{
                  flex: "1 1 320px",
                  minWidth: "300px",
                  background: "rgba(29,78,216,0.12)",
                  borderRadius: "1.5rem",
                  padding: "18px",
                  cursor:
                    gameOver || autoBattle || cartaAtacando
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: gameOver
                    ? winner === "p2"
                      ? "0 0 28px rgba(34,197,94,0.3)"
                      : "0 0 20px rgba(239,68,68,0.25)"
                    : cartaAtacando === "p2"
                    ? "0 0 24px rgba(34,211,238,0.4)"
                    : "0 12px 28px rgba(0,0,0,0.18)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <span style={{ fontWeight: 700, color: "#22d3ee" }}>
                    Jugador 2
                  </span>
                  <span>❤️ {carta2.vida} HP</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: "14px",
                    borderRadius: "999px",
                    overflow: "hidden",
                    background: "#0f172a",
                    marginBottom: "16px",
                  }}
                >
                  <div
                    style={{
                      width: `${Math.max(0, Math.min(100, carta2.vida))}%`,
                      height: "100%",
                      background:
                        carta2.vida > 50
                          ? "#22c55e"
                          : carta2.vida > 25
                          ? "#fbbf24"
                          : "#ef4444",
                      transition: "width 0.4s ease",
                    }}
                  />
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
                  className={`${getDamageClass(carta2.vida)} ${
                    cartaAtacando === "p2" ? "tarjeta-activa" : ""
                  }`}
                />
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "18px",
                marginTop: "24px",
              }}
            >
              <div
                style={{
                  background: "#111827",
                  borderRadius: "1rem",
                  padding: "18px",
                  borderLeft: "5px solid #f97316",
                }}
              >
                <p style={{ margin: 0, color: "#f97316", fontWeight: 700 }}>
                  Modo
                </p>
                <p style={{ margin: "10px 0 0 0", color: "#cbd5e1" }}>
                  {autoBattle ? "Auto-batalla activa" : "Manual"}
                </p>
              </div>
              <div
                style={{
                  background: "#111827",
                  borderRadius: "1rem",
                  padding: "18px",
                  borderLeft: "5px solid #ef4444",
                }}
              >
                <p style={{ margin: 0, color: "#ef4444", fontWeight: 700 }}>
                  Estado
                </p>
                <p style={{ margin: "10px 0 0 0", color: "#cbd5e1" }}>
                  {ventajaActual}
                </p>
              </div>
            </div>
          </section>

          <aside
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <div
              style={{
                background: "#111827",
                borderRadius: "1.5rem",
                padding: "22px",
                border: "1px solid rgba(148,163,184,0.12)",
              }}
            >
              <h3 style={{ margin: 0, color: "#facc15" }}>Controles</h3>
              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  marginTop: "18px",
                }}
              >
                <button
                  onClick={siguienteTurno}
                  disabled={deshabilitarSiguiente}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: deshabilitarSiguiente
                      ? "#334155"
                      : "#f97316",
                    color: "#fff",
                    cursor: deshabilitarSiguiente
                      ? "not-allowed"
                      : "pointer",
                  }}
                >
                  {cartaAtacando ? "¡Cargando Ki!..." : "⚡ Siguiente Turno"}
                </button>
                <button
                  onClick={() => setAutoBattle((prev) => !prev)}
                  disabled={gameOver}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: gameOver ? "#334155" : "#2563eb",
                    color: "#fff",
                    cursor: gameOver ? "not-allowed" : "pointer",
                  }}
                >
                  {autoBattle
                    ? "🛑 Detener Auto-Batalla"
                    : "🤖 Auto-Batalla Z"}
                </button>
                <button
                  onClick={() => navigate("/seleccionar-cartas")}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: "#0f172a",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  🔄 Cambiar Guerreros
                </button>
                <button
                  onClick={rendirse}
                  disabled={gameOver}
                  style={{
                    width: "100%",
                    padding: "14px",
                    borderRadius: "12px",
                    border: "none",
                    background: gameOver ? "#334155" : "#dc2626",
                    color: "#fff",
                    cursor: gameOver ? "not-allowed" : "pointer",
                  }}
                >
                  🏳️ Rendirse
                </button>
              </div>
            </div>

            <div
              style={{
                background: "#111827",
                borderRadius: "1.5rem",
                padding: "22px",
                border: "1px solid rgba(148,163,184,0.12)",
                overflow: "auto",
                maxHeight: "350px",
              }}
            >
              <h3 style={{ margin: 0, color: "#facc15" }}>
                Registro de Batalla
              </h3>
              {logs.length === 0 ? (
                <p style={{ marginTop: "16px", color: "#9ca3af" }}>
                  No hay registros aún.
                </p>
              ) : (
                logs
                  .slice()
                  .reverse()
                  .slice(0, 8)
                  .map((log, idx) => (
                    <div
                      key={idx}
                      style={{
                        background: "#0f172a",
                        borderRadius: "12px",
                        padding: "14px",
                        marginTop: "12px",
                        border: "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      <strong>Turno {log.turno}</strong>
                      <br />
                      {log.atacante} atacó a {log.defensor}
                      <br />
                      Daño: {log.damage} | HP restante: {log.vidaRestante}
                    </div>
                  ))
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CampoDeBatalla;