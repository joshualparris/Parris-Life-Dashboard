import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  label: string;
  value: number; // 0-100
  max?: number;
}

export function ProgressBar({ label, value, max = 100 }: ProgressBarProps) {
  const percentage = (value / max) * 100;
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{value} / {max}</span>
      </div>
      <Progress value={percentage} />
    </div>
  );
}