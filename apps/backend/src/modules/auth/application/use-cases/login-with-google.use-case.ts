import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { GoogleAuthService } from '../services/google-auth.service'
import { PrismaService } from '../../../../shared/database/prisma.service'

@Injectable()
export class LoginWithGoogleUseCase {
  constructor(
    private readonly googleAuth: GoogleAuthService,
    private readonly jwt: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async execute(idToken: string) {
    const googleUser = await this.googleAuth.verifyToken(idToken)

    let user = await this.prisma.user.findUnique({ where: { email: googleUser.email } })
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          picture: googleUser.picture,
          role: 'ESTUDIANTE',
        },
      })
    }

    const token = this.jwt.sign({
      sub: user.id,
      email: user.email,
    })

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
    }
  }
}
