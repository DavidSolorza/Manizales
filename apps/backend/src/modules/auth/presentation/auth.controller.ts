import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common'
import { LoginWithGoogleUseCase } from '../application/use-cases/login-with-google.use-case'
import { GoogleLoginDto } from './dtos/google-login.dto'
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard'
import { CurrentUser } from '../../../shared/decorators/current-user.decorator'
import { Public } from '../../../shared/decorators/public.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly loginWithGoogle: LoginWithGoogleUseCase) {}

  @Public()
  @Post('google')
  async googleLogin(@Body() dto: GoogleLoginDto) {
    return this.loginWithGoogle.execute(dto.idToken)
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@CurrentUser() user: any) {
    return user
  }
}
