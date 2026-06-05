import { useEffect, useMemo, useState } from "react";

const getParts = (target?: string) => {
  if (!target) return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true };
  const diff = Math.max(0, new Date(target).getTime() - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  };
};

export const Countdown = ({ target }: { target?: string }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setTick((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);
  const parts = useMemo(() => getParts(target), [target, tick]);

  if (parts.done) return <p className="text-sm font-bold text-oranje-100">Wedstrijdmoment bereikt</p>;

  return (
    <div className="grid grid-cols-4 gap-2">
      {[
        ["Dagen", parts.days],
        ["Uur", parts.hours],
        ["Min", parts.minutes],
        ["Sec", parts.seconds],
      ].map(([label, value]) => (
        <div key={label} className="rounded-xl border border-white/10 bg-black/20 p-3 text-center">
          <p className="text-2xl font-black text-white">{String(value).padStart(2, "0")}</p>
          <p className="text-[11px] font-bold uppercase text-slate-400">{label}</p>
        </div>
      ))}
    </div>
  );
};
