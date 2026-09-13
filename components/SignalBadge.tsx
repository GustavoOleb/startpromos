import { signalTone, type RadarSignal } from "@/lib/signals";

export default function SignalBadge({ signal }: { signal: RadarSignal }) {
  return (
    <span className="signal-chip" data-tone={signalTone(signal.kind)}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {signal.label}
    </span>
  );
}
