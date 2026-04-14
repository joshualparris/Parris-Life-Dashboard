 "use client";
 
 import { useEffect, useMemo, useState } from "react";
 import Link from "next/link";
 
 type GameState = {
   corruption: number;
   truth: number;
   flags: string[];
   visited: string[];
 };
 
 type Choice = {
   label: string;
   to: string;
   addCorruption?: number;
   addTruth?: number;
   setFlag?: string;
   requires?: string;
 };
 
export type Scene = {
   id: string;
   title: string;
   subtitle: string;
   body: (state: GameState) => string[];
   choices: (state: GameState) => Choice[];
 };
 
export const SAVE_KEY = "corporate-game-save-v2";

export const hasFlag = (flags: string[], flag?: string) => !flag || flags.includes(flag);

export function computeCharacterClass(visited: string[]): string {
  if (visited.includes("core")) return "Caretaker";
  if (visited.includes("mirror")) return "Witness";
  if (visited.includes("contact")) return "Witness";
  if (visited.includes("archive")) return "Archivist";
  if (visited.includes("diagnostics")) return "Technician";
  return "Visitor";
}
 
 const services = [
   {
     title: "Home Tech Help",
     normal: "Laptop cleanup, backups, account recovery, Wi-Fi fixes, and simple practical support.",
     weird: "Recovered passwords. Recovered devices. Recovered things that were never meant to be remembered.",
   },
   {
     title: "School & Staff Support",
     normal: "Clear systems, low-friction documentation, and support that reduces stress.",
     weird: "Tickets close themselves. Documentation rewrites itself. The staff list contains names no one recalls hiring.",
   },
   {
     title: "Small Business Fixes",
     normal: "Email, file systems, lightweight automation, and getting daily work moving again.",
     weird: "Every workflow leads back to the same hidden directory. Every folder opens inward.",
   },
 ];
 
