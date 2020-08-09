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
  return num.toLocaleString('en-US', {maximumFractionDigits}) + letter;
}
