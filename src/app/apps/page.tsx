import { apps } from "@/data/apps";
import { discoverExternalApps } from "@/lib/externalApps";
import AppsPageClient from "./page.client";

export const metadata = {
  title: "JoshHub | Apps",
  description: "Browse apps and games.",
};

interface Props {
  searchParams?: { status?: string };
}

export default async function AppsPage({ searchParams }: Props) {
  const external = await discoverExternalApps();
  const merged = [...apps, ...external];
  return <AppsPageClient searchParams={searchParams} apps={merged} />;
}
