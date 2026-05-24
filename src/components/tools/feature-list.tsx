import { Check } from "lucide-react";

export function FeatureList({ features }: { features: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {features.map((f, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-emerald-500/15">
            <Check className="h-3 w-3 text-emerald-600" />
          </span>
          <span className="text-sm leading-relaxed">{f}</span>
        </li>
      ))}
    </ul>
  );
}
