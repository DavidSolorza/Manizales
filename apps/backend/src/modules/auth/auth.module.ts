import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthController } from './presentation/auth.controller'
import { LoginWithGoogleUseCase } from './application/use-cases/login-with-google.use-case'
import { SetRoleUseCase } from './application/use-cases/set-role.use-case'
import { GoogleAuthService } from './application/services/google-auth.service'
import { JwtStrategy } from './infrastructure/jwt-strategy'
import { PrismaService } from '../../shared/database/prisma.service'

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super-secret-key',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [LoginWithGoogleUseCase, SetRoleUseCase, GoogleAuthService, JwtStrategy, PrismaService],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
