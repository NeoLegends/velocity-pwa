declare global {
  interface Number {
    toEuro(): string;
  }
}

/** Format a number as euro currency. */
Number.prototype.toEuro = function() {
  return this.toLocaleString(undefined, {
    currency: 'EUR',
    style: 'currency',
  });
};

export {}; // needed for TS
