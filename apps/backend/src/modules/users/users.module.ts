import { Module } from '@nestjs/common'
import { UserService } from './application/services/user.service'
import { PrismaUserRepository } from './infrastructure/prisma-user.repository'
import { PrismaService } from '../../shared/database/prisma.service'

@Module({
  providers: [UserService, PrismaUserRepository, PrismaService],
  exports: [UserService, PrismaUserRepository],
})
export class UsersModule {}
