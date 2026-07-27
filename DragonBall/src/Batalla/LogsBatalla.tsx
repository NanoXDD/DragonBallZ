type LogEntry = {
  turno: number;
  atacante: string;
  defensor: string;
  damage: number;
  vidaRestante: number;
};

type Props = {
  logs: LogEntry[];
  turnoActual: number;
};

export default function LogsBatalla({ logs, turnoActual }: Props) {
  return (
    <div className="logs-container">
      <h3 className="text-lg font-bold">Registro de batalla</h3>
      <div className="text-xs text-gray-400">Turno actual: {turnoActual}</div>
      <div className="mt-2 max-h-64 overflow-auto text-sm">
        {logs.length === 0 && <p className="text-gray-400">Aún no hay acciones...</p>}
        {logs.map((log, idx) => (
          <div key={idx} className="log-entry px-2 py-1 border-b border-gray-800">
            <div className="text-xs text-gray-400">Turno {log.turno}</div>
            <div>
              <strong>{log.atacante}</strong> hizo <span className="text-red-400">{log.damage}</span> de daño a <strong>{log.defensor}</strong>. Vida: {log.vidaRestante}
            </div>
          </div>
        ))}
      </div>
      <style>{`
        .logs-container { color: white; }
        .log-entry { opacity: 0.95; }
      `}</style>
    </div>
  );
}
