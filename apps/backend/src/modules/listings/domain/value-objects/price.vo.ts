export class PriceVO {
  private constructor(private readonly value: number) {}

  static create(amount: number): PriceVO {
    if (amount <= 0) throw new Error('Price must be greater than zero')
    return new PriceVO(amount)
  }

  getValue(): number {
    return this.value
  }
}
