import { ActionItem } from "@/lib/store/types";
import { StatusBadge } from "@/components/ui/status-badge";

interface ActionListProps {
  actions: ActionItem[];
}

export function ActionList({ actions }: ActionListProps) {
  // Sort by priority: urgent, soon, ongoing, done
  const priorityOrder = { urgent: 0, soon: 1, ongoing: 2, done: 3 };
  const sorted = [...actions].sort((a, b) => priorityOrder[a.status] - priorityOrder[b.status]);

  return (
    <div className="space-y-2">
      {sorted.map((action) => (
        <div key={action.id} className="flex justify-between items-center p-2 border rounded">
          <div>
            <div className="font-medium">{action.title}</div>
            <div className="text-sm text-gray-600">{action.module}</div>
            {action.notes && <div className="text-sm">{action.notes}</div>}
          </div>
          <StatusBadge status={action.status} />
        </div>
      ))}
    </div>
  );
}