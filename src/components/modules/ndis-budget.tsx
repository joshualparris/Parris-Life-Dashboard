import { NDISPlan } from "@/lib/store/types";
import { ProgressBar } from "@/components/ui/progress-bar";

interface NDISBudgetProps {
  data: NDISPlan;
}

export function NDISBudget({ data }: NDISBudgetProps) {
  return (
    <div className="space-y-4">
      {data.categories.map((category) => (
        <ProgressBar
          key={category.name}
          label={`${category.name} (${category.provider})`}
          value={category.spent}
          max={category.allocated}
        />
      ))}
    </div>
  );
}