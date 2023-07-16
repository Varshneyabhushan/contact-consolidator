export function toNumber(numberString: string): number | null {
    let anticipation = +numberString;
    if (Number.isNaN(anticipation)) return null;
    return anticipation;
  }