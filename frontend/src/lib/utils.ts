/**
 * Safely format number to fixed decimal places
 * Handles string, number, null, undefined
 */
export function toFixed(value: any, decimals: number = 2): string {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }
  
  const num = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(num)) {
    return '0.00';
  }
  
  return num.toFixed(decimals);
}

/**
 * Format price with currency symbol
 */
export function formatPrice(price: any, symbol: string = '$'): string {
  return `${symbol}${toFixed(price, 2)}`;
}

/**
 * Parse string/number to safe number
 */
export function toNumber(value: any): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const num = typeof value === 'number' ? value : parseFloat(value);
  
  return isNaN(num) ? 0 : num;
}