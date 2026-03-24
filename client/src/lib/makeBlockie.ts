function createSeededRandom(seed: string) {
  let value = 0;

  for (let index = 0; index < seed.length; index += 1) {
    value = (value << 5) - value + seed.charCodeAt(index);
    value |= 0;
  }

  return () => {
    value = Math.imul(value ^ (value >>> 15), 1 | value);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function createPattern(seed: string, size: number) {
  const random = createSeededRandom(seed.toLowerCase());
  const columns = Math.ceil(size / 2);

  return Array.from({ length: size }, () => {
    const leftSide = Array.from({ length: columns }, () => random() > 0.45);
    const mirrored = [...leftSide].slice(0, size - columns).reverse();
    return [...leftSide, ...mirrored];
  });
}

function colorFromSeed(seed: string, saturation: number, lightness: number) {
  let hue = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hue = (hue + seed.charCodeAt(index) * (index + 1)) % 360;
  }

  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}

export function makeBlockie(address: string, size = 8, scale = 6) {
  const normalizedAddress = address.trim().toLowerCase();
  const backgroundColor = colorFromSeed(`${normalizedAddress}-bg`, 35, 93);
  const foregroundColor = colorFromSeed(`${normalizedAddress}-fg`, 90, 52);
  const spotColor = colorFromSeed(`${normalizedAddress}-spot`, 80, 22);
  const pattern = createPattern(normalizedAddress, size);
  const dimension = size * scale;

  const cells = pattern
    .flatMap((row, rowIndex) =>
      row.map((enabled, columnIndex) => {
        if (!enabled) {
          return '';
        }

        const color = (rowIndex + columnIndex) % 3 === 0 ? spotColor : foregroundColor;

        return `<rect x="${columnIndex * scale}" y="${rowIndex * scale}" width="${scale}" height="${scale}" rx="${Math.max(
          1,
          Math.floor(scale / 3),
        )}" fill="${color}" />`;
      }),
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${dimension}" height="${dimension}" viewBox="0 0 ${dimension} ${dimension}" fill="none"><rect width="${dimension}" height="${dimension}" rx="${Math.max(
    4,
    scale,
  )}" fill="${backgroundColor}" />${cells}</svg>`;

  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
