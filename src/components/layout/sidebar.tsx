import Link from "next/link";

const modules = [
  { name: "Overview", href: "/", color: "gray" },
  { name: "Finances", href: "/finances", color: "amber" },
  { name: "Health", href: "/health", color: "teal" },
  { name: "Sylvie", href: "/sylvie", color: "purple" },
  { name: "Kristy", href: "/kristy", color: "pink" },
  { name: "Work", href: "/work", color: "blue" },
  { name: "Projects", href: "/projects", color: "green" },
  { name: "Faith", href: "/faith", color: "coral" },
];

export function AppSidebar() {
  return (
    <div className="w-48 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold mb-4">Parris Life Dashboard</h2>
      <nav className="space-y-2">
        {modules.map((module) => (
          <Link
            key={module.name}
            href={module.href}
            className="flex items-center space-x-2 p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className={`w-2 h-2 rounded-full bg-${module.color}-500`} />
            <span>{module.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}