import { Injectable } from '@nestjs/common'

@Injectable()
export class GeocodingService {
  async reverseGeocode(lat: number, lng: number): Promise<{ address: string; neighborhood: string }> {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
    const res = await fetch(url, { headers: { 'User-Agent': 'ProyectoArriendos/1.0' } })
    const data = await res.json()
    return {
      address: data.display_name || `${lat}, ${lng}`,
      neighborhood: data.address?.suburb || data.address?.neighbourhood || '',
    }
  }
}
