export function ms(value: string): number {
    const unit = value.slice(-1);
    const amount = parseInt(value.slice(0, -1), 10);
  
    if (isNaN(amount)) {
      throw new Error('Invalid input: amount must be a number');
    }
  
    switch (unit) {
      case 'ms':
        return amount;
      case 's':
        return amount * 1000;
      case 'm':
        return amount * 60 * 1000;
      case 'h':
        return amount * 60 * 60 * 1000;
      case 'd':
        return amount * 24 * 60 * 60 * 1000;
      case 'y':
        return amount * 365 * 24 * 60 * 60 * 1000;
      default:
        throw new Error('Invalid time unit');
    }
  }
  