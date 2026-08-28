"use client";

import { useEffect, useRef, useState } from "react";

// ponytail: calendar borrow diff, correct for variable month lengths — no date-fns needed
const START = new Date("2023-02-01T01:00:00.000Z"); // 2023-02-01 08:00 WIB (UTC+7)

type Elapsed = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function elapsed(from: Date, to: Date): Elapsed {
  if (to.getTime() <= from.getTime()) {
    return { years: 0, months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }
  let y = to.getUTCFullYear() - from.getUTCFullYear();
  let mo = to.getUTCMonth() - from.getUTCMonth();
  let d = to.getUTCDate() - from.getUTCDate();
  let h = to.getUTCHours() - from.getUTCHours();
  let mi = to.getUTCMinutes() - from.getUTCMinutes();
  let s = to.getUTCSeconds() - from.getUTCSeconds();

  if (s < 0) {
    s += 60;
    mi -= 1;
  }
  if (mi < 0) {
    mi += 60;
    h -= 1;
  }
  if (h < 0) {
    h += 24;
    d -= 1;
  }
  if (d < 0) {
    // days in previous month of `to` (UTC)
    const prevMonthLastDay = new Date(
      Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), 0),
    ).getUTCDate();
    d += prevMonthLastDay;
    mo -= 1;
  }
  if (mo < 0) {
    mo += 12;
    y -= 1;
  }
  return { years: y, months: mo, days: d, hours: h, minutes: mi, seconds: s };
}

function Flip({
  value,
  label,
  highlight,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  const padded = String(value).padStart(2, "0");
  return (
    <div
      className={
        highlight
          ? "bg-chart-4/10 border-chart-4/20 flex min-w-[4.2rem] flex-col items-center rounded-md border p-1"
          : "bg-card flex min-w-[4.2rem] flex-col items-center rounded-md border p-1"
      }
    >
      <div className="relative h-8 overflow-hidden">
        {/* ponytail: key remount triggers slide-down, CSS only — swap to motion lib if jank */}
        <div
          key={value}
          className={
            highlight
              ? "text-chart-4 animate-slideDown font-mono text-xl leading-8 font-bold tabular-nums"
              : "text-foreground animate-slideDown font-mono text-xl leading-8 font-bold tabular-nums"
          }
          aria-hidden
        >
          {padded}
        </div>
      </div>
      <span
        className={
          highlight
            ? "text-chart-4 font-mono text-[9px] tracking-widest uppercase"
            : "text-muted-foreground font-mono text-[9px] tracking-widest uppercase"
        }
      >
        {label}
      </span>
    </div>
  );
}

export function ExperienceTimer({ serverNow }: { serverNow: number }) {
  const perfStartRef = useRef<number>(0);
  const [t, setT] = useState<Elapsed>(() =>
    elapsed(START, new Date(serverNow)),
  );

  useEffect(() => {
    // ponytail: server-anchored monotonic clock — immune to client clock skew; rAF if tab throttling matters
    perfStartRef.current = performance.now();
    const getNow = () =>
      new Date(serverNow + (performance.now() - perfStartRef.current));
    const tick = () => setT(elapsed(START, getNow()));
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // serverNow is fixed per render (ISR 1h staleness max) — re-sync via fetch if exact second needed
  }, [serverNow]);

  const data = t;

  return (
    <div
      className="bg-card flex w-full flex-col gap-3 border p-4"
      aria-label={`Professional experience: ${data.years} years ${data.months} months ${data.days} days ${data.hours} hours ${data.minutes} minutes ${data.seconds} seconds since 1 February 2023 08:00 WIB`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h4 className="text-muted-foreground font-mono text-xs">
          Professional Career Time
        </h4>
        <span className="text-muted-foreground font-mono text-xs">
          live
          <span className="bg-destructive ml-1 inline-block size-2 animate-pulse rounded-full" />
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <Flip value={data.years} label="years" highlight />
        <Flip value={data.months} label="months" highlight />
        <Flip value={data.days} label="days" />
        <Flip value={data.hours} label="hours" />
        <Flip value={data.minutes} label="minutes" />
        <Flip value={data.seconds} label="seconds" />
      </div>

      <style>{`@keyframes slideDown{from{transform:translateY(-100%);opacity:0}to{transform:translateY(0);opacity:1}}.animate-slideDown{animation:slideDown 320ms ease-out}`}</style>
    </div>
  );
}
