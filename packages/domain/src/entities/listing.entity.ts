import { Price } from '../value-objects/price.vo'
import { Coordinates } from '../value-objects/coordinates.vo'

export type ListingStatus = 'active' | 'inactive' | 'rented'

export interface ListingProps {
  id: string
  title: string
  description: string
  price: Price
  type: string
  bedrooms: number
  status: ListingStatus
  userId: string
  images: string[]
  coordinates: Coordinates
  address: string
  neighborhood: string
  createdAt: Date
}

export class Listing {
  private constructor(private props: ListingProps) {}

  static create(props: Omit<ListingProps, 'status' | 'createdAt'>): Listing {
    if (!props.title.trim()) throw new Error('Title is required')
    if (!props.description.trim()) throw new Error('Description is required')
    if (props.images.length === 0) throw new Error('At least one image is required')
    if (!props.coordinates) throw new Error('Location is required')

    return new Listing({
      ...props,
      status: 'active',
      createdAt: new Date(),
    })
  }

  get id(): string { return this.props.id }
  get title(): string { return this.props.title }
  get description(): string { return this.props.description }
  get price(): Price { return this.props.price }
  get type(): string { return this.props.type }
  get bedrooms(): number { return this.props.bedrooms }
  get status(): ListingStatus { return this.props.status }
  get userId(): string { return this.props.userId }
  get images(): string[] { return this.props.images }
  get coordinates(): Coordinates { return this.props.coordinates }
  get address(): string { return this.props.address }
  get neighborhood(): string { return this.props.neighborhood }
  get createdAt(): Date { return this.props.createdAt }

  canEdit(userId: string): boolean {
    return this.props.userId === userId
  }

  markAsRented(): void {
    this.props.status = 'rented'
  }

  update(data: Partial<Pick<ListingProps, 'title' | 'description' | 'price' | 'type' | 'bedrooms'>>): void {
    if (data.title !== undefined) this.props.title = data.title
    if (data.description !== undefined) this.props.description = data.description
    if (data.price !== undefined) this.props.price = data.price
    if (data.type !== undefined) this.props.type = data.type
    if (data.bedrooms !== undefined) this.props.bedrooms = data.bedrooms
  }
}
