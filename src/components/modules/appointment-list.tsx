import { Appointment } from "@/lib/store/types";

interface AppointmentListProps {
  appointments: Appointment[];
}

export function AppointmentList({ appointments }: AppointmentListProps) {
  const upcoming = appointments.slice(0, 5);
  return (
    <div className="space-y-2">
      {upcoming.map((appt) => (
        <div key={appt.id} className="flex justify-between items-center p-2 border rounded">
          <div>
            <div className="font-medium">{appt.type}</div>
            <div className="text-sm text-gray-600">{appt.provider} - {appt.location}</div>
            {appt.notes && <div className="text-sm">{appt.notes}</div>}
          </div>
          <div className="text-sm">{new Date(appt.date).toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
}