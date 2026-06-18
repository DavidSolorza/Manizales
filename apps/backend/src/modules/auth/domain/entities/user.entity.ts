export type Role = 'ARRIENDADOR' | 'ESTUDIANTE' | 'SUPER_ADMIN'

export class UserEntity {
  constructor(
    readonly id: string,
    readonly name: string,
    readonly email: string,
    readonly picture: string | null,
    readonly role: Role,
    readonly createdAt: Date,
  ) {}
}
