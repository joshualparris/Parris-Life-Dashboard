import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: 'urgent' | 'soon' | 'ongoing' | 'done';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    urgent: 'bg-red-500 text-white',
    soon: 'bg-yellow-500 text-black',
    ongoing: 'bg-blue-500 text-white',
    done: 'bg-green-500 text-white',
  };

  return <Badge className={styles[status]}>{status}</Badge>;
}