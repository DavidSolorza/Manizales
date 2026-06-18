export class CoordinatesVO {
  constructor(
    readonly lat: number,
    readonly lng: number,
  ) {
    if (lat < -90 || lat > 90) throw new Error('Invalid latitude')
    if (lng < -180 || lng > 180) throw new Error('Invalid longitude')
  }
}
