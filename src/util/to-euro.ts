export const toEuro = (num: number) =>
  num.toLocaleString(undefined, {
    currency: 'EUR',
    style: 'currency',
  });
