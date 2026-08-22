const SYMBOLS: Record<string, string> = { USD: "$" };

export function currencySymbol(currencyCode: string): string {
  return SYMBOLS[currencyCode] || currencyCode;
}

export function formatCurrency(price: number, currencyCode: string): string {
  return `${currencySymbol(currencyCode)}${price.toFixed(2)}`;
}
