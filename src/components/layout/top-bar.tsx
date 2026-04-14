export function TopBar({ title }: { title: string }) {
  const currentDate = new Date().toLocaleDateString();
  return (
    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">{title}</h1>
        <span className="text-sm text-gray-600 dark:text-gray-400">{currentDate}</span>
      </div>
    </div>
  );
}