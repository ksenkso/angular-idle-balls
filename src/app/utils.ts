import * as PIXI from 'pixi.js';

export function formatPoints(points: number): string {
  if (points === 0) {
    return '0';
  }
  const letters = ['', 'k', 'M', 'G', 'T', 'P', 'E'];
  const power = Math.floor(Math.log10(points));
  let letter: string;
  let num: number;
  for (let i = 1; i < letters.length + 1; i++) {
    if (power < 3 * i) {
      letter = letters[i - 1];
      num = points / 10 ** (3 * (i - 1));
      break;
    }
  }
  if (!num) {
    num = points / 10 ** 18;
    letter = 'E';
  }
  const maximumFractionDigits = num.toString().length >= 2 ? 1 : 2;
  return num.toLocaleString('en-US', {maximumFractionDigits}).replace(/,/g, '') + letter;
}

export function HSLToNumber(h: number, s: number, l: number): number {
  s /= 100;
  l /= 100;

  let c = (1 - Math.abs(2 * l - 1)) * s,
    x = c * (1 - Math.abs((h / 60) % 2 - 1)),
    m = l - c/2,
    r = 0,
    g = 0,
    b = 0;

  if (0 <= h && h < 60) {
    r = c; g = x; b = 0;
  } else if (60 <= h && h < 120) {
    r = x; g = c; b = 0;
  } else if (120 <= h && h < 180) {
    r = 0; g = c; b = x;
  } else if (180 <= h && h < 240) {
    r = 0; g = x; b = c;
  } else if (240 <= h && h < 300) {
    r = x; g = 0; b = c;
  } else if (300 <= h && h < 360) {
    r = c; g = 0; b = x;
  }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return r * 16 ** 4 + g * 16 ** 2 + b;
}

export function randomPoint(width: number, height: number): PIXI.IPointData {
  return {
    x: randomInt(width),
    y: randomInt(height)
  };
}


export function randomInt(max: number): number {
  return Math.floor(Math.random() * max);
}
