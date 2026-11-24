export function selectLegislativeLayers(layers: { id: number; name: string }[], now: Date) {
  // The live TIGERweb service changes layer IDs when new vintages arrive.
  // Select the Congress actually seated, not the next election's boundaries.
  const year = now.getUTCFullYear();
  const cycleStart = year % 2 === 1 && now < new Date(Date.UTC(year, 0, 3, 17))
    ? year - 2 : year % 2 === 1 ? year : year - 1;
  const congress = 119 + (cycleStart - 2025) / 2;
  const suffix = congress % 100 >= 11 && congress % 100 <= 13 ? "th" : (["th", "st", "nd", "rd"][congress % 10] ?? "th");
  const required = (name: string) => {
    const match = layers.find(layer => layer.name === name);
    if (!match || !Number.isInteger(match.id)) throw new Error("Required legislative map vintage unavailable: " + name);
    return match.id;
  };
  return {
    congressional: required(`${congress}${suffix} Congressional Districts`),
    congressField: `CD${congress}`,
    upper: required(`${year} State Legislative Districts - Upper`),
    lower: required(`${year} State Legislative Districts - Lower`),
  };
}

