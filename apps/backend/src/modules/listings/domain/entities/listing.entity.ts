export class ListingEntity {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly description: string,
    readonly price: number,
    readonly type: string,
    readonly bedrooms: number,
    readonly status: string,
    readonly userId: string,
    readonly images: string[],
    readonly lat: number,
    readonly lng: number,
    readonly address: string,
    readonly neighborhood: string,
    readonly createdAt: Date,
  ) {}
}
