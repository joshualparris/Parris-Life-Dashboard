import type { Metadata } from "next";
import GameCard from "@/components/games/GameCard";
import gamesShowcase from "@/data/gamesShowcase";
import { apps } from "@/data/apps";

export const metadata: Metadata = {
    title: "Games Showcase - JoshHub",
    description: "Top game projects from your workspace",
};

export default function Page() {
    return (
        <div className="flex-1 overflow-auto p-6 pb-10">
            <header className="mb-6">
                <h1 className="text-2xl font-bold">Games Showcase</h1>
                <p className="mt-2 text-sm text-neutral-600 dark:text-slate-300">
                    Play the strongest local and live builds from across your game portfolio.
                </p>
            </header>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {gamesShowcase.map((g) => {
                    const titleLower = g.title.toLowerCase();

                    function scoreApp(a: typeof apps[number]) {
                        const urls = (a.urls ?? []).map((u) => u.url).filter(Boolean);
                        const primary = a.primaryUrl ?? "";
                        let s = 0;
                        const combined = [primary, ...urls].join(" ").toLowerCase();
                        if (combined.includes("itch.io")) s += 100;
                        if (combined.includes("github.io")) s += 80;
                        if (combined.includes("vercel.app") || combined.startsWith("https://")) s += 50;
                        if ((a.tags ?? []).includes("playable") || (a.tags ?? []).includes("play")) s += 20;
                        if (combined.startsWith("/games") || combined.includes("/games/")) s -= 10;
                        const lastTouched = a.lastTouched ? Date.parse(a.lastTouched) : NaN;
                        if (!Number.isNaN(lastTouched)) {
                            s += Math.min(30, Math.floor((Date.now() - lastTouched) / (1000 * 60 * 60 * 24 * 365)) * -1);
                        }
                        return s;
                    }

                    const candidates = apps.filter((a) => {
                        if (!a) return false;
                        const name = a.name?.toLowerCase() ?? "";
                        const id = a.id?.toLowerCase() ?? "";
                        return (
                            id.includes(titleLower) ||
                            titleLower.includes(id) ||
                            name.includes(titleLower) ||
                            titleLower.includes(name)
                        );
                    });

                    const best = candidates.sort((x, y) => scoreApp(y) - scoreApp(x))[0];
                    const playUrl = g.playUrl ?? best?.primaryUrl ?? best?.urls?.[0]?.url ?? null;

                    return (
                        <GameCard
                            key={g.id}
                            id={g.id}
                            title={g.title}
                            description={g.description}
                            localPath={g.localPath}
                            playUrl={playUrl}
                        />
                    );
                })}
            </div>
        </div>
    );
}
