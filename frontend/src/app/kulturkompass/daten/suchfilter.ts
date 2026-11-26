export function suchfilter(kriterien: Record<string, string | string[]>): Record<string, string[]> {
  const filters: Record<string, string[]> = {};
  for (const [feld, kriterium] of Object.entries(kriterien)) {
    const werte = (typeof kriterium === 'string' ? [kriterium] : kriterium)
      .map((wert) => wert.trim())
      .filter(Boolean);
    if (werte.length) filters[feld] = werte;
  }
  return filters;
}
