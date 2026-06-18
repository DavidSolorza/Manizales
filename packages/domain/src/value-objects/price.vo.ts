export class Price {
  private constructor(private readonly value: number) {}

  static create(amount: number): Price {
    if (amount <= 0) throw new Error('Price must be greater than zero')
    if (!Number.isFinite(amount)) throw new Error('Price must be a finite number')
    return new Price(amount)
  }

  getValue(): number {
    return this.value
  }

  equals(other: Price): boolean {
    return this.value === other.value
  }
}