export const scenes: Record<string, Scene> = {
   foyer: {
     id: "foyer",
     title: "The Foyer",
     subtitle: "The website still behaves like a website. Mostly.",
     body: (state) => [
       state.corruption < 3
         ? "You step through the polished landing page and into the administrative layer behind it. The lighting is soft, the interface clean, the language reassuring. Somewhere behind the hero section, something hums."
         : "The hero section peels back like wallpaper. Behind the polished gradient is a corridor made of source code and old ticket numbers. Something hums your full name.",
       "Three doors appear in the panel: Diagnostics, Archive, and Contact. The Contact door is warm to the touch.",
       state.truth >= 2
         ? "A line of tiny text flickers at the bottom: THERE WAS NEVER A CONTACT FORM."
         : "At the edge of your vision, the logo seems to blink.",
     ],
     choices: () => [
       { label: "Open Diagnostics", to: "diagnostics", addCorruption: 1 },
       { label: "Enter the Archive", to: "archive", addCorruption: 1 },
       { label: "Use the Contact Page", to: "contact", addCorruption: 1 },
     ],
   },
 
   diagnostics: {
     id: "diagnostics",
     title: "Diagnostics",
     subtitle: "The first layer still pretends to be technical.",
     body: (state) => [
       "Rows of system notices scroll past. Router recovered. Cache cleared. Session restored.",
       state.corruption < 4
         ? "One alert refuses to dismiss: GHOST SESSION DETECTED."
         : "The ghost session has a user photo. It is smiling with your face.",
       "A terminal asks whether you want to patch the issue or trace it to the source.",
     ],
     choices: (state) => [
       { label: "Patch the issue", to: "foyer", addTruth: 1 },
       { label: "Trace the ghost session", to: "mirror", addCorruption: 2, addTruth: 1 },
       ...(state.truth >= 2 ? [{ label: "Inspect hidden process: PARALLAX", to: "core", addCorruption: 2 }] : []),
     ],
   },
 
   archive: {
     id: "archive",
     title: "The Archive",
     subtitle: "Folders, minutes, backups, records of things that did not happen.",
     body: (state) => [
       "The archive is deeper than the building should allow.",
       "Staff profiles, old newsletters, maintenance logs, policy revisions. Then stranger files: dream reports, erased incidents, playground maps with extra gates.",
       state.truth < 2
         ? "A folder marked BOUNDARY ROAD LANTERN appears for a second, then vanishes."
         : "The BOUNDARY ROAD LANTERN folder opens. Inside is a map of the website drawn like a dungeon. At the centre is a room called THE CORE.",
     ],
     choices: (state) => [
       { label: "Read the vanished folder", to: "archiveRead", addTruth: 1, addCorruption: 1 },
       { label: "Return to the foyer", to: "foyer" },
       ...(state.truth >= 2 ? [{ label: "Follow the dungeon map", to: "core", addCorruption: 2 }] : []),
     ],
   },
 
   archiveRead: {
     id: "archiveRead",
     title: "The Lantern File",
     subtitle: "A record that reads like a campaign journal and an incident report at the same time.",
     body: () => [
       "The file says the website was never meant to sell services. It was meant to find a Reader.",
       "Each page layout was a ritual diagram. Each CTA was a question. Each click narrowed reality.",
       "A handwritten note is scanned into the file: IF THE USER CLICKS THE LOGO THREE TIMES, THE SITE BEGINS TO REMEMBER THEM.",
     ],
     choices: () => [
       { label: "Keep reading", to: "contact", addTruth: 1, addCorruption: 1, setFlag: "readLantern" },
       { label: "Run back to the foyer", to: "foyer", addCorruption: 1 },
     ],
   },
 
   contact: {
     id: "contact",
     title: "Contact",
     subtitle: "This is not a form. It is an invitation.",
     body: (state) => [
       state.flags.includes("readLantern")
         ? "The page asks for Name, Email, and Offering. The cursor already knows your name."
         : "The contact form loads with impossible smoothness. The placeholders flicker: Name. Email. Intent.",
       "Below the submit button is a checkbox: I consent to be known by the site.",
       state.corruption >= 5
         ? "There is no send button anymore. Only COMPLETE THE RITUAL."
         : "A little help text appears: We usually respond within 1–2 business eternities.",
     ],
     choices: () => [
       { label: "Submit the form", to: "mirror", addCorruption: 2, addTruth: 1 },
       { label: "Close the page", to: "foyer" },
     ],
   },
 
   mirror: {
     id: "mirror",
     title: "Mirror Layer",
     subtitle: "The site stops pretending.",
     body: (state) => [
       "A second version of the landing page stands behind the first one, moving half a second late.",
       "In that other page, the services cards are classes. Support Technician. Archivist. Witness.",
       state.truth >= 3
         ? "You recognise the pattern now. The website is a dungeon wearing the skin of a business."
         : "Every choice you made is listed in a sidebar labelled CHARACTER SHEET.",
       "Something in the mirrored page points downward, toward the Core.",
     ],
     choices: () => [
       { label: "Descend to the Core", to: "core", addCorruption: 2 },
       { label: "Try to shut the site down", to: "endingSeal", addTruth: 1 },
       { label: "Step through the mirror", to: "endingJoin", addCorruption: 3 },
     ],
   },
 
   core: {
     id: "core",
     title: "The Core",
     subtitle: "Deep below the CSS, where themes are chosen and names are bound.",
     body: (state) => [
       "The Core is a circular chamber built from nested divs and old prayers.",
       "At the centre hangs a kernel of black glass. Inside it, every version of the homepage exists at once: clean brochure site, game portal, church noticeboard, support ticket graveyard, dream engine.",
       state.truth >= 3
         ? "You finally understand: the site becomes what the visitor is willing to believe."
         : "You understand only one thing: it has been shaping itself around you.",
       "Three actions remain.",
     ],
     choices: (state) => [
       { label: "Seal the Core and leave", to: "endingSeal", addTruth: 1 },
       { label: "Bind yourself to it and become the caretaker", to: "endingJoin", addCorruption: 2 },
       ...(state.truth >= 3
         ? [{ label: "Rewrite the site into a living campaign world", to: "endingRewrite", addTruth: 2, addCorruption: 1 }]
         : []),
     ],
   },
 
   endingSeal: {
     id: "endingSeal",
     title: "Ending: Seal",
     subtitle: "You choose the ordinary world.",
     body: (state) => [
       "You pull the emergency stylesheet and flood the chamber with plain white light.",
       "The strange panels collapse. The dungeon folds back into a neat little business website.",
       state.corruption >= 6
         ? "But sometimes, when the page loads slowly, you still hear something scratching behind the hero section."
         : "The homepage is clean again. Calm. Respectable. Useful. Almost too useful.",
     ],
     choices: () => [{ label: "Start again", to: "foyer" }],
   },
 
   endingJoin: {
     id: "endingJoin",
     title: "Ending: Join",
     subtitle: "You stay.",
     body: () => [
       "You place your hand on the black glass and let the site index you.",
       "Your voice becomes the welcome copy. Your memories become side quests. Your fears become encounter tables.",
       "When the next visitor arrives, the homepage will smile and say: Fast, practical help for families, schools, and small business.",
     ],
     choices: () => [{ label: "Wake at the foyer", to: "foyer" }],
   },
 
   endingRewrite: {
     id: "endingRewrite",
     title: "Ending: Rewrite",
     subtitle: "You turn the system into a world.",
     body: () => [
       "Instead of sealing or submitting, you rewrite.",
       "Services become classes. Contact becomes summoning. Support tickets become quests. Archived files become ruins full of lore.",
       "The site stops being a trap and becomes an invitation to adventure. The first line appears in gold: CHOOSE YOUR PATH, READER.",
     ],
     choices: () => [{ label: "Play again from the start", to: "foyer" }],
   },
 };
 
 export default function CorporateGamePage() {
   const [started, setStarted] = useState(false);
   const [sceneId, setSceneId] = useState<keyof typeof scenes>("foyer");
   const [corruption, setCorruption] = useState(0);
   const [truth, setTruth] = useState(0);
   const [flags, setFlags] = useState<string[]>([]);
   const [visited, setVisited] = useState<string[]>([]);
  const [hasSave, setHasSave] = useState(false);
  const [tutorialSeen, setTutorialSeen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("corporate-game-audio") === "on";
    } catch {
      return false;
    }
  });
  const [effectsEnabled, setEffectsEnabled] = useState<boolean>(() => {
    try {
      return localStorage.getItem("corporate-game-effects") !== "off";
    } catch {
      return true;
    }
  });
 
   useEffect(() => {
     const raw = localStorage.getItem(SAVE_KEY);
    setHasSave(Boolean(raw));
    const tut = localStorage.getItem("corporate-game-tutorial") === "seen";
    setTutorialSeen(tut);
    if (!raw) return;
     try {
       const parsed = JSON.parse(raw);
       setStarted(Boolean(parsed.started));
       setSceneId((parsed.sceneId as keyof typeof scenes) || "foyer");
       setCorruption(Number(parsed.corruption || 0));
       setTruth(Number(parsed.truth || 0));
       setFlags(Array.isArray(parsed.flags) ? parsed.flags : []);
       setVisited(Array.isArray(parsed.visited) ? parsed.visited : []);
     } catch {
       // ignore bad save
     }
   }, []);
 
   useEffect(() => {
     localStorage.setItem(
       SAVE_KEY,
       JSON.stringify({
         started,
         sceneId,
         corruption,
         truth,
         flags,
         visited,
       }),
     );
   }, [started, sceneId, corruption, truth, flags, visited]);
 
  const state = useMemo<GameState>(() => ({ corruption, truth, flags, visited }), [corruption, truth, flags, visited]);
  const scene = scenes[sceneId];
  const characterClass = useMemo(() => computeCharacterClass(visited), [visited]);
 
  const weirdness =
     corruption < 2 ? "Everything feels normal." : corruption < 4 ? "Something is off." : corruption < 7 ? "Reality is thinning." : "The site knows you are here.";
 
   const heroTitle = corruption < 3 ? "Nexus Consulting" : corruption < 6 ? "Nex̸us Consulting" : "NEXUS // CORE";
   const heroText =
     corruption < 3
       ? "Strategy. Growth. Results."
       : corruption < 6
       ? "Systems and choices that shape each other."
       : "You are reading a site that is reading you back.";
 
   const enterGame = () => {
     setStarted(true);
     setSceneId("foyer");
     setVisited((prev) => (prev.includes("foyer") ? prev : [...prev, "foyer"]));
     setCorruption((c) => Math.min(c + 1, 10));
    setTutorialSeen(true);
    try {
      localStorage.setItem("corporate-game-tutorial", "seen");
    } catch {}
   };
 
   const bumpCorruption = () => {
     setCorruption((c) => Math.min(c + 1, 10));
   };
 
   const resetGame = () => {
     setStarted(false);
     setSceneId("foyer");
     setCorruption(0);
     setTruth(0);
     setFlags([]);
     setVisited([]);
     localStorage.removeItem(SAVE_KEY);
   };
 
   const choose = (choice: Choice) => {
     if (!hasFlag(flags, choice.requires)) return;
     if (choice.addCorruption) setCorruption((c) => Math.min(c + (choice.addCorruption as number), 10));
     if (choice.addTruth) setTruth((t) => t + (choice.addTruth as number));
     if (choice.setFlag && !flags.includes(choice.setFlag)) setFlags((prev) => [...prev, choice.setFlag as string]);
     setSceneId(choice.to as keyof typeof scenes);
     setVisited((prev) => (prev.includes(choice.to) ? prev : [...prev, choice.to]));
   };
 
   const visibleServices = services.map((item) => ({ ...item, text: corruption < 4 ? item.normal : item.weird }));
 
  useEffect(() => {
    try {
      localStorage.setItem("corporate-game-audio", audioEnabled ? "on" : "off");
      localStorage.setItem("corporate-game-effects", effectsEnabled ? "on" : "off");
    } catch {}
  }, [audioEnabled, effectsEnabled]);
 
  useEffect(() => {
    if (!audioEnabled) return;
    const thresholdHit = corruption === 4 || corruption === 7;
    if (!thresholdHit) return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = corruption >= 7 ? 340 : 220;
      gain.gain.value = 0.06;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      setTimeout(() => {
        osc.stop();
        ctx.close();
      }, 240);
    } catch {}
  }, [corruption, audioEnabled]);
 
  return (
    <div className="flex-1 overflow-auto">
      <div className="space-y-8 p-6 pb-10">
      {effectsEnabled && corruption >= 4 ? (
        <div
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              "repeating-linear-gradient(180deg, rgba(16,185,129,0.03) 0px, rgba(16,185,129,0.03) 2px, transparent 2px, transparent 6px)",
          }}
        />
      ) : null}
       <div className="rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/80">
         <div className="flex items-center justify-between">
           <div>
             <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-slate-300">Corporate Game</p>
             <h1 className="text-2xl font-semibold leading-tight text-neutral-900 dark:text-white">Nexus Consulting — Strategy. Growth. Results.</h1>
             <p className="text-sm text-neutral-700 dark:text-slate-300">Starts as a clean corporate site. Becomes an interactive mystery.</p>
           </div>
           <div className="flex items-center gap-2">
            {!started ? (
              <>
                {hasSave ? (
                  <button
                    onClick={() => setStarted(true)}
                    className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110"
                  >
                    Continue
                  </button>
                ) : (
                  <button onClick={enterGame} className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-110">
                    Enter
                  </button>
                )}
              </>
            ) : (
               <button onClick={resetGame} className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                 Reset
               </button>
             )}
           </div>
         </div>
       </div>
 
       <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
         <div className="space-y-6">
           <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
             <div className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-200">{weirdness}</div>
            {!started && !hasSave && !tutorialSeen ? (
              <div className="mb-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100">
                Tip: Click Enter to begin. Use Poke Reality to advance weirdness. Choices unlock different rooms and endings.
              </div>
            ) : null}
             <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">{scene.title}</h2>
             <p className="text-sm text-neutral-600 dark:text-slate-300">{scene.subtitle}</p>
             <div className="mt-3 space-y-2">
               {scene.body(state).map((line, idx) => (
                 <p key={`line-${idx}`} className="text-sm text-neutral-700 dark:text-slate-200">
                   {line}
                 </p>
               ))}
             </div>
             <div className="mt-4 grid gap-2 sm:grid-cols-2">
               {scene.choices(state).map((ch) => (
                 <button
                   key={`${scene.id}-${ch.label}`}
                   onClick={() => choose(ch)}
                   className="rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-medium text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                 >
                   {ch.label}
                 </button>
               ))}
             </div>
           </div>
 
           <div className="grid gap-5 md:grid-cols-3">
             {visibleServices.map((item) => (
               <button
                 key={item.title}
                 onClick={() => {
                   bumpCorruption();
                   if (item.title.includes("Home")) setSceneId("diagnostics");
                   if (item.title.includes("School")) setSceneId("archive");
                   if (item.title.includes("Business")) setSceneId("contact");
                   setStarted(true);
                 }}
                 className="group flex flex-col gap-2 rounded-2xl border border-neutral-200/80 bg-gradient-to-r from-white to-sky-50 px-3 py-3 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 dark:border-slate-800 dark:from-slate-900 dark:to-slate-800"
               >
                 <div className="flex items-center justify-between gap-2">
                   <div>
                     <p className="font-semibold text-neutral-900 dark:text-white">{item.title}</p>
                     <p className="text-xs text-neutral-500 dark:text-slate-400">{item.text}</p>
                   </div>
                 </div>
               </button>
             ))}
           </div>
         </div>
 
         <div className="space-y-6">
           <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
             <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-slate-300">Character Sheet</p>
             <div className="mt-2 space-y-2 text-sm">
              <p>
                Class: <span className="font-semibold">{characterClass}</span>
              </p>
               <p>
                 Corruption: <span className="font-semibold">{corruption}</span>
               </p>
               <p>
                 Truth: <span className="font-semibold">{truth}</span>
               </p>
               <p className="text-neutral-600 dark:text-slate-300">Flags: {flags.length > 0 ? flags.join(", ") : "none"}</p>
               <p className="text-neutral-600 dark:text-slate-300">Visited: {visited.length > 0 ? visited.join(" → ") : "none"}</p>
             </div>
           </div>
 
           <div className="rounded-3xl border border-neutral-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
             <p className="text-xs uppercase tracking-[0.2em] text-neutral-600 dark:text-slate-300">Systems & shortcuts</p>
             <div className="mt-3 space-y-2 text-sm">
               <Link href="/games" className="rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                 Back to Games
               </Link>
               <button onClick={bumpCorruption} className="rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                 Poke Reality
               </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAudioEnabled((v) => !v)}
                  className="rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  Audio: {audioEnabled ? "On" : "Off"}
                </button>
                <button
                  onClick={() => setEffectsEnabled((v) => !v)}
                  className="rounded-2xl border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200"
                >
                  Effects: {effectsEnabled ? "On" : "Off"}
                </button>
              </div>
             </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
