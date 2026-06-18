import { IsString, IsNotEmpty, IsNumber, Min, IsArray, ArrayMinSize } from 'class-validator'

export class CreateListingDto {
  @IsString()
  @IsNotEmpty()
  title: string

  @IsString()
  @IsNotEmpty()
  description: string

  @IsNumber()
  @Min(1)
  price: number

  @IsString()
  @IsNotEmpty()
  type: string

  @IsNumber()
  @Min(0)
  bedrooms: number

  @IsArray()
  @ArrayMinSize(1)
  images: string[]

  @IsNumber()
  lat: number

  @IsNumber()
  lng: number

  @IsString()
  @IsNotEmpty()
  address: string

  @IsString()
  @IsNotEmpty()
  neighborhood: string
}
