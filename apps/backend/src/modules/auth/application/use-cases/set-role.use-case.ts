import { Injectable, BadRequestException } from '@nestjs/common'
import { PrismaService } from '../../../../shared/database/prisma.service'

@Injectable()
export class SetRoleUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(userId: string, role: string) {
    if (role !== 'ARRIENDADOR' && role !== 'ESTUDIANTE' && role !== 'SUPER_ADMIN') {
      throw new BadRequestException('Rol invalido')
    }
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: { role },
    })
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      picture: user.picture,
      role: user.role,
    }
  }
}
