import { Injectable } from '@nestjs/common'
import { OAuth2Client } from 'google-auth-library'

@Injectable()
export class GoogleAuthService {
  private client: OAuth2Client

  constructor() {
    this.client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)
  }

  async verifyToken(idToken: string) {
    const ticket = await this.client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      throw new Error('Invalid Google token')
    }
    return {
      email: payload.email,
      name: payload.name || 'Unknown',
      picture: payload.picture || null,
    }
  }
}
