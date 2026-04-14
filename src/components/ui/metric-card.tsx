import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  color?: 'red' | 'green' | 'default';
}

export function MetricCard({ label, value, subtitle, color = 'default' }: MetricCardProps) {
  const colorClasses = {
    red: 'text-red-600',
    green: 'text-green-600',
    default: '',
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="text-sm font-medium text-muted-foreground">{label}</div>
        <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
        {subtitle && <div className="text-sm text-muted-foreground mt-1">{subtitle}</div>}
      </CardContent>
    </Card>
  );
}