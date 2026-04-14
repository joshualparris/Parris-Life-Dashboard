export function getMajor(nodeVersion: string): number {
  const m = /^v?(\d+)/.exec(nodeVersion);
  return m ? Number(m[1]) : 0;
}
