
export function formatPrice(price: any): string {
  if (price === null || price === undefined) {
    return '0.00';
  }
  
  const numPrice = typeof price === 'number' ? price : parseFloat(price);
  
  if (isNaN(numPrice)) {
    return '0.00';
  }
  
  return numPrice.toFixed(2);
}

export function formatCurrency(price: any, symbol: string = '$'): string {
  return `${symbol}${formatPrice(price)}`;
}